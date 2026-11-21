/* Traditions (Grèce, Wu Xing, métaux planétaires, Paracelse) et grimoire des recettes */
import { useState } from "react";
import { ALCHIMIE } from "../data/atlas";
import { IT, EL, elColor, info, RECS } from "../lib/chem";
import { useAtlas } from "../store/atlas";
import { RecipeCard } from "./InfoPanel";
import { Chip, Orb, cssVars } from "./ui";

const openScroll = (id: string) => useAtlas.getState().focus(id, { scroll: true });

function Sym({ kind, c }: { kind?: string; c: string }) {
  const st = { fill: "none", stroke: c, strokeWidth: 5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const up = <path d="M32 8 L58 54 L6 54 Z" {...st} />;
  const down = <path d="M32 56 L58 10 L6 10 Z" {...st} />;
  return (
    <svg viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill={c} opacity=".1" />
      {kind === "up" && up}
      {kind === "down" && down}
      {kind === "upbar" && <>{up}<path d="M14 38 H50" {...st} /></>}
      {kind === "downbar" && <>{down}<path d="M14 26 H50" {...st} /></>}
      {!["up", "down", "upbar", "downbar"].includes(kind ?? "") && <><circle cx="32" cy="32" r="22" {...st} /><circle cx="32" cy="32" r="5" fill={c} /></>}
    </svg>
  );
}

const GREEK: [string, string, string][] = [
  ["feu", "#ff7a4d", "Une réaction (combustion), pas une matière."],
  ["air", "#9fd8ff", "Un mélange de gaz : 78 % d'azote, 21 % d'oxygène."],
  ["eau", "#4f9dff", "Une molécule : H₂O."],
  ["terre", "#c9a26b", "Un mélange de minéraux, d'humus, d'eau et d'air."],
  ["ether", "#d6b3ff", "N'existe pas (abandonné en 1887)."],
];

function SvgNode({ id, x, y, r, c, label, emojiSize, labelSize, dy }: {
  id: string; x: number; y: number; r: number; c: string; label: string; emojiSize: number; labelSize: number; dy: [number, number];
}) {
  return (
    <g className="svgnode" onClick={() => openScroll(id)}>
      <circle cx={x} cy={y} r={r} fill="#0a0a0a" stroke={c} strokeWidth="2" />
      <text x={x} y={y + dy[0]} textAnchor="middle" fontSize={emojiSize}>{IT[id].e}</text>
      <text x={x} y={y + dy[1]} textAnchor="middle" fontSize={labelSize} fill={c} fontFamily="Cinzel">{label}</text>
    </g>
  );
}

function Aristote() {
  const nodes: [string, number, number, string, string][] = [
    ["feu", 200, 40, "#ff7a4d", "Feu"], ["air", 360, 200, "#9fd8ff", "Air"], ["eau", 200, 360, "#4f9dff", "Eau"], ["terre", 40, 200, "#c9a26b", "Terre"],
  ];
  return (
    <svg viewBox="0 0 400 400">
      <path d="M200 40 L360 200 L200 360 L40 200 Z" fill="none" stroke="#36332f" strokeWidth="2" />
      <g fontFamily="Cinzel" fontSize="13" textAnchor="middle" letterSpacing="2">
        <text x="300" y="110" fill="#ff9a6b">CHAUD</text><text x="300" y="300" fill="#6fb3ff">HUMIDE</text>
        <text x="100" y="300" fill="#9fd8ff">FROID</text><text x="100" y="110" fill="#d9b27a">SEC</text>
      </g>
      <g className="svgnode" onClick={() => openScroll("ether")}>
        <circle cx="200" cy="200" r="34" fill="#0a0a0a" stroke="#d6b3ff" strokeWidth="2" />
        <text x="200" y="198" textAnchor="middle" fontSize="20">✨</text>
        <text x="200" y="216" textAnchor="middle" fontSize="9" fill="#d6b3ff" fontFamily="Cinzel">ÉTHER</text>
      </g>
      {nodes.map(([id, x, y, c, n]) => <SvgNode key={id} id={id} x={x} y={y} r={34} c={c} label={n} emojiSize={24} labelSize={10} dy={[2, 22]} />)}
    </svg>
  );
}

function WuXing() {
  const Wx: [string, string, string, number][] = [
    ["feu", "Feu", "#ff6b57", -90], ["terre", "Terre", "#e0b45a", -18], ["metal", "Métal", "#d7dce2", 54], ["eau", "Eau", "#4f8fe0", 126], ["bois", "Bois", "#6fbf73", 198],
  ];
  const R = 135, cx = 200, cy = 205;
  const P: Record<string, [number, number]> = {};
  Wx.forEach(([id, , , a]) => { const r = (a * Math.PI) / 180; P[id] = [cx + R * Math.cos(r), cy + R * Math.sin(r)]; });
  const arrow = (a: string, b: string, curve: boolean, color: string, dash?: string) => {
    const [x1, y1] = P[a], [x2, y2] = P[b];
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, rr = 38;
    const sx = x1 + ux * rr, sy = y1 + uy * rr, ex = x2 - ux * rr, ey = y2 - uy * rr;
    if (curve) {
      const mx = (sx + ex) / 2, my = (sy + ey) / 2, nx = mx - cx, ny = my - cy, nl = Math.hypot(nx, ny);
      return <path key={a + b} d={`M${sx} ${sy} Q${mx + (nx / nl) * 28} ${my + (ny / nl) * 28} ${ex} ${ey}`} fill="none" stroke={color} strokeWidth="2.5" markerEnd="url(#ah1)" />;
    }
    return <path key={a + b} d={`M${sx} ${sy} L${ex} ${ey}`} fill="none" stroke={color} strokeWidth="1.6" strokeDasharray={dash} markerEnd="url(#ah2)" />;
  };
  return (
    <svg viewBox="0 0 400 400">
      <defs>
        <marker id="ah1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#e9b949" /></marker>
        <marker id="ah2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#8b6fd6" /></marker>
      </defs>
      {[["bois", "feu"], ["feu", "terre"], ["terre", "metal"], ["metal", "eau"], ["eau", "bois"]].map(([a, b]) => arrow(a, b, true, "#e9b949"))}
      {[["bois", "terre"], ["terre", "eau"], ["eau", "feu"], ["feu", "metal"], ["metal", "bois"]].map(([a, b]) => arrow(a, b, false, "#8b6fd6", "5 5"))}
      {Wx.map(([id, n, c]) => <SvgNode key={id} id={id} x={P[id][0]} y={P[id][1]} r={36} c={c} label={n} emojiSize={24} labelSize={10} dy={[3, 23]} />)}
    </svg>
  );
}

const TRIA: [string, string, string, string, string][] = [
  ["S", "Soufre", "l'âme", "Ce qui brûle et donne la couleur.", "Le soufre brûle bien (flamme bleue)."],
  ["Hg", "Mercure", "l'esprit", "Ce qui coule et s'évapore.", "Seul métal liquide, il s'évapore à température ambiante."],
  ["sel", "Sel", "le corps", "Ce qui reste, solide, après le feu.", "Les cendres sont bien des sels minéraux."],
];

function Grimoire() {
  const found = useAtlas((s) => s.found);
  const [reveal, setReveal] = useState(false);
  return (
    <>
      <div className="motto" style={{ marginTop: 60 }}>Solve et coagula <span>— dissous, puis assemble</span></div>
      <h2 className="big" id="grimoire">Le grimoire des recettes</h2>
      <div className="grim-head">
        <p className="sec-sub" style={{ margin: 0 }}>Chaque recette réussie au creuset s'inscrit ici (gardé dans ce navigateur).</p>
        <div className="grim-ctl">
          <span className="mono">{found.size} / {RECS.length}</span>
          <div className="progress"><i style={{ width: `${(found.size / RECS.length) * 100}%` }} /></div>
          <label><input type="checkbox" checked={reveal} onChange={(e) => setReveal(e.target.checked)} /> Tout révéler</label>
        </div>
      </div>
      <div className="grim-list">
        {RECS.map((r) =>
          found.has(r.i) || reveal ? (
            <RecipeCard key={r.i} r={r} />
          ) : (
            <div key={r.i} className="recipe lock">
              <div className="eq">
                <Chip id={r.ins[0]} />
                {r.ins.slice(1).map((_, k) => <span key={k} style={{ display: "contents" }}><span className="op">+</span><span className="q">?</span></span>)}
                <span className="op">→</span><span className="q">?</span>
              </div>
            </div>
          ),
        )}
      </div>
    </>
  );
}

export function Traditions() {
  return (
    <section className="lower" id="traditions">
      <div className="motto">Quod est inferius est sicut quod est superius <span>— ce qui est en bas est comme ce qui est en haut</span></div>
      <h2 className="big">Les traditions</h2>
      <p className="sec-sub">Avant les atomes, on expliquait le monde avec quelques « éléments ». Clique n'importe lequel : il s'ouvre dans le graphe là-haut.</p>
      <div className="greek">
        {GREEK.map(([id, c, sci]) => {
          const m = IT[id];
          return (
            <button key={id} className="gcard" style={cssVars({ "--c": c })} onClick={() => openScroll(id)}>
              <Sym kind={m.sym} c={c} />
              <div className="q">{m.qual}</div>
              <h4>{m.n.replace(" (Quintessence)", "")}</h4>
              <div className="sci"><b>En vrai :</b> {sci}</div>
            </button>
          );
        })}
      </div>

      <div className="duo">
        <div>
          <h3 className="sec">Le carré d'Aristote</h3>
          <p className="sec-sub">Chaque élément combine deux qualités. Change une qualité et l'élément devient son voisin : l'eau (froide & humide) chauffée devient chaude & humide… comme l'air. C'est la vapeur !</p>
          <div><Aristote /></div>
        </div>
        <div>
          <h3 className="sec">Le Wu Xing chinois</h3>
          <p className="sec-sub">Cinq phases qui s'engendrent (flèches pleines) et se dominent (pointillés).</p>
          <div><WuXing /></div>
          <div className="wx-list">
            <div className="it"><b style={{ color: "#e9b949" }}>⟳ Engendrement</b><p>Le Bois nourrit le Feu · le Feu donne la Terre (cendres) · la Terre porte le Métal (minerais) · le Métal recueille l'Eau (rosée) · l'Eau nourrit le Bois.</p></div>
            <div className="it"><b style={{ color: "#a58cf0" }}>✦ Domination</b><p>Le Bois perce la Terre · la Terre endigue l'Eau · l'Eau éteint le Feu · le Feu fond le Métal · le Métal coupe le Bois.</p></div>
          </div>
        </div>
      </div>

      <h3 className="sec">Les 7 métaux planétaires</h3>
      <div className="planets">
        {Object.entries(ALCHIMIE).map(([s, a]) => (
          <button key={s} className="planet" style={cssVars({ "--c": elColor(s) })} onClick={() => openScroll(s)}>
            <div className="sy">{a.sym}</div><b>{EL[s].n}</b><small>{a.astre}</small>
          </button>
        ))}
      </div>
      <h3 className="sec">Les trois principes de Paracelse</h3>
      <p className="sec-sub">Brûle un morceau de bois : la flamme serait le Soufre, les vapeurs le Mercure, les cendres le Sel.</p>
      <div className="tria">
        {TRIA.map(([id, n, sub, d, sci]) => (
          <button key={id} className="gcard" style={cssVars({ "--c": info(id).c })} onClick={() => openScroll(id)}>
            <div style={{ marginBottom: 10 }}><Orb id={id} size="md" /></div>
            <h4>{n} <small>— {sub}</small></h4>
            <p>{d}</p>
            <div className="sci"><b>En vrai :</b> {sci}</div>
          </button>
        ))}
      </div>

      <Grimoire />
    </section>
  );
}
