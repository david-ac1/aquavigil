import type { BreachIncident } from "@/lib/incidents";
import { readJsonFile, writeJsonFile } from "@/lib/persistence";

export type AlertChannel = "webhook" | "email";
export type AlertStatus = "queued" | "sent" | "failed";
export type AlertTrigger =
  | "incident-created"
  | "incident-escalated"
  | "incident-status-updated";

export type StakeholderAlert = {
  alertId: string;
  incidentId: string;
  channel: AlertChannel;
  trigger: AlertTrigger;
  status: AlertStatus;
  createdAt: string;
  dispatchedAt?: string;
  destination: string;
  payload: {
    incidentId: string;
    sector: string;
    pollutant: string;
    riskQuotient: number;
    status: string;
    severity: string;
    evidenceHash: string;
    trigger: AlertTrigger;
  };
  deliveryNotes?: string;
};

const ALERTS_FILE = "alerts.json";

function loadAlerts(): StakeholderAlert[] {
  return readJsonFile<StakeholderAlert[]>(ALERTS_FILE, []);
}

function saveAlerts(alerts: StakeholderAlert[]): void {
  writeJsonFile(ALERTS_FILE, alerts);
}

function buildAlertId(incidentId: string, trigger: AlertTrigger, createdAt: string): string {
  return `ALT-${incidentId}-${trigger}-${createdAt.slice(11, 16).replace(":", "")}`;
}

function shouldDedupe(
  alerts: StakeholderAlert[],
  incidentId: string,
  trigger: AlertTrigger,
): boolean {
  return alerts.some(
    (alert) =>
      alert.incidentId === incidentId &&
      alert.trigger === trigger &&
      (alert.status === "queued" || alert.status === "sent"),
  );
}

export function listAlerts(): StakeholderAlert[] {
  return loadAlerts().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function queueIncidentAlert(
  incident: BreachIncident,
  trigger: AlertTrigger,
): StakeholderAlert | null {
  const alerts = loadAlerts();

  if (shouldDedupe(alerts, incident.incidentId, trigger)) {
    return null;
  }

  const createdAt = new Date().toISOString();
  const destination = process.env.ALERT_WEBHOOK_URL ?? "simulated://epa-esg-board";

  const alert: StakeholderAlert = {
    alertId: buildAlertId(incident.incidentId, trigger, createdAt),
    incidentId: incident.incidentId,
    channel: process.env.ALERT_WEBHOOK_URL ? "webhook" : "email",
    trigger,
    status: "queued",
    createdAt,
    destination,
    payload: {
      incidentId: incident.incidentId,
      sector: incident.sector,
      pollutant: incident.pollutant,
      riskQuotient: incident.riskQuotient,
      status: incident.status,
      severity: incident.severity,
      evidenceHash: incident.evidenceHash,
      trigger,
    },
  };

  alerts.unshift(alert);
  saveAlerts(alerts);
  return alert;
}

export function seedAlertsForIncidents(incidents: BreachIncident[]): void {
  incidents.forEach((incident) => {
    if (incident.status === "open") {
      queueIncidentAlert(incident, "incident-created");
    }
  });
}

export async function dispatchAlert(alertId: string): Promise<StakeholderAlert | null> {
  const alerts = loadAlerts();
  const alert = alerts.find((item) => item.alertId === alertId);

  if (!alert) {
    return null;
  }

  if (alert.status === "sent") {
    return alert;
  }

  const webhookUrl = process.env.ALERT_WEBHOOK_URL;

  if (!webhookUrl) {
    alert.status = "sent";
    alert.dispatchedAt = new Date().toISOString();
    alert.deliveryNotes = "Simulated dispatch (no ALERT_WEBHOOK_URL configured).";
    saveAlerts(alerts);
    return alert;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(alert.payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook dispatch failed: ${response.status}`);
    }

    alert.status = "sent";
    alert.dispatchedAt = new Date().toISOString();
    alert.deliveryNotes = `Delivered to ${webhookUrl}`;
  } catch (error) {
    alert.status = "failed";
    alert.dispatchedAt = new Date().toISOString();
    alert.deliveryNotes = error instanceof Error ? error.message : "Unknown dispatch failure.";
  }

  saveAlerts(alerts);
  return alert;
}
