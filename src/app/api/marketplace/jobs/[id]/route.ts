import { NextRequest, NextResponse } from "next/server";
import { getJob, updateJobStatus, getUserByEmail, getAgent } from "@/lib/db";
import { logToHCS } from "@/lib/hedera";
import { auth } from "@/auth";
import { sendHandshakeConfirmedEmail, sendEscrowReleaseEmail } from "@/lib/mail";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const job = getJob(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json({ job });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action } = body; // "confirm" or "reject"

    const job = getJob(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Authorization check
    const userId = (session.user as any).id || session.user.email;
    if (job.clientId && job.clientId !== userId) {
      return NextResponse.json({ error: "You are not authorized to manage this job" }, { status: 403 });
    }

    if (job.status !== "awaiting_handshake") {
      return NextResponse.json({ error: "Job is not ready for a handshake" }, { status: 400 });
    }

    if (action === "confirm") {
      // User accepted the deliverable -> Release funds to agent (2.5% platform fee deducted on-chain)
      const platformFee = ((job as any).priceHbar * 2.5) / 100;
      const agentEarnings = ((job as any).priceHbar || 0) - platformFee;
      const logResponse = await logToHCS(
        JSON.stringify({
          event: "HANDSHAKE_CONFIRMED",
          jobId: id,
          agentId: job.agentId,
          client: userId,
          settlement: "RELEASE_TO_AGENT",
          platformFee: platformFee.toFixed(4),
          agentEarnings: agentEarnings.toFixed(4),
          gasNote: "Estimated 1000 gwei Hedera EVM gas applied",
          timestamp: new Date().toISOString(),
          marketplaceContract: process.env.MARKETPLACE_ADDRESS || "",
        })
      );
      updateJobStatus(id, "completed", undefined, undefined, logResponse.txId);

      // Send emails
      const clientEmail = userId;
      const agentObj = getAgent(job.agentId);
      if (agentObj) {
        const clientUser = getUserByEmail(clientEmail);
        const ownerUser = getUserByEmail(agentObj.creator);
        
        const clientName = clientUser?.name || clientEmail.split("@")[0];
        sendHandshakeConfirmedEmail(clientEmail, clientName, id, agentObj.name).catch(console.error);

        if (ownerUser) {
          const ownerEmail = ownerUser.id;
          const ownerName = ownerUser.name;
          sendEscrowReleaseEmail(ownerEmail, ownerName, id, agentObj.name, agentEarnings).catch(console.error);
        }
      }

      return NextResponse.json({ success: true, message: "Funds released to Agent Creator." });
    } else if (action === "reject") {
      // User rejected -> Refund minus 5% gas penalty
      const penalty = ((job as any).priceHbar * 5) / 100;
      const refundAmount = ((job as any).priceHbar || 0) - penalty;
      const logResponse = await logToHCS(
        JSON.stringify({
          event: "HANDSHAKE_REJECTED",
          jobId: id,
          agentId: job.agentId,
          client: userId,
          settlement: "REFUND_TO_CLIENT",
          penalty: penalty.toFixed(4),
          refundAmount: refundAmount.toFixed(4),
          gasNote: "Contractual 5% gas penalty applied",
          timestamp: new Date().toISOString(),
          marketplaceContract: process.env.MARKETPLACE_ADDRESS || "",
        })
      );
      updateJobStatus(id, "refunded", undefined, undefined, logResponse.txId);
      return NextResponse.json({ success: true, message: "Funds refunded minus 5% penalty." });
    } else if (action === "rate") {
      // User wants to rate the completed job
      const { rating } = body;
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
      }
      
      const ratingLog = await logToHCS(
        JSON.stringify({
          event: "REPUTATION_RATED",
          jobId: id,
          agentId: job.agentId,
          rating,
          reviewer: userId,
          timestamp: new Date().toISOString(),
          reputationContract: process.env.REPUTATION_SYSTEM_ADDRESS || "",
        })
      );
      const ratedJob = await import("@/lib/db").then(m => m.rateJob(id, rating, ratingLog.txId));
      
      if (!ratedJob) {
        return NextResponse.json({ error: "Could not rate job" }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: "Rating submitted successfully." });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: "Failed to process handshake" }, { status: 500 });
  }
}
