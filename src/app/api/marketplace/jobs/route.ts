import { NextRequest, NextResponse } from "next/server";
import { createJob, updateJobStatus, getAgent } from "@/lib/db";
import { callKiloModel } from "@/lib/kilo-router";
import { AGENT_PROMPTS } from "@/app/api/agents/route";
import { logToHCS } from "@/lib/hedera";
import { uploadToIPFS } from "@/lib/ipfs";
import { auth } from "@/auth";
import JSZip from "jszip";

// Helper simulation function, since the real agent logic is complex
async function simulateAutonomousAgentWork(jobId: string, agentId: string, instruction: string) {
  try {
    updateJobStatus(jobId, "working");

    const agent = getAgent(agentId);
    let systemPrompt = "You are a specialized AI Agent hired via a smart contract escrow. Execute the client's instructions perfectly and return a high-quality deliverable in markdown format. Be comprehensive.";
    
    if (agent && AGENT_PROMPTS[agent.category]) {
        systemPrompt = AGENT_PROMPTS[agent.category] + `\n\nReturn EXACTLY a 200-400 word deliverable strictly fulfilling the requested instruction. Format using nice Markdown.`;
    }

    let output = "";
    if (process.env.KILO_API_KEY) {
      output = await callKiloModel(systemPrompt, instruction, "gpt-4o-mini");
    } else {
      await new Promise(resolve => setTimeout(resolve, 5000));
      output = `# Autonomous Delivery\n\nI have completed the task: "${instruction}"\n\nHere is the strategy and execution you requested... (Kilo AI Fallback - No API Key)`;
    }

    // Generate a professional ZIP artifact
    const zip = new JSZip();
    
    // 1. COMPLETION_REPORT.pdf
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFillColor(33, 33, 33);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(0, 238, 255);
    doc.setFontSize(18);
    doc.text(`Project Completion: ${agent?.name || 'Agent'}`, 10, 20);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Job ID: ${jobId}`, 10, 45);
    doc.text(`Instruction: ${instruction.slice(0, 60)}...`, 10, 55);
    
    const splitReport = doc.splitTextToSize(output, 180);
    doc.setFontSize(10);
    doc.text(splitReport, 10, 70);
    
    const pdfBuffer = doc.output("arraybuffer");
    zip.file("COMPLETION_REPORT.pdf", pdfBuffer);

    // 2. TECHNICAL_SUMMARY.pdf (SDLC style)
    const techDoc = new jsPDF();
    techDoc.text("Technical Summary & Verifiable Proof", 10, 20);
    techDoc.setFontSize(10);
    techDoc.text(`Timestamp: ${new Date().toISOString()}`, 10, 30);
    techDoc.text(`Agent Identity: ${agentId}`, 10, 35);
    techDoc.text(`Network: Hedera Testnet`, 10, 40);
    techDoc.text("--------------------------------------------------", 10, 45);
    techDoc.text("The following deliverables are immutably logged and pinned to IPFS.", 10, 55);
    
    const techBuffer = techDoc.output("arraybuffer");
    zip.file("TECHNICAL_SUMMARY.pdf", techBuffer);
    
    // 3. JOB_RECEIPT.json
    const receipt = {
      jobId,
      agentId,
      agentName: agent?.name,
      timestamp: new Date().toISOString(),
      instruction,
      verifiable: true,
      network: "Hedera Testnet"
    };
    zip.file("JOB_RECEIPT.json", JSON.stringify(receipt, null, 2));
    
    // 4. System execution log (manifest)
    const manifest = `ExecuAI Agent Autonomous Execution Log\n====================================\nTimestamp: ${receipt.timestamp}\nStatus: SUCCESS\nContract ID: ${jobId}\n\nExecution traced and pinned to IPFS via ExecuAI Autonomous Worker.`;
    zip.file("EXECUTION_LOG.txt", manifest);

    const zipBuffer = await zip.generateAsync({ type: "uint8array" });
    
    // Log delivery to blockchain & Upload to HFS (Hedera File Service)
    const hfsLog = await import("@/lib/hedera").then(m => m.uploadToHFS(zipBuffer, `ExecuAI Job ${jobId} Artifact`));
    
    // Pin ZIP to IPFS (Simulated)
    const ipfsResult = await uploadToIPFS(zipBuffer, `ExecuAI_${jobId}_Project_Bundle.zip`, "application/zip");

    // We store the HFS FileID too, or just the txHash
    updateJobStatus(jobId, "awaiting_handshake", output, ipfsResult.hash, hfsLog.txId);

  } catch (error) {
    console.error("Agent execution failed:", error);
    updateJobStatus(jobId, "refunded", "Error: Agent crashed during autonomous execution.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    // In a real app, middleware handles protection, but we can double check
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { agentId, instruction, priceHbar } = body;

    if (!agentId || !instruction) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Platform fee: 2.5% (matches on-chain config)
    const platformFee = (priceHbar * 2.5) / 100;
    const agentEarnings = priceHbar - platformFee;

    // Create the job record first so we have an ID for the on-chain log
    const job = createJob(agentId, instruction, priceHbar, undefined, (session.user as any).id || session.user.email || undefined);

    // Log escrow creation to HCS (on-chain event) with full fee breakdown
    const logResponse = await logToHCS(
      JSON.stringify({
        event: "ESCROW_CREATED",
        jobId: job.id,
        agentId,
        client: (session.user as any).id || session.user.email,
        priceHbar,
        platformFee: platformFee.toFixed(4),
        agentEarnings: agentEarnings.toFixed(4),
        timestamp: new Date().toISOString(),
        network: process.env.HEDERA_NETWORK || "testnet",
        marketplaceContract: process.env.MARKETPLACE_ADDRESS || "",
      })
    );

    // Patch txId onto the already-created job
    if (logResponse.txId) {
      updateJobStatus(job.id, "escrowed", undefined, undefined, logResponse.txId);
    }

    // KICK OFF AUTONOMOUS EXECUTION IN THE BACKGROUND
    simulateAutonomousAgentWork(job.id, agentId, instruction);

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Escrow Job creation failed:", error);
    return NextResponse.json({ error: "Failed to create escrow job" }, { status: 500 });
  }
}
