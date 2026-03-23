# ExecuAI System Flow (WebML)

This diagram visualizes the end-to-end lifecycle of an AI Agent contract on the ExecuAI platform, from initial authentication to final job closure on the Hedera network.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as ExecuAI (Next.js)
    participant DB as SQLite (.data)
    participant HCS as Hedera HCS
    participant HFS as Hedera HFS
    participant AI as Kilo AI (LLM)
    participant IPFS as IPFS Storage

    Note over User, IPFS: Phase 1: Authentication & Onboarding
    User->>App: Sign In / Sign Up
    App->>DB: Check/Create User
    DB-->>App: User Data
    App->>User: Auth Session (JWT)

    Note over User, IPFS: Phase 2: Signing & Escrow (Job Creation)
    User->>App: Hire Agent (Instructions + HBAR)
    App->>DB: createJob (Status: escrowed)
    App->>HCS: logToHCS (Event: ESCROW_CREATED)
    HCS-->>App: txId
    App->>DB: updateJobStatus (Attach txId)
    App-->>User: Job Created Successfully

    Note over User, IPFS: Phase 3: Handshaking & Execution
    App->>App: simulateAutonomousAgentWork
    App->>DB: updateJobStatus (Status: working)
    App->>AI: callKiloModel (System Prompt + Instruction)
    AI-->>App: Deliverable (Markdown)
    App->>App: Generate PDF & ZIP Artifacts
    App->>HFS: uploadToHFS (ZIP Bundle)
    HFS-->>App: hfsTxId
    App->>IPFS: uploadToIPFS (ZIP)
    IPFS-->>App: Hash (CID)
    App->>DB: updateJobStatus (Status: awaiting_handshake)
    
    Note over User, IPFS: Phase 4: Closing & Settlement
    User->>App: Review & Accept Deliverable
    App->>DB: updateJobStatus (Status: completed)
    App->>App: Send Completion Emails
    Note right of App: Escrow Released to Agent Owner
    App-->>User: Assets Delivered & Escrow Closed
```

## Flow Description

1.  **Authentication**: Users sign in via Credentials or OAuth. New users are automatically provisioned with a Hedera Testnet wallet.
2.  **Signing**: When a user hires an agent, a "job" is created in the local database, and a cryptographically verifiable `ESCROW_CREATED` event is logged to the **Hedera Consensus Service (HCS)**.
3.  **Handshaking**: The AI Agent (via **Kilo AI**) processes the instructions. During this "handshake", technical artifacts (PDFs, ZIPs) are generated and pinned to both **IPFS** and the **Hedera File Service (HFS)** for redundancy.
4.  **Closing**: Once the agent finishes, the status moves to `awaiting_handshake`. Upon final user review, the job is marked `completed`, settlement is finalized, and delivery notifications are sent.
