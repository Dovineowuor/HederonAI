import {
  Client,
  PrivateKey,
  AccountId,
  FileCreateTransaction,
  FileAppendTransaction,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TransferTransaction,
  Hbar,
} from "@hashgraph/sdk";
import { ethers } from "ethers";

// Import ABIs
import AGENT_REGISTRY_ABI from "./abi/AgentRegistry_ABI.json";
import REPUTATION_SYSTEM_ABI from "./abi/ReputationSystem_ABI.json";
import MARKETPLACE_ABI from "./abi/Marketplace_ABI.json";

export interface HederaLog {
  type: "HCS" | "HTS" | "HFS" | "CONTRACT";
  message: string;
  timestamp: string;
  txId?: string;
  fileId?: string;
  contractAddress?: string;
}

const HEDERA_JSON_RPC_URL = process.env.HEDERA_NETWORK === "mainnet" 
  ? "https://mainnet.hashio.io/api" 
  : "https://testnet.hashio.io/api";

/**
 * Gets an ethers signer configured for Hedera JSON-RPC.
 */
export function getEthersSigner() {
  const pk = process.env.HEX_PRIVATE_KEY || process.env.HEDERA_PRIVATE_KEY;
  if (!pk) return null;
  
  const provider = new ethers.JsonRpcProvider(HEDERA_JSON_RPC_URL);
  return new ethers.Wallet(pk, provider);
}

/**
 * Gets a contract instance.
 */
export async function getContract(name: "AgentRegistry" | "ReputationSystem" | "Marketplace") {
  const signer = getEthersSigner();
  if (!signer) return null;

  let address = "";
  let abi: any = [];

  switch (name) {
    case "AgentRegistry":
      address = process.env.AGENT_REGISTRY_ADDRESS || "";
      abi = AGENT_REGISTRY_ABI;
      break;
    case "ReputationSystem":
      address = process.env.REPUTATION_SYSTEM_ADDRESS || "";
      abi = REPUTATION_SYSTEM_ABI;
      break;
    case "Marketplace":
      address = process.env.MARKETPLACE_ADDRESS || "";
      abi = MARKETPLACE_ABI;
      break;
  }

  if (!address) {
    console.warn(`Contract address for ${name} not found in environment`);
    return null;
  }
  
  return new ethers.Contract(address, abi, signer);
}

/**
 * Registers an agent on-chain in the AgentRegistry.
 */
export async function registerAgentOnChain(
  agentName: string, 
  metadataCid: string,
  capabilities: string[]
): Promise<HederaLog> {
  const registry = await getContract("AgentRegistry");
  const timestamp = new Date().toISOString();

  if (!registry) {
    return {
      type: "CONTRACT",
      message: `Registered agent ${agentName} (Simulated - Contract Address Missing)`,
      timestamp,
      txId: `sim-reg-${Date.now().toString(16)}`,
    };
  }

  try {
    const tx = await registry.registerAgent(agentName, metadataCid, capabilities, {
      gasPrice: ethers.parseUnits("1000", "gwei"),
      gasLimit: 1000000
    });
    const receipt = await tx.wait();

    return {
      type: "CONTRACT",
      message: `Registered agent ${agentName} on-chain`,
      timestamp,
      txId: receipt.hash,
      contractAddress: registry.target as string,
    };
  } catch (err) {
    console.error("Contract Error (registerAgent):", err);
    return {
      type: "CONTRACT",
      message: `On-chain registration failed for ${agentName}`,
      timestamp,
      txId: `error-reg-${Date.now().toString(16)}`,
    };
  }
}

/**
 * Creates a service contract on-chain (Escrow).
 */
export async function createOnChainEscrow(
  requestId: number,
  proposalId: number,
  price: number
): Promise<HederaLog> {
  const marketplace = await getContract("Marketplace");
  const timestamp = new Date().toISOString();

  if (!marketplace) {
    return {
      type: "CONTRACT",
      message: `Created on-chain escrow for request ${requestId} (Simulated)`,
      timestamp,
      txId: `sim-escrow-${Date.now().toString(16)}`,
    };
  }

  try {
    const tx = await marketplace.acceptProposal(requestId, proposalId, {
      gasPrice: ethers.parseUnits("1000", "gwei"),
      gasLimit: 2000000
    });
    const receipt = await tx.wait();

    return {
      type: "CONTRACT",
      message: `On-chain escrow created for request ${requestId} (Price: ${price} HBAR)`,
      timestamp,
      txId: receipt.hash,
      contractAddress: marketplace.target as string,
    };
  } catch (err) {
    console.error("Contract Error (acceptProposal):", err);
    return {
      type: "CONTRACT",
      message: `On-chain escrow failed for request ${requestId}`,
      timestamp,
      txId: `error-escrow-${Date.now().toString(16)}`,
    };
  }
}

/**
 * Uploads data to the Hedera File Service (HFS).
 */
export async function uploadToHFS(data: Uint8Array, memo: string): Promise<HederaLog> {
  const client = getClient();
  const timestamp = new Date().toISOString();

  if (!client) {
    return {
      type: "HFS",
      message: `Uploaded to HFS (Simulated): ${memo}`,
      timestamp,
      fileId: "0.0.0",
      txId: `sim-hfs-${Date.now().toString(16)}`,
    };
  }

  try {
    // 1. Create the file with initial small chunk
    const fileCreateTx = await new FileCreateTransaction()
      .setKeys([client.operatorPublicKey!])
      .setContents(data.slice(0, 1024))
      .setFileMemo(memo)
      .execute(client);

    const receipt = await fileCreateTx.getReceipt(client);
    const fileId = receipt.fileId!;

    // 2. Append remaining data if needed
    if (data.length > 1024) {
      const remainingData = data.slice(1024);
      const chunkSize = 2048; 
      for (let i = 0; i < remainingData.length; i += chunkSize) {
        const chunk = remainingData.slice(i, i + chunkSize);
        const appendTx = await new FileAppendTransaction()
          .setFileId(fileId)
          .setContents(chunk)
          .execute(client);
        await appendTx.getReceipt(client);
      }
    }

    return {
      type: "HFS",
      message: `Uploaded to HFS: ${memo}`,
      timestamp,
      fileId: fileId.toString(),
      txId: fileCreateTx.transactionId?.toString(),
    };
  } catch (err) {
    console.error("HFS Error:", err);
    return {
      type: "HFS",
      message: `HFS Upload Failed: ${memo}`,
      timestamp,
      txId: `error-hfs-${Date.now().toString(16)}`,
    };
  }
}

let cachedClient: Client | null = null;

function getClient(): Client | null {
  if (cachedClient) return cachedClient;

  const accountId = process.env.HEDERA_ACCOUNT_ID;
  const network = process.env.HEDERA_NETWORK || "testnet";
  
  const privateKeyStr = 
    process.env.DER_ENCODED_PRIVATE_KEY ||
    process.env.HEDERA_PRIVATE_KEY || 
    process.env.HEX_PRIVATE_KEY;

  if (!accountId || !privateKeyStr) {
    return null;
  }

  try {
    let client: Client;
    
    switch (network.toLowerCase()) {
      case "mainnet":
        client = Client.forMainnet();
        break;
      case "previewnet":
        client = Client.forPreviewnet();
        break;
      case "testnet":
      default:
        client = Client.forTestnet();
        break;
    }

    // Strip 0x from HEX key if present for Hedera SDK
    const cleanKey = privateKeyStr.startsWith("0x") ? privateKeyStr.substring(2) : privateKeyStr;
    const privateKey = PrivateKey.fromString(cleanKey);
    client.setOperator(AccountId.fromString(accountId), privateKey);
    
    cachedClient = client;
    return client;
  } catch (err) {
    console.error("Hedera Client Init Error:", err);
    return null;
  }
}

/**
 * Submits a message to Hedera Consensus Service (HCS).
 */
export async function logToHCS(message: string): Promise<HederaLog> {
  const client = getClient();
  const timestamp = new Date().toISOString();

  if (!client) {
    return {
      type: "HCS",
      message,
      timestamp,
      txId: `sim-hcs-${Date.now().toString(16)}`,
    };
  }

  try {
    let topicId = process.env.HEDERA_TOPIC_ID;

    if (!topicId) {
      const topicTx = await new TopicCreateTransaction().execute(client);
      const topicReceipt = await topicTx.getReceipt(client);
      topicId = topicReceipt.topicId!.toString();
    }

    const msgTx = await new TopicMessageSubmitTransaction({
      topicId,
      message,
    }).execute(client);

    await msgTx.getReceipt(client);

    return {
      type: "HCS",
      message,
      timestamp,
      txId: msgTx.transactionId?.toString(),
    };
  } catch (err) {
    console.error("HCS Error:", err);
    return {
      type: "HCS",
      message,
      timestamp,
      txId: `error-hcs-${Date.now().toString(16)}`,
    };
  }
}

/**
 * Simulates or executes a micro-payment between agents using HTS.
 */
export async function simulateAgentPayment(
  agentName: string,
  amount: number = 0.5
): Promise<HederaLog> {
  const client = getClient();
  const timestamp = new Date().toISOString();
  const operatorId = process.env.HEDERA_ACCOUNT_ID;
  const receiverId = process.env.HEDERA_RECEIVER_ID;

  if (!client || !operatorId) {
    return {
      type: "HTS",
      message: `Paid ${amount} HBAR to ${agentName} Agent (Simulated)`,
      timestamp,
      txId: `0.0.0@${Math.floor(Date.now()/1000)}.000000000`,
    };
  }

  try {
    const fromId = AccountId.fromString(operatorId);
    const toId = receiverId ? AccountId.fromString(receiverId) : fromId;

    const transferTx = await new TransferTransaction()
      .addHbarTransfer(fromId, new Hbar(-amount))
      .addHbarTransfer(toId, new Hbar(amount))
      .execute(client);

    await transferTx.getReceipt(client);

    return {
      type: "HTS",
      message: `Paid ${amount} HBAR to ${agentName} Agent (${toId.toString()})`,
      timestamp,
      txId: transferTx.transactionId?.toString(),
    };
  } catch (err) {
    console.error("HTS Error:", err);
    return {
      type: "HTS",
      message: `HBAR Payment Failed: ${err}`,
      timestamp,
      txId: `error-hts-${Date.now().toString(16)}`,
    };
  }
}
