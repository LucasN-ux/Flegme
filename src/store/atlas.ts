import { create } from "zustand";
import {
  exists, RECS, BYKEY, keyOf, atoms, hasAtoms, overlap, info, type Counts,
} from "../lib/chem";
import { MATIERES } from "../data/atlas";
import { toast, scrollToEl } from "./ui";
import { navigate, href, getRoute, subscribe } from "../router";
import type { Rec } from "../lib/chem";

export type Banner =
  | { kind: "ok"; sel: string[]; out: string; isNew: boolean; txt: string; by: string[]; lvl: 1 | 2 | 3 }
  | { kind: "fail"; sel: string[]; near: [string, number][] };

export interface FocusOpts {
  child?: boolean;
  crumb?: number;
  back?: boolean;
  keepBanner?: boolean;
  scroll?: boolean;
  /** changement venu de l'URL (bouton retour…) : ne pas réécrire l'historique */
  fromUrl?: boolean;
}

const EMPTY_SLOTS: (string | null)[] = [null, null, null, null];
const pad = (ids: string[]) => [...ids, null, null, null, null].slice(0, 4);

const STORAGE_KEY = "atlas-decouvertes";
function loadFound(): Set<number> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}
function saveFound(found: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...found]));
  } catch {
    /* stockage indisponible : on garde en mémoire */
  }
}

interface AtlasState {
  cur: string;
  path: string[];
  banner: Banner | null;
  /** incrémenté à chaque focus : rejoue l'animation du graphe */
  focusTick: number;
  boilTick: number;
  pulseTick: number;

  slots: (string | null)[];
  found: Set<number>;
  /** recette affichée en fenêtre (lancée hors de l'atlas) */
  modal: { r: Rec; isNew: boolean } | null;

  focus: (id: string, opts?: FocusOpts) => void;
  goBack: () => void;
  closeBanner: () => void;

  addToCauldron: (id: string) => void;
  removeSlot: (k: number) => void;
  clearSlots: () => void;
  mix: () => void;
  tryRecipe: (i: number) => void;
  /** enregistre une recette réussie ; renvoie true si c'est une nouvelle découverte */
  transmute: (r: Rec) => boolean;
  closeModal: () => void;
  randomHint: () => void;
}

export const useAtlas = create<AtlasState>((set, get) => ({
  cur: "terre",
  path: ["terre"],
  banner: null,
  focusTick: 0,
  boilTick: 0,
  pulseTick: 0,
  slots: EMPTY_SLOTS,
  found: loadFound(),
  modal: null,

  focus: (id, opts = {}) => {
    if (!exists(id)) return;
    const { cur } = get();
    let path = get().path;
    if (opts.child && path[path.length - 1] === cur) path = [...path, id];
    else if (opts.crumb != null) path = path.slice(0, opts.crumb + 1);
    else if (opts.back) path = path.slice(0, -1);
    else path = [id];
    set((s) => ({ cur: id, path, banner: opts.keepBanner ? s.banner : null, focusTick: s.focusTick + 1, modal: null }));
    if (!opts.fromUrl) {
      const wasAtlas = getRoute().page === "atlas";
      navigate(href({ page: "atlas", id }));
      if (!wasAtlas || opts.scroll) window.scrollTo({ top: 0, behavior: wasAtlas ? "smooth" : "instant" });
    }
  },

  goBack: () => {
    const { path, focus } = get();
    if (path.length > 1) focus(path[path.length - 2], { back: true });
  },

  closeBanner: () => set({ banner: null }),

  addToCauldron: (id) => {
    const { slots } = get();
    if (slots.filter(Boolean).length >= 4) {
      toast("Le creuset est plein (4 max)");
      return;
    }
    const next = [...slots];
    next[next.indexOf(null)] = id;
    set((s) => ({ slots: next, pulseTick: s.pulseTick + 1 }));
  },

  removeSlot: (k) => {
    const { slots } = get();
    if (!slots[k]) return;
    const next = [...slots];
    next[k] = null;
    set({ slots: pad(next.filter((x): x is string => !!x)) });
  },

  clearSlots: () => set({ slots: EMPTY_SLOTS }),

  mix: () => {
    const sel = get().slots.filter((x): x is string => !!x);
    if (!sel.length) return;
    set((s) => ({ boilTick: s.boilTick + 1 }));
    if (sel.length === 1) {
      get().focus(sel[0]);
      return;
    }
    const r = BYKEY[keyOf(sel)];
    if (r) {
      const isNew = get().transmute(r);
      set({ banner: { kind: "ok", sel, out: r.out, isNew, txt: r.txt, by: r.by, lvl: r.lvl } });
      get().focus(r.out, { keepBanner: true });
      set({ slots: EMPTY_SLOTS });
      if (window.innerWidth <= 980) scrollToEl(".stage");
    } else {
      const mixA: Counts = {};
      let n = 0;
      sel.forEach((id) => {
        const a = atoms(id);
        if (Object.keys(a).length) {
          n++;
          for (const s in a) mixA[s] = (mixA[s] || 0) + a[s];
        }
      });
      for (const s in mixA) mixA[s] /= n || 1;
      const near: [string, number][] = n
        ? MATIERES.filter((m) => hasAtoms(m.id) && !sel.includes(m.id))
            .map((m) => [m.id, overlap(mixA, atoms(m.id))] as [string, number])
            .filter((x) => x[1] >= 0.5)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
        : [];
      set({ banner: { kind: "fail", sel, near } });
      if (window.innerWidth <= 980) scrollToEl(".stage");
    }
  },

  tryRecipe: (i) => {
    const r = RECS[i];
    if (!r) return;
    if (getRoute().page !== "atlas") {
      // hors de l'atlas : on montre le résultat sur place, sans changer de page
      set({ modal: { r, isNew: get().transmute(r) } });
      return;
    }
    set({ slots: pad(r.ins) });
    scrollToEl(".stage");
    setTimeout(() => get().mix(), 450);
  },

  transmute: (r) => {
    const found = new Set(get().found);
    const isNew = !found.has(r.i);
    found.add(r.i);
    saveFound(found);
    set({ found });
    return isNew;
  },

  closeModal: () => set({ modal: null }),

  randomHint: () => {
    const { found } = get();
    const pool = RECS.filter((r) => !found.has(r.i));
    const list = pool.length ? pool : RECS;
    const r = list[Math.floor(Math.random() * list.length)];
    set({ slots: pad([r.ins[0]]) });
    const more = r.ins.length - 1;
    toast(`Indice : ${info(r.ins[0]).name} + ${more} autre${more > 1 ? "s" : ""} ingrédient${more > 1 ? "s" : ""}…`);
  },
}));

/* ---------- synchronisation avec l'URL ---------- */
function syncFromUrl() {
  const route = getRoute();
  if (route.page !== "atlas") return;
  const st = useAtlas.getState();
  const id = route.id ?? "terre";
  if (!exists(id)) {
    navigate("/", { replace: true });
    return;
  }
  if (id === st.cur) return;
  const k = st.path.indexOf(id);
  if (k >= 0) st.focus(id, { crumb: k, fromUrl: true });
  else st.focus(id, { fromUrl: true });
}
syncFromUrl();
subscribe(syncFromUrl);
