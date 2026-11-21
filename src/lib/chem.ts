/* ============================================================
   Logique pure de l'atlas : éléments, matières, atomes, recettes
   ============================================================ */
import { FAMILLES, ELEMENTS_RAW, MATIERES, CATS, RECETTES, RECETTE_THEMES } from "../data/atlas";
import type { Matiere } from "../data/types";

export type Counts = Record<string, number>;

/* ---------- Éléments ---------- */
export interface Element {
  z: number;
  s: string;
  n: string;
  m: number;
  cat: string;
  note: string;
  row: number;
  col: number;
  period: number;
  group: number | null;
  state: string;
  radio: boolean;
}

const GAZ = new Set(["H", "He", "N", "O", "F", "Ne", "Cl", "Ar", "Kr", "Xe", "Rn"]);
const LIQ = new Set(["Br", "Hg"]);

function position(z: number): { row: number; col: number } {
  if (z >= 57 && z <= 71) return { row: 9, col: z - 57 + 3 };
  if (z >= 89 && z <= 103) return { row: 10, col: z - 89 + 3 };
  if (z === 1) return { row: 1, col: 1 };
  if (z === 2) return { row: 1, col: 18 };
  if (z <= 10) { const o = z - 3; return { row: 2, col: o < 2 ? o + 1 : o + 11 }; }
  if (z <= 18) { const o = z - 11; return { row: 3, col: o < 2 ? o + 1 : o + 11 }; }
  if (z <= 36) return { row: 4, col: z - 18 };
  if (z <= 54) return { row: 5, col: z - 36 };
  if (z <= 86) { if (z <= 56) return { row: 6, col: z - 54 }; return { row: 6, col: z - 72 + 4 }; }
  if (z <= 88) return { row: 7, col: z - 86 };
  return { row: 7, col: z - 104 + 4 };
}

export const ELS: Element[] = ELEMENTS_RAW.trim().split("\n").map((l) => {
  const p = l.split("|");
  const z = +p[0];
  const pos = position(z);
  return {
    z, s: p[1], n: p[2], m: +p[3], cat: p[4], note: p.slice(5).join("|"),
    row: pos.row, col: pos.col,
    period: z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : z <= 36 ? 4 : z <= 54 ? 5 : z <= 86 ? 6 : 7,
    group: pos.row >= 9 ? null : pos.col,
    state: z >= 104 ? "inconnu" : GAZ.has(p[1]) ? "gaz" : LIQ.has(p[1]) ? "liquide" : "solide",
    radio: z === 43 || z === 61 || z >= 84,
  };
});
export const EL: Record<string, Element> = {};
ELS.forEach((e) => (EL[e.s] = e));

const CPK: Record<string, string> = {
  H: "#f4f4f4", C: "#8b919c", N: "#4f7dff", O: "#ff5a52", F: "#9be06a", Cl: "#46d483", Br: "#b23a3a", I: "#a24dbd", S: "#ffd447", P: "#ff9a2e",
  Na: "#b07cf2", K: "#9150d6", Mg: "#a6e85a", Ca: "#e6ddbd", Fe: "#e0763f", Si: "#e8c39c", Al: "#c7b3b3", Cu: "#d08a3c", Zn: "#8e91c4", Au: "#ffd23a",
  Ag: "#cfd3d8", Ti: "#bfc4cb", Cr: "#8ea0d4", Ni: "#69d169", Sn: "#7e9a9a", Pb: "#6b6e78", Hg: "#c3c3dc", Ar: "#80d1e3", He: "#d9ffff", Ne: "#b3e3f5",
  Mn: "#a487d2", Be: "#c6f25a", B: "#ffb5b5", Ce: "#f3f0b0", La: "#70d4ff", Nd: "#b7f0b7", Pr: "#d9f5b0", Co: "#6f8cff", Li: "#cc80ff", U: "#3faeff",
};
export const elColor = (s: string): string => CPK[s] || FAMILLES[EL[s].cat].c;

/* ---------- Matières ---------- */
export const IT: Record<string, Matiere> = {};
MATIERES.forEach((m) => (IT[m.id] = m));
export const isEl = (id: string): boolean => !!EL[id];
export const exists = (id: string): boolean => isEl(id) || !!IT[id];

export interface Info {
  id: string;
  name: string;
  kind: "el" | "mat";
  icon: string;
  c: string;
  catName: string;
}
export function info(id: string): Info {
  if (isEl(id)) {
    const e = EL[id];
    return { id, name: e.n, kind: "el", icon: e.s, c: elColor(id), catName: FAMILLES[e.cat].n };
  }
  const m = IT[id];
  return { id, name: m.n, kind: "mat", icon: m.e, c: CATS[m.cat].c, catName: CATS[m.cat].n };
}

/* ---------- Formules ---------- */
function num(s: string, i: number): { v: number; i: number } {
  const m = s.slice(i).match(/^\d+(\.\d+)?/);
  return m ? { v: +m[0], i: i + m[0].length } : { v: 1, i };
}
function group(s: string, i: number): { c: Counts; i: number } {
  const c: Counts = {};
  while (i < s.length) {
    const ch = s[i];
    if (ch === "(") {
      const r = group(s, i + 1);
      const n = num(s, r.i);
      i = n.i;
      for (const k in r.c) c[k] = (c[k] || 0) + r.c[k] * n.v;
    } else if (ch === ")") return { c, i: i + 1 };
    else {
      const m = s.slice(i).match(/^[A-Z][a-z]?/)!;
      i += m[0].length;
      const n = num(s, i);
      i = n.i;
      c[m[0]] = (c[m[0]] || 0) + n.v;
    }
  }
  return { c, i };
}
export function parseFormula(f: string): Counts {
  const out: Counts = {};
  f.split("·").forEach((part) => {
    let k = 1;
    const mm = part.match(/^(\d+(?:\.\d+)?)(?=[A-Z(])/);
    if (mm) { k = +mm[1]; part = part.slice(mm[1].length); }
    const r = group(part, 0);
    for (const s in r.c) out[s] = (out[s] || 0) + r.c[s] * k;
  });
  return out;
}

/** Découpe une formule en segments texte / indice, pour <sub>. */
export function formulaParts(f: string): { t: string; sub: boolean }[] {
  const out: { t: string; sub: boolean }[] = [];
  const re = /([A-Za-z)])(\d+(?:\.\d+)?)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(f))) {
    const head = f.slice(last, m.index + m[1].length);
    if (head) out.push({ t: head, sub: false });
    out.push({ t: m[2], sub: true });
    last = m.index + m[0].length;
  }
  if (last < f.length) out.push({ t: f.slice(last), sub: false });
  return out;
}

/* ---------- Atomes (fractions massiques) ---------- */
const memo: Record<string, Counts> = {};
export function atoms(id: string): Counts {
  if (isEl(id)) return { [id]: 1 };
  if (memo[id]) return memo[id];
  const m = IT[id];
  const r: Counts = {};
  if (m.f) {
    const a = parseFormula(m.f);
    let t = 0;
    for (const s in a) t += a[s] * EL[s].m;
    for (const s in a) r[s] = (a[s] * EL[s].m) / t;
  } else if (m.c) {
    const t = m.c.reduce((x, y) => x + y[1], 0);
    m.c.forEach(([cid, p]) => {
      const sub = atoms(cid);
      for (const s in sub) r[s] = (r[s] || 0) + (sub[s] * p) / t;
    });
  }
  return (memo[id] = r);
}
export const hasAtoms = (id: string): boolean => Object.keys(atoms(id)).length > 0;
export const sorted = (a: Counts): [string, number][] => Object.entries(a).sort((x, y) => y[1] - x[1]);
export function overlap(a: Counts, b: Counts): number {
  let s = 0;
  for (const k in a) if (b[k]) s += Math.min(a[k], b[k]);
  return s;
}
export function pct(v: number): string {
  const p = v * 100;
  if (p >= 99.95) return "100 %";
  if (p >= 10) return p.toFixed(0) + " %";
  if (p >= 0.1) return p.toFixed(1).replace(".", ",") + " %";
  return "<0,1 %";
}
export const norm = (s: string): string => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Pour chaque élément : matières où il est présent, triées par part massique. */
export const PRESENT: Record<string, [string, number][]> = {};
MATIERES.forEach((m) => {
  for (const [s, v] of Object.entries(atoms(m.id))) if (v >= 0.003) (PRESENT[s] = PRESENT[s] || []).push([m.id, v]);
});
for (const s in PRESENT) PRESENT[s].sort((a, b) => b[1] - a[1]);

/** Éléments présents dans au moins une matière (outil « recette atomique »). */
export const USED_ELS: Element[] = (() => {
  const used = new Set<string>();
  MATIERES.forEach((m) => Object.keys(atoms(m.id)).forEach((s) => used.add(s)));
  return ELS.filter((e) => used.has(e.s));
})();

/* ---------- Recettes du creuset ---------- */
export interface Rec {
  i: number;
  ins: string[];
  out: string;
  txt: string;
  by: string[];
  key: string;
  /** index du thème dans RECETTE_THEMES */
  theme: number;
}
export const keyOf = (arr: string[]): string => [...arr].sort().join("+");
const themeOf = (i: number): number => {
  let start = 0;
  for (let t = 0; t < RECETTE_THEMES.length; t++) {
    start += RECETTE_THEMES[t][2];
    if (i < start) return t;
  }
  return RECETTE_THEMES.length - 1;
};
export const RECS: Rec[] = RECETTES.map((r, i) => ({ i, ins: r[0], out: r[1], txt: r[2], by: r[3] || [], key: keyOf(r[0]), theme: themeOf(i) }));
export const BYKEY: Record<string, Rec> = {};
RECS.forEach((r) => { if (!BYKEY[r.key]) BYKEY[r.key] = r; });
export const USED: Record<string, Rec[]> = {};
export const MADE: Record<string, Rec[]> = {};
RECS.forEach((r) => {
  new Set(r.ins).forEach((id) => (USED[id] = USED[id] || []).push(r));
  (MADE[r.out] = MADE[r.out] || []).push(r);
});

export function msContains(big: string[], small: string[]): boolean {
  const c: Counts = {};
  big.forEach((x) => (c[x] = (c[x] || 0) + 1));
  for (const x of small) { if (!c[x]) return false; c[x]--; }
  return true;
}

/* ---------- Graphe : enfants d'un nœud ---------- */
export interface Kid { id: string; frac: number | null; count?: number }
export type KidMode = "el" | "mix" | "mol" | "see" | "none";
export function kidsOf(id: string): { mode: KidMode; list: Kid[] } {
  if (isEl(id)) {
    const pr = (PRESENT[id] || []).slice(0, 10);
    return { mode: "el", list: pr.map(([mid, v]) => ({ id: mid, frac: v })) };
  }
  const m = IT[id];
  if (m.c) {
    const t = m.c.reduce((s, x) => s + x[1], 0);
    return { mode: "mix", list: [...m.c].sort((x, y) => y[1] - x[1]).map(([cid, p]) => ({ id: cid, frac: p / t })) };
  }
  if (m.f) {
    const cnt = parseFormula(m.f);
    return { mode: "mol", list: sorted(atoms(id)).map(([s, v]) => ({ id: s, frac: v, count: cnt[s] })) };
  }
  if (m.see) return { mode: "see", list: m.see.map((s) => ({ id: s, frac: null })) };
  return { mode: "none", list: [] };
}

/** Matières aux atomes les plus proches. */
export function cousins(id: string, n = 8): [string, number][] {
  const a = atoms(id);
  if (!Object.keys(a).length) return [];
  return MATIERES.filter((m) => m.id !== id && hasAtoms(m.id))
    .map((m) => [m.id, overlap(a, atoms(m.id))] as [string, number])
    .filter((x) => x[1] >= 0.8)
    .sort((x, y) => y[1] - x[1])
    .slice(0, n);
}

/* ---------- Recherche ---------- */
export interface SearchEntry { id: string; t: string; sub: string }
export const SEARCH: SearchEntry[] = [
  ...ELS.map((e) => ({ id: e.s, t: norm(e.n + " " + e.s), sub: `Atome n°${e.z}` })),
  ...MATIERES.map((m) => ({ id: m.id, t: norm(m.n + " " + m.id + " " + (m.f || "")), sub: CATS[m.cat].n })),
];
export function search(qRaw: string): SearchEntry[] {
  const q = norm(qRaw.trim());
  if (!q) return [];
  return SEARCH.map((x) => {
    const i = x.t.indexOf(q);
    const ex = isEl(x.id) && x.id.toLowerCase() === q;
    return [x, ex ? -1 : i === 0 ? 0 : i > 0 ? 1 : 9] as [SearchEntry, number];
  })
    .filter((x) => x[1] < 9)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 12)
    .map((x) => x[0]);
}
