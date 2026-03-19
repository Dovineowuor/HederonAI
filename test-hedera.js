require('dotenv').config();
const { HederaLog, logToHCS } = require('./src/lib/hedera');

async function test() {
  console.log("Starting Hedera connectivity test...");
  console.log("ENV Check:", {
    HEDERA_NETWORK: process.env.HEDERA_NETWORK,
    HEDERA_ACCOUNT_ID: process.env.HEDERA_ACCOUNT_ID,
    HAS_PRIVATE_KEY: !!(process.env.HEDERA_PRIVATE_KEY || process.env.HEX_PRIVATE_KEY || process.env.DER_ENCODED_PRIVATE_KEY)
  });

  try {
    const result = await logToHCS("Connectivity Test - " + new Date().toISOString());
    console.log("Test Result:", result);
    if (result.txId && !result.txId.startsWith('sim-')) {
      console.log("✅ SUCCESS: Real transaction ID generated.");
    } else {
      console.log("❌ FAILURE: Still getting simulated/mock IDs.");
    }
  } catch (err) {
    console.error("💥 CRASH:", err);
  }
}

test();
