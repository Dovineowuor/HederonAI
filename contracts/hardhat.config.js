require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

// Hedera network configuration
const accounts = process.env.HEX_PRIVATE_KEY || process.env.HEDERA_PRIVATE_KEY ? [process.env.HEX_PRIVATE_KEY || process.env.HEDERA_PRIVATE_KEY] : { mnemonic: process.env.HEDERA_MNEMONIC || "" };

const HEDERA_TESTNET = {
  url: "https://testnet.hashio.io/api",
  chainId: 296,
  accounts: accounts,
  gasPrice: 1000000000000, // 1000 gwei
};

const HEDERA_MAINNET = {
  url: "https://mainnet.hashio.io/api",
  chainId: 295,
  accounts: accounts,
  gasPrice: 1000000000000, // 1000 gwei
};

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hederaTestnet: HEDERA_TESTNET,
    hederaMainnet: HEDERA_MAINNET,
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
    customChains: [
      {
        network: "hederaTestnet",
        chainId: 296,
        urls: {
          apiURL: "https://testnet.hashscan.io/api",
          browserURL: "https://testnet.hashscan.io",
        },
      },
      {
        network: "hederaMainnet",
        chainId: 295,
        urls: {
          apiURL: "https://hashscan.io/api",
          browserURL: "https://hashscan.io",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    gasPrice: 20,
    showTimeSpent: true,
    showMethodSig: true,
  },
  mocha: {
    timeout: 60000,
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
