import {
  type BreachIncident,
  type IncidentStatus,
  getBreachIncidents,
} from "@/lib/incidents";
import { readJsonFile, writeJsonFile } from "@/lib/persistence";

const statusOrder: IncidentStatus[] = ["open", "under-review", "resolved"];
const INCIDENTS_FILE = "incidents.json";
let incidentStoreCache: BreachIncident[] | null = null;

function ensureStore(): BreachIncident[] {
  if (incidentStoreCache) {
    return incidentStoreCache;
  }

  const seed = getBreachIncidents();
  const persisted = readJsonFile<BreachIncident[]>(INCIDENTS_FILE, seed);

  if (!persisted.length && seed.length) {
    writeJsonFile(INCIDENTS_FILE, seed);
    incidentStoreCache = seed;
    return incidentStoreCache;
  }

  incidentStoreCache = persisted;
  return incidentStoreCache;
}

function persistStore(store: BreachIncident[]): void {
  incidentStoreCache = store;
  writeJsonFile(INCIDENTS_FILE, store);
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
  persistStore(store);
  return incident;
}
