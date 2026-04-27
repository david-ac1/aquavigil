"use client";

import { useEffect, useMemo, useState } from "react";
import { ThresholdGauge } from "@/components/threshold-gauge";
import { VigilanceBadge } from "@/components/vigilance-badge";
import type { StakeholderAlert } from "@/lib/alerts-store";
import type { DeltaTelemetry, RiskGaugeData } from "@/lib/telemetry";
import type { BreachIncident } from "@/lib/incidents";
import {
  advanceIncidentStatus,
  dispatchStakeholderAlert,
  fetchDeltaTelemetry,
  fetchAlerts,
  fetchIncidents,
  fetchRiskGauges,
} from "@/lib/telemetry-client";

export default function SentinelMapPage() {
  const [telemetry, setTelemetry] = useState<DeltaTelemetry[]>([]);
  const [gauges, setGauges] = useState<RiskGaugeData[]>([]);
  const [incidents, setIncidents] = useState<BreachIncident[]>([]);
  const [alerts, setAlerts] = useState<StakeholderAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTelemetry() {
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
        setError(null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load telemetry data.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTelemetry();

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

  async function onAdvanceIncident(incidentId: string) {
    try {
      await advanceIncidentStatus(incidentId);
      const [refreshed, refreshedAlerts] = await Promise.all([
        fetchIncidents(100),
        fetchAlerts(),
      ]);
      setIncidents(refreshed);
      setAlerts(refreshedAlerts);
    } catch (transitionError) {
      setError(
        transitionError instanceof Error
          ? transitionError.message
          : "Failed to update incident status.",
      );
    }
  }

  async function onDispatchAlert(alertId: string) {
    try {
      await dispatchStakeholderAlert(alertId);
      const refreshedAlerts = await fetchAlerts();
      setAlerts(refreshedAlerts);
    } catch (dispatchError) {
      setError(
        dispatchError instanceof Error
          ? dispatchError.message
          : "Failed to dispatch alert.",
      );
    }
  }

  return (
    <section className="stack-lg">
      <div className="panel panel--hero">
        <div>
          <p className="kicker">Live Geospatial Monitoring</p>
          <h1 className="headline-lg">Sentinel Map Dashboard</h1>
          <p className="muted">
            Upstream versus downstream delta analysis to pinpoint likely discharge
            sources in real time.
          </p>
        </div>
        <VigilanceBadge score={badgeScore} />
      </div>

      {error && <div className="panel panel--error">{error}</div>}

      <div className="grid-2">
        <article className="panel panel--map">
          <h2 className="headline-md">Map Canvas</h2>
          <div className="map-mock">
            <div className="node node--alert" />
            <div className="node node--alert node--small" />
            <div className="node node--baseline" />
          </div>
        </article>

        <article className="panel">
          <h2 className="headline-md">Risk Quotient</h2>
          <div className="stack-sm">
            {isLoading && <p className="muted">Loading risk profile...</p>}
            {!isLoading && !gauges.length && <p className="muted">No risk gauge data available.</p>}
            {gauges.map((gauge) => (
              <ThresholdGauge key={gauge.label} label={gauge.label} value={gauge.value} />
            ))}
          </div>
        </article>
      </div>

      <article className="panel">
        <h2 className="headline-md">Live Telemetry Stream</h2>
        <div className="telemetry-list">
          {isLoading && <p className="muted">Loading telemetry stream...</p>}
          {!isLoading && !telemetry.length && <p className="muted">No telemetry events found.</p>}
          {telemetry.map((item) => (
            <div key={item.nodeId} className="telemetry-row">
              <span>{item.nodeId}</span>
              <span>{item.pollutant}</span>
              <span>{item.deltaPercent > 0 ? `+${item.deltaPercent}%` : `${item.deltaPercent}%`}</span>
              <span>{item.riskQuotient}% RQ</span>
            </div>
          ))}
        </div>
      </article>

      <article className="panel">
        <h2 className="headline-md">Active Breach Incidents</h2>
        <div className="telemetry-list">
          {isLoading && <p className="muted">Evaluating breach incidents...</p>}
          {!isLoading && !incidents.length && (
            <p className="muted">No incidents exceed the breach threshold.</p>
          )}
          {incidents.map((incident) => (
            <div key={incident.incidentId} className="telemetry-row">
              <span>{incident.incidentId}</span>
              <span>{incident.pollutant}</span>
              <span>{incident.severity.toUpperCase()}</span>
              <span className="incident-actions">
                <span>{incident.status.toUpperCase()}</span>
                <button
                  type="button"
                  className="incident-action-btn"
                  onClick={() => onAdvanceIncident(incident.incidentId)}
                  disabled={incident.status === "resolved"}
                >
                  {incident.status === "resolved" ? "Resolved" : "Advance"}
                </button>
              </span>
            </div>
          ))}
        </div>
      </article>

      <article className="panel">
        <h2 className="headline-md">Stakeholder Alert Queue</h2>
        <div className="telemetry-list">
          {isLoading && <p className="muted">Loading stakeholder alerts...</p>}
          {!isLoading && !alerts.length && (
            <p className="muted">No alerts queued.</p>
          )}
          {alerts.map((alert) => (
            <div key={alert.alertId} className="telemetry-row">
              <span>{alert.alertId}</span>
              <span>{alert.trigger}</span>
              <span>{alert.status.toUpperCase()}</span>
              <span className="incident-actions">
                <span>{alert.channel.toUpperCase()}</span>
                <button
                  type="button"
                  className="incident-action-btn"
                  onClick={() => onDispatchAlert(alert.alertId)}
                  disabled={alert.status === "sent"}
                >
                  {alert.status === "sent" ? "Sent" : "Dispatch"}
                </button>
              </span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
