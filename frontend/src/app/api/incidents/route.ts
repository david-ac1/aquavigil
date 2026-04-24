import { NextRequest, NextResponse } from "next/server";
import { listIncidents } from "@/lib/incidents-store";

export async function GET(request: NextRequest) {
  const thresholdParam = request.nextUrl.searchParams.get("threshold");
  const threshold = thresholdParam ? Number(thresholdParam) : 0;

  return NextResponse.json({
    data: listIncidents({
      thresholdRiskQuotient: Number.isFinite(threshold) ? threshold : 0,
    }),
  });
}
