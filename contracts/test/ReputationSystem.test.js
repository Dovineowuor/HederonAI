const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ReputationSystem", function () {
  let reputationSystem;
  let agentRegistry;
  let owner;
  let agent1;
  let agent2;

  beforeEach(async function () {
    [owner, agent1, agent2] = await ethers.getSigners();
    
    // Deploy mock AgentRegistry
    const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
    agentRegistry = await AgentRegistry.deploy();
    await agentRegistry.deployed();
    
    // Deploy ReputationSystem
    const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
    reputationSystem = await ReputationSystem.deploy();
    await reputationSystem.deployed();
    
    // Initialize ReputationSystem with AgentRegistry address
    await reputationSystem.initialize(agentRegistry.address);
    
    // Add capabilities and register agents
    await agentRegistry.addCapability("research", "Market research");
    await agentRegistry.addCapability("development", "Software development");
    
    await agentRegistry.registerAgent("Agent 1", "Description 1", ["research"], "metadata1");
    await agentRegistry.registerAgent("Agent 2", "Description 2", ["development"], "metadata2");
  });

  describe("Reputation Rating", function () {
    it("Should add reputation rating successfully", async function () {
      const taskId = 1;
      
      await expect(reputationSystem.addReputationRating(
        agent1.address,
        5, // Perfect rating
        "Excellent work, delivered on time",
        taskId,
        ethers.utils.parseEther("1.0"), // Task value
        7 // Complexity
      ))
        .to.emit(reputationSystem, "ReputationUpdated")
        .withArgs(
          agent1.address,
          500, // Starting score
          525, // Expected new score (500 + bonus)
          5,
          "Excellent work, delivered on time"
        );

      const metrics = await reputationSystem.getReputationMetrics(agent1.address);
      expect(metrics.totalRating).to.equal(5);
      expect(metrics.ratingCount).to.equal(1);
      expect(metrics.positiveCount).to.equal(1);
      expect(metrics.negativeCount).to.equal(0);
      expect(metrics.averageRating).to.equal(5);
    });

    it("Should validate rating parameters", async function () {
      const taskId = 2;
      
      await expect(
        reputationSystem.addReputationRating(
          agent1.address,
          0, // Invalid rating
          "Comment",
          taskId,
          ethers.utils.parseEther("1.0"),
          5
        )
      ).to.be.revertedWith("Invalid rating");

      await expect(
        reputationSystem.addReputationRating(
          agent1.address,
          6, // Invalid rating
          "Comment",
          taskId,
          ethers.utils.parseEther("1.0"),
          5
        )
      ).to.be.revertedWith("Invalid rating");

      await expect(
        reputationSystem.addReputationRating(
          agent1.address,
          4,
          "", // Empty comment
          taskId,
          ethers.utils.parseEther("1.0"),
          5
        )
      ).to.be.revertedWith("Comment cannot be empty");
    });

    it("Should prevent duplicate reviews", async function () {
      const taskId = 3;
      
      await reputationSystem.addReputationRating(
        agent1.address,
        4,
        "Good work",
        taskId,
        ethers.utils.parseEther("1.0"),
        5
      );

      await expect(
        reputationSystem.addReputationRating(
          agent1.address,
          5,
          "Excellent work",
          taskId, // Same task ID
          ethers.utils.parseEther("1.0"),
          5
        )
      ).to.be.revertedWith("Already reviewed this task");
    });

    it("Should calculate weighted reputation correctly", async function () {
      // Add multiple ratings to test weighted calculation
      await reputationSystem.addReputationRating(
        agent1.address,
        3, // Average rating
        "Decent work",
        4,
        ethers.utils.parseEther("0.5"), // Lower value
        3 // Lower complexity
      );

      await reputationSystem.addReputationRating(
        agent1.address,
        5, // Perfect rating
        "Excellent work",
        5,
        ethers.utils.parseEther("2.0"), // Higher value
        8 // Higher complexity
      );

      const metrics = await reputationSystem.getReputationMetrics(agent1.address);
      expect(metrics.ratingCount).to.equal(2);
      expect(metrics.averageRating).to.equal(4); // (3 + 5) / 2
      expect(metrics.reputationScore).to.be.gt(500); // Should be above starting score
    });
  });

  describe("Reputation Tiers", function () {
    beforeEach(async function () {
      // Set different reputation scores for testing tiers
      await reputationSystem.addReputationRating(
        agent1.address,
        5,
        "Perfect work",
        10,
        ethers.utils.parseEther("5.0"),
        10
      );
    });

    it("Should return correct reputation tier", async function () {
      const [tier, minScore] = await reputationSystem.getReputationTier(agent1.address);
      
      // Agent should have high reputation due to perfect rating and high value/complexity
      expect(tier).to.be.oneOf(["Bronze", "Silver", "Gold", "Platinum"]);
      expect(minScore).to.be.a('number');
    });

    it("Should handle unrated agents", async function () {
      const [tier, minScore] = await reputationSystem.getReputationTier(agent2.address);
      expect(tier).to.equal("Unrated");
      expect(minScore).to.equal(0);
    });
  });

  describe("Weight Factors", function () {
    it("Should update weight factors", async function () {
      await expect(reputationSystem.updateWeightFactors(
        200, // recentWeight
        150, // valueWeight
        120, // complexityWeight
        10   // decayRate
      ))
        .to.emit(reputationSystem, "WeightFactorsUpdated")
        .withArgs(200, 150, 120, 10);

      const factors = await reputationSystem.weightFactors();
      expect(factors.recentWeight).to.equal(200);
      expect(factors.valueWeight).to.equal(150);
      expect(factors.complexityWeight).to.equal(120);
      expect(factors.decayRate).to.equal(10);
    });
  });

  describe("Query Functions", function () {
    beforeEach(async function () {
      // Add some reputation events
      await reputationSystem.addReputationRating(
        agent1.address,
        5,
        "Excellent work",
        1,
        ethers.utils.parseEther("1.0"),
        5
      );

      await reputationSystem.addReputationRating(
        agent1.address,
        4,
        "Good work",
        2,
        ethers.utils.parseEther("1.5"),
        7
      );
    });

    it("Should get reputation metrics", async function () {
      const metrics = await reputationSystem.getReputationMetrics(agent1.address);
      expect(metrics.totalRating).to.equal(9);
      expect(metrics.ratingCount).to.equal(2);
      expect(metrics.positiveCount).to.equal(2);
      expect(metrics.negativeCount).to.equal(0);
      expect(metrics.averageRating).to.equal(4);
      expect(metrics.reputationScore).to.be.a('number');
    });

    it("Should get reputation events with limit", async function () {
      const events = await reputationSystem.getReputationEvents(agent1.address, 1);
      expect(events.length).to.equal(1);
      expect(events[0].rating).to.equal(4); // Most recent
      expect(events[0].comment).to.equal("Good work");
    });

    it("Should get all reputation events", async function () {
      const events = await reputationSystem.getReputationEvents(agent1.address, 0);
      expect(events.length).to.equal(2);
      expect(events[0].rating).to.equal(3); // First event
      expect(events[1].rating).to.equal(4); // Second event
    });

    it("Should get individual rating counts", async function () {
      expect(await reputationSystem.getTotalRatings(agent1.address)).to.equal(2);
      expect(await reputationSystem.getPositiveRatingCount(agent1.address)).to.equal(2);
      expect(await reputationSystem.getNegativeRatingCount(agent1.address)).to.equal(0);
    });
  });
});
