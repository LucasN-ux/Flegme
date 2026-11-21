/* Fiche détaillée de la matière ou de l'atome affiché */
import { useEffect, useRef } from "react";
import { ALCHIMIE } from "../data/atlas";
import {
  info, atoms, IT, EL, PRESENT, MADE, USED, sorted, pct, elColor, parseFormula, kidsOf, cousins, type Rec,
} from "../lib/chem";
import { LAB_BY_ATLAS } from "../lib/lab";
import { useAtlas } from "../store/atlas";
import { useLab } from "../store/lab";
import { scrollToEl } from "../store/ui";
import { ABar, Chip, Formula, Orb, joinNodes } from "./ui";

export function RecipeCard({ r }: { r: Rec }) {
  const tryRecipe = useAtlas((s) => s.tryRecipe);
  return (
    <div className="recipe">
      <div className="eq">
        {joinNodes(r.ins.map((id, k) => <Chip key={`i${k}`} id={id} />), (k) => <span key={`p${k}`} className="op">+</span>)}
        <span className="op">→</span>
        <Chip id={r.out} />
      </div>
      <p>{r.txt}</p>
      <button className="btn small" onClick={() => tryRecipe(r.i)}>⚗ Faire au creuset</button>
    </div>
  );
}

function CompRow({ id, v }: { id: string; v: number }) {
  const focus = useAtlas((s) => s.focus);
  const i = info(id);
  return (
    <button className="comp-row" onClick={() => focus(id, { child: true })}>
      <Orb id={id} />
      <span className="nm">{i.name}</span>
      <span className="bar"><i style={{ width: `${Math.max(v * 100, 1.5)}%`, background: i.c }} /></span>
      <span className="v">{pct(v)}</span>
    </button>
  );
}

function Balls({ f }: { f: string }) {
  const focus = useAtlas((s) => s.focus);
  const a = parseFormula(f);
  return (
    <div className="balls">
      {Object.keys(a).map((s) => {
        const n = a[s];
        const k = Number.isInteger(n) && n <= 6 ? n : 1;
        const disp = Number.isInteger(n) ? n : "≈" + String(Math.round(n * 100) / 100).replace(".", ",");
        return (
          <button key={s} className="ball-g" title={EL[s].n} onClick={() => focus(s, { child: true })}>
            {Array.from({ length: k }, (_, j) => <span key={j} className="ball" style={{ background: elColor(s) }}>{s}</span>)}
            <span>× {disp}</span>
          </button>
        );
      })}
    </div>
  );
}

function ElementDetails({ id }: { id: string }) {
  const e = EL[id], al = ALCHIMIE[id];
  const pr = PRESENT[id] || [];
  const to = al ? (al.astre === "Soleil" ? "au Soleil" : al.astre === "Lune" ? "à la Lune" : "à " + al.astre) : "";
  return (
    <>
      <p className="desc">{e.note}</p>
      <div className="kv">
        <div><small>N° atomique</small><b>{e.z}</b></div>
        <div><small>Masse</small><b>{String(e.m).replace(".", ",")}</b></div>
        <div><small>État à 20 °C</small><b>{e.state}</b></div>
        <div><small>Période</small><b>{e.period}</b></div>
        <div><small>Groupe</small><b>{e.group || "—"}</b></div>
        <div><small>Radioactif</small><b>{e.radio ? "oui ☢" : "non"}</b></div>
      </div>
      {al && <div className="note">{al.sym} <b>Alchimie :</b> l'un des 7 métaux connus depuis l'Antiquité, associé {to}.</div>}
      {pr.length > 0 && (
        <div className="sec">
          <h5>Présent dans <small>{pr.length} matière{pr.length > 1 ? "s" : ""} · part de leur masse</small></h5>
          <div className="comp-list">{pr.slice(0, 20).map(([mid, v]) => <CompRow key={mid} id={mid} v={v} />)}</div>
        </div>
      )}
    </>
  );
}

function MaterialDetails({ id }: { id: string }) {
  const focus = useAtlas((s) => s.focus);
  const m = IT[id], a = atoms(id);
  const cz = cousins(id);
  return (
    <>
      <p className="desc">{m.d}</p>
      {m.note && <p className="desc dim">{m.note}</p>}
      {m.x && <div className="note">✦ <b>Indivisible.</b> {m.x}</div>}
      {m.s && <div className="sec"><h5>Structure</h5><div className="note">{m.s}</div></div>}
      {m.f && (
        <div className="sec">
          <h5>La molécule</h5>
          <div className="formula"><Formula f={m.f} /></div>
          <Balls f={m.f} />
        </div>
      )}
      {m.c && (
        <div className="sec">
          <h5>Fait de <small>% de la masse</small></h5>
          <div className="comp-list">{kidsOf(id).list.map((k) => <CompRow key={k.id} id={k.id} v={k.frac ?? 0} />)}</div>
        </div>
      )}
      {Object.keys(a).length > 0 && (
        <div className="sec">
          <h5>Jusqu'aux atomes</h5>
          <ABar a={a} big />
          <div className="atom-leg">
            {sorted(a).slice(0, 10).map(([s, v]) => (
              <button key={s} onClick={() => focus(s)}>
                <span className="sw" style={{ background: elColor(s) }} />{EL[s].n}<span className="v">{pct(v)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {cz.length > 0 && (
        <div className="sec">
          <h5>Même recette atomique <small>matières aux atomes les plus proches</small></h5>
          <div className="chips">
            {cz.map(([cid, v]) => <Chip key={cid} id={cid}><b>{v > 0.995 ? "identique" : Math.round(v * 100) + " %"}</b></Chip>)}
          </div>
          {cz.some((c) => c[1] > 0.995) && (
            <p className="dim small">« Identique » : mêmes atomes, mêmes proportions… mais arrangés autrement (comme le diamant et le graphite).</p>
          )}
        </div>
      )}
    </>
  );
}

export function InfoPanel() {
  const cur = useAtlas((s) => s.cur);
  const banner = useAtlas((s) => s.banner);
  const ref = useRef<HTMLElement>(null);
  const i = info(cur);
  const labId = LAB_BY_ATLAS[cur];
  const made = MADE[cur] || [], used = USED[cur] || [];

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
  }, [cur, banner]);

  const openInLab = () => {
    useLab.getState().load([labId]);
    scrollToEl("#lab");
  };

  return (
    <aside className="info" ref={ref}>
      <div className="i-head">
        <Orb id={cur} size="lg" />
        <div><h2>{i.name}</h2><div className="cat" style={{ color: i.c }}>{i.catName}</div></div>
      </div>
      {labId && <button className="btn small labgo" onClick={openInLab}>⚛ Voir sa molécule au laboratoire ↓</button>}
      {banner?.kind === "ok" && (
        <div className="note gold">
          <b>✦ Transmutation : {banner.sel.map((id) => info(id).name).join(" + ")} → {info(banner.out).name}</b>
          <br />
          {banner.txt}
          {banner.by.length > 0 && <> <span className="dim">(Sous-produits : {banner.by.map((b) => info(b).name).join(", ")}.)</span></>}
        </div>
      )}
      {i.kind === "el" ? <ElementDetails id={cur} /> : <MaterialDetails id={cur} />}
      {made.length > 0 && (
        <div className="sec">
          <h5>Comment le fabriquer <small>{made.length} recette{made.length > 1 ? "s" : ""}</small></h5>
          {made.map((r) => <RecipeCard key={r.i} r={r} />)}
        </div>
      )}
      {used.length > 0 && (
        <div className="sec">
          <h5>Ce qu'on fabrique avec <small>{used.length} recette{used.length > 1 ? "s" : ""}</small></h5>
          {used.slice(0, 8).map((r) => <RecipeCard key={r.i} r={r} />)}
          {used.length > 8 && <p className="dim small">… et {used.length - 8} autres à trouver au creuset.</p>}
        </div>
      )}
    </aside>
  );
}
