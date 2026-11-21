/* Navigation entre les sections : onglets dans l'en-tête et barre en bas sur mobile */
import type { MouseEvent, ReactNode } from "react";
import { navigate, useRoute, href, type Page, type Route } from "../router";
import { useAtlas } from "../store/atlas";

export const TABS: { page: Page; label: string; icon: string }[] = [
  { page: "atlas", label: "Atlas", icon: "🌍" },
  { page: "labo", label: "Labo", icon: "⚗️" },
  { page: "grimoire", label: "Grimoire", icon: "📜" },
  { page: "traditions", label: "Traditions", icon: "☯️" },
  { page: "lexique", label: "Lexique", icon: "📖" },
];

/** Lien interne : met à jour l'URL sans recharger la page. */
export function Link({ to, className, children, title }: { to: Route; className?: string; children: ReactNode; title?: string }) {
  const cur = useAtlas((s) => s.cur);
  const target = to.page === "atlas" && !to.id ? { page: "atlas" as const, id: cur } : to;
  const url = href(target);
  const onClick = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(url);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  return <a href={url} className={className} onClick={onClick} title={title}>{children}</a>;
}

export function TopTabs() {
  const route = useRoute();
  return (
    <nav className="jump">
      {TABS.map((t) => (
        <Link key={t.page} to={{ page: t.page }} className={route.page === t.page ? "on" : undefined}>{t.label}</Link>
      ))}
    </nav>
  );
}

export function BottomTabs() {
  const route = useRoute();
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <Link key={t.page} to={{ page: t.page }} className={route.page === t.page ? "on" : undefined}>
          <span className="ti">{t.icon}</span>
          <span>{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
