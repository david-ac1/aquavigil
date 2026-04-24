import { NextRequest, NextResponse } from "next/server";
import { getBreachIncidents } from "@/lib/incidents";

export async function GET(request: NextRequest) {
  const rawThreshold = request.nextUrl.searchParams.get("threshold");
  const threshold = rawThreshold ? Number(rawThreshold) : 100;

  return NextResponse.json({
    data: getBreachIncidents(Number.isFinite(threshold) ? threshold : 100),
  });
}
