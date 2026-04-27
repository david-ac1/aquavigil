import { NextRequest, NextResponse } from "next/server";
import { createDossierForIncident } from "@/lib/dossiers-store";

type GenerateDossierBody = {
  incidentId?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as GenerateDossierBody;

  if (!body.incidentId) {
    return NextResponse.json({ error: "incidentId is required." }, { status: 400 });
  }

  const record = createDossierForIncident(body.incidentId);
  if (!record) {
    return NextResponse.json({ error: "Incident not found." }, { status: 404 });
  }

  return NextResponse.json({
    data: record,
  });
}
