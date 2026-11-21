/* Les 3 niveaux de transformation : physique, chimique, subatomique */
import { NIVEAUX } from "../data/atlas";
import { RECS } from "../lib/chem";
import { cssVars } from "./ui";

export type Lvl = 1 | 2 | 3;
export const LVLS: Lvl[] = [1, 2, 3];
const COUNT: Record<Lvl, number> = { 1: 0, 2: 0, 3: 0 };
RECS.forEach((r) => COUNT[r.lvl]++);

/** Petit badge « 2 · Chimique », avec la définition au survol. */
export function LevelTag({ lvl }: { lvl: Lvl }) {
  const n = NIVEAUX[lvl];
  return (
    <span className={`lvl lvl-${lvl}`} style={cssVars({ "--lc": n.c })} data-tip={`Niveau ${lvl} · ${n.n} — ce qui change : ${n.change}`}>
      <b>{lvl}</b>{n.n}
    </span>
  );
}

/** Les 3 cartes explicatives ; cliquer une carte filtre les recettes de ce niveau. */
export function LevelCards({ value, onChange }: { value: Lvl | null; onChange: (l: Lvl | null) => void }) {
  return (
    <div className="lvl-cards" role="group" aria-label="Filtrer par niveau de transformation">
      {LVLS.map((l) => {
        const n = NIVEAUX[l];
        return (
          <button
            key={l}
            className={`lvl-card${value === l ? " on" : ""}${value != null && value !== l ? " off" : ""}`}
            style={cssVars({ "--lc": n.c })}
            aria-pressed={value === l}
            onClick={() => onChange(value === l ? null : l)}
          >
            <span className="lc-head"><b>{l}</b><span className="lc-n">{n.e} {n.n}</span><span className="lc-k">{COUNT[l]} recettes</span></span>
            <span className="lc-change"><i>Ce qui change :</i> {n.change}</span>
            <span className="lc-ex"><i>Exemples :</i> {n.ex}</span>
          </button>
        );
      })}
    </div>
  );
}
