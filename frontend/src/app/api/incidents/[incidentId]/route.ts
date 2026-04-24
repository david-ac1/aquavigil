import { NextRequest, NextResponse } from "next/server";
import type { IncidentStatus } from "@/lib/incidents";
import { getIncidentById, transitionIncidentStatus } from "@/lib/incidents-store";

type Params = {
  params: Promise<{ incidentId: string }>;
};

export async function GET(_: NextRequest, context: Params) {
  const { incidentId } = await context.params;
  const incident = getIncidentById(incidentId);

  if (!incident) {
    return NextResponse.json({ error: "Incident not found." }, { status: 404 });
  }

  return NextResponse.json({ data: incident });
}

export async function PATCH(request: NextRequest, context: Params) {
  const { incidentId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { status?: IncidentStatus };

  try {
    const updated = transitionIncidentStatus(incidentId, body.status);

    if (!updated) {
      return NextResponse.json({ error: "Incident not found." }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to transition incident.",
      },
      { status: 400 },
    );
  }
}
