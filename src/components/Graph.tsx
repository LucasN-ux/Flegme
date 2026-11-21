/* Graphe radial : la matière au centre, ses composants en bulles, ses atomes sur l'anneau */
import { Fragment } from "react";
import { info, IT, EL, atoms, sorted, pct, elColor, isEl, kidsOf, formulaParts, type KidMode } from "../lib/chem";
import { useAtlas } from "../store/atlas";
import { cssVars } from "./ui";

const H = 680, CX = 410, CY = 338;

function NodeShape({ id, r, big }: { id: string; r: number; big?: boolean }) {
  const i = info(id);
  if (i.kind === "el") {
    return (
      <>
        <rect x={-r} y={-r} width={2 * r} height={2 * r} rx={r * 0.22} fill={`url(#gEl-${id})`} stroke={i.c} strokeWidth={big ? 2 : 1.5} />
        <text y={r * 0.18} textAnchor="middle" fontFamily="Archivo" fontWeight="800" fontSize={r * 0.72} fill="#0b0b0b">{i.icon}</text>
      </>
    );
  }
  return (
    <>
      <circle r={r} fill={`url(#gM-${id})`} stroke={i.c} strokeWidth={big ? 2 : 1.5} />
      <text y={r * 0.33} textAnchor="middle" fontSize={r * 0.95}>{i.icon}</text>
    </>
  );
}

function Gradients({ ids }: { ids: string[] }) {
  return (
    <>
      {ids.map((id) => {
        const i = info(id);
        if (i.kind === "el")
          return (
            <linearGradient key={id} id={`gEl-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={i.c} /><stop offset="1" stopColor={i.c} stopOpacity=".72" />
            </linearGradient>
          );
        return (
          <radialGradient key={id} id={`gM-${id}`} cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor={i.c} stopOpacity=".55" />
            <stop offset=".7" stopColor={i.c} stopOpacity=".12" />
            <stop offset="1" stopColor="#050505" stopOpacity=".9" />
          </radialGradient>
        );
      })}
    </>
  );
}

function wrapName(name: string, max = 14): string[] {
  const lines = [""];
  name.split(" ").forEach((w) => {
    const last = lines[lines.length - 1];
    if ((last + " " + w).trim().length > max && last) lines.push(w);
    else lines[lines.length - 1] = (last + " " + w).trim();
  });
  return lines.slice(0, 2);
}

const LEGEND: Record<Exclude<KidMode, "none">, React.ReactNode> = {
  mix: <>Chaque bulle = un ingrédient de la matière · taille = part de la masse · <b>clique une bulle</b> pour l'ouvrir · l'anneau = les atomes au final</>,
  mol: "Une molécule : chaque bulle = un type d'atome, avec leur nombre · l'anneau = la part de chaque atome dans la masse",
  el: "Un atome : les bulles montrent les matières où on le trouve le plus (part de leur masse)",
  see: "Clique un des 7 métaux des alchimistes",
};

export function Graph() {
  const cur = useAtlas((s) => s.cur);
  const tick = useAtlas((s) => s.focusTick);
  const focus = useAtlas((s) => s.focus);

  const ci = info(cur);
  const K = kidsOf(cur);
  let list = K.list;
  let rest = 0;
  if (list.length > 12) {
    rest = list.slice(12).reduce((s, k) => s + (k.frac || 0), 0);
    list = list.slice(0, 12);
  }
  const n = list.length;
  const R1 = K.mode === "el" ? (n >= 8 ? 232 : 210) : 190;
  const Rc = 64;
  const maxR = n ? Math.min(62, ((Math.PI * R1) / n) * 0.62) : 60;
  const ids = [...new Set([cur, ...list.map((k) => k.id)])];

  // anneau extérieur : atomes
  const at = sorted(atoms(cur));
  const RR = 300, C = 2 * Math.PI * RR;
  let off = 0;
  const ring = at.map(([s, v]) => {
    const len = v * C;
    const mid = ((off + len / 2) / C) * 2 * Math.PI - Math.PI / 2;
    const seg = { s, v, len, mid, off };
    off += len;
    return seg;
  });

  const m = IT[cur];
  const legend = K.mode === "none" ? (m?.x ?? "") : LEGEND[K.mode];

  return (
    <>
      <div className="graph-wrap">
        <div className="g-title">
          <b>{ci.name}</b>
          <span style={{ color: ci.c }}>{ci.catName}</span>
          {m?.f && (
            <span className="mono f">
              {formulaParts(m.f).map((p, k) => (p.sub ? <sub key={k}>{p.t}</sub> : <Fragment key={k}>{p.t}</Fragment>))}
            </span>
          )}
        </div>
        <svg id="graph" viewBox="0 0 820 680" key={tick}>
          <defs>
            <Gradients ids={ids} />
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
          </defs>

          {at.length > 0 && K.mode !== "el" && (
            <>
              <circle cx={CX} cy={CY} r={RR} fill="none" stroke="#1d1c1a" strokeWidth="16" />
              {ring.map(({ s, v, len, mid, off }) => {
                const lx = CX + (RR + 24) * Math.cos(mid), ly = CY + (RR + 24) * Math.sin(mid);
                const anc = Math.cos(mid) > 0.35 ? "start" : Math.cos(mid) < -0.35 ? "end" : "middle";
                return (
                  <Fragment key={s}>
                    <circle
                      className="ringseg" data-tip={`${EL[s].n} — ${pct(v)} de la masse`}
                      cx={CX} cy={CY} r={RR} fill="none" stroke={elColor(s)} strokeWidth="16"
                      strokeDasharray={`${Math.max(len - 2, 0.6)} ${C}`} strokeDashoffset={-off}
                      transform={`rotate(-90 ${CX} ${CY})`} onClick={() => focus(s)}
                    />
                    {v >= 0.025 && (
                      <text className="ringlab" x={lx} y={ly + 5} textAnchor={anc} fill={elColor(s)} onClick={() => focus(s)}>
                        {s} <tspan fill="#9a9388" fontSize="13">{pct(v)}</tspan>
                      </text>
                    )}
                  </Fragment>
                );
              })}
            </>
          )}
          {K.mode === "el" && <circle cx={CX} cy={CY} r={RR} fill="none" stroke={ci.c} strokeOpacity=".25" strokeWidth="1" strokeDasharray="2 6" />}

          {list.map((k, idx) => {
            const ang = -Math.PI / 2 + (idx * 2 * Math.PI) / Math.max(n, 1) + (n === 2 ? Math.PI / 2 : 0);
            const r = k.frac == null ? 40 : Math.max(22, Math.min(maxR, 20 + 52 * Math.sqrt(k.frac)));
            const x = CX + R1 * Math.cos(ang), y = CY + R1 * Math.sin(ang);
            const ki = info(k.id);
            const col = ki.c;
            const x1 = CX + Rc * Math.cos(ang), y1 = CY + Rc * Math.sin(ang);
            const x2 = x - r * Math.cos(ang), y2 = y - r * Math.sin(ang);
            const w = k.frac == null ? 1.5 : 1 + 7 * k.frac;
            const mx = x1 + (x2 - x1) * 0.42, my = y1 + (y2 - y1) * 0.42;
            const lines = wrapName(ki.name.replace(/\s*\(.*?\)/g, ""));
            const sub = k.count != null
              ? `× ${Number.isInteger(k.count) ? k.count : "≈" + String(Math.round(k.count * 10) / 10).replace(".", ",")} atome${k.count > 1 ? "s" : ""}`
              : "";
            const tipTxt = K.mode === "el" ? `${ki.name} — ${ci.name} = ${pct(k.frac ?? 0)} de sa masse`
              : K.mode === "mol" ? `${ki.name} — ${k.count} atome(s), ${pct(k.frac ?? 0)} de la masse`
              : k.frac != null ? `${ki.name} — ${pct(k.frac)} de la masse` : ki.name;
            const labels: [string, string][] = [...lines.map((l) => [l, "nlab"] as [string, string]), ...(sub ? [[sub, "nsub"] as [string, string]] : [])];
            const up = Math.sin(ang) < -0.3;
            return (
              <Fragment key={k.id}>
                <line className="link" x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={w} strokeOpacity=".55" style={{ animationDelay: `${idx * 40}ms` }} />
                <line className="flow" x1={x2} y1={y2} x2={x1} y2={y1} stroke={col} strokeWidth={Math.max(1.2, w * 0.5)} />
                {k.frac != null && (
                  <g className="plab" style={{ animationDelay: `${200 + idx * 40}ms` }}>
                    <rect x={mx - 26} y={my - 11} width="52" height="21" rx="10" fill="#0a0a0a" stroke={col} strokeOpacity=".5" />
                    <text x={mx} y={my + 4} textAnchor="middle">{pct(k.frac)}</text>
                  </g>
                )}
                <g
                  className="sat" data-tip={tipTxt}
                  style={{ ...cssVars({ "--tx": `${x - CX}px`, "--ty": `${y - CY}px` }), animationDelay: `${idx * 45}ms` }}
                  onClick={() => focus(k.id, { child: true })}
                >
                  <g transform={`translate(${CX} ${CY})`}>
                    <circle r={r + 10} fill={col} opacity=".18" filter="url(#glow)" />
                    <NodeShape id={k.id} r={r} />
                    {labels.map(([l, c], li) => (
                      <text key={li} className={c} y={up ? -r - 10 - (labels.length - 1 - li) * 17 : r + 19 + li * 17} textAnchor="middle">{l}</text>
                    ))}
                    {!isEl(k.id) && kidsOf(k.id).list.length > 0 && (
                      <g className="more" transform={`translate(${r * 0.72} ${-r * 0.72})`}>
                        <circle r="9" fill="#0a0a0a" stroke={col} />
                        <text y="4" textAnchor="middle">+</text>
                      </g>
                    )}
                  </g>
                </g>
              </Fragment>
            );
          })}
          {rest > 0.0005 && <text x={CX} y={H - 12} textAnchor="middle" className="nsub">+ autres composants : {pct(rest)}</text>}

          <g className="center" data-tip={ci.name}>
            <circle cx={CX} cy={CY} r={Rc + 22} fill={ci.c} opacity=".22" filter="url(#glow)" />
            <circle cx={CX} cy={CY} r={Rc + 8} fill="none" stroke={ci.c} strokeOpacity=".35" strokeDasharray="3 5" className="spin" />
            <g transform={`translate(${CX} ${CY})`}><NodeShape id={cur} r={Rc} big /></g>
          </g>
          {!n && (
            <text x={CX} y={CY - Rc - 30} textAnchor="middle" className="nsub" fontSize="14">✦ {m?.x ? "Indivisible" : "—"}</text>
          )}
        </svg>
      </div>
      <div className="graph-leg">{legend}</div>
    </>
  );
}
