# AquaVigil Frontend Implementation Plan

## Objective
Build the Next.js frontend by treating the `aquavigil-screens` designs as the source of truth and `prd.md` as functional guidance.

## Current Setup (Completed)
- Next.js (App Router) scaffold created in `frontend/`
- Shared shell with top bar + side navigation
- Routes created for all provided screens:
  - `/sentinel-map`
  - `/sensor-deep-dive`
  - `/ngo-reporting`
  - `/transparency-feed`
- Global Obsidian Stream tokens and base component styles in `src/app/globals.css`
- Reusable PRD-aligned components:
  - `VigilanceBadge`
  - `ThresholdGauge`

## Implementation Phases

### Phase 1: Screen Fidelity Pass
- Port each HTML screen from `aquavigil-screens/*/code.html` into React components
- Match spacing, typography, and layer/elevation exactly
- Keep visual parity for desktop and mobile breakpoints

### Phase 2: Functional Wiring (P0 First)
- P0: Delta-X map interactions
- P0: ESG dossier generation flow UI
- P1: Attribution confidence and source matching panels
- P1: Alerting configuration interfaces (email/webhook)

### Phase 3: Data Integration
- Define API contracts for sensors/readings/incidents
- Add data fetch layer and loading/error states
- Add immutable proof references (ledger hash display blocks)

### Phase 4: Quality and Delivery
- Accessibility and responsive validation
- E2E path for red-alert-to-report journey
- Demo script alignment with hackathon day-10 narrative

## Suggested Next Development Slice
1. Implement full visual parity for `sentinel_map_main_dashboard` first.
2. Move repeated shell sections into reusable `TopAppBar` and `SideNavBar` components.
3. Introduce typed screen DTOs for telemetry rows and alert cards.
