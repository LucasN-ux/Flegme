import { create } from "zustand";

const SIMPLE_KEY = "atlas-mode-simple";
function loadSimple(): boolean {
  try { return localStorage.getItem(SIMPLE_KEY) !== "0"; } catch { return true; }
}

interface UiState {
  toastMsg: string;
  toastTick: number;
  /** un ingrédient de l'atlas est en cours de glisser-déposer */
  dragging: boolean;
  /** mode simple : détails techniques repliés, vocabulaire allégé */
  simple: boolean;
  toast: (msg: string) => void;
  setSimple: (v: boolean) => void;
  setDragging: (v: boolean) => void;
}

export const useUi = create<UiState>((set) => ({
  toastMsg: "",
  toastTick: 0,
  dragging: false,
  simple: loadSimple(),
  setSimple: (v) => {
    try { localStorage.setItem(SIMPLE_KEY, v ? "1" : "0"); } catch { /* ignoré */ }
    set({ simple: v });
  },
  toast: (msg) => set((s) => ({ toastMsg: msg, toastTick: s.toastTick + 1 })),
  setDragging: (v) => set({ dragging: v }),
}));

export const toast = (msg: string) => useUi.getState().toast(msg);

export function scrollToEl(selector: string, block: ScrollLogicalPosition = "start") {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block });
}

/** Rejoue une animation CSS liée à une classe (retire, force un reflow, remet). */
export function restartClass(el: HTMLElement | null, cls: string) {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}
