import { getIncidentById } from "@/lib/incidents-store";
import { readJsonFile, writeJsonFile } from "@/lib/persistence";

export type DossierRecord = {
  dossierId: string;
  incidentId: string;
  generatedAt: string;
  downloadUrl: string;
  evidenceHash: string;
};

const DOSSIERS_FILE = "dossiers.json";

function getAllDossiers(): DossierRecord[] {
  return readJsonFile<DossierRecord[]>(DOSSIERS_FILE, []);
}

function saveAllDossiers(dossiers: DossierRecord[]): void {
  writeJsonFile(DOSSIERS_FILE, dossiers);
}

export function createDossierForIncident(incidentId: string): DossierRecord | null {
  const incident = getIncidentById(incidentId);
  if (!incident) {
    return null;
  }

  const generatedAt = new Date().toISOString();
  const dossierId = `DOS-${incident.incidentId}-${generatedAt.slice(11, 16).replace(":", "")}`;
  const downloadUrl = `/api/dossiers/${dossierId}/download`;

  const record: DossierRecord = {
    dossierId,
    incidentId: incident.incidentId,
    generatedAt,
    downloadUrl,
    evidenceHash: incident.evidenceHash,
  };

  const dossiers = getAllDossiers();
  dossiers.unshift(record);
  saveAllDossiers(dossiers);

  return record;
}

export function getDossierById(dossierId: string): DossierRecord | undefined {
  return getAllDossiers().find((dossier) => dossier.dossierId === dossierId);
}

export function renderDossierText(dossierId: string): string | null {
  const dossier = getDossierById(dossierId);
  if (!dossier) {
    return null;
  }

  const incident = getIncidentById(dossier.incidentId);
  if (!incident) {
    return null;
  }

  return [
    "AquaVigil ESG Accountability Dossier",
    "",
    `Dossier ID: ${dossier.dossierId}`,
    `Generated At (UTC): ${dossier.generatedAt}`,
    `Incident ID: ${dossier.incidentId}`,
    "",
    "Incident Summary",
    `- Node: ${incident.nodeId}`,
    `- Sector: ${incident.sector}`,
    `- Pollutant: ${incident.pollutant}`,
    `- Risk Quotient: ${incident.riskQuotient}%`,
    `- Delta: ${incident.deltaPercent}%`,
    `- Status: ${incident.status}`,
    `- Severity: ${incident.severity}`,
    `- Observed At: ${incident.observedAt}`,
    "",
    "Ledger Proof",
    `- Evidence Hash: ${dossier.evidenceHash}`,
  ].join("\n");
}
