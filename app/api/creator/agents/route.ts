import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAgent } from "@/lib/db";
import type { AgentCategory } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, category, priceHbar, systemPrompt } = await req.json();

    if (!name || !description || !category || !priceHbar || !systemPrompt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const agent = createAgent(
      name,
      session.user.email,
      description,
      category as AgentCategory,
      Number(priceHbar),
      systemPrompt
    );

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Agent creation error:", error);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
