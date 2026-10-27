/**
 * ValueFlow.ts — A DreamSong: a manufacturing group's value flows as one hyperobject.
 *
 * The song, in order:
 *
 *   the black Earth with white land turns to Europe; the eye descends,
 *   the borders draw; the holding company rises and the plants
 *   after it — uncoloured: the grain is not yet asked for (then asked: the
 *   plants take their colours, and fold back). Every plant reports home (a
 *   great-circle arc to the holding). The eye pulls back, and the many arcs
 *   lift off the planet into ONE circle — complementary pieces of it, never
 *   stacked — which IS the group; each plant lifts off its spot as a ring
 *   and glides to its seat. The grain: the red and blue discs shrink in
 *   from the circle's own rim into the vesica, conversion and extrusion,
 *   the plants that do both in the overlap. The raw material flows in —
 *   ghosted, we have no data for it — and a lens lifts off that arrow: in
 *   its window the line is a road and the dots are trucks. Back to the
 *   abstract. The semi-finished and finished layers switch on (solid —
 *   "covered in our data"); every particle becomes what it carries
 *   (pallets in, film reels between, pouches out — types still guesses,
 *   ghosted); the map tilts into the value chain's stage stack (raw in
 *   contracts, finished out expands), and lies flat again.
 *
 * Built on the generic GeoFlow (core/vocabulary/GeoFlow) — the technique
 * this song proved, consolidated upward. What stays here is the data, the
 * song's timing, and its own abstract-world pieces: the lens on the raw
 * inflow and the closure marks.
 *
 * Mocked things are ghosted (core/src/certainty.ts): a plant whose city is
 * a stand-in, the raw-material layer and what the lens shows of it, the
 * material types. See the data module for what is which.
 *
 * Free play: `?scene=valueflow&play=free` — v globe/abstract, g grain,
 * e flat/staged, o lens (on the flat map, raw layer shown), the digits the
 * flow layers.
 */

import { Dream, render } from "../../core/src/index"
import type { DreamSlot } from "../../core/src/dream"
import type { DofPreset } from "../../core/src/dof"
import { together, type Anim } from "../../core/src/anim"
import { rgb } from "../../core/src/constants"
import { derive, scalar, type Param, type ParamValue } from "../../core/src/params"
import type { Holon } from "../../core/src/holon"
import { doubtShown, presence } from "../../core/src/certainty"
import { axis, rekey, toggle, type StateSpace } from "../../core/src/automaton"
import { Group, Null, Square } from "../../core/src/parts/primitives"
import { GeoFlow, GEOFLOW_WINDOWS } from "../../core/vocabulary/GeoFlow/GeoFlow"
import { RoleMap } from "../../core/vocabulary/RoleMap/RoleMap"
import { SOPLoop } from "../../core/vocabulary/SOPLoop/SOPLoop"
import { Horizons } from "../../core/vocabulary/Horizons/Horizons"
import { GroupSystemsDream, siteLevel } from "./levels"
import { FlowLens } from "../../core/vocabulary/Lens/Lens"
import { FLOWMAP, GROUP, PLANTS, ROLES, SHOWCASE } from "./data"

// === Kairos ===

const EUROPE = { lat: 50.5, lon: 11, span: 15 }
const MAP_R = 300
/** The grain-of-knowledge beat (pallets / reels / pouches). */
const GRAIN_BEAT = true
/** Seconds the view transition takes (the song's and free play's). */
const VIEW_DURATION = 6.6
/** The raw-material flow the lens sits on: a supplier into the blue lobe. */
const LENS_FLOW = FLOWMAP.flows.filter((f) => f.stage === "raw").findIndex((f) => f.from === SHOWCASE.lens.from && f.to === SHOWCASE.lens.to)

/**
 * The curated walk (Dream.preset, src/dof.ts): what a first viewer meets —
 * globe ↔ abstract (v), the grain (g), the flat value flows (their layers,
 * labels, roads), the stage stack (e), one site's fiber (z / a click,
 * Esc) and the uncertainty drawn (u; switched off, everything solid). Off, yet in the settings (`,`): the lens (o), the layer switch (b)
 * with the roles and the S&OP horizons, every level (Enter), the Earth's
 * own looks, the certainty / type / gap toggles, the trucks' loads, and
 * the slots that open those. The song follows it: an off beat is not sung.
 */
const PRESET: DofPreset = {
  "axis:*": false,
  "axis:view": true,
  "axis:grain": true,
  "axis:expand": true,
  "axis:labels": true,
  "axis:raw": true,
  "axis:semi": true,
  "axis:finished": true,
  "axis:raw.concrete": true,
  "axis:semi.concrete": true,
  "axis:finished.concrete": true,
  "axis:focus": true,
  "axis:uncertainty": true,
  "level:*": false,
  "slot:7": false,
  "slot:8": false,
  "slot:9": false,
}
/** Is a degree of freedom on in the preset (the song's own question)? */
const preset = (id: string): boolean => PRESET[id] ?? PRESET[`${id.slice(0, id.indexOf(":"))}:*`] ?? PRESET["*"] ?? true
/** The song's optional beats. */
const SING_LENS = preset("axis:lens")
const SING_LAYERS = preset("axis:layer")

const ss = (a: number, b: number, x: number): number => {
  const u = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return u * u * (3 - 2 * u)
}

/**
 * The lens, walkable only where it means something: on the flat map, with
 * the raw-material layer shown. When the song never draws it (off in the
 * preset), its own axis draws it on as it opens and off as it closes.
 */
class RawLens extends FlowLens {
  walkable: () => boolean = () => true
  drawsItself = false
  protected override openPositions(): { closed: Record<string, number>; open: Record<string, number> } {
    const p = super.openPositions()
    return this.drawsItself ? { closed: { ...p.closed, creation: 0 }, open: { ...p.open, creation: 1 } } : p
  }
  protected override openDuration(): number {
    return super.openDuration() + (this.drawsItself ? 1.6 : 0)
  }
  protected override openVia(opening: boolean): Anim {
    const via = super.openVia(opening)
    if (!this.drawsItself) return via
    return opening
      ? together([this.creation.to(1), 0, 0.2], [via, 0.22, 1])
      : together([via, 0, 0.78], [this.creation.to(0), 0.8, 1])
  }
  override stateSpace(): StateSpace {
    const s = super.stateSpace()
    return { ...s, axes: s.axes.map((a) => ({ ...a, when: () => this.walkable() })) }
  }
}


/** The machine's three lenses on one organisation (infrastructure · social structure · superstructure). */
const LAYERS = ["infrastructure", "social", "superstructure"] as const

/** Owns the layer axis: which structure of the organisation is in view. */
class Layers extends Null {
  static sovereign = true
  layer = scalar(0)
  /** The machine's gate for this axis (the abstract map must stand). */
  walkable: () => boolean = () => true
  override stateSpace(): StateSpace {
    return {
      axes: [
        axis("layer", this, Object.fromEntries(LAYERS.map((id, k) => [id, { layer: k }])), {
          key: "b",
          duration: 2.2,
          when: () => this.walkable(),
        }),
      ],
    }
  }
}

/**
 * Owns the uncertainty axis: every ghost, its blur and its wobble drawn, or
 * none (src/certainty.ts doubtShown) — the whole picture at once, whatever
 * declares the doubt. Switched off in the settings, nothing is ghosted.
 */
class Uncertainty extends Null {
  static sovereign = true
  override stateSpace(): StateSpace {
    return {
      axes: [toggle("uncertainty", doubtShown, { key: "u", off: ["hidden", 0], on: ["shown", 1], duration: 1.2, whenOff: "hidden" })],
    }
  }
}

/** A lens's presence: 1 at its own position on the layer axis, 0 one step away. */
class Lensed extends Group {
  presence = presence(1)
}

class SocialRoles extends RoleMap {
  gate: () => boolean = () => true
  override stateSpace(): StateSpace {
    return rekey(super.stateSpace(), { centralise: "j", sites: "w", risk: null, labels: null }, () => this.gate())
  }
}
class Cycle extends SOPLoop {
  gate: () => boolean = () => true
  override stateSpace(): StateSpace {
    return rekey(super.stateSpace(), { focus: "x", round: "n", labels: null }, () => this.gate())
  }
}
class Horizon extends Horizons {
  gate: () => boolean = () => true
  override stateSpace(): StateSpace {
    return rekey(super.stateSpace(), { reveal: "t", labels: null }, () => this.gate())
  }
}

export class ValueFlowDream extends Dream {
  /** The group where it is and as what it is — one `view` between. */
  geo = new GeoFlow({
    data: FLOWMAP,
    geo: {
      group: { lat: GROUP.lat, lon: GROUP.lon, certainty: GROUP.located },
      region: EUROPE,
      places: Object.fromEntries(PLANTS.map((p) => [p.code, { lat: p.lat, lon: p.lon, certainty: p.located }])),
    },
    seenBy: () => this.observer,
    openFov: (53.13 * Math.PI) / 180,
    ortho: true,
    stagger: 0.7,
    relateStagger: 0.5,
    landIn: 0,
    rise: 0,
    relate: 0,
    traffic: 0,
    mapOptions: { roads: true, particleMax: 0.09, spacing: 75 },
  })

  private get map() {
    return this.geo.map
  }

  /** The structure in view: infrastructure · social · superstructure (b). */
  layers = new Layers()
  /** The doubt drawn or not (u). */
  uncertainty = new Uncertainty()
  roles!: SocialRoles
  cycle!: Cycle

  /** The lens on the raw inflow — what it shows ghosts with the flow; the lens stays crisp. */
  lens!: RawLens

  /** Closed and closing plants, boxed (closing fainter), riding their seats, flat map only. */
  private closures(): Square[] {
    return PLANTS.flatMap((p) => {
      if (!p.status) return []
      const seat = this.geo.seat(p.code)
      return [
        new Square({
          size: derive(() => seat.ring.radius.value * 2.5),
          stroke: 1.6,
          tint: derive(() => seat.ring.tint.value),
          x: derive(() => seat.x.value),
          y: derive(() => seat.y.value),
          opacity: derive(
            () => (p.status === "closed" ? 0.9 : 0.45) * seat.ring.creation.value * seat.presence.value * (1 - ss(0, 0.3, this.map.expand.value)),
          ),
        }),
      ]
    })
  }

  // === Kronos ===

  /** The song's own clock while it is written (every beat goes through flowing). */
  private at = 0
  /** Named song moments, for the presenter slots. */
  private marks: Record<string, number> = {}
  private mark(name: string, offset = 0): void {
    this.marks[name] = this.at + offset
  }

  override preset(): DofPreset {
    return PRESET
  }

  /** The presenter's walk (⌥1–9): each a held moment of the song line, one inside a level (7–9 off in the preset). */
  override slots(): readonly DreamSlot[] {
    void this.roots
    const m = this.marks
    const unsung = (name: string) => m[name] === undefined
    return [
      { name: "the globe", t: m.globe! },
      { name: "the group", t: m.abstract! },
      { name: "conversion · extrusion", t: m.grain! },
      { name: "the value flows", t: m.flows! },
      { name: "the value chain, roads", t: m.roads! },
      { name: "one site's fiber", t: m.fiber! },
      { name: "inside the site", t: m.fiber!, nest: [siteLevel(SHOWCASE.inside)!.name] },
      ...(unsung("social") ? [] : [{ name: "the roles", t: m.social! }, { name: "S&OP horizons", t: m.sop! }]),
    ]
  }

  private flowing(dt: number, ...anims: Anim[]): void {
    this.at += dt
    this.play(together(this.geo.time.by(dt, { easing: "linear" }), ...anims), dt)
  }

  unfold() {
    const geo = this.geo
    void geo.parts
    const m = this.map
    const raw = m.stage("raw")
    const flow = raw.flows[LENS_FLOW]!

    // The lens: on the raw arrow just before it crosses into the group; its
    // near face rises to the upper left. The abstract world is parallel
    // (ortho) by the time it opens, so it magnifies by `zoom`.
    const at = (() => {
      const path = flow.path()
      return path[Math.floor(path.length * 0.3)]!
    })()
    const near = { x: Math.sign(at.x || -1) * MAP_R * 1.78, y: MAP_R * 0.72 }
    this.lens = (
      new RawLens(
        {
          path: () => flow.path(),
          particles: () => flow.particles(),
          frame: m.stack,
          certainty: () => raw.certainty.value * flow.certainty.value,
        },
        {
          observer: this.observer,
          x: at.x,
          y: at.y,
          radius: 52,
          zoom: 2.7,
          liftX: near.x - at.x,
          liftY: near.y - at.y,
          liftZ: 400,
          dotRadius: 6,
          creation: 0,
        },
      )
    )
    const lens = this.lens
    lens.drawsItself = !SING_LENS
    lens.walkable = () =>
      geo.view.value > 0.99 && m.expand.value < 0.5 && raw.shown.value > 0.5 && (lens.drawsItself || lens.creation.value > 0.5)
    // The flows' own instruments (the lens, the closure marks) belong to the infrastructure lens.
    const infra = new Lensed({ members: [lens, ...this.closures()], presence: derive(() => (geo.view.value >= GEOFLOW_WINDOWS.gone[1] ? 1 : 0) * Math.max(0, 1 - this.layers.layer.value)) })
    geo.inPlane(infra)

    // SLEEP: GeoFlow itself puts the abstracted Earth and the travelers out
    // of flight by presence (exactly 0), so the host lets them doze. The
    // finished relations morph is the one piece it still hides by opacity.
    const W = GEOFLOW_WINDOWS
    const relSleep = presence(1)
    relSleep.follow(derive(() => (geo.view.value > W.morph[0] && geo.view.value < W.morph[1] ? 1 : 0)))
    ;(geo.relations.params as Map<string, Param<ParamValue>>).set("sleep", relSleep)

    // --- ONE HYPEROBJECT: the lenses and the levels ---------------------
    // The layer axis (b): infrastructure (the flows) · social structure
    // (the roles) · superstructure (the S&OP rhythms). The map gives way
    // wholly (presence exactly 0: it sleeps) — the roles' own rings are the group there.
    const layers = this.layers
    const L = layers.layer
    const atLayer = (k: number) => derive(() => Math.max(0, 1 - Math.abs(L.value - k)))
    const abstract = () => geo.view.value > 0.99
    layers.walkable = () => abstract() && m.expand.value < 0.5
    m.presence.follow(derive(() => (geo.view.value >= GEOFLOW_WINDOWS.morph[1] ? 1 : 0) * Math.max(0, 1 - L.value)))
    const roles = new SocialRoles({ data: ROLES, scale: 0.55, centralise: 0, sites: 0, labels: 1 })
    roles.gate = () => abstract() && L.value > 0.5 && L.value < 1.5
    const cycle = new Cycle({ scale: 0.36, x: 0, y: 300 })
    cycle.gate = () => abstract() && L.value > 1.5
    const horizon = new Horizon({ scale: 0.55, x: -60, y: -60 })
    horizon.gate = () => abstract() && L.value > 1.5
    geo.inPlane(new Lensed({ members: [roles], presence: atLayer(1) }))
    geo.inPlane(new Lensed({ members: [cycle, horizon], presence: atLayer(2) }))
    this.roles = roles
    this.cycle = cycle

    // Enter over a plant: its systems; over the group's circle: its data systems.
    m.slices[0]!.sites.forEach((e, i) => {
      const code = FLOWMAP.members[i]!.id
      e.unpack = () => siteLevel(code)
    })
    m.slices[0]!.hull.unpack = () => GroupSystemsDream

    this.stage(geo)
    this.stage(layers)
    this.stage(this.uncertainty)
    // The eye starts over the Atlantic; the Earth's lines are drawn on.
    const earth = geo.earth
    const eye = geo.eye
    this.set(
      eye.lat.to(18),
      eye.lon.to(-62),
      eye.tilt.to(0),
      earth.limbDraw.to(0),
      earth.coastDraw.to(0),
      earth.borderDraw.to(0),
      earth.land.to(rgb(0xff, 0xff, 0xff)),
    )

    // I. The Earth: its outline, then it turns to Europe as the shore draws and the land floods.
    this.flowing(1.2, earth.limbDraw.to(1))
    this.flowing(
      5.5,
      together(
        [earth.coastDraw.to(1, { easing: "easeOut" }), 0, 0.55],
        [geo.landIn.to(1), 0.35, 0.8],
        eye.lon.to(EUROPE.lon),
        eye.lat.to(32),
      ),
    )
    this.mark("globe", -0.3)
    // II. The descent: the land dims, the borders draw, the lens narrows.
    this.flowing(
      4.5,
      together(
        eye.lat.to(EUROPE.lat),
        eye.lon.to(EUROPE.lon),
        geo.descent.to(geo.regionZoom()),
        [eye.tilt.to(geo.tilt), 0.3, 1],
        [earth.land.to(rgb(0x0e, 0x0e, 0x0e)), 0.25, 0.75],
        [earth.borderDraw.to(1), 0.4, 1],
      ),
    )
    // III. The holding rises, then the plants — uncoloured.
    this.flowing(4.8, geo.rise.to(1, { easing: "linear" }))
    this.flowing(0.6)
    // The grain, as the globe says it: the plants take their colours…
    this.flowing(1.8, m.grain.to(1))
    this.flowing(1.6)
    // IV. Every plant reports home — and the grain folds back, for the circle to say it its own way.
    this.flowing(1.4, m.grain.to(0))
    this.flowing(3, geo.relate.to(1, { easing: "linear" }))
    this.flowing(1)
    // V–VI. Abstraction (the view axis): the eye pulls back, the arcs lift
    // off the planet into one circle, each plant glides to its seat, the
    // planet goes, the partners arrive — and the camera turns parallel.
    this.flowing(VIEW_DURATION, together(geo.view.to(1, { easing: "linear" }), [m.labels.to(1), 0.8, 1]))
    this.mark("abstract", 0.6)
    this.flowing(1)
    // VII. The grain: conversion and extrusion shrink in from the rim into the vesica.
    this.flowing(2.6, m.grain.to(1))
    this.mark("grain", 0.8)
    this.flowing(1.6)
    // VIII. Raw material flows in — ghosted, we hold no data for it.
    this.flowing(1.8, raw.shown.to(1))
    this.flowing(1.6)
    // IX. The lens lifts off the raw-material arrow: road and trucks — and back.
    if (SING_LENS) {
      this.flowing(1, lens.creation.to(1))
      this.flowing(2.4, lens.lift.to(1))
      this.flowing(0.6)
      this.flowing(3, lens.concrete.to(1))
      this.flowing(4)
      this.flowing(2.6, lens.concrete.to(0))
      this.flowing(2.2, lens.lift.to(0))
      this.flowing(0.8, lens.creation.to(0))
    }
    // X. The data we have: semi-finished, finished product out.
    this.flowing(1.6, m.stage("semi").shown.to(1))
    this.flowing(1.6, m.stage("finished").shown.to(1))
    this.mark("flows")
    // THE FIBER: one site and only what flows into it and out of it — its
    // suppliers and sending sites on the left, its receivers and buyers on
    // the right; everything else gone. Then the next site, then the whole.
    this.flowing(2.4, m.stateAxis("focus").to(SHOWCASE.fiber[0]))
    this.flowing(2.5)
    this.flowing(2.2, m.stateAxis("focus").to(SHOWCASE.fiber[1]))
    this.mark("fiber", 1.2)
    this.flowing(2.5)
    this.flowing(2.2, m.stateAxis("focus").to("none"))
    this.flowing(1.5)
    if (GRAIN_BEAT) {
      // The grain of knowledge: each particle becomes what it carries —
      // pallets in, film reels between the plants, pouches out (fewer of
      // them while they are symbols: a symbol needs room a dot does not; each
      // symbol is capped at particleMax of the map's radius, so members stay readable).
    const rungs = (k: number) => ["raw", "semi", "finished"].map((id) => m.stage(id).rung.to(k))
      this.flowing(3, together(m.spacing.to(m.spacing.value * 2.4), ...rungs(2)))
      this.flowing(3.5)
      this.flowing(2.4, together(m.spacing.to(m.spacing.value), ...rungs(1)))
    }
    // XI. The value chain's order as a dimension: the stage stack.
    this.flowing(3, together(m.expand.to(1), m.x.to(-MAP_R * 0.3), geo.breadth.to(0.68)))
    this.flowing(2)
    // The finished product, fully refined: its flows out to the buyers become
    // roads, each particle its truck — and back to the abstract.
    this.flowing(3, m.stage("finished").concrete.to(1))
    this.mark("roads", 2)
    this.flowing(4)
    this.flowing(2.5, m.stage("finished").concrete.to(0))
    this.flowing(1)
    // XII. Flat and face-on again — and the lens lies back on the arrow, for free play.
    this.flowing(3, together(m.expand.to(0), m.x.to(0), geo.breadth.to(1)))
    if (SING_LENS) this.flowing(1, lens.creation.to(1))
    this.flowing(1)
    if (!SING_LAYERS) return
    // XIII. The same group as its social structure: its roles by distance
    // from decision; the replenishment workforce gathers into one shared service.
    this.flowing(2.2, layers.layer.to(1))
    this.flowing(1.2)
    this.flowing(2.4, roles.centralise.to(1))
    this.mark("social", 0.8)
    this.flowing(1.6)
    // XIV. And as its superstructure: the S&OP cycle and its horizons.
    this.flowing(2.2, layers.layer.to(2))
    this.flowing(1.6, horizon.reveal.to(horizon.data.horizons.length))
    this.mark("sop", 0.8)
    this.flowing(1.6)
    // Home: the flows.
    this.flowing(2.2, layers.layer.to(0))
    this.flowing(1.5)
  }
}

if (import.meta.main) render(ValueFlowDream)
