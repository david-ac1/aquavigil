import { ThresholdGauge } from "@/components/threshold-gauge";
import { VigilanceBadge } from "@/components/vigilance-badge";
import { getDeltaTelemetry, getRiskGaugeData } from "@/lib/telemetry";

export default function SentinelMapPage() {
  const telemetry = getDeltaTelemetry();
  const gauges = getRiskGaugeData();

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
        <VigilanceBadge score={89} />
      </div>

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
            {gauges.map((gauge) => (
              <ThresholdGauge key={gauge.label} label={gauge.label} value={gauge.value} />
            ))}
          </div>
        </article>
      </div>

      <article className="panel">
        <h2 className="headline-md">Live Telemetry Stream</h2>
        <div className="telemetry-list">
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
    </section>
  );
}
