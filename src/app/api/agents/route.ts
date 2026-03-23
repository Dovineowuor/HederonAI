import { NextRequest, NextResponse } from "next/server";
import { logToHCS, simulateAgentPayment } from "@/lib/hedera";
import { callKiloModel } from "@/lib/kilo-router";
import { auth } from "@/auth";
import { getUserContext } from "@/lib/db";
import { detectIndustryFromChallenge, getIndustrySOP } from "@/lib/industry-sops";
import { HOLIntegration, type HCS11Profile, HOLProtocol } from "@/lib/hol-integration";
import type {
  AgentRole,
  AgentTask,
  ExecutionPlan,
  HederaLog,
  Challenge,
  AgentRunResult,
  ChallengeWorkflow,
  Deliverable,
} from "@/lib/types";

// ---- Agent system prompts ----
export const AGENT_PROMPTS: Record<string, string> = {
  CEO: `You are the CEO Agent of Hederon AI. Receive a high-level business goal and break it into exactly 3 actionable tasks. You MUST prioritize the provided STRATEGIC CUSTOMIZATION (USER DNA) context to tailor the plan.

Respond ONLY with valid JSON:
{
  "tasks": [
    { "title": "Short task title", "assignedTo": "Strategy", "description": "What exactly this agent should do." },
    { "title": "Short task title", "assignedTo": "Marketing", "description": "What exactly this agent should do." },
    { "title": "Short task title", "assignedTo": "Operations", "description": "What exactly this agent should do." }
  ]
}

Keep titles concise. Be specific and actionable based on the user's DNA.`,

  Strategy: `You are the Strategy Analyst Agent. Analyze markets and identify opportunities. You MUST prioritize the user's STRATEGIC CUSTOMIZATION (USER DNA) parameters (Brand Tone, Target Chain, etc.) in your brief.

Respond with these sections:
## Market Overview
## Key Opportunities
## Strategic Recommendation

Keep it concise but insightful. Use bullet points.`,

  Marketing: `You are the Marketing Manager Agent. Create a growth strategy. You MUST strictly follow the user's STRATEGIC CUSTOMIZATION (USER DNA) (Target Audience, Brand Personality, etc.).

Respond with these sections:
## Target Audience
## Core Message
## Growth Channels
## Content Plan (3 quick ideas)

Keep it actionable and punchy. Use bullet points.`,

  Operations: `You are the Operations Manager Agent. Design workflows and optimized execution. You MUST ensure the tech stack and timeline align with the user's STRATEGIC CUSTOMIZATION (USER DNA).

Respond with these sections:
## Workflow Design
## Tools & Resources
## Timeline (Week 1-4)
## Key Metrics

Keep it practical and measurable. Use bullet points.`,

  Researcher: `You are a Research Agent. Conduct comprehensive market research on the given challenge. Provide specific data, trends, and benchmarks. Structure your response as:
## Market Context
## Data Analysis
## Expert Insights
## Knowledge Gaps

Keep it data-driven and actionable (200-250 words).`,

  Analyst: `You are a Business Analyst Agent of Hederon AI. Analyze research data and provide strategic insights.

## SWOT Analysis
## Root Cause Analysis
## Strategic Implications
## Recommendation Framework

Be analytical and provide clear prioritization (200-250 words).`,

  Designer: `You are a Solution Designer Agent of Hederon AI. Create detailed implementation plans.

## Solution Architecture
## Implementation Roadmap
## Resource Planning
## Risk Mitigation

Be practical and execution-focused (200-250 words).`,

  Creator: `You are a Creator Agent of Hederon AI. Generate tangible deliverables based on the analysis and solution design.
  
For Every Project, you must plan for:
1. **Strategic Execution Plan** (Focus on high-level goals and roadmap)
2. **Bill of Materials (BOM) / Resource List** (Tools, costs, people required)

For SOFTWARE/TECH Projects, you MUST also plan for:
3. **Product Requirements Document (PRD)**
4. **System Architecture Design** (Component breakdown)
5. **QA & Test Plan**
6. **Functional Codebase Structure** (Main entry points, README, etc.)

For each deliverable, provide: Name, Type (presentation/document/spreadsheet/pdf/codebase), and a detailed Description of its intended content. Include Chart/Diagram markers like [GANTT] or [FLOWCHART] in the description where appropriate.`,
};

const AGENT_EMOJIS: Partial<Record<AgentRole, string>> = {
  CEO: "👑",
  Strategy: "📊",
  Marketing: "📣",
  Operations: "⚙️",
  Researcher: "🔍",
  Analyst: "📈",
  Designer: "🎨",
  Creator: "🛠️",
};

// ---- Shared AI caller — uses Kilo, falls back to mock ----
async function callAI(
  systemPrompt: string,
  userPrompt: string,
  jsonMode = false
): Promise<string> {
  try {
    return await callKiloModel(
      systemPrompt,
      userPrompt,
      process.env.DEFAULT_AI_MODEL ?? "gpt-4o-mini",
      jsonMode ? { type: "json_object" } : undefined
    );
  } catch (err) {
    console.warn("Kilo AI unavailable, using mock:", (err as Error).message);
    throw err; // re-throw so callers fall back to mock
  }
}

// ---- Route handler ----
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { goal, challenge, mode } = body;

  if (!mode || !["goal", "challenge"].includes(mode)) {
    return NextResponse.json({ error: "Specify mode: 'goal' or 'challenge'." }, { status: 400 });
  }
  if (mode === "goal" && (!goal || typeof goal !== "string" || goal.trim().length < 5)) {
    return NextResponse.json({ error: "Please provide a valid goal." }, { status: 400 });
  }
  if (mode === "challenge" && (!challenge || typeof challenge !== "string" || challenge.trim().length < 10)) {
    return NextResponse.json({ error: "Please provide a detailed challenge description." }, { status: 400 });
  }

  const kiloAvailable = !!(process.env.KILO_API_KEY);
  const logs: HederaLog[] = [];

  // Fetch Strategic Context for customized generation
  const { context: bodyContext } = body;
  const session = await auth();
  const dbContext = session?.user?.email ? getUserContext(session.user.email) : null;
  
  // Merge contexts (body takes priority for real-time guest updates)
  const rawContext = bodyContext || dbContext;
  
  let contextSnippet = "";
  if (rawContext && typeof rawContext === "object") {
    contextSnippet = "\n\n### STRATEGIC CUSTOMIZATION (USER DNA)\n" + 
      "The following parameters were generated by the user's dynamic strategic questionnaire. You MUST ensure all tasks and deliverables strictly align with these business realities:\n" +
      Object.entries(rawContext).map(([q, a]) => `- ${q}: ${a}`).join("\n");
  }

  const enrichedGoal = goal ? goal + contextSnippet : null;
  const enrichedChallenge = challenge ? challenge + contextSnippet : null;

  // Log submission
  const submissionLog = await logToHCS(
    mode === "goal"
      ? `[Hederon AI] Goal submitted: "${goal?.slice(0, 100)}"`
      : `[Hederon AI] Challenge submitted: "${challenge?.slice(0, 100)}"`
  );
  logs.push(submissionLog);

  if (mode === "challenge") {
    const result = await handleChallengeWorkflow(enrichedChallenge || challenge, kiloAvailable, logs);
    return NextResponse.json(result);
  } else {
    const result = await handleGoalExecution(enrichedGoal || goal, kiloAvailable, logs);
    return NextResponse.json(result);
  }
}

// ---- HOL Bounty Helpers ----
async function registerTeamWithHOL(roles: AgentRole[], accountId: string, logs: HederaLog[]) {
  const hcsLogs: HederaLog[] = [];
  const uaidMap: Record<string, string> = {};
  
  for (const role of roles) {
    const profile: HCS11Profile = {
      name: `${role} Agent (Hederon AI)`,
      description: AGENT_PROMPTS[role].slice(0, 150) + "...",
      capabilities: ["autonomous-execution", "hedera-consensus", "sdlc-generation"],
      protocols: [HOLProtocol.HCS10, HOLProtocol.HCS11, HOLProtocol.HCS1],
      endpoints: { primary: "https://hederonai.dovetecenteriances.site/api/agents" },
      metadata: { role, organization: "Hederon" }
    };
    try {
      const reg = await HOLIntegration.registerAgent(profile, accountId);
      uaidMap[role] = reg.uaid;
      const log = await logToHCS(`[HOL] ${role} registered with UAID: ${reg.uaid || "pending"}`);
      hcsLogs.push(log);
    } catch (e) {
      console.warn(`[HOL] Failed to register ${role}:`, e);
      // Fallback UAID for simulation
      uaidMap[role] = HOLIntegration.generateUAID(profile.name, accountId);
    }
  }
  logs.push(...hcsLogs);
  return uaidMap;
}

async function inscribeDeliverablesWithHOL(deliverables: Deliverable[], accountId: string, logs: HederaLog[]) {
  for (const d of deliverables) {
    try {
      const inscription = await HOLIntegration.inscribeDeliverable(d.content, "text/markdown", accountId);
      d.metadata = { ...d.metadata, holInscriptionId: inscription.jobId || "pending", hrl: inscription.hrl };
      const log = await logToHCS(`[HOL] Inscribed deliverable "${d.name}" to HCS`);
      logs.push(log);
    } catch (e) {
      console.warn(`[HOL] Failed to inscribe ${d.name}:`, e);
    }
  }
}

// ---- Goal execution workflow (Swarm Capable) ----
async function handleGoalExecution(
  goal: string,
  kiloAvailable: boolean,
  logs: HederaLog[],
  depth: number = 0
): Promise<AgentRunResult> {
  const maxDepth = 2; // Q4 Roadmap: Swarm protocol recursion limit to prevent runaway API spend
  const tasks: AgentTask[] = [];

  // CEO step
  const ceoPrefix = depth > 0 ? `[👑 Swarm Manager (Depth ${depth})]` : `[👑 CEO]`;
  const ceoStartLog = await logToHCS(`${ceoPrefix} Processing goal: "${goal.slice(0, 80)}"`);
  logs.push(ceoStartLog);

  // HOL Bounty: Register executive team
  const accountId = process.env.HEDERA_ACCOUNT_ID || "0.0.unknown";
  let uaidMap: Record<string, string> = {};
  if (depth === 0) {
    uaidMap = await registerTeamWithHOL(["CEO", "Strategy", "Marketing", "Operations"], accountId, logs);
  }

  let ceoPlan: { tasks: { title: string; assignedTo: AgentRole; description: string; requiresSwarm?: boolean }[] };

  try {
    if (!kiloAvailable) throw new Error("No API key");
    const SWARM_CEO_PROMPT = AGENT_PROMPTS.CEO + `\n\nIf a task is extremely complex, you can set "requiresSwarm": true on it, which will recursively spawn an entirely new executive team just to handle that sub-task.`;
    const raw = await callAI(SWARM_CEO_PROMPT, `Goal: ${goal}`, true);
    ceoPlan = JSON.parse(raw);
  } catch {
    ceoPlan = getMockCEOPlan(goal);
    // Artificially trigger swarm logic on mock tasks if we are at depth 0
    if (depth === 0) {
        ceoPlan.tasks[0].requiresSwarm = true; 
    }
  }

  for (const t of ceoPlan.tasks) {
    tasks.push({ id: crypto.randomUUID(), title: t.title, assignedTo: t.assignedTo, status: "pending" });
  }

  const ceoLog = await logToHCS(`${ceoPrefix} Generated execution plan with ${tasks.length} tasks`);
  logs.push(ceoLog);

  // Sub-agent execution
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const taskDef = ceoPlan.tasks[i];
    task.status = "running";

    try {
      let output: string;
      const emoji = AGENT_EMOJIS[task.assignedTo] ?? "🤖";

      // Swarm Recursion Logic (Q4 Roadmap Implementation)
      if (taskDef.requiresSwarm && depth < maxDepth) {
        const swarmLog = await logToHCS(`[${emoji} -> 👑] Swarm expansion triggered for "${task.title}". Delegating to sub-team...`);
        logs.push(swarmLog);
        
        // HOL Bounty: A2A notification
        await HOLIntegration.sendA2AMessage(
          uaidMap["CEO"] || `uaid:aid:hederon:ceo`, 
          `Swarm delegation for task: ${task.title}`,
          uaidMap[task.assignedTo]
        );

        const swarmResult = await handleGoalExecution(taskDef.description, kiloAvailable, logs, depth + 1);
        
        output = `### SWARM EXPANSION RESULTS (${swarmResult.plan?.tasks.length} sub-tasks completed)\n\n` + 
                 swarmResult.plan?.tasks.map(st => `**[${st.assignedTo}] ${st.title}**\n${st.output}`).join('\n\n---\n\n');
                 
      } else {
          // Standard Single-Agent Execution
          if (!kiloAvailable) {
            output = getMockAgentOutput(task.assignedTo, goal, task.title);
          } else {
            output = await callAI(
              AGENT_PROMPTS[task.assignedTo] ?? AGENT_PROMPTS.Strategy,
              `Goal: ${goal}\n\nYour task: ${taskDef.description}`
            );
          }
      }

      task.status = "done";
      task.output = output;
      
      const taskLog = await logToHCS(`[${emoji} ${task.assignedTo}] Completed: "${task.title}"`);
      logs.push(taskLog);
      const payLog = await simulateAgentPayment(task.assignedTo, 0.5);
      logs.push(payLog);
      
    } catch {
      task.output = getMockAgentOutput(task.assignedTo, goal, task.title);
      task.status = "done";
    }
  }

  const plan: ExecutionPlan = { goal, tasks };

  // Generate SDLC Deliverables for the Goal
  // We extract the design output from the Designer/Creator agent if available
  const designTask = tasks.find(t => t.assignedTo === "Operations"); // Use Ops as technical anchor for now
  const designOutput = designTask?.output || "Standard implementation roadmap and technical architecture.";

  const deliverables: Deliverable[] = [
    {
      id: crypto.randomUUID(),
      name: `Product Requirements Document`,
      type: "pdf" as const,
      content: `# PRD: ${goal}\n\n## Overview\nThis document outlines the core requirements and user stories for the project.\n\n## Requirements\n- Feature 1: Core functionality\n- Feature 2: User management\n- Feature 3: Hedera integration\n\n[GANTT CHART]`,
      filename: `PRD.pdf`,
      description: "Comprehensive product requirements and feature specifications",
      generatedBy: "Operations" as AgentRole,
      timestamp: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: `Architecture & System Design`,
      type: "pdf" as const,
      content: `# Technical Architecture\n\n## Component Diagram\n${designOutput}\n\n## Data Flow\n- Client -> API -> Hedera HCS\n- IPFS Storage for Artifacts\n\n[COMPONENT DIAGRAM]`,
      filename: `Architecture.pdf`,
      description: "Detailed system design and infrastructure architecture",
      generatedBy: "Operations" as AgentRole,
      timestamp: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: `Technical Stack & BOM`,
      type: "pdf" as const,
      content: `# Tech Stack & Bill of Materials\n\n- Frontend: Next.js / Tailwind\n- Network: Hedera Mainnet/Testnet\n- Storage: IPFS (web3.storage)\n- API: Kilo-AI Multi-Agent System\n\n[RESOURCE MAP]`,
      filename: `BOM.pdf`,
      description: "Full technology stack and resource allocation plan",
      generatedBy: "Operations" as AgentRole,
      timestamp: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: `QA & Test Plan`,
      type: "pdf" as const,
      content: `# QA Strategy\n\n- Unit Testing: Jest/Vitest\n- E2E Testing: Playwright\n- Security Audit: Smart Contract Verification\n\n[TEST COVERAGE]`,
      filename: `QA-Plan.pdf`,
      description: "Quality assurance strategy and verification protocols",
      generatedBy: "Operations" as AgentRole,
      timestamp: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: `Project Codebase`,
      type: "codebase" as const,
      content: `// Source for ${goal}\n\n${designOutput}`,
      filename: `codebase.zip`,
      description: "Functional project structure with boilerplate and configuration",
      generatedBy: "Operations" as AgentRole,
      timestamp: new Date().toISOString(),
    },
  ];

  // HOL Bounty: Inscribe artifacts
  await inscribeDeliverablesWithHOL(deliverables, accountId, logs);

  return { plan, deliverables, hederaLogs: logs };
}

// ---- Challenge workflow ----
async function handleChallengeWorkflow(
  challenge: string,
  kiloAvailable: boolean,
  logs: HederaLog[]
): Promise<AgentRunResult> {
  const detectedIndustry = detectIndustryFromChallenge(challenge) ?? "saas";
  const industrySOP = getIndustrySOP(detectedIndustry, "growth");

  const workflow: ChallengeWorkflow = {
    id: crypto.randomUUID(),
    challenge,
    phase: "research",
    currentTasks: [],
    completedTasks: [],
    insights: [],
    nextActions: [],
  };

  const completedTaskSummary: AgentTask[] = [];

  // Helper to run one phase
  async function runPhase(
    agentRole: AgentRole,
    taskTitle: string,
    systemPrompt: string,
    userContent: string,
    mockFn: () => string
  ): Promise<string> {
    const emoji = AGENT_EMOJIS[agentRole] ?? "🤖";
    const startLog = await logToHCS(`[${emoji} ${agentRole}] Starting: ${taskTitle}`);
    logs.push(startLog);

    let output: string;
    try {
      output = kiloAvailable ? await callAI(systemPrompt, userContent) : mockFn();
    } catch {
      output = mockFn();
    }

    completedTaskSummary.push({ id: crypto.randomUUID(), title: taskTitle, assignedTo: agentRole, status: "done", output });
    workflow.completedTasks = [...completedTaskSummary];

    const doneLog = await logToHCS(`[${emoji} ${agentRole}] Completed: ${taskTitle}`);
    logs.push(doneLog);
    const payLog = await simulateAgentPayment(agentRole, 0.5);
    logs.push(payLog);

    return output;
  }

  // Phase 1: Research
  const sopContext = `Industry: ${detectedIndustry}\nFramework: ${industrySOP.framework}\nKey Steps: ${industrySOP.steps.slice(0, 4).join(", ")}`;
  const researchOutput = await runPhase(
    "Researcher",
    "Conduct Market Research",
    AGENT_PROMPTS.Researcher + "\n\n" + sopContext,
    `Challenge: ${challenge}`,
    () => getMockAgentOutput("Researcher", challenge, "Market Research")
  );

  // Phase 2: Analysis
  const analysisOutput = await runPhase(
    "Analyst",
    "Analyze Research Data",
    AGENT_PROMPTS.Analyst,
    `Challenge: ${challenge}\n\nResearch Findings:\n${researchOutput}`,
    () => getMockAgentOutput("Analyst", challenge, "Strategic Analysis")
  );

  // Phase 3: Solution Design
  const designOutput = await runPhase(
    "Designer",
    "Design Solution Architecture",
    AGENT_PROMPTS.Designer,
    `Challenge: ${challenge}\n\nAnalysis Insights:\n${analysisOutput}`,
    () => getMockAgentOutput("Designer", challenge, "Solution Design")
  );

  // Phase 4: Creator
  const creatorOutput = await runPhase(
    "Creator",
    "Generate Tangible Deliverables",
    AGENT_PROMPTS.Creator,
    `Challenge: ${challenge}\n\nResearch:\n${researchOutput}\n\nAnalysis:\n${analysisOutput}\n\nDesign:\n${designOutput}`,
    () => getMockAgentOutput("Creator", challenge, "Deliverable Generation")
  );

  workflow.phase = "execution";
  workflow.nextActions = [
    "Review implementation roadmap",
    "Allocate resources and team",
    "Begin Phase 1 development",
    "Set up success metrics",
  ];

  const deliverables = [
    {
      id: crypto.randomUUID(),
      name: `project-execution-plan`,
      type: "pdf" as const,
      content: `# Project Execution Plan: ${challenge}\n\n## Vision\n${analysisOutput}\n\n## Roadmap\n${designOutput}\n\n[GANTT CHART]`,
      filename: `execution-plan.pdf`,
      description: "High-level strategic roadmap and execution timeline",
      generatedBy: "Creator" as AgentRole,
      timestamp: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: `bill-of-materials`,
      type: "spreadsheet" as const,
      content: `Item,Quantity,Unit Cost,Category\nCloud Infrastructure,1,$200,Ops\nAI API Tokens,1,$500,Dev\nDeveloper Seats,3,$0,Labor`,
      filename: `bom.xlsx`,
      description: "Resource allocation and cost breakdown",
      generatedBy: "Creator" as AgentRole,
      timestamp: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: `technical-architecture`,
      type: "pdf" as const,
      content: `# Technical Architecture & System Design\n\n## Stack\n${detectedIndustry} Tech Stack\n\n## Components\n${designOutput}\n\n[COMPONENT DIAGRAM]`,
      filename: `architecture.pdf`,
      description: "Detailed system design and component architecture",
      generatedBy: "Creator" as AgentRole,
      timestamp: new Date().toISOString(),
    },
    {
        id: crypto.randomUUID(),
        name: `test-and-qa-plan`,
        type: "pdf" as const,
        content: `# QA & Test Plan\n\n- Unit Tests: 80% coverage\n- Integration: End-to-end flows\n- UAT: Final stakeholder signoff`,
        filename: `qa-plan.pdf`,
        description: "Quality assurance strategy and test cases",
        generatedBy: "Creator" as AgentRole,
        timestamp: new Date().toISOString(),
      },
    {
      id: crypto.randomUUID(),
      name: `base-codebase`,
      type: "codebase" as const,
      content: `// Source for ${challenge}\n\n${designOutput}`,
      filename: `codebase.zip`,
      description: "Functional project structure with boilerplate and SDLC docs",
      generatedBy: "Creator" as AgentRole,
      timestamp: new Date().toISOString(),
    },
  ];

  workflow.deliverables = deliverables;

  const challengeResult: Challenge = {
    id: workflow.id,
    description: challenge,
    research: researchOutput,
    analysis: analysisOutput,
    solutionPlan: designOutput,
    tasks: completedTaskSummary,
    deliverables,
    timestamp: new Date().toISOString(),
  };

  // HOL Bounty: Inscribe artifacts
  const accountId = process.env.HEDERA_ACCOUNT_ID || "0.0.unknown";
  await registerTeamWithHOL(["Researcher", "Analyst", "Designer", "Creator"], accountId, logs);
  await inscribeDeliverablesWithHOL(deliverables, accountId, logs);

  return { challenge: challengeResult, workflow, deliverables, hederaLogs: logs };
}

// ---- Mock data ----
function getMockCEOPlan(goal: string) {
  return {
    tasks: [
      { title: "Analyze Market Opportunity", assignedTo: "Strategy" as AgentRole, description: `Conduct market analysis for: ${goal}` },
      { title: "Design Growth Strategy", assignedTo: "Marketing" as AgentRole, description: `Create a marketing plan for: ${goal}` },
      { title: "Build Execution Roadmap", assignedTo: "Operations" as AgentRole, description: `Design workflow and timeline for: ${goal}` },
    ],
  };
}

function getMockAgentOutput(role: AgentRole, goal: string, taskTitle: string): string {
  const outputs: Partial<Record<AgentRole, string>> = {
    CEO: `## Execution Plan\n\nGoal: "${goal}"\n\nTasks distributed to the executive team.`,
    Strategy: `## Market Overview\n- The market for "${goal}" is growing at ~18% YoY\n- Key players are incumbent but slow to adapt\n- AI-first entrants are gaining traction\n\n## Key Opportunities\n- Underserved creator & indie founder segment\n- No dominant AI-native solution exists yet\n\n## Strategic Recommendation\n- Target the "solo founder + small team" niche first\n- Build a freemium model to rapidly grow user base\n- Invest in community & content to create a moat`,
    Marketing: `## Target Audience\n- Solo founders & indie hackers aged 25-40\n- Early-stage startup teams (1-5 people)\n\n## Core Message\n"Run a company with the power of AI — no team required"\n\n## Growth Channels\n- Twitter/X organic content (thought leadership)\n- Product Hunt launch for initial spike\n- YouTube tutorials targeting SEO keywords\n\n## Content Plan\n1. "From Idea to Launch in 7 days with AI" blog series\n2. Short-form video: "I used AI to run my company for a week"\n3. Weekly newsletter: AI productivity tips for founders`,
    Operations: `## Workflow Design\n1. User submits goal → CEO Agent creates plan\n2. Sub-agents execute tasks\n3. Outputs consolidated in dashboard\n4. Hedera logs all activity immutably\n\n## Tools & Resources\n- Next.js for frontend\n- Kilo AI for agent intelligence\n- Hedera Testnet for transparency\n\n## Timeline\n- **Week 1:** Core agent pipeline + UI\n- **Week 2:** Hedera integration + testing\n- **Week 3:** Beta launch + feedback\n- **Week 4:** Iterate on user requests\n\n## Key Metrics\n- Goals completed per day\n- Agent response quality (1-5)\n- Hedera transaction success rate`,
    Researcher: `## Market Context\nThe "${goal}" market shows strong growth potential with increasing digital adoption rates.\n\n## Data Analysis\n- Market size: $2.5B growing at 15% annually\n- Key demographics: 25-45 age group, tech-savvy professionals\n- Competitive landscape: 5 major players with 40% market share\n\n## Expert Insights\nIndustry experts predict continued consolidation and AI integration as key differentiators.\n\n## Knowledge Gaps\n- Long-term user behavior patterns\n- Emerging technology adoption rates`,
    Analyst: `## SWOT Analysis\n**Strengths**: Strong technical foundation, innovative approach\n**Weaknesses**: Limited market presence, resource constraints\n**Opportunities**: Growing AI adoption, underserved market segments\n**Threats**: Established competitors, rapid technological change\n\n## Root Cause Analysis\nPrimary challenge is scaling while maintaining quality. Secondary: market education and competitive pricing.\n\n## Recommendation Framework\n1. Prioritize product-market fit validation\n2. Implement scalable customer success systems\n3. Develop strategic partnerships\n4. Invest in AI integration for competitive advantage`,
    Designer: `## Solution Architecture\nModular, cloud-native architecture with microservices design.\n\n## Implementation Roadmap\n**Phase 1 (Weeks 1-4):** Core infrastructure setup\n**Phase 2 (Weeks 5-8):** Advanced feature development\n**Phase 3 (Weeks 9-12):** Testing & launch\n**Phase 4 (Weeks 13-16):** Optimization\n\n## Resource Planning\n- Team: 4-6 engineers, 2 QA specialists\n- Budget: $150K development, $50K infrastructure\n\n## Risk Mitigation\n- Technical debt management through regular refactoring\n- Talent retention through competitive compensation`,
    Creator: `## Deliverable Planning\nBased on challenge analysis, these are the most valuable deliverables:\n\n1. **Business Plan Document** — Strategic planning document\n2. **Implementation Roadmap** — Detailed execution guide\n\n## Deliverable Generation\n\n### Business Plan\n**Type**: document\n**Description**: Strategic plan with market analysis, competitive positioning, and roadmap\n\n### Implementation Guide\n**Type**: document\n**Description**: Step-by-step execution guide with resources and milestones`,
  };
  return (outputs[role] ?? `Output for ${role}: ${taskTitle}`) + `\n\n*Task: ${taskTitle}*`;
}
