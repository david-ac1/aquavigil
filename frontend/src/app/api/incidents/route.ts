import { NextRequest, NextResponse } from "next/server";
import { listIncidents } from "@/lib/incidents-store";

export async function GET(request: NextRequest) {
  try {
    const thresholdParam = request.nextUrl.searchParams.get("threshold");
    const threshold = thresholdParam ? Number(thresholdParam) : 0;

    return NextResponse.json({
      data: listIncidents({
        thresholdRiskQuotient: Number.isFinite(threshold) ? threshold : 0,
      }),
    });
  } catch (err) {
    console.error("incidents.list.error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
