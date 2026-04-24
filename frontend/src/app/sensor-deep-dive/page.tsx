import { ThresholdGauge } from "@/components/threshold-gauge";
import { getDeltaTelemetry, getPrimaryDeepDive } from "@/lib/telemetry";

export default function SensorDeepDivePage() {
  const deepDive = getPrimaryDeepDive();
  const maxTrendValue = Math.max(...deepDive.trend.map((point) => point.concentrationMgL));
  const currentDelta = getDeltaTelemetry().find((item) => item.nodeId === deepDive.nodeId);

  return (
    <section className="stack-lg">
      <div className="panel panel--hero">
        <div>
          <p className="kicker">Forensic Telemetry</p>
          <h1 className="headline-lg">Sensor Deep-Dive Analytics</h1>
          <p className="muted">
            High-density concentration traces, breach timeline, and attribution confidence
            for {deepDive.nodeId} in {deepDive.sector}.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <article className="panel">
          <h2 className="headline-md">7-Day Concentration Trend</h2>
          <div className="chart-mock chart-mock--bars">
            {deepDive.trend.map((point) => {
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
            <ThresholdGauge label={deepDive.pollutant} value={Math.min((currentDelta?.riskQuotient ?? 100), 100)} />
            <ThresholdGauge label="Attribution Confidence" value={deepDive.attributionConfidence} />
            <ThresholdGauge label="WHO Threshold Delta" value={Math.min(Math.max(currentDelta?.deltaPercent ?? 0, 0), 100)} />
          </div>
        </article>
      </div>

      <article className="panel">
        <h2 className="headline-md">Incident Timeline</h2>
        <div className="telemetry-list">
          {deepDive.trend.map((point) => (
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
