import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  const db = getDb();
  // Fetch all settings
  const rawSettings = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  
  // Convert to key-value object
  const settings = rawSettings.reduce((acc, current) => {
    // Attempt to parse JSON values (booleans/objects), fallback to string
    try {
      acc[current.key] = JSON.parse(current.value);
    } catch {
      acc[current.key] = current.value;
    }
    return acc;
  }, {} as Record<string, any>);

  // Default values if table is empty
  const defaultSettings = {
    auth_hedera_wallet: true,
    auth_email_password: true,
    auth_sso_auth0: true,
    integration_ipfs: true,
    integration_hedera_hcs: true,
    theme_mode: "dark",
    ...settings,
  };

  return NextResponse.json(defaultSettings);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const db = getDb();

    // Use a transaction for atomic updates
    const updateSettings = db.transaction((settingsObj: Record<string, any>) => {
      const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, datetime('now'))");
      for (const [key, value] of Object.entries(settingsObj)) {
        // Store booleans and objects as JSON strings, raw strings as strings
        const storeValue = typeof value === 'string' ? value : JSON.stringify(value);
        stmt.run(key, storeValue);
      }
    });

    updateSettings(data);

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
