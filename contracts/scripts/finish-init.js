const { ethers } = require("hardhat");

async function main() {
  const agentRegistryAddr = "0xA2952237f156A11435Df567efD3c9aA74a9A07ff";
  const reputationSystemAddr = "0x98cDe189ddf5a2696145fA38B61055aE23B2b965";
  const marketplaceAddr = "0x30F59d20C9e294032A9bff47767b971D5199Bad9";

  console.log("Connecting to contracts...");
  const AgentRegistry = await ethers.getContractAt("AgentRegistry", agentRegistryAddr);
  const ReputationSystem = await ethers.getContractAt("ReputationSystem", reputationSystemAddr);
  const Marketplace = await ethers.getContractAt("Marketplace", marketplaceAddr);

  console.log("Checking/Completing Initialization...");
  try {
    const tx = await Marketplace.initialize(agentRegistryAddr, reputationSystemAddr);
    await tx.wait();
    console.log("Marketplace initialized");
  } catch (e) {
    console.log("Marketplace initialization skipped (may already be initialized):", e.message);
  }

  const capabilities = ["research", "development", "marketing", "finance", "legal", "design", "analytics", "consulting"];
  for (const cap of capabilities) {
    try {
      const tx = await AgentRegistry.addCapability(cap, cap + " services");
      await tx.wait();
      console.log("Added capability:", cap);
    } catch (e) {
      console.log("Capability addition skipped for:", cap, "(may already be added)");
    }
  }

  try {
    const tx1 = await Marketplace.updatePlatformFee(250);
    await tx1.wait();
    const tx2 = await Marketplace.updateMinReputationScore(300);
    await tx2.wait();
    console.log("Marketplace parameters updated");
  } catch (e) {
    console.log("Marketplace parameter update failed:", e.message);
  }

  console.log("Initialization complete!");
}

main().catch(console.error);
