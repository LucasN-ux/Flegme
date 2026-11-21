/* Résultat d'une recette lancée hors de l'atlas : affiché sur place, sans changer de page */
import { useEffect } from "react";
import { info } from "../lib/chem";
import { useAtlas } from "../store/atlas";
import { G, Orb, joinNodes } from "./ui";

export function RecipeModal() {
  const modal = useAtlas((s) => s.modal);
  const close = useAtlas((s) => s.closeModal);
  const focus = useAtlas((s) => s.focus);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal, close]);

  if (!modal) return null;
  const { r, isNew } = modal;
  const out = info(r.out);

  return (
    <div className="modal-bg" onClick={close}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={`Recette : ${out.name}`} onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={close} title="Fermer">✕</button>
        <span className={`tag${isNew ? "" : " dim"}`}>{isNew ? "✦ Nouvelle transmutation" : "Transmutation"}</span>
        <div className="m-eq">
          {joinNodes(
            r.ins.map((id, k) => (
              <div key={`i${k}`} className="m-ing" style={{ animationDelay: `${k * 90}ms` }}>
                <Orb id={id} size="md" />
                <small>{info(id).name}</small>
              </div>
            )),
            (k) => <b key={`p${k}`} className="op">+</b>,
          )}
          <b className="op big">→</b>
          <div className="m-out">
            <Orb id={r.out} size="lg" />
            <b>{out.name}</b>
          </div>
        </div>
        <p className="m-txt"><G>{r.txt}</G></p>
        {r.by.length > 0 && <p className="dim small">Il reste aussi : {r.by.map((b) => info(b).name).join(", ")}.</p>}
        <div className="m-btns">
          <button className="btn gold" onClick={() => focus(r.out)}>Ouvrir la fiche « {out.name} »</button>
          <button className="btn" onClick={close}>Continuer</button>
        </div>
      </div>
    </div>
  );
}
