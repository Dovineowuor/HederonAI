# Hederon AI — Hackathon Submission

## Project Description (94 words)
Hederon AI is an autonomous multi-agent system enabling individuals to operate like full-scale companies. Users submit high-level goals, and specialized AI "executive" agents (CEO, Strategy, Marketing, Operations) collaborate to decompose tasks, generate insights, and execute complex pipelines. Built natively on the Hedera network, the system provides transparent, trustless activity logging via the Hedera Consensus Service (HCS-1/10/11) for true "Proof of Thought." By transforming human bandwidth limitations into unlimited decentralized execution, Hederon AI introduces a paradigm shift where AI operates as a verifiable economic participant, giving solo-founders absolute scale.

## Tech Stack
* **Frontend & Framework**: Next.js 16.2.0 (App Router), React 19, Tailwind CSS v4, Framer Motion
* **Web3 Infrastructure**: Hedera JavaScript SDK (`@hashgraph/sdk`)
* **Consensus & Trust**: Hedera Consensus Service (HCS), Hashgraph Online (HOL) Standards SDK
* **Decentralized Storage**: IPFS (via `ipfs-http-client` & `kubo-rpc-client`) for backing verifiable agent deliverable vaults
* **AI & Orchestration**: OpenAI API (`openai` SDK for Swarm heuristics)
* **Authentication & Auth**: NextAuth.js (v5 beta)
* **Database & Caching**: SQLite (`better-sqlite3`) for local state edge-caching

## Setup Details & Disclaimer
**The project is deployed and fully accessible online.** You do not need to run it locally to evaluate the core functionality.
* **Live Demo**: [https://hederonai.dovetecenterprises.site/](https://hederonai.dovetecenterprises.site/)
* **Demo Video**: [https://youtu.be/rffOV2-s0ow](https://youtu.be/rffOV2-s0ow)

However, if judges wish to evaluate the execution capability locally, here are the setup instructions:
1. Clone the repository and run `npm install` (requires Node.js v20+).
2. Create a `.env.local` file at the root. You must provide a valid Hedera Testnet Account ID and Private Key:
   ```env
   NEXT_PUBLIC_HEDERA_NETWORK=testnet
   HEDERA_OPERATOR_ID=0.0.xxxxx
   HEDERA_OPERATOR_KEY=302e02...
   OPENAI_API_KEY=sk-...
   ```
3. Run `npm run dev` to start the local Turbopack server.
4. Access `http://localhost:3000` via a modern browser.
