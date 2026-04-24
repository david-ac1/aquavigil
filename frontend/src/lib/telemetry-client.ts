import type { DeltaTelemetry, NodeDeepDive, RiskGaugeData } from "@/lib/telemetry";
import type { BreachIncident } from "@/lib/incidents";

type DataEnvelope<T> = {
  data: T;
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Telemetry request failed: ${response.status}`);
  }

  const payload = (await response.json()) as DataEnvelope<T>;
  return payload.data;
}

export async function fetchDeltaTelemetry(): Promise<DeltaTelemetry[]> {
  return fetchJson<DeltaTelemetry[]>("/api/telemetry/delta");
}

export async function fetchRiskGauges(): Promise<RiskGaugeData[]> {
  return fetchJson<RiskGaugeData[]>("/api/telemetry/risk-gauges");
}

export async function fetchPrimaryDeepDive(nodeId?: string): Promise<NodeDeepDive> {
  const query = nodeId ? `?nodeId=${encodeURIComponent(nodeId)}` : "";
  return fetchJson<NodeDeepDive>(`/api/telemetry/deep-dive${query}`);
}

export async function fetchBreachIncidents(
  thresholdRiskQuotient = 100,
): Promise<BreachIncident[]> {
  return fetchJson<BreachIncident[]>(
    `/api/incidents/breach?threshold=${thresholdRiskQuotient}`,
  );
}
