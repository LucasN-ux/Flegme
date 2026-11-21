/* ============================================================
   Logique pure du laboratoire moléculaire
   ============================================================ */
import { SPECIES_RAW, PROTOCOLS, STATE, SOLUBLE, ACIDS, BASES, BORING, KNOWN } from "../data/lab";
import type { KnownRecipe } from "../data/types";
import type { Counts } from "./chem";

/* ---------- parseur de structures (SMILES simplifié) ---------- */
interface SmiAtom { el: string; q: number; h: number; br: boolean; comp: number }
/** [atome i, atome j, ordre] — ordre 0 = attraction ionique */
export type Bond = [number, number, number];

const VAL: Record<string, number[]> = { C: [4], N: [3, 5], O: [2], S: [2, 4, 6], P: [3, 5], F: [1], Cl: [1], B: [3] };

function parseSmi(s: string): { atoms: SmiAtom[]; bonds: Bond[] } {
  const atoms: SmiAtom[] = [];
  const bonds: Bond[] = [];
  let prev: number | null = null;
  let order = 1;
  let comp = 0;
  const stack: (number | null)[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === ".") { prev = null; comp++; i++; continue; }
    if (ch === "(") { stack.push(prev); i++; continue; }
    if (ch === ")") { prev = stack.pop() ?? null; i++; continue; }
    if (ch === "=") { order = 2; i++; continue; }
    if (ch === "#") { order = 3; i++; continue; }
    if (ch === "-") { order = 1; i++; continue; }
    let a: SmiAtom;
    if (ch === "[") {
      const j = s.indexOf("]", i);
      const t = s.slice(i + 1, j);
      i = j + 1;
      const m = t.match(/^([A-Z][a-z]?)(H(\d*))?([+-]\d*)?$/)!;
      const el = m[1];
      const h = m[2] ? (m[3] ? +m[3] : 1) : 0;
      let q = 0;
      if (m[4]) q = (m[4][0] === "+" ? 1 : -1) * (m[4].length > 1 ? +m[4].slice(1) : 1);
      a = { el, q, h, br: true, comp };
    } else {
      const two = s.slice(i, i + 2);
      const el = two === "Cl" || two === "Br" ? two : ch;
      i += el.length;
      a = { el, q: 0, h: 0, br: false, comp };
    }
    atoms.push(a);
    const idx = atoms.length - 1;
    if (prev != null) bonds.push([prev, idx, order]);
    prev = idx;
    order = 1;
  }
  // hydrogènes implicites
  atoms.forEach((a, k) => {
    if (a.br) return;
    const sum = bonds.filter((b) => b[0] === k || b[1] === k).reduce((x, b) => x + b[2], 0);
    const v = (VAL[a.el] || [0]).find((x) => x >= sum);
    a.h = v != null ? v - sum : 0;
  });
  const n = atoms.length;
  for (let k = 0; k < n; k++) {
    for (let t = 0; t < atoms[k].h; t++) {
      atoms.push({ el: "H", q: 0, h: 0, br: true, comp: atoms[k].comp });
      bonds.push([k, atoms.length - 1, 1]);
    }
  }
  return { atoms, bonds };
}

/* ---------- mise en page 2D ---------- */
export const ARAD = (el: string): number =>
  el === "H" ? 13 : ["Na", "K", "Ca", "Mg", "Al", "Fe", "Cu", "Zn"].includes(el) ? 25 : ["S", "P", "Cl", "Si"].includes(el) ? 22 : 19;

type Pos = Record<number, [number, number]>;

function layoutComp(atoms: SmiAtom[], bonds: Bond[], ids: number[]): Pos {
  const pos: Pos = {};
  if (ids.length === 1) { pos[ids[0]] = [0, 0]; return pos; }
  const nb: Record<number, [number, number][]> = {};
  ids.forEach((i) => (nb[i] = []));
  bonds.forEach(([a, b, o]) => { if (nb[a] && nb[b]) { nb[a].push([b, o]); nb[b].push([a, o]); } });
  const heavyDeg = (i: number) => nb[i].filter(([j]) => atoms[j].el !== "H").length;
  const isHeavy = (i: number) => (atoms[i].el !== "H" ? 1 : 0);
  const root = ids.slice().sort((x, y) => isHeavy(y) - isHeavy(x) || heavyDeg(y) - heavyDeg(x) || nb[y].length - nb[x].length)[0];
  const lp = (i: number) => {
    const a = atoms[i], d = nb[i].length, s = nb[i].reduce((x, [, o]) => x + o, 0);
    if ((a.el === "O" || a.el === "S") && d === 2 && s === 2 && a.q === 0) return 1;
    if (a.el === "N" && d === 2 && s === 3) return 1;
    return 0;
  };
  const L = (i: number, j: number) => (atoms[i].el === "H" || atoms[j].el === "H" ? 44 : 58);
  pos[root] = [0, 0];
  const q: [number, number | null][] = [[root, null]];
  const seen = new Set([root]);
  while (q.length) {
    const [i, par] = q.shift()!;
    const kids = nb[i].filter(([j]) => !seen.has(j));
    const d = nb[i].length, slots = d + lp(i);
    let angs: number[] = [];
    if (par == null) {
      if (lp(i)) angs = kids.map((_, k) => -Math.PI / 2 + ((k + 1) * 2 * Math.PI) / slots);
      else { const st = d === 2 ? 0 : -Math.PI / 2; angs = kids.map((_, k) => st + (k * 2 * Math.PI) / d); }
    } else {
      const back = Math.atan2(pos[par][1] - pos[i][1], pos[par][0] - pos[i][0]);
      angs = kids.map((_, k) => back + ((k + 1) * 2 * Math.PI) / slots);
    }
    // les H en dernier pour que les atomes lourds prennent les meilleures places
    kids.sort((x, y) => (atoms[x[0]].el === "H" ? 1 : 0) - (atoms[y[0]].el === "H" ? 1 : 0));
    kids.forEach(([j], k) => {
      seen.add(j);
      pos[j] = [pos[i][0] + L(i, j) * Math.cos(angs[k]), pos[i][1] + L(i, j) * Math.sin(angs[k])];
      q.push([j, i]);
    });
  }
  // petite relaxation anti-chevauchement
  for (let it = 0; it < 40; it++) {
    ids.forEach((a) => ids.forEach((b) => {
      if (a >= b) return;
      if (nb[a].some(([j]) => j === b)) return;
      const dx = pos[b][0] - pos[a][0], dy = pos[b][1] - pos[a][1];
      const dist = Math.hypot(dx, dy) || 0.01;
      const min = ARAD(atoms[a].el) + ARAD(atoms[b].el) + 8;
      if (dist < min) {
        const f = (min - dist) / 2 / dist;
        if (a !== root) { pos[a][0] -= dx * f; pos[a][1] -= dy * f; }
        if (b !== root) { pos[b][0] += dx * f; pos[b][1] += dy * f; }
      }
    }));
  }
  return pos;
}

export interface LayoutAtom { el: string; q: number; x: number; y: number }
export interface Layout { atoms: LayoutAtom[]; bonds: Bond[]; w: number; h: number }

interface Box { ids: number[]; p: Pos; r: number }

function layoutSpecies(smi: string): Layout {
  const { atoms, bonds } = parseSmi(smi);
  const comps: Record<number, number[]> = {};
  atoms.forEach((a, k) => (comps[a.comp] = comps[a.comp] || []).push(k));
  const cl = Object.values(comps);
  const P: Pos = {};
  const boxes: Box[] = cl.map((ids) => {
    const p = layoutComp(atoms, bonds, ids);
    let cx = 0, cy = 0;
    ids.forEach((i) => { cx += p[i][0]; cy += p[i][1]; });
    cx /= ids.length; cy /= ids.length;
    let r = 0;
    ids.forEach((i) => { p[i][0] -= cx; p[i][1] -= cy; r = Math.max(r, Math.hypot(p[i][0], p[i][1]) + ARAD(atoms[i].el)); });
    return { ids, p, r };
  });
  const ionic: [Box, Box][] = [];
  if (cl.length === 1) boxes[0].ids.forEach((i) => (P[i] = boxes[0].p[i]));
  else {
    // cations au centre, anions autour
    const charge = (b: Box) => b.ids.reduce((s, i) => s + atoms[i].q, 0);
    const cat = boxes.filter((b) => charge(b) > 0), an = boxes.filter((b) => charge(b) <= 0);
    const place = (b: Box, x: number, y: number) => b.ids.forEach((i) => (P[i] = [b.p[i][0] + x, b.p[i][1] + y]));
    if (cat.length === 1) {
      place(cat[0], 0, 0);
      const R = cat[0].r + Math.max(...an.map((b) => b.r)) + 14;
      an.forEach((b, k) => {
        const a = an.length === 1 ? 0 : -Math.PI / 2 + (k * 2 * Math.PI) / an.length + (an.length === 2 ? Math.PI / 2 : 0);
        place(b, R * Math.cos(a), R * Math.sin(a));
      });
      an.forEach((b) => ionic.push([cat[0], b]));
    } else {
      const all = [...cat, ...an];
      const R = Math.max(...all.map((b) => b.r)) * 1.9;
      // alterner cations et anions sur un cercle
      const order: Box[] = [];
      const c2 = [...cat], a2 = [...an];
      while (c2.length || a2.length) { if (c2.length) order.push(c2.shift()!); if (a2.length) order.push(a2.shift()!); }
      order.forEach((b, k) => { const a = -Math.PI / 2 + (k * 2 * Math.PI) / order.length; place(b, R * Math.cos(a), R * Math.sin(a)); });
      order.forEach((b, k) => { const nx = order[(k + 1) % order.length]; if (b !== nx) ionic.push([b, nx]); });
    }
  }
  const ib: Bond[] = ionic.map(([a, b]) => {
    // relier les deux atomes les plus proches
    let best: [number, number] = [a.ids[0], b.ids[0]];
    let bd = 1e9;
    a.ids.forEach((i) => b.ids.forEach((j) => {
      const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]);
      if (d < bd) { bd = d; best = [i, j]; }
    }));
    return [best[0], best[1], 0];
  });
  let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
  atoms.forEach((a, k) => {
    const r = ARAD(a.el);
    minx = Math.min(minx, P[k][0] - r); maxx = Math.max(maxx, P[k][0] + r);
    miny = Math.min(miny, P[k][1] - r); maxy = Math.max(maxy, P[k][1] + r);
  });
  return {
    atoms: atoms.map((a, k) => ({ el: a.el, q: a.q, x: P[k][0] - minx, y: P[k][1] - miny })),
    bonds: [...bonds, ...ib],
    w: maxx - minx,
    h: maxy - miny,
  };
}

/* ---------- espèces ---------- */
export interface Species {
  id: string;
  name: string;
  form: string;
  smi: string;
  dh: number;
  grp: string;
  desc: string;
  atlas: string | null;
  L: Layout;
  comp: Counts;
  key: string;
  size: number;
}
export function compKey(c: Counts): string {
  return Object.keys(c).filter((k) => c[k] > 0).sort().map((k) => k + c[k]).join("");
}
export const SPC: Record<string, Species> = {};
export const SPLIST: Species[] = [];
SPECIES_RAW.forEach(([id, name, form, smi, dh, grp, desc, atlas]) => {
  const L = layoutSpecies(smi);
  const comp: Counts = {};
  L.atoms.forEach((a) => (comp[a.el] = (comp[a.el] || 0) + 1));
  const s: Species = { id, name, form, smi, dh, grp, desc, atlas, L, comp, key: compKey(comp), size: L.atoms.length };
  SPC[id] = s;
  SPLIST.push(s);
});
const BYCOMP: Record<string, Species[]> = {};
SPLIST.forEach((s) => (BYCOMP[s.key] = BYCOMP[s.key] || []).push(s));
export const LAB_BY_ATLAS: Record<string, string> = {};
SPLIST.forEach((s) => { if (s.atlas && s.grp !== "atome" && !LAB_BY_ATLAS[s.atlas]) LAB_BY_ATLAS[s.atlas] = s.id; });
LAB_BY_ATLAS.eau = "h2o";
LAB_BY_ATLAS.vapeur = "h2o";
LAB_BY_ATLAS.glace = "h2o";

/* ---------- chimie : combinaison la plus stable ---------- */
export interface Split { e: number; list: string[] }
const bestMemo = new Map<string, Split>();
export function bestSplit(comp: Counts): Split {
  const key = compKey(comp);
  if (!key) return { e: 0, list: [] };
  const hit = bestMemo.get(key);
  if (hit) return hit;
  const pivot = Object.keys(comp).filter((k) => comp[k] > 0).sort()[0];
  let best: Split | null = null;
  for (const s of SPLIST) {
    if (!s.comp[pivot]) continue;
    let ok = true;
    for (const el in s.comp) if ((comp[el] || 0) < s.comp[el]) { ok = false; break; }
    if (!ok) continue;
    const rest = { ...comp };
    for (const el in s.comp) rest[el] -= s.comp[el];
    const r = bestSplit(rest);
    const e = s.dh + r.e, n = r.list.length + 1;
    if (!best || e < best.e - 0.01 || (Math.abs(e - best.e) < 0.01 && n < best.list.length)) best = { e, list: [s.id, ...r.list] };
  }
  if (!best) best = { e: 1e9, list: [] };
  bestMemo.set(key, best);
  return best;
}
export function exactSpecies(comp: Counts): string | null {
  const l = BYCOMP[compKey(comp)];
  return l ? l[0].id : null;
}
export function addComp(a: Counts, b: Counts): Counts {
  const r = { ...a };
  for (const k in b) r[k] = (r[k] || 0) + b[k];
  return r;
}
const compOf = (list: string[]): Counts => {
  const c: Counts = {};
  list.forEach((id) => { for (const el in SPC[id].comp) c[el] = (c[el] || 0) + SPC[id].comp[el]; });
  return c;
};

/** Regroupe une liste d'espèces : [[id, nombre], …] dans l'ordre d'apparition. */
export function groupList(list: string[]): [string, number][] {
  const c: Record<string, number> = {};
  const order: string[] = [];
  list.forEach((x) => { if (!c[x]) order.push(x); c[x] = (c[x] || 0) + 1; });
  return order.map((x) => [x, c[x]]);
}

/* ---------- Mode opératoire ---------- */
export interface ProtocolOut { c: string[]; steps: string[]; tip?: string; warn?: string; sep?: string; main: string }

function genericProtocol(react: string[]): Omit<ProtocolOut, "main"> {
  const R = new Set(react);
  const acid = react.find((x) => ACIDS.includes(x)), base = react.find((x) => BASES.includes(x));
  if (acid && base)
    return {
      c: ["eau", "melanger"],
      steps: [
        `Neutralisation : verser doucement l'acide (${SPC[acid].name.toLowerCase()}) dans la base (${SPC[base].name.toLowerCase()}) dissoute dans l'eau, en mélangeant.`,
        "Ça chauffe un peu. On vérifie avec du papier pH qu'on arrive à 7 (neutre).",
      ],
      warn: "Lunettes et gants : acides et bases concentrés brûlent.",
    };
  if (R.has("o2") && react.some((x) => SPC[x].grp === "elem"))
    return { c: ["feu", "air"], steps: ["Chauffer le métal (ou l'élément) à l'air ou dans l'oxygène : il s'oxyde.", "Certains métaux s'oxydent aussi tout seuls, lentement, à l'air humide."] };
  if (R.has("o2")) return { c: ["etincelle", "air"], steps: ["Une combustion : il faut allumer avec une flamme ou une étincelle, ensuite la chaleur dégagée entretient la réaction."] };
  if (react.some((x) => SPC[x].grp === "atome"))
    return { c: ["danger"], steps: ["Les atomes isolés (radicaux) n'existent quasiment pas tels quels : ils réagissent en une fraction de seconde avec le premier atome venu.", "En labo, on les crée avec de l'énergie (lumière UV, décharge électrique, très haute température)."] };
  if (react.some((x) => SPC[x].grp === "elem"))
    return { c: ["feu"], steps: ["Mettre les éléments en contact et chauffer pour démarrer la réaction ; beaucoup de réactions entre éléments purs dégagent ensuite beaucoup de chaleur."] };
  return { c: ["melanger", "feu"], steps: ["Mélanger les réactifs ; s'il ne se passe rien, chauffer doucement pour donner l'énergie de démarrage (l'« énergie d'activation »).", "Certaines réactions ont besoin d'un catalyseur pour aller assez vite."] };
}

function separation(prod: string[], main: string): { txt: string; c: string[] } | null {
  if (!main) return null;
  const S = SPC[main], st = STATE[main] || "s", others = prod.filter((x) => x !== main);
  const gasOthers = [...new Set(others.filter((x) => (STATE[x] || "s") === "g"))].map((x) => SPC[x].form);
  const water = prod.includes("h2o");
  let txt = "";
  let c: string[] = [];
  if (st === "g") {
    txt = `${S.name} est un gaz : on le recueille dans un flacon retourné sur l'eau ou dans un ballon${["cl2", "co", "no2", "h2s", "so2", "hcl", "hf"].includes(main) ? " — ou plutôt on ventile, il est toxique" : ""}.`;
    c = ["gaz"];
  } else if (st === "l" && water && main !== "h2o") {
    txt = `Pour séparer ${S.name.toLowerCase()} de l'eau : distillation (on chauffe, les liquides s'évaporent à des températures différentes, on recondense la vapeur dans un tube froid).`;
    c = ["distil"];
  } else if (SOLUBLE.has(main) && water) {
    txt = `${S.name} reste dissous dans l'eau : on fait évaporer l'eau (chauffer, ou laisser au soleil) et les cristaux apparaissent.`;
    c = ["evap"];
  } else if (st === "s" && (water || others.some((x) => (STATE[x] || "s") === "l"))) {
    txt = `${S.name} est un solide qui ne se dissout pas : on filtre, on rince, on sèche.`;
    c = ["filtre"];
  } else if (st === "s") {
    txt = `${S.name} est un solide : il reste au fond, il suffit de le récupérer.`;
  }
  if (gasOthers.length) txt += ` ${gasOthers.join(", ")} s'échappe${gasOthers.length > 1 ? "nt" : ""} tout seul${gasOthers.length > 1 ? "s" : ""} sous forme de gaz.`;
  return txt ? { txt, c } : null;
}

export function protocolFor(react: string[], prod: string[]): ProtocolOut {
  let best: (typeof PROTOCOLS)[number] | null = null;
  let score = -1;
  PROTOCOLS.forEach((P) => {
    const okR = P.r.every((x) => react.filter((y) => y === x).length >= P.r.filter((y) => y === x).length);
    const okP = P.p.every((x) => prod.includes(x));
    if (okR && okP) { const s = P.r.length + P.p.length; if (s > score) { score = s; best = P; } }
  });
  const main = prod.filter((x) => !BORING.includes(x)).sort((a, b) => SPC[b].size - SPC[a].size)[0] || prod[0];
  const b = best as (typeof PROTOCOLS)[number] | null;
  const out: Omit<ProtocolOut, "main"> = b ? { c: [...b.c], steps: [...b.steps], tip: b.tip, warn: b.warn } : genericProtocol(react);
  // séparation du produit principal
  const sep = separation(prod, main);
  if (sep && !(b && b.steps.some((s) => /récupér|filtr|évapor|distill|liquéfi/i.test(s)))) {
    out.sep = sep.txt;
    sep.c.forEach((c) => { if (!out.c.includes(c)) out.c.push(c); });
  }
  return { ...out, main };
}

/* ---------- Recettes connues (réelles) par molécule ---------- */
export interface Known extends KnownRecipe { i: number }
export const KNOWN_LIST: Known[] = KNOWN.map((k, i) => ({ ...k, i }));
export const KN_BY: Record<string, Known[]> = {};
KNOWN_LIST.forEach((k) => new Set([...(k.for || []), ...(k.r || [])]).forEach((id) => (KN_BY[id] = KN_BY[id] || []).push(k)));

export const msEq = (a: string[], b: string[]): boolean => [...a].sort().join() === [...b].sort().join();

/** Produits obtenus dans ce labo pour une recette connue (si elle a des réactifs). */
export function knownWorks(k: KnownRecipe): string[] | null {
  if (!k.r) return null;
  const b = bestSplit(compOf(k.r));
  return msEq(b.list, k.r) ? null : b.list;
}

export interface AutoReaction { r: string[]; p: string[]; dh: number }
const PARTNERS = ["o2", "h2o", "h2", "co2", "hcl", "naoh", "nh3", "cao", "Na", "C", "cl2", "so3", "caoh2", "nahco3", "co", "h2so4", "Fe", "Mg"];
export function autoReactions(sp: string): AutoReaction[] {
  const out: AutoReaction[] = [];
  PARTNERS.forEach((t) => {
    if (t === sp) return;
    const r = [sp, t];
    const b = bestSplit(compOf(r));
    if (!msEq(b.list, r)) out.push({ r, p: b.list, dh: b.e - SPC[sp].dh - SPC[t].dh });
  });
  return out.sort((a, b) => a.dh - b.dh);
}
