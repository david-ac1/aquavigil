import { NextRequest, NextResponse } from "next/server";
import { getPrimaryDeepDive } from "@/lib/telemetry";

export async function GET(request: NextRequest) {
  const nodeId = request.nextUrl.searchParams.get("nodeId") ?? undefined;

  return NextResponse.json({
    data: getPrimaryDeepDive(nodeId),
  });
}
