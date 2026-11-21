import { Fragment, useMemo, useState } from "react";
import { CATS, MATIERES, FAMILLES } from "../data/atlas";
import { ELS, USED_ELS, atoms, hasAtoms, info, isEl, norm, pct, elColor } from "../lib/chem";
import { useAtlas } from "../store/atlas";
import { ABar, Orb, cssVars, dragProps } from "./ui";

const PRESETS: [string[], string][] = [
  [["C", "H"], "Hydrocarbures"], [["C", "H", "O"], "Sucres & bois"], [["C", "H", "N", "O"], "Vivant"],
  [["Si", "O"], "Sable & verre"], [["Ca", "C", "O"], "Calcaire"], [["C"], "Carbone pur"],
];

function LibRow({ id, cur, showCat }: { id: string; cur: string; showCat?: boolean }) {
  const focus = useAtlas((s) => s.focus);
  const m = MATIERES.find((x) => x.id === id);
  const style = showCat && m ? cssVars({ "--c": CATS[m.cat].c }) : undefined;
  const add = useAtlas((s) => s.addToCauldron);
  return (
    <div className="lib-item">
      <button className={`lib-row${cur === id ? " on" : ""}`} style={style} onClick={() => focus(id)} {...dragProps(id)}>
        <Orb id={id} />
        <span className="nm">{info(id).name}</span>
        {hasAtoms(id) ? <ABar a={atoms(id)} /> : <span className="dim small">✦</span>}
      </button>
      <button className="add-btn" title={`Mettre ${info(id).name} dans le creuset`} aria-label={`Mettre ${info(id).name} dans le creuset`} onClick={() => add(id)}>＋</button>
    </div>
  );
}

function MaterialsPane({ cur }: { cur: string }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const nq = norm(q);
  const groups = Object.entries(CATS)
    .filter(([k]) => cat === "all" || cat === k)
    .map(([k, c]) => ({
      k, c,
      items: MATIERES.filter((m) => m.cat === k && (!nq || norm(m.n + " " + m.id + " " + (m.f || "")).includes(nq))),
    }))
    .filter((g) => g.items.length);

  return (
    <>
      <input className="lib-q" placeholder="Filtrer…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="lib-cats">
        <button className={`pill${cat === "all" ? " on" : ""}`} onClick={() => setCat("all")}>Tout</button>
        {Object.entries(CATS).map(([k, c]) => (
          <button key={k} className={`pill${cat === k ? " on" : ""}`} style={cssVars({ "--c": c.c })} onClick={() => setCat(k)}>
            <span className="dot" />{c.n}
          </button>
        ))}
      </div>
      <div className="lib-list">
        {groups.length ? (
          groups.map(({ k, c, items }) => (
            <Fragment key={k}>
              <div className="lib-h" style={cssVars({ "--c": c.c })}>{c.e} {c.n}</div>
              {items.map((m) => <LibRow key={m.id} id={m.id} cur={cur} showCat />)}
            </Fragment>
          ))
        ) : (
          <p className="dim">Rien trouvé.</p>
        )}
      </div>
    </>
  );
}

function MiniPeriodicTable({ cur }: { cur: string }) {
  const focus = useAtlas((s) => s.focus);
  const a = atoms(cur);
  const curName = info(cur).name;
  return (
    <>
      <div className="mini-pt">
        {ELS.map((e) => {
          const v = a[e.s] || 0;
          const lit = v > 0.0005;
          return (
            <button
              key={e.s}
              className={`mt${lit ? " lit" : ""}${cur === e.s ? " on" : ""}`}
              style={{ gridRow: e.row, gridColumn: e.col, ...cssVars({ "--c": FAMILLES[e.cat].c, "--a": lit ? Math.min(1, 0.35 + Math.sqrt(v)) : 0 }) }}
              data-tip={`${e.z} · ${e.n}${lit ? ` — ${pct(v)} de ${curName}` : ""}`}
              onClick={() => focus(e.s)}
              {...dragProps(e.s)}
            >
              {e.s}
            </button>
          );
        })}
      </div>
      <p className="hint">
        {isEl(cur) ? "Clique un atome pour voir où on le trouve." : <>Les atomes de <b>{curName}</b> sont allumés (plus c'est vif, plus il y en a).</>}
      </p>
    </>
  );
}

function AtomRecipe({ cur }: { cur: string }) {
  const [sel, setSel] = useState<Set<string>>(() => new Set(["C", "H"]));
  const res = useMemo(() => {
    if (!sel.size) return [];
    return MATIERES.filter((m) => {
      const a = atoms(m.id);
      if (!Object.keys(a).length) return false;
      let s = 0;
      sel.forEach((x) => (s += a[x] || 0));
      return s >= 0.985;
    }).map((m) => m.id);
  }, [sel]);
  const toggle = (s: string) => {
    const n = new Set(sel);
    if (n.has(s)) n.delete(s); else n.add(s);
    setSel(n);
  };
  const pl = res.length > 1 ? "s" : "";
  return (
    <div className="recipe-tool">
      <h5>✦ Recette atomique</h5>
      <p className="hint">Quelles matières sont faites <i>uniquement</i> de ces atomes ?</p>
      <div className="pills">
        {PRESETS.map(([els, label]) => (
          <button key={label} className="pill" onClick={() => setSel(new Set(els))}>{label}</button>
        ))}
      </div>
      <div className="at-sel">
        {USED_ELS.map((e) => (
          <button key={e.s} className={`at${sel.has(e.s) ? " on" : ""}`} style={cssVars({ "--c": elColor(e.s) })} title={e.n} onClick={() => toggle(e.s)}>
            {e.s}
          </button>
        ))}
      </div>
      <div className="lib-list">
        {sel.size > 0 && <div className="lib-h">{res.length} matière{pl} faite{pl} de {[...sel].join(" + ")}</div>}
        {res.map((id) => <LibRow key={id} id={id} cur={cur} />)}
      </div>
    </div>
  );
}

export function Library() {
  const cur = useAtlas((s) => s.cur);
  const [tab, setTab] = useState<"mat" | "atom">("mat");
  return (
    <aside className="lib">
      <div className="lib-tabs">
        <button className={tab === "mat" ? "on" : ""} onClick={() => setTab("mat")}>Matières</button>
        <button className={tab === "atom" ? "on" : ""} onClick={() => setTab("atom")}>Atomes</button>
      </div>
      <div className={`lib-pane${tab === "mat" ? " on" : ""}`}>
        <MaterialsPane cur={cur} />
      </div>
      <div className={`lib-pane${tab === "atom" ? " on" : ""}`}>
        <MiniPeriodicTable cur={cur} />
        <AtomRecipe cur={cur} />
      </div>
    </aside>
  );
}
