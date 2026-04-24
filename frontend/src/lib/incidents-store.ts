import {
  type BreachIncident,
  type IncidentStatus,
  getBreachIncidents,
} from "@/lib/incidents";

const statusOrder: IncidentStatus[] = ["open", "under-review", "resolved"];
let incidentStore: BreachIncident[] | null = null;

function ensureStore(): BreachIncident[] {
  if (!incidentStore) {
    incidentStore = getBreachIncidents();
  }

  return incidentStore;
}

export function listIncidents(options?: { thresholdRiskQuotient?: number }): BreachIncident[] {
  const threshold = options?.thresholdRiskQuotient ?? 0;

  return ensureStore()
    .filter((incident) => incident.riskQuotient >= threshold)
    .sort((a, b) => b.riskQuotient - a.riskQuotient);
}

export function getIncidentById(incidentId: string): BreachIncident | undefined {
  return ensureStore().find((incident) => incident.incidentId === incidentId);
}

export function transitionIncidentStatus(
  incidentId: string,
  targetStatus?: IncidentStatus,
): BreachIncident | null {
  const store = ensureStore();
  const incident = store.find((item) => item.incidentId === incidentId);

  if (!incident) {
    return null;
  }

  const currentIndex = statusOrder.indexOf(incident.status);
  const desiredStatus = targetStatus ?? statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)];
  const desiredIndex = statusOrder.indexOf(desiredStatus);

  if (desiredIndex < currentIndex || desiredIndex > currentIndex + 1) {
    throw new Error("Invalid incident transition.");
  }

  incident.status = desiredStatus;
  return incident;
}
