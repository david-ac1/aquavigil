import { NextRequest, NextResponse } from "next/server";
import { getIncidentById } from "@/lib/incidents-store";

type GenerateDossierBody = {
  incidentId?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as GenerateDossierBody;

  if (!body.incidentId) {
    return NextResponse.json({ error: "incidentId is required." }, { status: 400 });
  }

  const incident = getIncidentById(body.incidentId);
  if (!incident) {
    return NextResponse.json({ error: "Incident not found." }, { status: 404 });
  }

  const timestamp = new Date().toISOString();
  const dossierId = `DOS-${incident.incidentId}-${timestamp.slice(11, 16).replace(":", "")}`;

  return NextResponse.json({
    data: {
      dossierId,
      incidentId: incident.incidentId,
      generatedAt: timestamp,
      downloadUrl: `/api/dossiers/${dossierId}/download`,
      evidenceHash: incident.evidenceHash,
    },
  });
}
