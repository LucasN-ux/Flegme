/* Petit routeur basé sur l'History API : une URL par section et par matière.
   /                → atlas (matière par défaut)
   /matiere/:id     → atlas ouvert sur une matière ou un atome
   /labo, /grimoire, /traditions, /lexique */
import { useSyncExternalStore } from "react";

export type Page = "atlas" | "labo" | "grimoire" | "traditions" | "lexique";
export interface Route { page: Page; id?: string }

const PAGES: Page[] = ["labo", "grimoire", "traditions", "lexique"];

export function parse(pathname: string): Route {
  const parts = pathname.replace(/^\/+|\/+$/g, "").split("/").map(decodeURIComponent);
  if (parts[0] === "matiere" && parts[1]) return { page: "atlas", id: parts[1] };
  if (PAGES.includes(parts[0] as Page)) return { page: parts[0] as Page };
  return { page: "atlas" };
}

export const href = (r: Route): string =>
  r.page === "atlas" ? (r.id ? `/matiere/${encodeURIComponent(r.id)}` : "/") : `/${r.page}`;

const listeners = new Set<() => void>();
let current = parse(location.pathname);

function emit() {
  current = parse(location.pathname);
  listeners.forEach((l) => l());
}
window.addEventListener("popstate", emit);

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  if (to === location.pathname) return;
  if (opts.replace) history.replaceState(null, "", to);
  else history.pushState(null, "", to);
  emit();
}

export const getRoute = () => current;

export function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, getRoute);
}
