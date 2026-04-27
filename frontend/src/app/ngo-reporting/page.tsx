"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VigilanceBadge } from "@/components/vigilance-badge";
import type { BreachIncident } from "@/lib/incidents";
import {
  type DossierReceipt,
  fetchIncidents,
  generateDossierForIncident,
} from "@/lib/telemetry-client";

export default function NgoReportingPage() {
  const searchParams = useSearchParams();
  const [incidents, setIncidents] = useState<BreachIncident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<DossierReceipt | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadIncidents() {
      try {
        const response = await fetchIncidents(100);
        if (!isMounted) {
          return;
        }

        setIncidents(response);
        const requestedIncidentId = searchParams.get("incidentId");
        const matchedIncident =
          (requestedIncidentId &&
            response.find((incident) => incident.incidentId === requestedIncidentId)) ??
          response[0];

        setSelectedIncidentId(matchedIncident?.incidentId ?? null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Failed to load incidents.");
      }
    }

    void loadIncidents();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  async function onGenerateDossier() {
    if (!selectedIncidentId) {
      return;
    }

    try {
      setIsGenerating(true);
      const generated = await generateDossierForIncident(selectedIncidentId);
      setReceipt(generated);
      setError(null);
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "Dossier generation failed.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="stack-lg">
      <div className="panel panel--hero">
        <div>
          <p className="kicker">Audit-Ready Evidence</p>
          <h1 className="headline-lg">NGO Reporting Tool</h1>
          <p className="muted">
            Generate legal-grade ESG dossiers with timestamped telemetry and
            geospatial proof.
          </p>
        </div>
        <VigilanceBadge score={93} />
      </div>

      {error && <div className="panel panel--error">{error}</div>}

      <div className="grid-2">
        <article className="panel">
          <h2 className="headline-md">Open Investigations</h2>
          <div className="stack-sm">
            {incidents.map((incident) => (
              <button
                key={incident.incidentId}
                type="button"
                className={
                  selectedIncidentId === incident.incidentId
                    ? "incident-row incident-row--active"
                    : "incident-row"
                }
                onClick={() => setSelectedIncidentId(incident.incidentId)}
              >
                {incident.incidentId}: {incident.pollutant} in {incident.sector}
              </button>
            ))}
            {!incidents.length && (
              <div className="incident-row">No incidents currently available.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <h2 className="headline-md">Dossier Pipeline</h2>
          <ol className="ordered-steps">
            <li>Collect upstream/downstream comparative data</li>
            <li>Attach ledger hash verification</li>
            <li>Build PDF evidence package</li>
            <li>Dispatch to EPA and ESG board contacts</li>
          </ol>
          <div className="stack-sm mt-4">
            <button
              type="button"
              className="incident-action-btn"
              disabled={!selectedIncidentId || isGenerating}
              onClick={onGenerateDossier}
            >
              {isGenerating ? "Generating..." : "Generate Dossier"}
            </button>

            {receipt && (
              <div className="incident-row">
                <div>Dossier: {receipt.dossierId}</div>
                <div>Incident: {receipt.incidentId}</div>
                <div>Evidence: {receipt.evidenceHash}</div>
                <div>Download: {receipt.downloadUrl}</div>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
