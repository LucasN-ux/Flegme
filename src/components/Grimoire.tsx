/* Le grimoire : toutes les recettes du creuset, classées par thème et cherchables */
import { useMemo, useState } from "react";
import { RECETTE_THEMES } from "../data/atlas";
import { RECS, info, norm, type Rec } from "../lib/chem";
import { useAtlas } from "../store/atlas";
import { RecipeCard } from "./InfoPanel";
import { Chip } from "./ui";
import { LevelCards, type Lvl } from "./Levels";

const searchText = (r: Rec) => norm([...r.ins, r.out, ...r.by].map((id) => info(id).name).join(" ") + " " + r.txt);
const TEXTS = RECS.map(searchText);

function LockedCard({ r }: { r: Rec }) {
  return (
    <div className="recipe lock">
      <div className="eq">
        <Chip id={r.ins[0]} />
        {r.ins.slice(1).map((_, k) => <span key={k} style={{ display: "contents" }}><span className="op">+</span><span className="q">?</span></span>)}
        <span className="op">→</span><span className="q">?</span>
      </div>
      <p className="dim small">À toi de trouver les autres ingrédients au creuset…</p>
    </div>
  );
}

export function Grimoire() {
  const found = useAtlas((s) => s.found);
  const [theme, setTheme] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [challenge, setChallenge] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [lvl, setLvl] = useState<Lvl | null>(null);

  const nq = norm(q.trim());
  const list = useMemo(
    () => RECS.filter((r) => (theme == null || r.theme === theme) && (lvl == null || r.lvl === lvl) && (!nq || TEXTS[r.i].includes(nq)) && (!onlyNew || !found.has(r.i))),
    [theme, lvl, nq, onlyNew, found],
  );
  const card = (r: Rec) => (challenge && !found.has(r.i) ? <LockedCard key={r.i} r={r} /> : <RecipeCard key={r.i} r={r} />);
  const grouped = theme == null && !nq;
  const filtered = theme != null || lvl != null || !!nq || onlyNew;

  return (
    <section className="lower grim-sec">
      <div className="motto">Solve et coagula <span>— dissous, puis assemble</span></div>
      <h2 className="big" id="grimoire">Le grimoire des recettes</h2>
      <p className="sec-sub">
        Les {RECS.length} recettes du creuset, toutes consultables. Clique <b>« Essayer au creuset »</b> pour voir le résultat, ou
        touche un ingrédient pour ouvrir sa fiche. Celles que tu as réussies toi-même sont marquées <b className="gold-t">✓ trouvée</b>.
      </p>

      <h3 className="sec lvl-title">Trois niveaux de transformation</h3>
      <p className="sec-sub">Toutes les recettes ne touchent pas la matière aussi profondément. Touche un niveau pour n'afficher que ses recettes.</p>
      <LevelCards value={lvl} onChange={setLvl} />

      <div className="grim-tools">
        <div className="search grim-q">
          <span className="ico">⌕</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Chercher un ingrédient ou un résultat (ex. fer, pain, verre…)" />
        </div>
        <div className="grim-ctl">
          <span className="mono">{found.size} / {RECS.length} trouvées</span>
          <div className="progress"><i style={{ width: `${(found.size / RECS.length) * 100}%` }} /></div>
        </div>
      </div>
      <div className="grim-tools">
        <div className="pills">
          <button className={`pill${theme == null ? " on" : ""}`} onClick={() => setTheme(null)}>Tous les thèmes ({RECS.length})</button>
          {RECETTE_THEMES.map(([name, emoji, n], t) => (
            <button key={name} className={`pill${theme === t ? " on" : ""}`} onClick={() => setTheme(theme === t ? null : t)}>
              {emoji} {name} ({n})
            </button>
          ))}
        </div>
        <div className="grim-ctl">
          <label title="N'affiche que les recettes que tu n'as pas encore réussies"><input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} /> À découvrir seulement</label>
          <label title="Cache les ingrédients des recettes pas encore trouvées, pour jouer"><input type="checkbox" checked={challenge} onChange={(e) => setChallenge(e.target.checked)} /> Mode défi</label>
        </div>
      </div>

      {filtered && <p className="dim small">{list.length} recette{list.length > 1 ? "s" : ""} affichée{list.length > 1 ? "s" : ""}.</p>}
      {!list.length && <p className="dim">Aucune recette ne correspond.</p>}
      {grouped
        ? RECETTE_THEMES.map(([name, emoji], t) => {
            const items = list.filter((r) => r.theme === t);
            if (!items.length) return null;
            return (
              <div key={name} className="grim-group">
                <h3 className="sec">{emoji} {name} <small className="dim">{items.length}</small></h3>
                <div className="grim-list">{items.map(card)}</div>
              </div>
            );
          })
        : <div className="grim-list">{list.map(card)}</div>}
    </section>
  );
}
