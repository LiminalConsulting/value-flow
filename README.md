# ValueFlow

A manufacturing group's value flows as one interactive hyperobject, built
with [DreamTalk](https://github.com/ProjectLiminality/DreamTalk): the Earth
turns to the group's region, the holding and its sites rise, every site
reports home, the arcs lift into one circle that is the group, the grain
splits it into conversion and extrusion, and raw, semi-finished and finished
material flow between the sites and their partners — then the value chain
tilts into its stage stack. Click a site to open its systems; Esc returns.

Live demo (anonymized): https://liminalconsulting.github.io/value-flow/

## Setup

ValueFlow is a DreamTalk holon: it lives in the engine's `holons/` folder.

```sh
git clone https://github.com/ProjectLiminality/DreamTalk.git
cd DreamTalk
git clone https://github.com/LiminalConsulting/value-flow.git holons/ValueFlow
cd core && bun install
bun run studio
```

Open http://localhost:4174/demo/?scene=valueflow (free play:
`&play=free`; `,` or the ⚙ button opens the settings).

After editing the source, `bun run build:demo` (the studio rebuilds on its
own while it runs) and reload.

## Data

- `data.anon.ts` — the anonymized data. The song plays on it whenever
  `data.ts` is absent.
- `data.ts` — your real data. **Gitignored**: it never leaves the machine
  it is on. Start it with `cp data.anon.ts data.ts`, then edit. With it
  present, the song plays on it.
- `anonymize.ts` — `bun anonymize.ts` regenerates `data.anon.ts` from
  `data.ts` (names and codes replaced, places coarsened to 2° cells; it
  refuses to write if any name survives).

Before committing, `git status` should never list `data.ts`.

## Files

- `ValueFlow.ts` — the song and the hyperobject (axes, presets, slots).
- `levels.ts` — the inner levels opened with Enter (a site's systems, the
  group's data systems).

## Publish a standalone build

```sh
cd DreamTalk/core
bun scripts/build-standalone.ts --scene valueflow --data=anon --out ../../value-flow-site
```

`--data=anon` always builds from `data.anon.ts`, whatever `data.ts` holds.
The output is a static folder (index.html, app.js, fonts, wasm) for any
static host; this repository's `gh-pages` branch serves the live demo.
