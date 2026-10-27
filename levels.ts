/**
 * levels.ts — the hyperobject's inner levels .
 *
 * Unpacking (Enter, core editor/nest.ts) opens a level built from this
 * group's own data, in the generic holons of the public vocabulary:
 *
 *   a plant      → its systems: the ERP of record (its family, drifted by
 *                  the site's usage convention) and what lives outside any
 *                  ERP (spreadsheets, local tools, warehouse systems)
 *   the group    → its data systems: hub vs pairwise harmonisation of the
 *                  ERP families, beside the lossy chain from shop floor to
 *                  the humans who decide
 *
 * Which site runs which ERP is a known unknown, so every assignment
 * here is ghosted (certainty < 1) until the authoritative table arrives.
 */

import { Dream, type DreamClass } from "../../core/src/index"
import { Create } from "../../core/src/verbs"
import { together } from "../../core/src/anim"
import { SiteSystems, type SiteSystemsData } from "../../core/vocabulary/SiteSystems/SiteSystems"
import { Harmonization, type HarmonizationData } from "../../core/vocabulary/Harmonization/Harmonization"
import { LossyChain, MOCK_LOSSY_CHAIN } from "../../core/vocabulary/LossyChain/LossyChain"
import { FAMILY_OF, PLANTS, type Plant } from "./data"

// === The systems, in structure ===

/** ERP families (placeholders): A the migration target, B its predecessor family, C legacy, D one site's own. */
export const ERP_FAMILIES = ["ERP A", "ERP B", "ERP C", "ERP D"] as const

/** Each site's own usage convention, 0 … 1 off its family's standard — a picture, golden-ratio spread (never random). */
const usageOf = (i: number): number => 0.2 + 0.7 * (((i + 1) * 0.6180339887) % 1)

/** What lives outside every ERP, per site. */
const OUTSIDE: SiteSystemsData["outside"] = [
  { kind: "spreadsheet", label: "capacity" },
  { kind: "spreadsheet", label: "product → machine" },
  { kind: "spreadsheet", label: "planning comments" },
  { kind: "warehouse", label: "item stock" },
]

export const siteSystemsOf = (p: Plant, i: number): SiteSystemsData => {
  const family = FAMILY_OF[p.code]
  return {
    site: { label: p.code, kind: p.categories.join(" + ") || "group entity" },
    erp: { family: family ?? "ERP ?", certainty: family ? 0.35 : 0.1 },
    usage: usageOf(i),
    outside: [...OUTSIDE, { kind: "localTool", label: "local tools?", certainty: 0.15 }],
  }
}

// === The levels ===

const named = <T extends DreamClass>(C: T, name: string): T => {
  Object.defineProperty(C, "name", { value: name })
  return C
}

const siteLevels = new Map<string, DreamClass>()

/** A plant's own level: its systems (built once per plant, on first unpack). */
export const siteLevel = (code: string): DreamClass | undefined => {
  const i = PLANTS.findIndex((p) => p.code === code)
  if (i < 0) return undefined
  let C = siteLevels.get(code)
  if (!C) {
    const data = siteSystemsOf(PLANTS[i]!, i)
    C = named(
      class extends Dream {
        systems = new SiteSystems({ observer: this.observer, data, outside: 0, usage: 0 })
        unfold() {
          this.set(...this.observer.orbit({ theta: 0.6 }), ...this.observer.dolly(1900), this.observer.fov.to(0.5))
          this.stage(this.systems)
          this.play(Create(this.systems), 1.6)
          this.play(this.systems.stateAxis("usage").to("local"), 1.4)
          this.play(this.systems.stateAxis("outside").to("shown"), 1.6)
        }
      },
      `Site${code}Dream`,
    )
    siteLevels.set(code, C)
  }
  return C
}

/** The ERP families onto one canonical model — A defines it (the migration target), each next costs its distance. */
const HARMONIZATION: HarmonizationData = {
  systems: [
    { id: "a", label: "ERP A", distance: 0.15 },
    { id: "b", label: "ERP B", distance: 0.35 },
    { id: "c", label: "ERP C", distance: 0.75 },
    { id: "d", label: "ERP D", distance: 0.45 },
    { id: "x", label: "others ?", distance: 0.9, certainty: 0.15 },
    { id: "y", label: "others ?", distance: 0.9, certainty: 0.15 },
  ],
  model: "canonical model",
}

/** The group's data systems: harmonisation beside the lossy chain. */
export class GroupSystemsDream extends Dream {
  hub = new Harmonization({ data: HARMONIZATION, x: -760, y: 150, scale: 1.1, topology: 0, onboarded: 0 })
  chain = new LossyChain({ data: MOCK_LOSSY_CHAIN, x: 460, y: -150, scale: 1.1, write: 0 })

  unfold() {
    this.set(...this.observer.dolly(2000))
    this.stage(this.hub)
    this.stage(this.chain)
    this.play(together(Create(this.hub), Create(this.chain), this.chain.time.by(2, { easing: "linear" })), 2)
    this.play(together(this.hub.stateAxis("topology").to("hub"), this.chain.time.by(2.4, { easing: "linear" })), 2.4)
    this.play(together(this.hub.onboarded.to(HARMONIZATION.systems.length - 2), this.chain.time.by(3, { easing: "linear" })), 3)
    this.play(this.chain.time.by(2, { easing: "linear" }), 2)
  }
}
