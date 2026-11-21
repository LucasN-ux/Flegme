/* Petites briques réutilisées partout : orbes, puces, barres d'atomes, formules */
import type { CSSProperties, DragEvent, ReactNode } from "react";
import { info, sorted, elColor, EL, pct, formulaParts, type Counts } from "../lib/chem";
import { useAtlas, type FocusOpts } from "../store/atlas";
import { useUi } from "../store/ui";
import { GLOSS_RE, lookup } from "../lib/glossary";

/** Variable CSS personnalisée (--c, --a…) dans un objet style typé. */
export const cssVars = (vars: Record<string, string | number>): CSSProperties => vars as CSSProperties;

/** Props pour rendre un ingrédient glissable vers le creuset. */
export function dragProps(id: string) {
  return {
    draggable: true,
    onDragStart: (e: DragEvent) => {
      e.dataTransfer.setData("text/plain", id);
      useUi.getState().setDragging(true);
    },
    onDragEnd: () => useUi.getState().setDragging(false),
  };
}

export function Orb({ id, size }: { id: string; size?: "lg" | "md" }) {
  const i = info(id);
  return (
    <span className={`orb${i.kind === "el" ? " el" : ""}${size ? " " + size : ""}`} style={cssVars({ "--c": i.c })}>
      {i.icon}
    </span>
  );
}

/** Formule chimique avec indices. */
export function Formula({ f }: { f: string }) {
  return (
    <>
      {formulaParts(f).map((p, k) => (p.sub ? <sub key={k}>{p.t}</sub> : <span key={k}>{p.t}</span>))}
    </>
  );
}

/** Puce cliquable : ouvre la matière (ou action personnalisée) et se glisse vers le creuset. */
export function Chip({
  id, onClick, opts, children,
}: { id: string; onClick?: () => void; opts?: FocusOpts; children?: ReactNode }) {
  const focus = useAtlas((s) => s.focus);
  const i = info(id);
  return (
    <button className="chip" title={i.name} onClick={onClick ?? (() => focus(id, opts))} {...dragProps(id)}>
      <Orb id={id} />
      <span className="nm">{i.name}</span>
      {children}
    </button>
  );
}

export function ABar({ a, big }: { a: Counts; big?: boolean }) {
  return (
    <div className={`abar${big ? " big" : ""}`}>
      {sorted(a)
        .filter((p) => p[1] > 0.004)
        .map(([s, v]) => (
          <i key={s} style={{ width: `${v * 100}%`, background: elColor(s) }} title={`${EL[s].n} ${pct(v)}`} />
        ))}
    </div>
  );
}

/** Remplace les flèches d'une équation texte par des opérateurs dorés. */
export function EqText({ text }: { text: string }) {
  const parts = text.split(/(→|⇄)/);
  return <>{parts.map((p, k) => (p === "→" || p === "⇄" ? <span key={k} className="op">{p}</span> : p))}</>;
}

/** Sépare les éléments d'une liste par un nœud. */
export function joinNodes(nodes: ReactNode[], sep: (k: number) => ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  nodes.forEach((n, k) => {
    if (k) out.push(sep(k));
    out.push(n);
  });
  return out;
}

/** Texte avec les mots techniques soulignés : définition simple au survol (1re occurrence de chaque mot). */
export function G({ children }: { children: string }) {
  const out: ReactNode[] = [];
  const seen = new Set<string>();
  let last = 0;
  for (const m of children.matchAll(GLOSS_RE)) {
    const hit = lookup(m[0]);
    if (!hit || seen.has(hit.word)) continue;
    seen.add(hit.word);
    out.push(children.slice(last, m.index));
    out.push(<span key={m.index} className="gl" data-tip={`${hit.word} : ${hit.def}`}>{m[0]}</span>);
    last = m.index! + m[0].length;
  }
  out.push(children.slice(last));
  return <>{out}</>;
}

/** Section repliable « pour les curieux » (ouverte d'office en mode expert). */
export function Curious({ title = "🔬 Pour les curieux", children }: { title?: string; children: ReactNode }) {
  const simple = useUi((s) => s.simple);
  if (!simple) return <>{children}</>;
  return (
    <details className="curious">
      <summary>{title}</summary>
      {children}
    </details>
  );
}
