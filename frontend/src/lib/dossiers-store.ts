import { getIncidentById } from "@/lib/incidents-store";
import { readJsonFile, writeJsonFile } from "@/lib/persistence";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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

export async function renderDossierPdf(dossierId: string): Promise<Uint8Array | null> {
  const dossier = getDossierById(dossierId);
  if (!dossier) {
    return null;
  }

  const incident = getIncidentById(dossier.incidentId);
  if (!incident) {
    return null;
  }

  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const titleFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await doc.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({
    x: 40,
    y: height - 110,
    width: width - 80,
    height: 56,
    color: rgb(0.06, 0.08, 0.1),
  });

  page.drawText("AquaVigil ESG Accountability Dossier", {
    x: 52,
    y: height - 80,
    size: 18,
    font: titleFont,
    color: rgb(0.77, 0.96, 1),
  });

  const lines = [
    `Dossier ID: ${dossier.dossierId}`,
    `Generated At (UTC): ${dossier.generatedAt}`,
    `Incident ID: ${dossier.incidentId}`,
    "",
    "Incident Summary",
    `Node: ${incident.nodeId}`,
    `Sector: ${incident.sector}`,
    `Pollutant: ${incident.pollutant}`,
    `Risk Quotient: ${incident.riskQuotient}%`,
    `Delta: ${incident.deltaPercent}%`,
    `Status: ${incident.status}`,
    `Severity: ${incident.severity}`,
    `Observed At: ${incident.observedAt}`,
    "",
    "Ledger Proof",
    `Evidence Hash: ${dossier.evidenceHash}`,
  ];

  let y = height - 150;
  lines.forEach((line) => {
    const isSectionHeader =
      line === "Incident Summary" || line === "Ledger Proof";

    if (!line) {
      y -= 10;
      return;
    }

    page.drawText(line, {
      x: 52,
      y,
      size: isSectionHeader ? 12 : 10,
      font: isSectionHeader ? titleFont : bodyFont,
      color: isSectionHeader ? rgb(0.77, 0.96, 1) : rgb(0.89, 0.91, 0.94),
    });

    y -= isSectionHeader ? 18 : 14;
  });

  return doc.save();
}
