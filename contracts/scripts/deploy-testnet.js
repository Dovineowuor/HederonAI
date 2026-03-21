const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Hederon AI Marketplace Contracts to Hedera Testnet...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Deploy AgentRegistry
  console.log("Deploying AgentRegistry...");
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy();
  await agentRegistry.waitForDeployment();
  console.log("AgentRegistry deployed to:", agentRegistry.target);
  
  // Deploy ReputationSystem
  console.log("Deploying ReputationSystem...");
  const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
  const reputationSystem = await ReputationSystem.deploy();
  await reputationSystem.waitForDeployment();
  console.log("ReputationSystem deployed to:", reputationSystem.target);
  
  // Initialize ReputationSystem with AgentRegistry address
  console.log("Initializing ReputationSystem...");
  await reputationSystem.initialize(agentRegistry.target);
  console.log("ReputationSystem initialized");
  
  // Deploy Marketplace
  console.log("Deploying Marketplace...");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.waitForDeployment();
  console.log("Marketplace deployed to:", marketplace.target);
  
  // Initialize Marketplace with AgentRegistry and ReputationSystem addresses
  console.log("Initializing Marketplace...");
  await marketplace.initialize(agentRegistry.target, reputationSystem.target);
  console.log("Marketplace initialized");
  
  // Add initial capabilities
  console.log("Adding initial capabilities...");
  const capabilities = [
    { name: "research", description: "Market research and competitive intelligence" },
    { name: "development", description: "Software development and engineering" },
    { name: "marketing", description: "Digital marketing and growth campaigns" },
    { name: "finance", description: "Financial analysis and risk management" },
    { name: "legal", description: "Legal compliance and contract analysis" },
    { name: "design", description: "UI/UX design and user experience" },
    { name: "analytics", description: "Data analytics and business intelligence" },
    { name: "consulting", description: "Strategic consulting and advisory services" }
  ];
  
  for (const capability of capabilities) {
    await agentRegistry.addCapability(capability.name, capability.description);
    console.log(`Added capability: ${capability.name}`);
  }
  
  // Set initial marketplace parameters
  console.log("Setting marketplace parameters...");
  await marketplace.updatePlatformFee(250); // 2.5%
  await marketplace.updateMinReputationScore(300); // Bronze tier minimum
  
  console.log("\n=== Deployment Summary ===");
  console.log("AgentRegistry:", agentRegistry.address);
  console.log("ReputationSystem:", reputationSystem.address);
  console.log("Marketplace:", marketplace.address);
  console.log("Platform Fee: 2.5%");
  console.log("Min Reputation Score: 300");
  console.log("Network: Hedera Testnet");
  
  // Save deployment addresses to file
  const fs = require('fs');
  const deploymentInfo = {
    network: "hedera-testnet",
    timestamp: new Date().toISOString(),
    contracts: {
      AgentRegistry: agentRegistry.target,
      ReputationSystem: reputationSystem.target,
      Marketplace: marketplace.target
    },
    config: {
      platformFee: "2.5%",
      minReputationScore: 300,
      capabilities: capabilities.length
    }
  };
  
  fs.writeFileSync(
    `deployments/hedera-testnet-${Date.now()}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\nDeployment info saved to:", `deployments/hedera-testnet-${Date.now()}.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
