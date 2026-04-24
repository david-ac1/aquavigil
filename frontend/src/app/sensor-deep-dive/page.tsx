import { ThresholdGauge } from "@/components/threshold-gauge";

export default function SensorDeepDivePage() {
  return (
    <section className="stack-lg">
      <div className="panel panel--hero">
        <div>
          <p className="kicker">Forensic Telemetry</p>
          <h1 className="headline-lg">Sensor Deep-Dive Analytics</h1>
          <p className="muted">
            High-density concentration traces, breach timeline, and attribution
            confidence for a selected node.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <article className="panel">
          <h2 className="headline-md">7-Day Concentration Trend</h2>
          <div className="chart-mock" />
        </article>
        <article className="panel">
          <h2 className="headline-md">Breach Snapshot</h2>
          <div className="stack-sm">
            <ThresholdGauge label="Ciprofloxacin" value={96} />
            <ThresholdGauge label="Erythromycin" value={78} />
            <ThresholdGauge label="WHO Threshold Delta" value={88} />
          </div>
        </article>
      </div>
    </section>
  );
}
