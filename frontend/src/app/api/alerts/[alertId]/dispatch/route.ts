import { NextResponse } from "next/server";
import { dispatchAlert } from "@/lib/alerts-store";

type Params = {
  params: Promise<{ alertId: string }>;
};

export async function POST(_: Request, context: Params) {
  const { alertId } = await context.params;
  const alert = await dispatchAlert(alertId);

  if (!alert) {
    return NextResponse.json({ error: "Alert not found." }, { status: 404 });
  }

  return NextResponse.json({ data: alert });
}
