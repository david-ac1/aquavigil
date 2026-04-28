import { NextResponse } from "next/server";
import { getRiskGaugeData } from "@/lib/telemetry";

export async function GET() {
  try {
    const data = getRiskGaugeData();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("telemetry.riskGauges.error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
