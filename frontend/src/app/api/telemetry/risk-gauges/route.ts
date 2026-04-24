import { NextResponse } from "next/server";
import { getRiskGaugeData } from "@/lib/telemetry";

export async function GET() {
  return NextResponse.json({
    data: getRiskGaugeData(),
  });
}
