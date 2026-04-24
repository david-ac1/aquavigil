---
name: Obsidian Stream
colors:
  surface: '#0f141a'
  surface-dim: '#0f141a'
  surface-bright: '#353941'
  surface-container-lowest: '#090f15'
  surface-container-low: '#171c23'
  surface-container: '#1b2027'
  surface-container-high: '#252a32'
  surface-container-highest: '#30353d'
  on-surface: '#dee2ec'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#dee2ec'
  inverse-on-surface: '#2c3138'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#c4c6cf'
  on-secondary: '#2e3037'
  secondary-container: '#464950'
  on-secondary-container: '#b6b8c1'
  tertiary: '#ffe7e2'
  on-tertiary: '#621100'
  tertiary-container: '#ffc2b3'
  on-tertiary-container: '#aa2600'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#e1e2eb'
  secondary-fixed-dim: '#c4c6cf'
  on-secondary-fixed: '#191c22'
  on-secondary-fixed-variant: '#44474e'
  tertiary-fixed: '#ffdad2'
  tertiary-fixed-dim: '#ffb4a2'
  on-tertiary-fixed: '#3c0700'
  on-tertiary-fixed-variant: '#8a1d00'
  background: '#0f141a'
  on-background: '#dee2ec'
  surface-variant: '#30353d'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  mono-data:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 20px
  margin: 32px
---

## Brand & Style

This design system establishes a high-stakes, investigative environment. The brand personality is uncompromising, clinical, and authoritative—evoking the feeling of a tactical command center. The target audience includes environmental analysts, legal investigators, and whistleblowers who require precision and clarity to hold entities accountable.

The design style is a fusion of **Minimalism** and **High-Contrast Tech**. It utilizes a "Vigilante Tech" aesthetic: ultra-dark backgrounds that recede to make data-heavy "neon" elements pop with urgency. Interface elements are sleek and utilitarian, avoiding decorative flourishes in favor of functional density and mathematical precision.

## Colors

The palette is anchored in a "Void" state to minimize eye strain during long-term data monitoring. 

- **Primary (Neon Cyan):** Reserved for interactive states, active data streams, and critical "tactical" information. It represents the AI's "sight."
- **Background (Deep Charcoal):** Used for the primary canvas to provide maximum contrast for cyan and red accents.
- **Alerts (Vivid Red):** Strictly reserved for environmental violations, critical sensor failures, and "Accountability Triggers."
- **Neutral (Slate Gray):** Used for structural borders and secondary text to maintain a hierarchy that doesn't distract from core data.
- **Surface Tiers:** Use #14181F for containers and #1C212B for hover states or elevated panels.

## Typography

This design system uses **Inter** for its neutral, highly legible, and systematic qualities. The type scale is optimized for high information density.

- **Headlines:** Set with tighter letter-spacing for a compact, authoritative feel.
- **Labels:** Use "label-caps" for metadata and category headers to differentiate from narrative content.
- **Data Display:** While Inter is the primary typeface, a secondary monospace font should be used for coordinates, timestamps, and raw sensor output to reinforce the "investigative" aesthetic.
- **Contrast:** Ensure body text never falls below a medium-gray to maintain legibility against the deep charcoal background.

## Layout & Spacing

The layout philosophy follows a **strict 12-column fluid grid** that prioritizes dashboard-style information density. 

- **Grid:** Use 20px gutters to separate complex data visualizations.
- **Rhythm:** An 8pt spatial system governs all padding and margins. 
- **Density:** Use "Compact" spacing for data tables and "Spacious" spacing for investigative reports. 
- **Sidebar:** A fixed left-hand navigation rail (64px collapsed, 240px expanded) provides constant access to investigative tools.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** and **Subtle Glows** rather than traditional shadows.

- **Surfaces:** Use slightly lighter shades of charcoal to indicate elevation. The "closer" an object is to the user, the lighter the gray background (e.g., a modal is #1C212B, the background is #0B0E14).
- **Primary Borders:** Use thin (1px) borders in #1A1F26 for containers.
- **The "Vigil" Glow:** Critical active elements (like the primary action button or a live alert) should utilize a subtle 4px blur of the primary Cyan or Alert Red to simulate a glowing terminal screen.
- **Backdrop Blurs:** Use a 12px blur on overlay backgrounds to maintain context while focusing on investigative modals.

## Shapes

The shape language is **Soft (0.25rem)**, leaning toward sharp edges to maintain a technical, "engineered" look.

- **Buttons & Inputs:** Use the standard 4px radius for a precise, military-grade feel.
- **Status Indicators:** Small dots and indicators should remain perfectly square or circular depending on their function (Square for "System," Circle for "User/Live").
- **Cards:** Container corners should remain consistent at 4px. Avoid large radii, as they appear too consumer-friendly and soft for an investigative platform.

## Components

- **Buttons:** 
    - *Primary:* Solid Neon Cyan background with #0B0E14 text. High-contrast, no gradient.
    - *Secondary:* Ghost style with 1px Neon Cyan border and Cyan text.
- **Input Fields:** Deep background (#0B0E14) with a 1px Slate border. On focus, the border transitions to Neon Cyan with a subtle outer glow.
- **Data Chips:** Small, rectangular containers with "label-caps" typography. Used for tagging pollutants (e.g., "LEAD," "MERCURY").
- **Accountability Cards:** High-contrast containers housing evidence. They should feature a "Evidence ID" mono-font tag in the top right.
- **Status Pips:** Pulsing animations for live data streams. Cyan for "Monitoring," Red for "Violation Detected."
- **The "Scrub Bar":** A specialized component for temporal data analysis, allowing users to move through environmental history with frame-by-frame precision.
- **Telemetry Lists:** High-density rows with alternating subtle background tints to help the eye track across long sets of data.