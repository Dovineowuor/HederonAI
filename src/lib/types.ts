export type AgentRole = "CEO" | "Strategy" | "Marketing" | "Operations" | "Brainstormer" | "Researcher" | "Analyst" | "Designer" | "Creator";

export interface AgentTask {
  id: string;
  title: string;
  assignedTo: AgentRole;
  status: "pending" | "running" | "done" | "error";
  output?: string;
  dependencies?: string[];
  priority?: "low" | "medium" | "high";
}

export interface Deliverable {
  id: string;
  name: string;
  type: "presentation" | "pdf" | "image" | "codebase" | "document" | "spreadsheet";
  content: string;
  filename: string;
  description: string;
  generatedBy: AgentRole;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ExecutionPlan {
  goal: string;
  tasks: AgentTask[];
}

export interface IndustrySOP {
  id: string;
  industry: "saas" | "ecommerce" | "fintech" | "healthcare" | "manufacturing" | "retail" | "education" | "realestate";
  category: "growth" | "operations" | "fundraising" | "compliance" | "product" | "marketing" | "technology";
  framework: string;
  steps: string[];
  kpis: string[];
  bestPractices: string[];
  compliance: string[];
  templates: string[];
}

export interface Challenge {
  id: string;
  description: string;
  brainstormedSolutions?: string[];
  tasks?: AgentTask[];
  research?: string;
  analysis?: string;
  solutionPlan?: string;
  deliverables?: Deliverable[];
  industrySOP?: IndustrySOP;
  timestamp: string;
}

export interface ChallengeWorkflow {
  id: string;
  challenge: string;
  phase: "research" | "analysis" | "solution" | "creation" | "execution";
  currentTasks: AgentTask[];
  completedTasks: AgentTask[];
  insights: string[];
  nextActions: string[];
  deliverables?: Deliverable[];
}

export interface HederaLog {
  type: "HCS" | "HTS" | "HFS" | "CONTRACT";
  message: string;
  timestamp: string;
  txId?: string;
  fileId?: string;
  contractAddress?: string;
}

export interface AgentRunResult {
  plan?: ExecutionPlan;
  challenge?: Challenge;
  workflow?: ChallengeWorkflow;
  hederaLogs: HederaLog[];
  deliverables?: Deliverable[];
}

export type ExecutionMode = "goal" | "challenge";
