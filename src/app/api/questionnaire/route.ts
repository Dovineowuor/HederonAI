import { NextRequest, NextResponse } from "next/server";
import { STRATEGIC_QUESTIONS } from "@/lib/questionnaire";
import { callKiloModel } from "@/lib/kilo-router";

const CONSULTANT_PROMPT = `You are the Hederon AI Executive Consultant. Your task is to generate a strategic customization questionnaire for a user based on their specific business goal or challenge.

Generate exactly 6 strategic, multiple-choice questions that will help the AI executive team (CEO, Strategy, Marketing, Ops) better understand the project's DNA.

For each question, provide:
- id: a unique camelCase string
- question: a clear, strategic question
- options: exactly 4 distinct, high-impact options
- icon: one of ["building", "globe", "megaphone", "coins", "target", "calendar", "zap", "briefcase", "rocket"]
- category: one of ["business", "technical", "market", "execution"]

Respond ONLY with valid JSON in this format:
{
  "questions": [
    { "id": "...", "question": "...", "options": ["...", "...", "...", "..."], "icon": "...", "category": "..." },
    ...
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const { goal, challenge } = await req.json();
    const context = goal || challenge || "General project launch";

    const kiloAvailable = !!(process.env.KILO_API_KEY);
    if (!kiloAvailable) {
      return NextResponse.json({ questions: STRATEGIC_QUESTIONS });
    }

    const raw = await callKiloModel(
      CONSULTANT_PROMPT,
      `User Goal/Challenge: ${context}`,
      process.env.DEFAULT_AI_MODEL ?? "gpt-4o-mini",
      { type: "json_object" }
    );

    const data = JSON.parse(raw);
    return NextResponse.json({ questions: data.questions || STRATEGIC_QUESTIONS });
  } catch (err) {
    console.error("AI Questionnaire failed, falling back", err);
    return NextResponse.json({ questions: STRATEGIC_QUESTIONS });
  }
}

export async function GET() {
  return NextResponse.json({ questions: STRATEGIC_QUESTIONS });
}
