// Icons are now referenced by name for API serialization

export interface Question {
  id: string;
  question: string;
  options: string[];
  icon: "building" | "globe" | "megaphone" | "coins" | "target" | "calendar" | "zap" | "briefcase" | "rocket" | string;
  category: "business" | "technical" | "market" | "execution";
}

export const STRATEGIC_QUESTIONS: Question[] = [
  {
    id: "businessModel",
    question: "What's your primary business model?",
    options: ["B2B (Enterprise)", "B2C (Retail)", "DAO / Community Utility", "Marketplace"],
    icon: "building",
    category: "business"
  },
  {
    id: "targetChain",
    question: "Which blockchain ecosystem are you targeting?",
    options: ["Hedera (HCS/HTS focus)", "Ethereum / L2 (EVM focus)", "Multichain / Agnostic", "Private/Enterprise Ledger"],
    icon: "globe",
    category: "technical"
  },
  {
    id: "brandTone",
    question: "What is your desired brand personality?",
    options: ["Professional & Corporate", "Hype & Crypto-native", "Minimalist & Technical", "Friendly & Accessible"],
    icon: "megaphone",
    category: "market"
  },
  {
    id: "monetization",
    question: "What's your primary value capture model?",
    options: ["Transaction Fees / Spreads", "SaaS Subscriptions", "Tokenomics / Staking", "Platform Advertising"],
    icon: "coins",
    category: "business"
  },
  {
    id: "benchmark",
    question: "Is there a specific industry benchmark or competitor?",
    options: ["Leading Tech Incumbent", "Successful Web3 Protocol", "Blue Ocean (New Market)", "Direct Local Competitor"],
    icon: "target",
    category: "market"
  },
  {
    id: "timeline",
    question: "What's your target execution horizon?",
    options: ["Quick MVP (1 month)", "Strategic Launch (3-6 months)", "Long-term Roadmap (1 year+)", "Continuous R&D"],
    icon: "calendar",
    category: "execution"
  }
];

export function getQuestionsByCategory(category: string) {
  return STRATEGIC_QUESTIONS.filter(q => q.category === category);
}

export function getQuestionById(id: string) {
  return STRATEGIC_QUESTIONS.find(q => q.id === id);
}
