# AquaVigil Frontend

Next.js App Router implementation for the AquaVigil command dashboard.

For full repository documentation, run instructions from root, and API details, see the root README.

## Run From frontend/

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build and run production mode:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## Main Routes

- `/` dashboard
- `/sentinel-map`
- `/sensor-deep-dive`
- `/ngo-reporting`
- `/transparency-feed`

## Data and Persistence

- Local data folder: `frontend/data/`
- Files used: `incidents.json`, `alerts.json`, `dossiers.json`
- Source telemetry seed: `src/lib/telemetry.ts`

## Optional Environment Variable

- `ALERT_WEBHOOK_URL`
	- When configured, alert dispatch posts payloads to this endpoint.
	- When missing, dispatch is simulated.
