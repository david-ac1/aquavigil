import { getDeltaTelemetry } from "@/lib/telemetry";

export type IncidentStatus = "open" | "under-review" | "resolved";
export type IncidentSeverity = "critical" | "high";

export type BreachIncident = {
  incidentId: string;
  nodeId: string;
  sector: string;
  pollutant: string;
  riskQuotient: number;
  deltaPercent: number;
  status: IncidentStatus;
  severity: IncidentSeverity;
  observedAt: string;
  evidenceHash: string;
};

function toShortHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash).toString(16).padStart(8, "0").slice(0, 8);
}

export function getBreachIncidents(thresholdRiskQuotient = 100): BreachIncident[] {
  return getDeltaTelemetry()
    .filter((item) => item.riskQuotient >= thresholdRiskQuotient)
    .map((item): BreachIncident => {
      const isCritical = item.riskQuotient >= 170;
      return {
        incidentId: `INC-${item.nodeId}-${item.observedAt.slice(11, 16).replace(":", "")}`,
        nodeId: item.nodeId,
        sector: item.sector,
        pollutant: item.pollutant,
        riskQuotient: item.riskQuotient,
        deltaPercent: item.deltaPercent,
        status: isCritical ? "open" : "under-review",
        severity: isCritical ? "critical" : "high",
        observedAt: item.observedAt,
        evidenceHash: `0x${toShortHash(`${item.nodeId}-${item.observedAt}-${item.riskQuotient}`)}`,
      };
    })
    .sort((a, b) => b.riskQuotient - a.riskQuotient);
}
