import { NextResponse } from "next/server";
import { getDeltaTelemetry } from "@/lib/telemetry";

export async function GET() {
  return NextResponse.json({
    data: getDeltaTelemetry(),
  });
}
