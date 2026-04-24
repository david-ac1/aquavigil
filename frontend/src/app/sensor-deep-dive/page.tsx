"use client";

import { useEffect, useMemo, useState } from "react";
import { ThresholdGauge } from "@/components/threshold-gauge";
import type { DeltaTelemetry, NodeDeepDive } from "@/lib/telemetry";
import { fetchDeltaTelemetry, fetchPrimaryDeepDive } from "@/lib/telemetry-client";

export default function SensorDeepDivePage() {
  const [deepDive, setDeepDive] = useState<NodeDeepDive | null>(null);
  const [deltaTelemetry, setDeltaTelemetry] = useState<DeltaTelemetry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDeepDive() {
      try {
        setIsLoading(true);
        const [dive, delta] = await Promise.all([
          fetchPrimaryDeepDive(),
          fetchDeltaTelemetry(),
        ]);

        if (!isMounted) {
          return;
        }

        setDeepDive(dive);
        setDeltaTelemetry(delta);
        setError(null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load deep-dive analytics.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDeepDive();

    return () => {
      isMounted = false;
    };
  }, []);

  const maxTrendValue = useMemo(() => {
    if (!deepDive?.trend.length) {
      return 1;
    }

    return Math.max(...deepDive.trend.map((point) => point.concentrationMgL));
  }, [deepDive]);

  const currentDelta = useMemo(() => {
    if (!deepDive) {
      return undefined;
    }

    return deltaTelemetry.find((item) => item.nodeId === deepDive.nodeId);
  }, [deepDive, deltaTelemetry]);

  return (
    <section className="stack-lg">
      <div className="panel panel--hero">
        <div>
          <p className="kicker">Forensic Telemetry</p>
          <h1 className="headline-lg">Sensor Deep-Dive Analytics</h1>
          <p className="muted">
            High-density concentration traces, breach timeline, and attribution confidence
            for {deepDive?.nodeId ?? "active node"} in {deepDive?.sector ?? "current sector"}.
          </p>
        </div>
      </div>

      {error && <div className="panel panel--error">{error}</div>}

      <div className="grid-2">
        <article className="panel">
          <h2 className="headline-md">7-Day Concentration Trend</h2>
          <div className="chart-mock chart-mock--bars">
            {isLoading && <p className="muted">Loading trend data...</p>}
            {!isLoading && !deepDive?.trend.length && <p className="muted">No trend points available.</p>}
            {deepDive?.trend.map((point) => {
              const height = Math.max(16, Math.round((point.concentrationMgL / maxTrendValue) * 100));
              return (
                <div key={point.hour} className="trend-bar-wrap">
                  <div className="trend-bar" style={{ height: `${height}%` }} />
                  <span>{point.hour}</span>
                </div>
              );
            })}
          </div>
        </article>
        <article className="panel">
          <h2 className="headline-md">Breach Snapshot</h2>
          <div className="stack-sm">
            <ThresholdGauge label={deepDive?.pollutant ?? "Pollutant"} value={Math.min((currentDelta?.riskQuotient ?? 100), 100)} />
            <ThresholdGauge label="Attribution Confidence" value={deepDive?.attributionConfidence ?? 0} />
            <ThresholdGauge label="WHO Threshold Delta" value={Math.min(Math.max(currentDelta?.deltaPercent ?? 0, 0), 100)} />
          </div>
        </article>
      </div>

      <article className="panel">
        <h2 className="headline-md">Incident Timeline</h2>
        <div className="telemetry-list">
          {isLoading && <p className="muted">Loading incident timeline...</p>}
          {!isLoading && !deepDive?.trend.length && <p className="muted">No incident timeline entries available.</p>}
          {deepDive?.trend.map((point) => (
            <div className="telemetry-row" key={point.hour}>
              <span>{deepDive.nodeId}</span>
              <span>{deepDive.pollutant}</span>
              <span>{point.hour} UTC</span>
              <span>{point.concentrationMgL.toFixed(2)} mg/L</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
