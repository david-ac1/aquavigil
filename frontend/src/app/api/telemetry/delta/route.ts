import { NextResponse } from "next/server";
import { getDeltaTelemetry } from "@/lib/telemetry";

export async function GET() {
  try {
    const data = getDeltaTelemetry();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("telemetry.delta.error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
