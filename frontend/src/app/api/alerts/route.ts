import { NextRequest, NextResponse } from "next/server";
import type { AlertStatus } from "@/lib/alerts-store";
import { listAlerts } from "@/lib/alerts-store";

export async function GET(request: NextRequest) {
  const statusFilter = request.nextUrl.searchParams.get("status") as AlertStatus | null;
  const alerts = listAlerts();

  const filtered = statusFilter
    ? alerts.filter((alert) => alert.status === statusFilter)
    : alerts;

  return NextResponse.json({ data: filtered });
}
