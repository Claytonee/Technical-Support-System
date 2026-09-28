# Showcase visual system

The README uses diagrams as engineering evidence, not decoration.

## Generate

From the repository root:

```bash
node scripts/generate-showcase-visuals.mjs
```

The script writes:

- `assets/support-journey.svg` — the end-to-end support sequence;
- `assets/capability-map.svg` — user action and system outcome for four core capabilities;
- `assets/system-architecture-v2.svg` — runtime boundaries and optional adapters.

The generator has no package dependencies. Text, dimensions, colors and content remain reviewable in Git and can be regenerated consistently.

## Visual rules

- Every diagram must answer a concrete engineering question.
- The diagram and surrounding prose must agree.
- Text remains readable when the README is shown at laptop width.
- Alternative text states the relationship shown, not “image” or “diagram”.
- Color reinforces grouping but is never the only carrier of meaning.
- Decorative animation is excluded.

## Motion rule

GitHub does not execute inline script in README SVGs and does not reliably play SVG animation. If a future concept genuinely needs time—for example, offline queue → reconnect → replay—export it to a short GIF and keep the static SVG as the editable, accessible fallback.

Recommended production pattern:

1. keep the source as deterministic SVG or HTML;
2. capture only the state-changing layers;
3. use 6–8 fps for a calm technical sequence;
4. loop after a readable pause;
5. link the GIF to the static high-resolution source;
6. keep the README understandable when motion is disabled.
