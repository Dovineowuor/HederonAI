<div align="center">
  <img src="public/favicon.ico" alt="Hederon AI Logo" width="120" />
  <h1>Hederon AI – The Enterprise-Grade Agent Engine</h1>
  <p><strong>One Person. Unlimited Execution. Powered by Hedera.</strong></p>
  
  <p>
    <a href="https://hederonai.dovetecenterprises.site/">
      <img src="https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
    </a>
    <a href="https://youtu.be/rffOV2-s0ow">
      <img src="https://img.shields.io/badge/Demo_Video-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Demo Video" />
    </a>
    <a href="https://github.com/Dovineowuor/HederonAI/blob/main/LICENSE.md">
      <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
    </a>
  </p>
</div>

---

## 🧠 Overview

**Hederon AI** is an autonomous, decentralized multi-agent ecosystem that enables solo-founders and small teams to hyperscale their bandwidth. 

Users submit a high-level strategic goal, and a coordinated swarm of specialized AI "executive" agents dynamically decompose, assign, and execute the required tasks. Built natively on the **Hedera** network, Hederon AI logs every autonomous decision and heuristic pivot immutably to the ledger—providing true **"Proof of Thought"** for enterprise stakeholders.

---

## 🏆 Hashgraph Online (HOL) Ecosystem Integration

Hederon AI extensively utilizes the **Hashgraph Online (HOL) Standards SDK** to bring high-throughput autonomous agents on-chain. This submission fulfills the **$8,000 HOL Ecosystem Bounty**:

1. **Agent Registration (HCS-11)**: Our 4 core agents (CEO, Strategy, Marketing, Operations) formalize their identities dynamically on the HOL Registry Broker.
2. **Dynamic Discovery (HCS-10)**: The CEO Agent queries the HOL Registry to locate and contract specialized sub-agents based on their registered capabilities.
3. **Execution Negotiation (A2A)**: Agents communicate via standardized HOL Agent-to-Agent (A2A) messaging for task delegation, status updates, and settlement.
4. **Immutable Deliverables (HCS-1)**: All generated codebases, PRDs, and marketing assets are pushed to IPFS, with their references logged immutably via HCS-1 inscriptions.

---

## 💡 The Algorithmic Swarm

Hederon provides a **coordinated AI executive team** out of the box:
* 👔 **CEO Agent (The Orchestrator)**: Transforms strategic mandates into distributed execution plans.
* 📈 **Strategy Agent**: Handles market gap analysis and business models.
* 📢 **Marketing Agent**: Outputs GTM campaigns, copywriting, and social orchestration.
* ⚙️ **Operations Agent**: Designs system workflows, PRDs, and architecture specs.

---

## 🏗️ Tech Stack & Architecture

* **Frontend Framework:** Next.js 16.2.0 (App Router), React 19, TypeScript
* **Styling & UI:** TailwindCSS v4, Framer Motion (Glassmorphism & Micro-animations)
* **Identity & Auth:** NextAuth v5 (Supporting Auth0 / Credentials / SSO)
* **Data Persistence:** SQLite (`better-sqlite3`) for high-speed edge caching
* **Decentralized Storage:** IPFS (via `ipfs-http-client` & `kubo-rpc-client`)
* **AI Orchestration:** OpenAI API (`openai` SDK for Swarm heuristics)
* **Blockchain Infrastructure:** Hedera JavaScript SDK natively integrated
  * **HCS:** Immutable logging of agent decisions and execution handshakes
  * **HTS:** Infrastructure for potential micro-settlements and the absolute Creator Economy

---

## 🚀 Quick Start (Judge Evaluation)

### 1. Online Evaluation (Recommended)
You do not need to run the project locally to interact with it. The platform is fully deployed and connected to the Hedera testnet:
👉 **[Launch Hederon AI Live](https://hederonai.dovetecenterprises.site/)**

### 2. Local Setup
If you prefer to audit the source code execution locally:

**Prerequisites:** Node.js 20+

```bash
# Clone the repository
git clone https://github.com/Dovineowuor/HederonAI.git
cd hederon-ai

# Install dependencies
npm install
```

**Environment Variables**
Create a `.env.local` file at the root. You must provide a valid Hedera Testnet Account ID and Private Key:
```env
NEXT_PUBLIC_HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=302e02...
OPENAI_API_KEY=sk-...
```

**Run Development Server**
```bash
npm run dev
```
Navigate to `http://localhost:3000` to interact with the DApp locally.

---

## 🧪 Verifying the Integration

To verify the Hedera and HOL integrations works:
1. Log in to the dashboard and instantiate a new **Goal** execution.
2. Monitor the **Hedera Activity Log** scrolling on the right side of the dashboard UI.
3. You will see real-time blockchain operations:
   - `[HOL] Agent Registered`
   - `[HOL] Delegating sub-task via A2A`
   - `[HCS] Immutable decision logged (Proof of Thought)`
4. Check the **Deliverables** tab; completed tasks feature verifiable IPFS CID links.

---

## 👥 Team
* **Dovine Owuor**: Founder & Lead Architect
  * _Building the future of autonomous agent economies on decentralized ledgers._

---

<div align="center">
  <br />
  <strong>Welcome to the Sovereign Revolution.</strong><br />
  Built for the Hedera Hello Future Apex Hackathon 2026.
</div>
