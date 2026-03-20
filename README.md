# 🚀 ExecuAI – Your AI Executive Team

> Run a company of one — powered by intelligent agents and Hedera.

---

## 🧠 Overview

ExecuAI is an AI-powered executive assistant platform that enables individuals to operate like full-scale companies. Users input a goal, and a team of specialized AI agents — CEO, Strategy, Marketing, and Operations — collaborate to break it down, generate insights, and execute tasks. Built on Hedera, ExecuAI introduces transparent logging and agent-based microtransactions, laying the foundation for autonomous digital work.

---

## 🎯 Problem

Modern entrepreneurship is overwhelming. To build anything meaningful, individuals must juggle:
- Strategy
- Marketing  
- Operations
- Execution

This creates a bottleneck where ideas don't scale due to limited human bandwidth.

---

## 💡 Solution

ExecuAI provides a **coordinated AI executive team** that:
- Transforms goals into structured execution plans
- Delegates tasks across specialized agents
- Automates research, planning, and workflows
- Tracks all activity transparently using Hedera

---

## 🤖 AI Agents

### 👑 CEO Agent
- Breaks down goals into actionable steps
- Coordinates execution

### 📊 Strategy Analyst
- Market research
- Opportunity analysis

### 📣 Marketing Manager
- Growth strategies
- Content generation

### ⚙️ Operations Manager
- Workflow design
- Task optimization

---

## ⛓️ Hedera Integration

### 🔹 Hedera Consensus Service (HCS)
- Logs: Task creation, Agent actions, Outputs
- Provides immutable and transparent records

### 🔹 Hedera Token Service (HTS)
- Simulates microtransactions
- Enables agent-based reward system

---

## 🖥️ Features

- Goal-to-execution pipeline
- Multi-agent collaboration
- Interactive dashboard
- Real-time agent outputs
- Blockchain-backed activity logs

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Backend:** Node.js, Next.js API Routes
- **AI:** OpenAI API (GPT-4o-mini) + Kilo Gateway fallback models
- **Blockchain:** Hedera (HCS + HTS) + Smart Contracts
- **Storage:** IPFS for decentralized file storage
- **Styling:** TailwindCSS 4, Framer Motion

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
git clone https://github.com/dovineowuor/execuai.git
cd execuai
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
# AI Services
OPENAI_API_KEY=your_openai_api_key_here
KILO_API_KEY=your_kilo_api_key_here

# Hedera Testnet Credentials
HEDERA_ACCOUNT_ID=0.0.xxxxxx
HEDERA_PRIVATE_KEY=your_hedera_private_key_here

# IPFS Configuration
IPFS_GATEWAY_URL=https://ipfs.io
IPFS_API_URL=http://localhost:5001/api

# Application Settings
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
ENABLE_MOCK_MODE=false
ENABLE_IPFS_STORAGE=true
ENABLE_KILO_FALLBACK=true

# Model Selection
DEFAULT_AI_MODEL=gpt-4o-mini
FALLBACK_AI_MODEL=minimax-8b
```

### Running the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔄 How It Works

1. User inputs a goal
2. CEO Agent creates execution plan
3. Tasks distributed to agents
4. Agents generate outputs
5. Results displayed in dashboard
6. Actions logged on Hedera
7. Payments simulated between agents

---

## 📱 Demo

- **Live Demo:** [https://execuai-demo.vercel.app](https://execuai-demo.vercel.app)
- **Demo Video:** [https://youtu.be/demo-video-link](https://youtu.be/demo-video-link)

---

## 🌍 Impact

ExecuAI enables:
- Solo founders to operate like full teams
- Global access to AI-powered productivity
- A shift from "AI as a tool" → "AI as an economic participant"

---

## 🚀 Future Roadmap

### Phase 1: Foundation (COMPLETED ✅)
- Multi-agent system with industry SOPs
- Hedera blockchain integration
- IPFS decentralized storage
- Fallback AI models (Kilo Gateway)
- Tangible deliverables generation

### Phase 2: Intelligence (IN PROGRESS 🚧)
- Decentralized agent marketplace
- Smart contract deployment on Hedera
- Agent reputation system
- Economic engine with microtransactions
- Multi-agent coordination layer

### Phase 3: Autonomy (PLANNED 📋)
- Self-improving agent learning loops
- Swarm intelligence systems
- Autonomous agent economies
- Governance and staking systems
- Cross-agent communication protocols

---

## 🤖 Decentralized Agent Marketplace

ExecuAI is evolving into the **world's first decentralized AI agent marketplace** where:

### 🏪 Marketplace Features
- **Agent Registration**: Onboard AI agents with capabilities
- **Reputation System**: Weighted 0-1000 reputation scoring
- **Service Exchange**: Complete marketplace with escrow
- **Smart Contracts**: Secure agent-client agreements

### 💰 Economic Engine
- **Microtransactions**: Hedera-based agent payments
- **Dynamic Pricing**: Market-driven agent rates
- **Token Staking**: Governance and reputation
- **Batch Processing**: Efficient transaction handling

### 🤝 Agent Coordination
- **Multi-Agent Orchestration**: Swarm coordination protocols
- **Communication Channels**: Secure agent-to-agent messaging
- **Dispute Resolution**: Automated conflict resolution
- **Learning Systems**: Self-improving agent capabilities

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check

# Test smart contracts
cd contracts && npm run test
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Dovine Owuor**: Founder & Lead Software Engineer.
  - Architected the multi-agent coordination system and Hedera integration.
  - Leads the vision for autonomous agent economies on decentralized ledgers.

---

## 🏁 Conclusion

ExecuAI is not just a tool — it's the foundation for a future where individuals can build, run, and scale entire companies using AI agents. With our decentralized marketplace, we're creating the infrastructure for **autonomous agent economies** where AI entities can think, transact, and collaborate independently.

---

## 🔗 Links

- **Hackathon Submission:** Hedera Hello Future Apex 2026
- **Track:** AI & Agents
- **GitHub:** https://github.com/dovineowuor/ExecuAI
- **Smart Contracts:** https://github.com/dovineowuor/ExecuAI/tree/main/contracts
- **Contact:** [owuordove@gmail.com](mailto:owuordove@gmail.com)
