"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ThresholdGauge } from "@/components/threshold-gauge";
import { VigilanceBadge } from "@/components/vigilance-badge";
import type { StakeholderAlert } from "@/lib/alerts-store";
import type { BreachIncident } from "@/lib/incidents";
import type { DeltaTelemetry, RiskGaugeData } from "@/lib/telemetry";
import {
  advanceIncidentStatus,
  dispatchStakeholderAlert,
  fetchAlerts,
  fetchDeltaTelemetry,
  fetchIncidents,
  fetchRiskGauges,
  generateDossierForIncident,
} from "@/lib/telemetry-client";

export default function Home() {
  const [telemetry, setTelemetry] = useState<DeltaTelemetry[]>([]);
  const [gauges, setGauges] = useState<RiskGaugeData[]>([]);
  const [incidents, setIncidents] = useState<BreachIncident[]>([]);
  const [alerts, setAlerts] = useState<StakeholderAlert[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        const [delta, gaugeData, incidentData, alertData] = await Promise.all([
          fetchDeltaTelemetry(),
          fetchRiskGauges(),
          fetchIncidents(100),
          fetchAlerts(),
        ]);

        if (!isMounted) {
          return;
        }

        setTelemetry(delta);
        setGauges(gaugeData);
        setIncidents(incidentData);
        setAlerts(alertData);
        setSelectedIncidentId(incidentData[0]?.incidentId ?? null);
        setSelectedAlertId(alertData[0]?.alertId ?? null);
        setError(null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error ? loadError.message : "Unable to load dashboard.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const badgeScore = useMemo(() => {
    if (!telemetry.length) {
      return 80;
    }

    return Math.max(60, Math.min(99, telemetry[0].riskQuotient));
  }, [telemetry]);

  const activeIncident = useMemo(
    () => incidents.find((incident) => incident.incidentId === selectedIncidentId),
    [incidents, selectedIncidentId],
  );

  const activeAlert = useMemo(
    () => alerts.find((alert) => alert.alertId === selectedAlertId),
    [alerts, selectedAlertId],
  );

  async function refreshAll() {
    const [delta, gaugeData, incidentData, alertData] = await Promise.all([
      fetchDeltaTelemetry(),
      fetchRiskGauges(),
      fetchIncidents(100),
      fetchAlerts(),
    ]);

    setTelemetry(delta);
    setGauges(gaugeData);
    setIncidents(incidentData);
    setAlerts(alertData);
    setSelectedIncidentId((current) => current ?? incidentData[0]?.incidentId ?? null);
    setSelectedAlertId((current) => current ?? alertData[0]?.alertId ?? null);
  }

  async function onAdvanceSelectedIncident() {
    if (!selectedIncidentId) {
      return;
    }

    try {
      await advanceIncidentStatus(selectedIncidentId);
      await refreshAll();
      setActionMessage("Incident advanced and alert queue refreshed.");
    } catch (transitionError) {
      setError(
        transitionError instanceof Error
          ? transitionError.message
          : "Failed to advance incident.",
      );
    }
  }

  async function onDispatchSelectedAlert() {
    if (!selectedAlertId) {
      return;
    }

    try {
      await dispatchStakeholderAlert(selectedAlertId);
      await refreshAll();
      setActionMessage("Alert dispatched successfully.");
    } catch (dispatchError) {
      setError(
        dispatchError instanceof Error
          ? dispatchError.message
          : "Failed to dispatch alert.",
      );
    }
  }

  async function onGenerateSelectedDossier() {
    if (!selectedIncidentId) {
      return;
    }

    try {
      const generated = await generateDossierForIncident(selectedIncidentId);
      setReceipt(`${generated.dossierId} ready for download`);
      setActionMessage("Dossier generated from current incident.");
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "Failed to generate dossier.",
      );
    }
  }

  return (
    <section className="stack-lg dashboard-shell">
      <div className="panel panel--hero dashboard-hero">
        <div>
          <p className="kicker">Operations Command Center</p>
          <h1 className="headline-lg">AquaVigil Dashboard</h1>
          <p className="muted">
            One place to monitor breach signals, manage incidents, dispatch alerts,
            and generate dossier evidence without leaving the application.
          </p>
        </div>
        <VigilanceBadge score={badgeScore} />
      </div>

      {error && <div className="panel panel--error">{error}</div>}
      {actionMessage && <div className="panel panel--success">{actionMessage}</div>}

      <div className="dashboard-stats">
        <article className="panel stat-card">
          <span className="kicker">Active Incidents</span>
          <strong>{incidents.length}</strong>
          <p className="muted">Open, under review, and resolved cases in persistence.</p>
        </article>
        <article className="panel stat-card">
          <span className="kicker">Queued Alerts</span>
          <strong>{alerts.length}</strong>
          <p className="muted">Notification records awaiting or completing dispatch.</p>
        </article>
        <article className="panel stat-card">
          <span className="kicker">Top Risk Quotient</span>
          <strong>{telemetry[0]?.riskQuotient ?? 0}%</strong>
          <p className="muted">Live severity derived from upstream/downstream deltas.</p>
        </article>
        <article className="panel stat-card">
          <span className="kicker">Selected Dossier</span>
          <strong>{receipt ?? "None yet"}</strong>
          <p className="muted">Latest dossier receipt generated from a current incident.</p>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="panel dashboard-panel">
          <div className="dashboard-panel__header">
            <h2 className="headline-md">Priority Incident</h2>
            <Link className="dashboard-link" href="/sentinel-map">
              Open Sentinel Map
            </Link>
          </div>
          {isLoading && <p className="muted">Loading incident data...</p>}
          {!isLoading && activeIncident && (
            <div className="dashboard-card">
              <div className="dashboard-card__meta">
                <span>{activeIncident.incidentId}</span>
                <span>{activeIncident.status.toUpperCase()}</span>
              </div>
              <h3>{activeIncident.pollutant}</h3>
              <p>
                {activeIncident.sector} · {activeIncident.deltaPercent}% delta · {activeIncident.riskQuotient}% RQ
              </p>
            </div>
          )}
          <div className="dashboard-actions">
            <button type="button" className="incident-action-btn" onClick={onAdvanceSelectedIncident} disabled={!selectedIncidentId}>
              Advance Incident
            </button>
            <button type="button" className="incident-action-btn" onClick={onGenerateSelectedDossier} disabled={!selectedIncidentId}>
              Generate Dossier
            </button>
          </div>
          <div className="stack-sm">
            {incidents.slice(0, 3).map((incident) => (
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
                {incident.incidentId} · {incident.pollutant} · {incident.status}
              </button>
            ))}
          </div>
        </article>

        <article className="panel dashboard-panel">
          <div className="dashboard-panel__header">
            <h2 className="headline-md">Stakeholder Alerting</h2>
            <Link className="dashboard-link" href="/transparency-feed">
              Open Transparency Feed
            </Link>
          </div>
          {isLoading && <p className="muted">Loading alert queue...</p>}
          {!isLoading && activeAlert && (
            <div className="dashboard-card">
              <div className="dashboard-card__meta">
                <span>{activeAlert.alertId}</span>
                <span>{activeAlert.status.toUpperCase()}</span>
              </div>
              <h3>{activeAlert.trigger}</h3>
              <p>
                {activeAlert.channel.toUpperCase()} · {activeAlert.destination}
              </p>
            </div>
          )}
          <div className="dashboard-actions">
            <button type="button" className="incident-action-btn" onClick={onDispatchSelectedAlert} disabled={!selectedAlertId}>
              Dispatch Alert
            </button>
            <Link className="incident-action-btn incident-action-link" href="/ngo-reporting">
              Build Dossier Report
            </Link>
          </div>
          <div className="stack-sm">
            {alerts.slice(0, 3).map((alert) => (
              <button
                key={alert.alertId}
                type="button"
                className={
                  selectedAlertId === alert.alertId
                    ? "incident-row incident-row--active"
                    : "incident-row"
                }
                onClick={() => setSelectedAlertId(alert.alertId)}
              >
                {alert.alertId} · {alert.trigger} · {alert.status}
              </button>
            ))}
          </div>
        </article>
      </div>

      <div className="dashboard-grid dashboard-grid--lower">
        <article className="panel dashboard-panel">
          <h2 className="headline-md">Telemetry Snapshot</h2>
          <div className="stack-sm">
            {gauges.slice(0, 3).map((gauge) => (
              <ThresholdGauge key={gauge.label} label={gauge.label} value={gauge.value} />
            ))}
          </div>
        </article>

        <article className="panel dashboard-panel">
          <h2 className="headline-md">Quick Actions</h2>
          <div className="dashboard-actions dashboard-actions--links">
            <Link className="dashboard-link dashboard-link--button" href="/sensor-deep-dive">
              Analyze Node
            </Link>
            <Link className="dashboard-link dashboard-link--button" href="/ngo-reporting">
              Generate Dossier
            </Link>
            <Link className="dashboard-link dashboard-link--button" href="/sentinel-map">
              Review Map
            </Link>
            <Link className="dashboard-link dashboard-link--button" href="/transparency-feed">
              Review Feed
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
