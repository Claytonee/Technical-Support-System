# Showcase visual system

The README uses compact technical plates to explain the product rather than repeating long feature prose.

## Generate and verify

```bash
node scripts/generate-showcase-visuals.mjs
node scripts/verify-showcase.mjs
```

The dependency-free generator writes:

- `assets/support-system-banner.svg` — the product promise and three core guarantees;
- `assets/fault-anatomy.svg` — intake, offline safety, routing, escalation and resolution;
- `assets/support-intelligence.svg` — the relationship between symptoms, approved knowledge, AI and the Resource Library;
- `assets/system-architecture.svg` — the runtime path and security boundary.

## Design language

- A deep-navy technical canvas keeps the set coherent.
- Cyan carries system flow, amber marks operational decisions and green marks resolved or approved outcomes.
- Geometry communicates function: rectangles are bounded system stages, a diamond is a delivery gate and a hexagon is shared knowledge.
- Small labels provide orientation; one large statement per node carries the meaning.
- Decorative stars and dot grids add depth without competing with the flow.
- Native SVG motion is limited to signal travel, gentle rotation and state pulses. The static frame still explains the complete concept.

## README rule

Each plate gets one short interpretation paragraph. Details belong in a table or the implementation repository, not in a second explanation of the same picture.
