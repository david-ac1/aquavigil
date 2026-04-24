import { ThresholdGauge } from "@/components/threshold-gauge";
import { VigilanceBadge } from "@/components/vigilance-badge";

const telemetry = [
  { node: "NODE_04", chemical: "Ciprofloxacin", delta: "+150%", risk: 94 },
  { node: "SECTOR_G", chemical: "Mercury", delta: "+73%", risk: 81 },
  { node: "NODE_11", chemical: "Nitrates", delta: "+31%", risk: 64 },
];

export default function SentinelMapPage() {
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
            <ThresholdGauge label="Sector 09-Beta" value={92} />
            <ThresholdGauge label="Sector 04-Delta" value={71} />
            <ThresholdGauge label="Sector 13-Alpha" value={48} />
          </div>
        </article>
      </div>

      <article className="panel">
        <h2 className="headline-md">Live Telemetry Stream</h2>
        <div className="telemetry-list">
          {telemetry.map((item) => (
            <div key={item.node} className="telemetry-row">
              <span>{item.node}</span>
              <span>{item.chemical}</span>
              <span>{item.delta}</span>
              <span>{item.risk}% RQ</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
