/* ============================================================
   LABORATOIRE MOLÉCULAIRE
   ============================================================ */
import { Fragment, useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from "react";
import { EXPERIENCES, PALETTE, LGROUPS, COND } from "../data/lab";
import { EL, elColor, exists } from "../lib/chem";
import {
  SPC, SPLIST, ARAD, LAB_BY_ATLAS, bestSplit, addComp, groupList, protocolFor,
  KN_BY, knownWorks, autoReactions, msEq,
} from "../lib/lab";
import { useLab, labCompOf, labTry, type Mol } from "../store/lab";
import { useAtlas } from "../store/atlas";
import { toast, restartClass, useUi } from "../store/ui";
import { Formula, EqText, G, cssVars, joinNodes } from "./ui";

/* ---------- mise en page des molécules dans le creuset ---------- */
interface Placed { m: Mol; ox: number; oy: number }
function packLab(LM: Mol[]): { placed: Placed[]; W: number; H: number } {
  const maxW = 980, gap = 46, lab = 40;
  let x = 0, y = 0, rowH = 0;
  const rows: { m: Mol; ox: number; oy: number; cw: number }[][] = [[]];
  LM.forEach((m) => {
    const w = Math.max(m.w, 90);
    if (x > 0 && x + w > maxW) { x = 0; y += rowH + gap + lab; rowH = 0; rows.push([]); }
    rows[rows.length - 1].push({ m, ox: x + (w - m.w) / 2, oy: y, cw: w });
    x += w + gap;
    rowH = Math.max(rowH, m.h);
  });
  // centrer chaque rangée et aligner verticalement
  let totalW = 0;
  rows.forEach((r) => { if (r.length) totalW = Math.max(totalW, r.reduce((s, p) => s + p.cw, 0) + gap * (r.length - 1)); });
  rows.forEach((r) => {
    if (!r.length) return;
    const w = r.reduce((s, p) => s + p.cw, 0) + gap * (r.length - 1);
    let xx = (totalW - w) / 2;
    const rh = Math.max(...r.map((p) => p.m.h));
    r.forEach((p) => { p.ox = xx + (p.cw - p.m.w) / 2; p.oy += (rh - p.m.h) / 2; xx += p.cw + gap; });
  });
  return { placed: rows.flat().map(({ m, ox, oy }) => ({ m, ox, oy })), W: Math.max(totalW, 1), H: y + rowH + lab };
}

/** Formule en <tspan> pour le SVG (indices décalés). */
function SvgFormula({ f }: { f: string }) {
  const toks = f.match(/\d+|[^\d]+/g) || [];
  let low = false;
  return (
    <>
      {toks.map((tok, k) => {
        if (/^\d+$/.test(tok)) { const el = <tspan key={k} dy={low ? 0 : 4} fontSize="9">{tok}</tspan>; low = true; return el; }
        const el = <tspan key={k} dy={low ? -4 : 0}>{tok}</tspan>;
        low = false;
        return el;
      })}
    </>
  );
}

/** Équation cliquable : « 2 H₂O + CO₂ ». */
function EqList({ list }: { list: string[] }) {
  const selectSpecies = useLab((s) => s.selectSpecies);
  return (
    <>
      {joinNodes(
        groupList(list).map(([x, n]) => (
          <Fragment key={x}>{n > 1 ? n + " " : ""}<button className="eqm" onClick={() => selectSpecies(x)}><Formula f={SPC[x].form} /></button></Fragment>
        )),
        (k) => <Fragment key={`p${k}`}> <span className="op">+</span> </Fragment>,
      )}
    </>
  );
}
function EqPlain({ list }: { list: string[] }) {
  return <>{joinNodes(groupList(list).map(([x, n]) => <Fragment key={x}>{n > 1 ? n + " " : ""}<Formula f={SPC[x].form} /></Fragment>), (k) => <Fragment key={`p${k}`}> + </Fragment>)}</>;
}

/* ---------- colonne de gauche ---------- */
function LabLibrary() {
  const { load, add } = useLab.getState();
  return (
    <aside className="lab-lib">
      <h5>✦ Expériences</h5>
      <div className="pills">
        {EXPERIENCES.map(([name, list]) => <button key={name} className="pill" onClick={() => load(list)}>{name}</button>)}
      </div>
      <h5>✦ Atomes <small>clic = ajouter</small></h5>
      <div className="pal-grid">
        {PALETTE.map((el) => (
          <button key={el} className="pal" style={cssVars({ "--c": elColor(el) })} title={EL[el].n} onClick={() => add(el)}>
            <b>{el}</b><small>{EL[el].n}</small>
          </button>
        ))}
      </div>
      <h5>✦ Molécules <small>clic ou glisser</small></h5>
      <div>
        {Object.entries(LGROUPS).filter(([g]) => g !== "atome" && g !== "elem").map(([g, n]) => {
          const l = SPLIST.filter((s) => s.grp === g);
          if (!l.length) return null;
          return (
            <Fragment key={g}>
              <div className="lib-h">{n}</div>
              {l.map((s) => (
                <button key={s.id} className="tpl" draggable onDragStart={(e) => e.dataTransfer.setData("lab/sp", s.id)} onClick={() => add(s.id)}>
                  <span className="mono"><Formula f={s.form} /></span><span className="nm">{s.name}</span>
                </button>
              ))}
            </Fragment>
          );
        })}
      </div>
    </aside>
  );
}

/* ---------- scène SVG ---------- */
interface DrawnAtom { uid: string; el: string; q: number; x: number; y: number; gone?: boolean }

function drawAtoms(placed: Placed[]): DrawnAtom[] {
  return placed.flatMap(({ m, ox, oy }) => m.atoms.map((a) => ({ uid: a.uid, el: a.el, q: a.q, x: a.x + ox, y: a.y + oy })));
}

const DARK_TEXT = ["H", "Ca", "Si", "Ag", "Ti", "Al", "S", "Au", "He", "Ne", "F", "Mg"];

function LabStage() {
  const LM = useLab((s) => s.LM);
  const sel = useLab((s) => s.sel);
  const justReacted = useLab((s) => s.justReacted);
  const reactTick = useLab((s) => s.reactTick);
  const hist = useLab((s) => s.hist);
  const { removeAtom, toggleMol, react, clear, undo, add } = useLab.getState();
  const [over, setOver] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const { placed, W, H } = useMemo(() => packLab(LM), [LM]);
  const drawn = useMemo(() => drawAtoms(placed), [placed]);

  // Les atomes qui disparaissent restent 400 ms (fondu) avant d'être retirés.
  const [prev, setPrev] = useState({ LM, drawn });
  const [ghosts, setGhosts] = useState<DrawnAtom[]>([]);
  if (prev.LM !== LM) {
    const keep = new Set(drawn.map((a) => a.uid));
    const gone = prev.drawn.filter((a) => !keep.has(a.uid)).map((a) => ({ ...a, gone: true }));
    setPrev({ LM, drawn });
    if (gone.length) setGhosts((g) => [...g.filter((x) => !keep.has(x.uid)), ...gone]);
  }
  useEffect(() => {
    if (!ghosts.length) return;
    const t = setTimeout(() => setGhosts([]), 400);
    return () => clearTimeout(t);
  }, [ghosts]);

  useEffect(() => {
    if (reactTick) restartClass(stageRef.current, "flash");
  }, [reactTick]);

  const pad = 70, vw = Math.max(W + pad * 2, 520), vh = Math.max(H + pad * 2, 380);
  const vx = (W - vw) / 2, vy = (H - vh) / 2;
  const els = [...new Set(LM.flatMap((m) => m.atoms.map((a) => a.el)))];
  const ghostIds = new Set(drawn.map((a) => a.uid));
  const allAtoms = [...drawn, ...ghosts.filter((g) => !ghostIds.has(g.uid))];

  const comp = labCompOf(LM);
  let predict: ReactNode = null;
  if (LM.length) {
    const b = bestSplit(comp);
    const same = LM.map((m) => m.sp).sort().join() === [...b.list].sort().join();
    predict = same
      ? <span className="dim">Ces molécules sont déjà la combinaison la plus stable : rien ne se passerait.</span>
      : <>Si tu fais réagir : <EqList list={b.list} /></>;
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    const sp = e.dataTransfer.getData("lab/sp");
    if (sp && SPC[sp]) { add(sp); return; }
    const id = e.dataTransfer.getData("text/plain");
    if (LAB_BY_ATLAS[id]) add(LAB_BY_ATLAS[id]);
    else if (SPC[id]) add(id);
    else if (id) toast("Pas de structure moléculaire pour cette matière");
  };

  return (
    <div
      ref={stageRef}
      className={`lab-stage${over ? " over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <div className="lab-ring" aria-hidden="true" />
      <svg id="labSvg" viewBox={`${vx} ${vy} ${vw} ${vh}`}>
        <defs>
          {els.map((el) => (
            <radialGradient key={el} id={`ag-${el}`} cx="35%" cy="30%" r="75%">
              <stop offset="0" stopColor="#fff" stopOpacity=".85" />
              <stop offset=".25" stopColor={elColor(el)} />
              <stop offset="1" stopColor={elColor(el)} stopOpacity=".55" />
            </radialGradient>
          ))}
        </defs>
        <g id="labBonds" className={justReacted ? "late" : undefined} key={`b${reactTick}`}>
          {placed.flatMap(({ m, ox, oy }) => m.bonds.flatMap(([i, j, o], bk) => {
            const a = m.atoms[i], b = m.atoms[j];
            const x1 = a.x + ox, y1 = a.y + oy, x2 = b.x + ox, y2 = b.y + oy;
            if (o === 0) return [<line key={`${m.id}-${bk}`} className="bond ionic" x1={x1} y1={y1} x2={x2} y2={y2} />];
            const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
            const offs = o === 1 ? [0] : o === 2 ? [-4.5, 4.5] : [-7, 0, 7];
            return offs.map((d, dk) => (
              <line key={`${m.id}-${bk}-${dk}`} className="bond" x1={x1 + nx * d} y1={y1 + ny * d} x2={x2 + nx * d} y2={y2 + ny * d} />
            ));
          }))}
        </g>
        <g id="labAtoms">
          {allAtoms.map((a) => {
            const r = ARAD(a.el);
            return (
              <g
                key={a.uid}
                className={`latom born${a.gone ? " gone" : ""}`}
                style={{ transform: `translate(${a.x}px,${a.y}px)` }}
                data-tip={a.gone ? undefined : `${EL[a.el].n} — clic pour retirer cet atome`}
                onClick={a.gone ? undefined : () => removeAtom(a.uid)}
              >
                <circle r={r} fill={`url(#ag-${a.el})`} stroke={elColor(a.el)} strokeWidth="1.5" />
                <text y={r * 0.32} textAnchor="middle" fontSize={a.el.length > 1 ? r * 0.8 : r * 0.95} fill={DARK_TEXT.includes(a.el) ? "#111" : "#fff"}>{a.el}</text>
                {a.q !== 0 && (
                  <text className="chg" x={r * 0.75} y={-r * 0.6}>{Math.abs(a.q) > 1 ? Math.abs(a.q) : ""}{a.q > 0 ? "+" : "−"}</text>
                )}
              </g>
            );
          })}
        </g>
        <g id="labLabels">
          {placed.map(({ m, ox, oy }) => {
            const S = SPC[m.sp];
            const cx = ox + m.w / 2, y = oy + m.h + 26;
            return (
              <g key={m.id} className={`mlab${sel === m.id ? " sel" : ""}`} onClick={() => toggleMol(m.id)}>
                <text x={cx} y={y} textAnchor="middle">{S.name}</text>
                <text className="f" x={cx} y={y + 18} textAnchor="middle"><SvgFormula f={S.form} /></text>
              </g>
            );
          })}
        </g>
      </svg>
      <div className="lab-empty" style={{ display: LM.length ? "none" : "flex" }}>Le creuset est vide — ajoute des atomes ou des molécules à gauche.</div>
      <div className="lab-ctl">
        <div className="lab-pred">{predict}</div>
        <div className="lab-btns">
          <button className="btn" disabled={!hist.length} onClick={undo}>↶ Annuler</button>
          <button className="btn" onClick={clear}>Vider</button>
          <button className="btn gold big" onClick={react}>🔥 Faire réagir</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- colonne de droite ---------- */
function Protocol({ react, prod }: { react: string[]; prod: string[] }) {
  const P = protocolFor(react, prod);
  return (
    <div className="proto">
      <h5>✦ Comment le faire en vrai <small>pour obtenir {SPC[P.main].name.toLowerCase()}</small></h5>
      <div className="conds">
        {P.c.map((k) => <span key={k} className={`cond${k === "danger" ? " bad" : ""}`}><i>{COND[k][0]}</i>{COND[k][1]}</span>)}
      </div>
      <ol className="psteps">
        {P.steps.map((s, k) => <li key={k}><G>{s}</G></li>)}
        {P.sep && <li className="sep"><b>Récupérer :</b> <G>{P.sep}</G></li>}
      </ol>
      {P.tip && <div className="ptip">💡 <G>{P.tip}</G></div>}
      {P.warn && <div className="pwarn">⚠ {P.warn}</div>}
    </div>
  );
}

const TOXIC = ["cl2", "co", "no2", "h2s", "f2", "hf", "o3", "so2", "ch2o", "ch3oh"];

function Equation() {
  const eq = useLab((s) => s.eq);
  const simple = useUi((s) => s.simple);
  if (!eq) return null;
  if (eq.same) return <div className="note">Rien ne se passe : <EqList list={eq.react} /> est déjà la forme la plus stable de ces atomes.</div>;
  const dh = Math.round(eq.dh);
  const heat = dh > -200 ? "ça chauffe un peu" : dh > -600 ? "ça chauffe fort 🔥" : "ça brûle, voire ça explose 🔥🔥";
  const msg = simple
    ? dh < -50 ? <>🔥 <b>Ça dégage de la chaleur</b> : {heat}.</>
      : dh > 50 ? <>❄ <b>Ça ne se fait pas tout seul</b> : il faut apporter de l'énergie (chauffer, électricité…).</>
      : "Presque aucun échange de chaleur."
    : dh < -50 ? <><b><G>Exothermique</G></b> : la réaction libère {-dh} <G>kJ</G> — {heat}</>
      : dh > 50 ? <><b><G>Endothermique</G></b> : il faudrait fournir {dh} kJ d'énergie ❄</> : "Presque aucun échange d'énergie.";
  const tox = TOXIC.filter((x) => eq.prod.includes(x) && !eq.react.includes(x));
  return (
    <>
      <div className="lab-eq">
        <div className="eqline"><EqList list={eq.react} /> <span className="op">→</span> <EqList list={eq.prod} /></div>
        <div className="eqdh">{msg}</div>
        {tox.length > 0 && <div className="eqwarn">⚠ Dégage {tox.map((x) => SPC[x].name.toLowerCase()).join(", ")} : toxique !</div>}
      </div>
      <Protocol react={eq.react} prod={eq.prod} />
    </>
  );
}

function KnownRecipes({ sp }: { sp: string }) {
  const S = SPC[sp];
  const list = KN_BY[sp] || [];
  const auto = autoReactions(sp).filter((a) => !list.some((k) => k.r && msEq(k.r, a.r))).slice(0, 5);
  return (
    <div className="known">
      <h5>✦ Recettes connues <small>avec {S.name.toLowerCase()}</small></h5>
      {list.map((k) => {
        const res = k.r ? knownWorks(k) : null;
        return (
          <div key={k.i} className="kn">
            <b>{k.t}</b>
            {k.r && res ? (
              <div className="kn-eq mono"><EqPlain list={k.r} /> <span className="op">→</span> <EqPlain list={res} /></div>
            ) : k.eq ? (
              <div className="kn-eq mono"><EqText text={k.eq} /></div>
            ) : null}
            <p><G>{k.txt}</G></p>
            {k.r && res && <button className="btn small" onClick={() => labTry(k.r!)}>⚗ Essayer au labo</button>}
          </div>
        );
      })}
      {auto.length > 0 && (
        <div className="kn-auto">
          <div className="dim small" style={{ margin: "10px 0 6px" }}>Autres réactions possibles dans ce labo :</div>
          {auto.map((a) => (
            <button key={a.r.join()} className="hint-chip" onClick={() => labTry(a.r)}>
              <span className="mono"><EqPlain list={a.r} /> <span className="op">→</span> <EqPlain list={a.p} /></span>
            </button>
          ))}
        </div>
      )}
      {!list.length && !auto.length && <p className="dim small">Pas encore de recette connue pour celle-ci.</p>}
    </div>
  );
}

interface Piste { lbl: string; res: string; act: () => void }

function LabSide() {
  const LM = useLab((s) => s.LM);
  const sel = useLab((s) => s.sel);
  const peek = useLab((s) => s.peek);
  const eq = useLab((s) => s.eq);
  const { add, removeEl } = useLab.getState();
  const focus = useAtlas((s) => s.focus);
  const simple = useUi((s) => s.simple);

  const comp = labCompOf(LM);
  const els = Object.keys(comp).sort((a, b) => EL[a].z - EL[b].z);

  const selM = LM.find((m) => m.id === sel);
  const sp = peek ?? (selM ? selM.sp : eq && !eq.same ? eq.prod[0] : LM.length === 1 ? LM[0].sp : null);

  // pistes : ce qu'on obtiendrait en ajoutant / retirant un atome ou une molécule
  const pistes = useMemo(() => {
    const out: Piste[] = [];
    if (!LM.length) return out;
    const seen = new Set(LM.map((m) => m.sp));
    const tryIt = (lbl: string, act: () => void, newComp: Record<string, number>) => {
      const b = bestSplit(newComp);
      if (b.list.length === 1 && !["atome", "elem"].includes(SPC[b.list[0]].grp) && !seen.has(b.list[0]) && !out.some((p) => p.res === b.list[0]))
        out.push({ lbl, act, res: b.list[0] });
    };
    ["H", "O", "C", "N", "Cl", "S", "Na"].forEach((el) => tryIt(`+ ${el}`, () => add(el), addComp(comp, { [el]: 1 })));
    ["h2o", "o2", "co2", "so3", "nh3", "hcl", "h2", "cao", "naoh"].forEach((t) => tryIt(`+ ${SPC[t].form}`, () => add(t), addComp(comp, SPC[t].comp)));
    els.forEach((el) => {
      const c = { ...comp };
      c[el]--;
      if (Object.values(c).some((v) => v > 0)) tryIt(`− ${el}`, () => removeEl(el), c);
    });
    return out;
  }, [LM]);

  const openAtlas = (id: string) => focus(id, { scroll: true });

  return (
    <aside className="lab-side">
      <h5>✦ Dans le creuset <small>− / + pour retirer ou ajouter un atome</small></h5>
      <div className="lab-comp">
        {els.length ? els.map((el) => (
          <span key={el} className="cc" style={cssVars({ "--c": elColor(el) })}>
            <button title={`Retirer un ${EL[el].n}`} onClick={() => removeEl(el)}>−</button>
            <b>{el}</b><i>{comp[el]}</i>
            <button title={`Ajouter un ${EL[el].n}`} onClick={() => add(el)}>+</button>
          </span>
        )) : <span className="dim small">Vide.</span>}
      </div>
      <div><Equation /></div>
      <h5>✦ Pistes <small>ce que tu obtiendrais…</small></h5>
      <div className="lab-hints">
        {pistes.length ? pistes.slice(0, 8).map((p) => (
          <button key={p.lbl} className="hint-chip" onClick={p.act}>
            <b>{p.lbl}</b> <span className="op">→</span> {SPC[p.res].name} <span className="mono"><Formula f={SPC[p.res].form} /></span>
          </button>
        )) : <span className="dim small">{LM.length ? "Aucune molécule unique à portée d'un atome." : "Ajoute quelque chose pour avoir des pistes."}</span>}
      </div>
      <h5>✦ Molécule</h5>
      <div className="lab-info">
        {sp ? (
          <>
            <div className="li-head"><b>{SPC[sp].name}</b><span className="mono"><Formula f={SPC[sp].form} /></span></div>
            <p><G>{SPC[sp].desc}</G></p>
            {!peek && !simple && (
              <div className="dim small">
                <G>Énergie de formation</G> : <span className="mono">{SPC[sp].dh > 0 ? "+" : ""}{SPC[sp].dh} kJ/mol</span>{" "}
                {SPC[sp].dh < 0 ? "(stable)" : SPC[sp].dh > 0 ? "(instable, réactif)" : "(référence)"}
              </div>
            )}
            {SPC[sp].atlas && exists(SPC[sp].atlas!) && (
              <button className="btn small" style={{ marginTop: 8 }} onClick={() => openAtlas(SPC[sp].atlas!)}>↑ Ouvrir dans l'atlas</button>
            )}
          </>
        ) : <p className="dim small">Clique le nom d'une molécule dans le creuset pour la décrire.</p>}
      </div>
      <p className="dim small lab-caveat">
        Labo simplifié : les atomes vont vers la combinaison qui a l'énergie de formation la plus basse (la plus stable). En vrai, il faut souvent une
        étincelle, de la chaleur ou un catalyseur, et certaines molécules (l'acide carbonique…) se redécomposent.
      </p>
      <div>{sp && <KnownRecipes sp={sp} />}</div>
    </aside>
  );
}

export function Lab() {
  return (
    <section className="labsec" id="lab">
      <div className="lab-headline">
        <div>
          <div className="motto">Solve et coagula <span>— dissous, puis assemble</span></div>
          <h2 className="big">Le laboratoire moléculaire</h2>
          <p className="sec-sub">
            Ici on voit les molécules pour de vrai : les boules sont les atomes, les traits les liaisons (double trait = double liaison, pointillés =
            attraction entre ions + et −). Ajoute des atomes ou des molécules, <b>clique un atome pour l'enlever</b>, puis fais réagir : les atomes se
            réarrangent dans la combinaison la plus stable.
          </p>
        </div>
      </div>
      <div className="lab">
        <LabLibrary />
        <LabStage />
        <LabSide />
      </div>
    </section>
  );
}
