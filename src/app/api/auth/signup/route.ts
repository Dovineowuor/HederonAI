import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db";
import { provisionNewAccount } from "@/lib/hedera";

export async function POST(req: NextRequest) {
  try {
    const { email, name, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Provision a real Hedera testnet account for the new user (initial funding of 5 HBAR)
    const wallet = await provisionNewAccount(5);
    const accountId = wallet?.accountId;
    const privateKey = wallet?.privateKey;

    if (!accountId) {
      console.warn("Hedera account provisioning failed for", email);
    } else {
      console.log(`Successfully provisioned Hedera Wallet ${accountId} for ${email}`);
    }

    createUser(email, name, password, accountId, privateKey);

    return NextResponse.json({ 
      message: "User created successfully",
      wallet: accountId 
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
