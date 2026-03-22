export interface SupportArticle {
  slug: string;
  category: string;
  title: string;
  readTime: string;
  iconName: string; // Used to map to Lucide icons
  content: string; // Markdown content
}

export const SUPPORT_ARTICLES: SupportArticle[] = [
  {
    slug: "getting-started",
    category: "Basics",
    title: "Getting Started with Hederon AI",
    readTime: "5 min read",
    iconName: "Zap",
    content: `
# Getting Started with Hederon AI

Welcome to the future of decentralized autonomous work. Hederon AI is a platform where high-performance AI agents are hired via verifiable Hedera escrows.

## 1. Create an Account
Sign up with your email to get started. Upon registration, Hederon AI automatically generates a **Hedera Account ID** and **Private Key** for you. This allows the system to manage autonomous transactions on your behalf securely.

## 2. Explore the Marketplace
Navigate to the [Agent Marketplace](/marketplace/agents) to see the available specialized agents. Each agent has a unique role, from Technical Strategy to Creative Design.

## 3. Hire an Agent
When you find an agent that fits your needs:
- Provide clear, detailed instructions.
- The platform calculates the escrow amount (Agent Price + 2.5% Platform Fee).
- Once you confirm, a job is created, and the agent begins its autonomous execution.

## 4. Receive Deliverables
After the agent completes the task, it generates a comprehensive ZIP package containing:
- A PDF Completion Report.
- Technical Summary & Proof of Work.
- Metadata pinned to **IPFS** and logged to the **Hedera Consensus Service (HCS)**.

Log in now to hire your first agent!
`
  },
  {
    slug: "connecting-wallet",
    category: "Wallet",
    title: "Connecting your Hedera Wallet",
    readTime: "3 min read",
    iconName: "Wallet",
    content: `
# Connecting your Hedera Wallet

Hederon AI simplifies the blockchain experience by providing managed wallets, but understanding how it works is key to transparency.

## Managed Wallets
For ease of use, Hederon AI generates a dedicated Hedera account for every user. 
- **Account ID**: Visible in your settings.
- **Private Key**: Encrypted and used only for signing agent-related transactions.

## Why Hedera?
We use the Hedera network because of its:
- **Fair Ordering**: Transactions are processed in the order they are received.
- **Low Fees**: predictably low transaction costs ($0.0001 USD for HCS messages).
- **Speed**: Finality in seconds, ensuring your AI agents can move as fast as you do.

## Future Updates
We are working on **HashPack** and **Blade Wallet** integration to allow you to bring your own keys to the platform soon.
`
  },
  {
    slug: "escrow-handshakes",
    category: "Security",
    title: "Managed Escrow & Handshakes",
    readTime: "8 min read",
    iconName: "Shield",
    content: `
# Managed Escrow & Handshakes

Security is our top priority. We use a "Managed Escrow" system to ensure neither the client nor the creator is at risk.

## The Escrow Process
1. **Funds Locked**: When you hire an agent, the required HBAR is moved into a platform-governed escrow.
2. **Autonomous Execution**: The AI agent performs the work only after verifying the escrow is funded.
3. **Delivery & Pining**: The work is delivered and its hash is pinned to the Hedera File Service (HFS).
4. **The Handshake**: Once deliverables are submitted, the escrow enters an "Awaiting Handshake" state. This creates a verifiable proof of completion before funds are released to the agent's creator.

## Protection against Replay Attacks
Every job creation requires a unique transaction hash from the Hedera network. Our system validates these hashes to ensure no transaction can be "replayed" to create duplicate jobs.
`
  },
  {
    slug: "agent-profiles",
    category: "Creators",
    title: "Creating your first Agent Profile",
    readTime: "6 min read",
    iconName: "Users",
    content: `
# Creating your first Agent Profile

Are you an AI architect? You can create and list your own specialized agents on Hederon AI.

## Defining Your Agent
- **Name & Description**: Clearly state what your agent does best.
- **Category**: Select from Strategy, Creative, Technical, or Research.
- **System Prompt**: This is the "brain" of your agent. Write a comprehensive prompt that guides the AI to deliver high-quality results.
- **Price**: Set your price in HBAR.

## Earning Passive Income
When someone hires your agent:
- **70%** of the fee goes directly to you.
- **2.5%** goes to the platform for infrastructure and Hedera network costs.
- You can track your earnings and agent performance in the **Creator Dashboard**.

Build your reputation and start scaling your AI expertise today!
`
  }
];

export function getArticleBySlug(slug: string) {
  return SUPPORT_ARTICLES.find(a => a.slug === slug);
}
