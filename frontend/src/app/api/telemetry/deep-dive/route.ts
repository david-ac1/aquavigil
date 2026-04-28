import { NextRequest, NextResponse } from "next/server";
import { getPrimaryDeepDive } from "@/lib/telemetry";

export async function GET(request: NextRequest) {
  try {
    const nodeId = request.nextUrl.searchParams.get("nodeId") ?? undefined;
    const data = getPrimaryDeepDive(nodeId);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("telemetry.deepDive.error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
