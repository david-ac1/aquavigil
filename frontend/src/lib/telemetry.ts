export type TelemetryReading = {
  nodeId: string;
  sector: string;
  pollutant: string;
  concentrationMgL: number;
  whoLimitMgL: number;
  observedAt: string;
  latitude: number;
  longitude: number;
  role: "upstream" | "downstream";
};

export type DeepDivePoint = {
  hour: string;
  concentrationMgL: number;
};

export type NodeDeepDive = {
  nodeId: string;
  sector: string;
  pollutant: string;
  trend: DeepDivePoint[];
  attributionConfidence: number;
};

const readings: TelemetryReading[] = [
  {
    nodeId: "NODE_04",
    sector: "Sector 09-Beta",
    pollutant: "Ciprofloxacin",
    concentrationMgL: 1.5,
    whoLimitMgL: 0.6,
    observedAt: "2026-04-24T10:30:00Z",
    latitude: -6.9147,
    longitude: 107.6098,
    role: "downstream",
  },
  {
    nodeId: "NODE_01",
    sector: "Sector 09-Beta",
    pollutant: "Ciprofloxacin",
    concentrationMgL: 0.6,
    whoLimitMgL: 0.6,
    observedAt: "2026-04-24T10:30:00Z",
    latitude: -6.9081,
    longitude: 107.6011,
    role: "upstream",
  },
  {
    nodeId: "SECTOR_G",
    sector: "Sector 04-Delta",
    pollutant: "Mercury",
    concentrationMgL: 0.19,
    whoLimitMgL: 0.11,
    observedAt: "2026-04-24T10:28:00Z",
    latitude: -6.9002,
    longitude: 107.635,
    role: "downstream",
  },
  {
    nodeId: "NODE_03",
    sector: "Sector 04-Delta",
    pollutant: "Mercury",
    concentrationMgL: 0.11,
    whoLimitMgL: 0.11,
    observedAt: "2026-04-24T10:28:00Z",
    latitude: -6.8952,
    longitude: 107.6244,
    role: "upstream",
  },
  {
    nodeId: "NODE_11",
    sector: "Sector 13-Alpha",
    pollutant: "Nitrates",
    concentrationMgL: 9.2,
    whoLimitMgL: 7,
    observedAt: "2026-04-24T10:27:00Z",
    latitude: -6.921,
    longitude: 107.617,
    role: "downstream",
  },
  {
    nodeId: "NODE_09",
    sector: "Sector 13-Alpha",
    pollutant: "Nitrates",
    concentrationMgL: 7,
    whoLimitMgL: 7,
    observedAt: "2026-04-24T10:27:00Z",
    latitude: -6.93,
    longitude: 107.61,
    role: "upstream",
  },
];

const deepDives: Record<string, NodeDeepDive> = {
  NODE_04: {
    nodeId: "NODE_04",
    sector: "Sector 09-Beta",
    pollutant: "Ciprofloxacin",
    attributionConfidence: 89,
    trend: [
      { hour: "00:00", concentrationMgL: 0.62 },
      { hour: "04:00", concentrationMgL: 0.67 },
      { hour: "08:00", concentrationMgL: 0.7 },
      { hour: "12:00", concentrationMgL: 0.96 },
      { hour: "16:00", concentrationMgL: 1.12 },
      { hour: "20:00", concentrationMgL: 1.5 },
    ],
  },
  SECTOR_G: {
    nodeId: "SECTOR_G",
    sector: "Sector 04-Delta",
    pollutant: "Mercury",
    attributionConfidence: 81,
    trend: [
      { hour: "00:00", concentrationMgL: 0.11 },
      { hour: "04:00", concentrationMgL: 0.12 },
      { hour: "08:00", concentrationMgL: 0.12 },
      { hour: "12:00", concentrationMgL: 0.14 },
      { hour: "16:00", concentrationMgL: 0.16 },
      { hour: "20:00", concentrationMgL: 0.19 },
    ],
  },
};

export type DeltaTelemetry = {
  nodeId: string;
  sector: string;
  pollutant: string;
  deltaPercent: number;
  riskQuotient: number;
  observedAt: string;
};

function toRiskQuotient(concentrationMgL: number, whoLimitMgL: number): number {
  return Math.round((concentrationMgL / whoLimitMgL) * 100);
}

export function getDeltaTelemetry(): DeltaTelemetry[] {
  const downstream = readings.filter((item) => item.role === "downstream");

  return downstream
    .map((downstreamItem) => {
      const upstreamItem = readings.find(
        (candidate) =>
          candidate.role === "upstream" &&
          candidate.sector === downstreamItem.sector &&
          candidate.pollutant === downstreamItem.pollutant,
      );

      if (!upstreamItem) {
        return null;
      }

      const deltaPercent = Math.round(
        ((downstreamItem.concentrationMgL - upstreamItem.concentrationMgL) /
          upstreamItem.concentrationMgL) *
          100,
      );

      return {
        nodeId: downstreamItem.nodeId,
        sector: downstreamItem.sector,
        pollutant: downstreamItem.pollutant,
        deltaPercent,
        riskQuotient: toRiskQuotient(
          downstreamItem.concentrationMgL,
          downstreamItem.whoLimitMgL,
        ),
        observedAt: downstreamItem.observedAt,
      };
    })
    .filter((item): item is DeltaTelemetry => Boolean(item))
    .sort((a, b) => b.riskQuotient - a.riskQuotient);
}

export function getRiskGaugeData(): Array<{ label: string; value: number }> {
  return getDeltaTelemetry().map((item) => ({
    label: item.sector,
    value: Math.min(item.riskQuotient, 100),
  }));
}

export function getPrimaryDeepDive(nodeId?: string): NodeDeepDive {
  if (nodeId && deepDives[nodeId]) {
    return deepDives[nodeId];
  }

  const highestRisk = getDeltaTelemetry()[0];
  if (highestRisk && deepDives[highestRisk.nodeId]) {
    return deepDives[highestRisk.nodeId];
  }

  return deepDives.NODE_04;
}
