import { VigilanceBadge } from "@/components/vigilance-badge";

const incidents = [
  "Case AQ-2024-X9: Industrial Effluent Case Study",
  "Case AQ-2024-R3: Repeat Threshold Breach in Sector Gamma",
  "Case AQ-2024-P1: Citizen Validator Integrity Alert",
];

export default function NgoReportingPage() {
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

      <div className="grid-2">
        <article className="panel">
          <h2 className="headline-md">Open Investigations</h2>
          <div className="stack-sm">
            {incidents.map((incident) => (
              <div key={incident} className="incident-row">
                {incident}
              </div>
            ))}
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
        </article>
      </div>
    </section>
  );
}
