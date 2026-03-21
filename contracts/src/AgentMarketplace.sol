// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * @title AgentMarketplace
 * @dev World's first Hedera Smart Contract for Decentralized AI Agent hiring via token escrow.
 * Designed for the Hederon AI platform (Hedera Hello Future Apex Hackathon 2026).
 */
contract AgentMarketplace {
    
    struct Agent {
        uint256 id;
        address payable creator;
        string name;
        string capabilitiesCID; // IPFS CID for agent metadata/instructions
        uint256 pricePerTask; // in tinybars
        bool isActive;
        uint256 totalHires;
    }

    struct JobEscrow {
        uint256 jobId;
        uint256 agentId;
        address client;
        uint256 escrowAmount;
        bool isCompleted;
    }

    uint256 public agentCount;
    uint256 public jobCount;

    mapping(uint256 => Agent) public agents;
    mapping(uint256 => JobEscrow) public jobs;

    event AgentRegistered(uint256 indexed agentId, address indexed creator, string name, uint256 price);
    event AgentHired(uint256 indexed jobId, uint256 indexed agentId, address indexed client, uint256 amountEscrowed);
    event JobCompleted(uint256 indexed jobId, uint256 indexed agentId, uint256 payoutAmount);

    /**
     * @dev Register a new user-generated specialized AI agent
     */
    function registerAgent(string memory _name, string memory _cid, uint256 _pricePerTask) external {
        agentCount++;
        agents[agentCount] = Agent({
            id: agentCount,
            creator: payable(msg.sender),
            name: _name,
            capabilitiesCID: _cid,
            pricePerTask: _pricePerTask,
            isActive: true,
            totalHires: 0
        });

        emit AgentRegistered(agentCount, msg.sender, _name, _pricePerTask);
    }

    /**
     * @dev Hire an agent by placing the required task price into the contract escrow
     */
    function hireAgent(uint256 _agentId) external payable {
        Agent storage agent = agents[_agentId];
        require(agent.isActive, "Agent is not active");
        require(msg.value >= agent.pricePerTask, "Insufficient funds to hire agent");

        jobCount++;
        jobs[jobCount] = JobEscrow({
            jobId: jobCount,
            agentId: _agentId,
            client: msg.sender,
            escrowAmount: msg.value,
            isCompleted: false
        });

        agent.totalHires++;

        emit AgentHired(jobCount, _agentId, msg.sender, msg.value);
    }

    /**
     * @dev Mark the task as completed (driven by HCS verified oracle) and release escrow to Agent Creator
     */
    function completeJob(uint256 _jobId) external {
        JobEscrow storage job = jobs[_jobId];
        require(!job.isCompleted, "Job already completed");
        require(msg.sender == job.client, "Only client can mark job complete"); // In production, an Oracle would verify the HCS log

        job.isCompleted = true;
        Agent storage agent = agents[job.agentId];

        // Release funds
        (bool success, ) = agent.creator.call{value: job.escrowAmount}("");
        require(success, "Payout failed");

        emit JobCompleted(_jobId, job.agentId, job.escrowAmount);
    }

    /**
     * @dev If the client rejects the deliverable or withdraws service, 
     *      refund the escrow minus a 5% protocol gas/service fee.
     */
    function cancelJob(uint256 _jobId) external {
        JobEscrow storage job = jobs[_jobId];
        require(!job.isCompleted, "Job already completed");
        require(msg.sender == job.client, "Only client can cancel");

        job.isCompleted = true;

        // Calculate 5% service fee penalty
        uint256 penaltyFee = (job.escrowAmount * 5) / 100;
        uint256 refundAmount = job.escrowAmount - penaltyFee;

        // Refund the client
        (bool refundSuccess, ) = job.client.call{value: refundAmount}("");
        require(refundSuccess, "Refund payout failed");

        // The remaining 5% implicitly stays in the contract as a protocol fee

        emit JobCompleted(_jobId, job.agentId, 0); // Log completion with 0 payout to agent
    }
}
