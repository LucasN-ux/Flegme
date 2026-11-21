import { GLOSSARY } from "../lib/glossary";

/** Petit lexique en bas de page : tous les mots techniques expliqués simplement. */
export function Lexicon() {
  const words = [...GLOSSARY].sort((a, b) => a[0].localeCompare(b[0], "fr"));
  return (
    <section className="lower lexicon">
      <h2 className="big" id="lexique">Petit lexique</h2>
      <p className="sec-sub">Les mots un peu techniques du site, en langage de tous les jours. Dans les textes, ils sont soulignés en pointillés : passe la souris dessus.</p>
      <dl className="lex-list">
        {words.map(([w, , def]) => (
          <div key={w} className="lex"><dt>{w}</dt><dd>{def}</dd></div>
        ))}
      </dl>
    </section>
  );
}
