import { NextRequest, NextResponse } from "next/server";

const KILO_BASE_URL = "https://api.kilo.ai/api/gateway";

/**
 * Call the Kilo AI gateway (OpenAI-compatible endpoint).
 * Falls back gracefully on error.
 */
export async function callKiloModel(
  systemPrompt: string,
  userPrompt: string,
  model: string = "gpt-4o-mini",
  responseFormat?: { type: "json_object" }
): Promise<string> {
  const apiKey = process.env.KILO_API_KEY;

  if (!apiKey) {
    throw new Error("KILO_API_KEY not set");
  }

  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 600,
  };

  if (responseFormat) {
    body.response_format = responseFormat;
  }

  const res = await fetch(`${KILO_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Kilo API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// Mock fallback AI models for when OpenAI/Kilo are unavailable
const MOCK_MODELS = {
  'minimax-8b': {
    name: 'MiniMax M2.1 (mock)',
    description: 'Fast, efficient model for quick responses',
    maxTokens: 4096,
    capabilities: ['text', 'code', 'analysis']
  },

  'z-ai-glama-3b': {
    name: 'Z.AI GLM 3B (mock)',
    description: 'Balanced model for general tasks',
    maxTokens: 4096,
    capabilities: ['text', 'analysis', 'reasoning']
  },
  'qwen-2.5-7b': {
    name: 'Qwen 2.5-7B (mock)',
    description: 'Efficient model for various tasks',
    maxTokens: 4096,
    capabilities: ['text', 'analysis', 'coding']
  },
  'gemma2-9b-it': {
    name: 'Gemma 2-9B IT (mock)',
    description: 'Lightweight model for quick responses',
    maxTokens: 4096,
    capabilities: ['text', 'analysis']
  }
};

// Mock AI responses for different agent types
const MOCK_RESPONSES = {
  'CEO': (goal: string) => JSON.stringify({
    tasks: [
      { title: "Market Research", assignedTo: "Strategy", description: "Analyze target market and competition" },
      { title: "Growth Strategy", assignedTo: "Marketing", description: "Develop customer acquisition and retention strategy" },
      { title: "Operations Setup", assignedTo: "Operations", description: "Establish efficient workflows and processes" }
    ]
  }),
  
  'Strategy': (task: string) => `## Market Overview
The ${task} market presents significant opportunities for growth and expansion.
## Key Opportunities
- Growing demand in digital transformation
- Untapped market segments with high potential
- Competitive gaps in current offerings

## Strategic Recommendation
Focus on product-market fit and scalable growth strategies. Prioritize channels with highest ROI potential.

Key metrics to track: CAC, LTV, conversion rates, and market share growth.`,

  'Marketing': (task: string) => `## Target Audience
Tech-savvy professionals and businesses seeking efficiency solutions.

## Core Message
Transform your business operations with AI-powered automation and insights.

## Growth Channels
- Content marketing and SEO
- Strategic partnerships
- Direct sales outreach

## Content Plan (3 quick ideas)
1. Educational blog series on AI benefits
2. Case study showcase with measurable results
3. Interactive demo and trial offerings

Focus on demonstrating clear value proposition and measurable business impact.`,

  'Operations': (task: string) => `## Workflow Design
Implement scalable operational processes that can handle 10x growth without proportional cost increase.

## Tools & Resources
- Automation platforms for efficiency
- Performance monitoring dashboards
- Standard operating procedures documentation

## Timeline (Week 1-4)
Week 1-2: Process automation implementation
Week 3-4: Performance optimization
Week 5-6: Scalability testing
Week 7-8: Full deployment

## Key Metrics
- Process efficiency ratios
- Cost per transaction
- Customer satisfaction scores
- System uptime and performance

Establish clear KPIs for continuous improvement and accountability.`,

  'Brainstormer': (challenge: string) => `## Technology Solution
AI-powered solution with machine learning algorithms for automated decision-making and predictive analytics.

**Key Benefits**: Reduces manual effort by 80%, increases accuracy, provides real-time insights.

**Implementation Steps**: 
1. Requirements gathering and data collection
2. ML model development and training
3. Integration with existing systems
4. Testing and deployment

**Resources Needed**: Development team, data infrastructure, cloud computing resources.

## Business Model Solution
Subscription-based SaaS model with tiered pricing based on usage and features.

**Key Benefits**: Recurring revenue, customer retention, scalability, predictable cash flow.

**Implementation Steps**: 
1. Market research and pricing strategy
2. Platform development and testing
3. Beta launch with early adopters
4. Full market launch and marketing campaign

**Resources Needed**: Development team, marketing budget, cloud infrastructure, payment processing systems.

## User Experience Solution
Intuitive dashboard with personalized insights, automated recommendations, and seamless integration with existing tools.

**Key Benefits**: Higher user engagement, reduced support tickets, improved customer satisfaction.

**Implementation Steps**: 
1. User research and persona development
2. UX/UI design and prototyping
3. Frontend and backend development
4. User testing and iteration

**Resources Needed**: UX/UI designers, frontend developers, user research participants, testing tools.

## Process Solution
Automated workflow orchestration with real-time monitoring and intelligent resource allocation.

**Key Benefits**: Eliminates bottlenecks, optimizes resource utilization, enables proactive issue resolution.

**Implementation Steps**: 
1. Process mapping and analysis
2. Automation tool selection and implementation
3. Integration with existing systems
4. Monitoring and optimization

**Resources Needed**: Process automation tools, integration specialists, monitoring infrastructure.

## Partnership Solution
Strategic alliances with complementary technology providers and industry leaders.

**Key Benefits**: Expanded market reach, enhanced credibility, access to new customer segments, shared innovation resources.

**Implementation Steps**: 
1. Partner identification and vetting
2. Partnership agreement negotiation
3. Integration planning and execution
4. Joint marketing and sales initiatives

**Resources Needed**: Business development team, legal support, integration resources, marketing budget.`,

  'Researcher': (challenge: string, category: string) => `## Market Context
The ${challenge} market shows strong growth potential with increasing digital adoption rates.

## Data Analysis
- Market size: $2.5B growing at 15% annually
- Key demographics: 25-45 age group, tech-savvy professionals
- Competitive landscape: 5 major players with 40% market share

## Expert Insights
Industry experts predict continued consolidation and AI integration as key differentiators.

## Knowledge Gaps
- Long-term user behavior patterns
- Emerging technology adoption rates
- Regulatory impact assessments

Focus on actionable intelligence that drives strategic decision-making and competitive advantage.`,

  'Analyst': (challenge: string, research: string) => `## SWOT Analysis
**Strengths**: Strong technical foundation, experienced team, innovative approach
**Weaknesses**: Limited market presence, resource constraints
**Opportunities**: Growing AI adoption, underserved market segments
**Threats**: Established competitors, rapid technological change

## Root Cause Analysis
Primary challenge is scaling operations while maintaining quality and customer experience. Secondary factors include market education needs and competitive pricing pressure.

## Strategic Implications
Success requires balancing growth speed with operational excellence. High potential for market leadership if execution is optimized.

## Recommendation Framework
1. Prioritize product-market fit validation
2. Implement scalable customer success systems
3. Develop strategic partnerships for market access
4. Invest in automation and AI integration for competitive advantage`,

  'Designer': (challenge: string, analysis: string) => `## Solution Architecture
Modular, cloud-native architecture with microservices design for scalability and maintainability.

## Implementation Roadmap
**Phase 1: Foundation (Weeks 1-4)**
- Core infrastructure setup
- Basic functionality implementation
- Initial user testing

**Phase 2: Development (Weeks 5-8)**
- Advanced feature development
- Integration with third-party systems
- Performance optimization

**Phase 3: Testing & Launch (Weeks 9-12)**
- Comprehensive testing and quality assurance
- Beta launch with select customers
- Full market launch

**Phase 4: Optimization (Weeks 13-16)**
- Performance monitoring and optimization
- Feature enhancement based on user feedback
- Scalability improvements

## Resource Planning
- Development team: 4-6 engineers, 2 QA specialists
- Budget: $150K for development, $50K for infrastructure
- Tools: Cloud platform, development tools, monitoring systems

## Risk Mitigation
- Technical debt management through regular refactoring
- Talent retention through competitive compensation and growth opportunities
- Market risk through diversification and continuous innovation`,

  'Creator': (challenge: string, research: string, analysis: string, design: string) => `## Deliverable Planning
Based on challenge analysis, the most valuable deliverables are:

1. **Business Plan Document** - Comprehensive strategic planning document
2. **Technical Specification** - Detailed implementation requirements
3. **Financial Model** - ROI analysis and revenue projections

## Deliverable Generation

### Business Plan Document
**Name**: ${challenge.toLowerCase().replace(/\s+/g, '-')}-business-plan.docx
**Type**: document
**Description**: Strategic business plan with market analysis, competitive positioning, and implementation roadmap

### Technical Specification
**Name**: ${challenge.toLowerCase().replace(/\s+/g, '-')}-technical-specs.docx
**Type**: document
**Description**: Technical requirements, architecture specifications, and integration guidelines

### Financial Model
**Name**: ${challenge.toLowerCase().replace(/\s+/g, '-')}-financial-model.xlsx
**Type**: spreadsheet
**Description**: Financial projections, cost analysis, and ROI calculations

Each deliverable includes executive summary, detailed analysis, and actionable recommendations for immediate implementation.`
};

// Get available models
export function getAvailableModels(): string[] {
  return Object.keys(MOCK_MODELS);
}

// Check if model supports specific capability
export function modelSupportsCapability(model: string, capability: string): boolean {
  const modelKey = model as keyof typeof MOCK_MODELS;
  const modelDefinition = MOCK_MODELS[modelKey];
  const modelCapabilities = modelDefinition?.capabilities || [];
  return modelCapabilities.includes(capability);
}

export async function POST(req: NextRequest) {
  const { prompt, model = 'minimax-8b', options = {} } = await req.json();

  try {
    // Use mock response instead of external API
    const modelKey = model as keyof typeof MOCK_MODELS;
    const mockResponse = MOCK_RESPONSES[modelKey as keyof typeof MOCK_RESPONSES];
    
    let result: string;
    if (mockResponse && typeof mockResponse === 'function') {
      result = (mockResponse as any)(prompt, [], { role: 'Assistant' }, prompt);
    } else {
      result = `Mock response for ${model}: ${prompt}`;
    }
    
    console.log(`Mock model ${model} response:`, result.substring(0, 100) + '...');
    
    return NextResponse.json({
      success: true,
      model,
      prompt,
      response: result,
      usage: {
        model,
        maxTokens: MOCK_MODELS[modelKey]?.maxTokens || 4096,
        capabilities: MOCK_MODELS[modelKey]?.capabilities || []
      }
    });
  } catch (error) {
    console.error('Mock AI error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Mock AI call failed: ${(error as Error).message}` 
      },
      { status: 500 }
    );
  }
}
