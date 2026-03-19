const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("AgentRegistry", function () {
  let agentRegistry;
  let owner;
  let agent1;
  let agent2;

  beforeEach(async function () {
    [owner, agent1, agent2] = await ethers.getSigners();
    
    const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
    agentRegistry = await AgentRegistry.deploy();
    await agentRegistry.deployed();
    
    // Add some capabilities
    await agentRegistry.addCapability("research", "Market research and analysis");
    await agentRegistry.addCapability("development", "Software development");
    await agentRegistry.addCapability("marketing", "Digital marketing campaigns");
  });

  describe("Agent Registration", function () {
    it("Should register a new agent successfully", async function () {
      const capabilities = ["research", "development"];
      
      await expect(agentRegistry.registerAgent(
        "AI Research Agent",
        "Specialized in market research and competitive analysis",
        capabilities,
        "https://metadata.example.com/agent1"
      ))
        .to.emit(agentRegistry, "AgentRegistered")
        .withArgs(
          agent1.address,
          "AI Research Agent",
          "Specialized in market research and competitive analysis",
          capabilities
        );
      
      const agent = await agentRegistry.getAgent(agent1.address);
      expect(agent.name).to.equal("AI Research Agent");
      expect(agent.description).to.equal("Specialized in market research and competitive analysis");
      expect(agent.isActive).to.be.true;
      expect(agent.reputation).to.equal(100);
      expect(agent.totalEarnings).to.equal(0);
      expect(agent.completedTasks).to.equal(0);
    });

    it("Should prevent duplicate registration", async function () {
      const capabilities = ["research"];
      
      await agentRegistry.registerAgent(
        "AI Research Agent",
        "Research specialist",
        capabilities,
        "https://metadata.example.com/agent1"
      );

      await expect(
        agentRegistry.registerAgent(
          "Another Name",
          "Another description",
          capabilities,
          "https://metadata.example.com/agent2"
        )
      ).to.be.revertedWith("Agent already registered");
    });

    it("Should validate required fields", async function () {
      await expect(
        agentRegistry.registerAgent("", "Description", ["research"], "metadata")
      ).to.be.revertedWith("Name cannot be empty");

      await expect(
        agentRegistry.registerAgent("Name", "", ["research"], "metadata")
      ).to.be.revertedWith("Description cannot be empty");

      await expect(
        agentRegistry.registerAgent("Name", "Description", [], "metadata")
      ).to.be.revertedWith("At least one capability required");
    });

    it("Should validate capabilities", async function () {
      await expect(
        agentRegistry.registerAgent(
          "Name",
          "Description",
          ["invalid_capability"],
          "metadata"
        )
      ).to.be.revertedWith("Capability does not exist");
    });
  });

  describe("Agent Management", function () {
    beforeEach(async function () {
      await agentRegistry.registerAgent(
        "Test Agent",
        "Test description",
        ["research"],
        "metadata"
      );
    });

    it("Should update agent information", async function () {
      const newCapabilities = ["research", "development"];
      
      await expect(agentRegistry.updateAgent(
        "Updated Agent",
        "Updated description",
        newCapabilities,
        "https://new-metadata.example.com"
      ))
        .to.emit(agentRegistry, "AgentUpdated");

      const agent = await agentRegistry.getAgent(agent1.address);
      expect(agent.name).to.equal("Updated Agent");
      expect(agent.description).to.equal("Updated description");
    });

    it("Should deactivate and reactivate agent", async function () {
      await expect(agentRegistry.deactivateAgent())
        .to.emit(agentRegistry, "AgentDeactivated")
        .withArgs(agent1.address, await ethers.provider.getBlockNumber());

      let agent = await agentRegistry.getAgent(agent1.address);
      expect(agent.isActive).to.be.false;

      await expect(agentRegistry.reactivateAgent())
        .to.emit(agentRegistry, "AgentReactivated");

      agent = await agentRegistry.getAgent(agent1.address);
      expect(agent.isActive).to.be.true;
    });
  });

  describe("Capability Management", function () {
    it("Should add new capabilities", async function () {
      await expect(agentRegistry.addCapability("analytics", "Data analytics and insights"))
        .to.emit(agentRegistry, "CapabilityAdded")
        .withArgs("analytics", "Data analytics and insights");

      expect(await agentRegistry.capabilityExists("analytics")).to.be.true;
      expect(await agentRegistry.getAgentCount()).to.equal(1); // Should not affect agent count
    });

    it("Should prevent duplicate capabilities", async function () {
      await expect(
        agentRegistry.addCapability("research", "Duplicate capability")
      ).to.be.revertedWith("Capability already exists");
    });

    it("Should remove capabilities", async function () {
      await expect(agentRegistry.removeCapability("research"))
        .to.emit(agentRegistry, "CapabilityRemoved")
        .withArgs("research");

      expect(await agentRegistry.capabilityExists("research")).to.be.false;
    });
  });

  describe("Query Functions", function () {
    beforeEach(async function () {
      await agentRegistry.registerAgent(
        "Research Agent",
        "Research specialist",
        ["research"],
        "metadata1"
      );

      await agentRegistry.registerAgent(
        "Dev Agent",
        "Development specialist",
        ["development"],
        "metadata2"
      );
    });

    it("Should get active agents", async function () {
      const activeAgents = await agentRegistry.getActiveAgents();
      expect(activeAgents.length).to.equal(2);
      expect(activeAgents).to.include(agent1.address);
      expect(activeAgents).to.include(agent2.address);
    });

    it("Should filter agents by capability", async function () {
      const researchAgents = await agentRegistry.getAgentsByCapability("research");
      expect(researchAgents.length).to.equal(1);
      expect(researchAgents[0]).to.equal(agent1.address);

      const devAgents = await agentRegistry.getAgentsByCapability("development");
      expect(devAgents.length).to.equal(1);
      expect(devAgents[0]).to.equal(agent2.address);
    });

    it("Should check agent capabilities", async function () {
      expect(await agentRegistry.hasCapability(agent1.address, "research")).to.be.true;
      expect(await agentRegistry.hasCapability(agent1.address, "development")).to.be.false;
    });
  });

  describe("Reputation Updates", function () {
    beforeEach(async function () {
      await agentRegistry.registerAgent(
        "Test Agent",
        "Test description",
        ["research"],
        "metadata"
      );
    });

    it("Should update agent reputation", async function () {
      await agentRegistry.updateReputation(agent1.address, 750);
      
      const agent = await agentRegistry.getAgent(agent1.address);
      expect(agent.reputation).to.equal(750);
    });

    it("Should update agent earnings", async function () {
      await agentRegistry.updateEarnings(agent1.address, ethers.utils.parseEther("1.5"));
      
      const agent = await agentRegistry.getAgent(agent1.address);
      expect(agent.totalEarnings).to.equal(ethers.utils.parseEther("1.5"));
    });

    it("Should increment completed tasks", async function () {
      await agentRegistry.incrementCompletedTasks(agent1.address);
      
      const agent = await agentRegistry.getAgent(agent1.address);
      expect(agent.completedTasks).to.equal(1);
    });
  });
});
