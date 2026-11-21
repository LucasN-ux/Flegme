import { create } from "zustand";
import { SPC, bestSplit, exactSpecies, type Bond } from "../lib/lab";
import type { Counts } from "../lib/chem";
import { toast } from "./ui";

export interface LabAtom { el: string; q: number; x: number; y: number; uid: string }
export interface Mol { sp: string; atoms: LabAtom[]; bonds: Bond[]; w: number; h: number; id: string }
export type LabEq = { same: true; react: string[] } | { same?: false; react: string[]; prod: string[]; dh: number };

let uidN = 0;
type Pool = Record<string, string[]>;

/** Crée une molécule ; réutilise les identifiants d'atomes du « pool » pour animer leur déplacement. */
function makeMol(sp: string, pool?: Pool): Mol {
  const S = SPC[sp];
  const atoms = S.L.atoms.map((a) => {
    let uid: string | undefined;
    if (pool && pool[a.el] && pool[a.el].length) uid = pool[a.el].shift();
    return { ...a, uid: uid ?? "a" + ++uidN };
  });
  return { sp, atoms, bonds: S.L.bonds, w: S.L.w, h: S.L.h, id: "m" + ++uidN };
}

export const labCompOf = (LM: Mol[]): Counts => {
  const c: Counts = {};
  LM.forEach((m) => m.atoms.forEach((a) => (c[a.el] = (c[a.el] || 0) + 1)));
  return c;
};

const countList = (l: string[]) => {
  const c: Record<string, number> = {};
  l.forEach((x) => (c[x] = (c[x] || 0) + 1));
  return JSON.stringify(Object.entries(c).sort());
};

interface LabState {
  LM: Mol[];
  sel: string | null;
  /** espèce affichée dans la fiche sans être dans le creuset (clic dans une équation) */
  peek: string | null;
  eq: LabEq | null;
  hist: Mol[][];
  justReacted: boolean;
  reactTick: number;

  add: (sp: string) => void;
  removeAtom: (uid: string) => void;
  removeEl: (el: string) => void;
  react: () => void;
  load: (list: string[]) => void;
  clear: () => void;
  undo: () => void;
  toggleMol: (id: string) => void;
  selectSpecies: (sp: string) => void;
}

const MAX_HIST = 40;
const withHist = (s: LabState) => [...s.hist, s.LM].slice(-MAX_HIST);

export const useLab = create<LabState>((set, get) => ({
  LM: ["h2", "h2", "o2"].map((sp) => makeMol(sp)),
  sel: null,
  peek: null,
  eq: null,
  hist: [],
  justReacted: false,
  reactTick: 0,

  add: (sp) => {
    const s = get();
    if (s.LM.reduce((n, m) => n + m.atoms.length, 0) > 90) {
      toast("Le creuset déborde !");
      return;
    }
    const nm = makeMol(sp);
    set({ hist: withHist(s), LM: [...s.LM, nm], sel: nm.id, peek: null, eq: null, justReacted: false });
  },

  removeAtom: (uid) => {
    const s = get();
    const m = s.LM.find((m) => m.atoms.some((a) => a.uid === uid));
    if (!m) return;
    const rest = m.atoms.filter((a) => a.uid !== uid);
    const pool: Pool = {};
    rest.forEach((a) => (pool[a.el] = pool[a.el] || []).push(a.uid));
    const comp: Counts = {};
    rest.forEach((a) => (comp[a.el] = (comp[a.el] || 0) + 1));
    const ex = exactSpecies(comp);
    const list = ex ? [ex] : bestSplit(comp).list;
    const LM = [...s.LM];
    LM.splice(LM.indexOf(m), 1, ...list.map((sp) => makeMol(sp, pool)));
    set({ hist: withHist(s), LM, peek: null, eq: null, justReacted: false });
  },

  removeEl: (el) => {
    const { LM, removeAtom } = get();
    for (let k = LM.length - 1; k >= 0; k--) {
      const a = LM[k].atoms.find((a) => a.el === el);
      if (a) { removeAtom(a.uid); return; }
    }
  },

  react: () => {
    const s = get();
    if (!s.LM.length) return;
    const b = bestSplit(labCompOf(s.LM));
    const before = s.LM.map((m) => m.sp);
    if (countList(before) === countList(b.list)) {
      set({ eq: { same: true, react: before }, peek: null });
      return;
    }
    const eBefore = before.reduce((n, x) => n + SPC[x].dh, 0);
    const pool: Pool = {};
    s.LM.forEach((m) => m.atoms.forEach((a) => (pool[a.el] = pool[a.el] || []).push(a.uid)));
    set({
      hist: withHist(s),
      LM: b.list.map((sp) => makeMol(sp, pool)),
      eq: { react: before, prod: b.list, dh: b.e - eBefore },
      justReacted: true,
      sel: null,
      peek: null,
      reactTick: s.reactTick + 1,
    });
  },

  load: (list) => {
    const s = get();
    set({ hist: withHist(s), LM: list.map((sp) => makeMol(sp)), eq: null, sel: null, peek: null, justReacted: false });
  },

  clear: () => {
    const s = get();
    set({ hist: withHist(s), LM: [], eq: null, sel: null, peek: null });
  },

  undo: () => {
    const { hist } = get();
    if (!hist.length) return;
    set({ LM: hist[hist.length - 1], hist: hist.slice(0, -1), eq: null, peek: null, justReacted: false });
  },

  toggleMol: (id) => set((s) => ({ sel: s.sel === id ? null : id, peek: null })),

  selectSpecies: (sp) => {
    const m = get().LM.find((m) => m.sp === sp);
    set(m ? { sel: m.id, peek: null } : { sel: null, peek: sp });
  },
}));

/** Charge une liste de réactifs puis déclenche la réaction (recettes « Essayer au labo »). */
export function labTry(list: string[]) {
  useLab.getState().load(list);
  setTimeout(() => useLab.getState().react(), 700);
}
