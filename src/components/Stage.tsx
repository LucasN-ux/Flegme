import { useEffect, useRef, useState, type DragEvent } from "react";
import { info, exists, RECS, keyOf, msContains } from "../lib/chem";
import { useAtlas } from "../store/atlas";
import { useUi, restartClass } from "../store/ui";
import { Graph } from "./Graph";
import { Chip, Orb, cssVars, joinNodes } from "./ui";

function Crumbs() {
  const path = useAtlas((s) => s.path);
  const focus = useAtlas((s) => s.focus);
  return (
    <nav className="crumbs">
      {path.map((id, k) => (
        <span key={k} style={{ display: "contents" }}>
          {k > 0 && <span className="sep">›</span>}
          <button className={k === path.length - 1 ? "on" : ""} onClick={() => focus(path[k], { crumb: k })}>
            <Orb id={id} />{info(id).name}
          </button>
        </span>
      ))}
    </nav>
  );
}

function BannerBar() {
  const banner = useAtlas((s) => s.banner);
  const close = useAtlas((s) => s.closeBanner);
  if (!banner) return <div className="banner" />;
  const eq = joinNodes(
    banner.sel.map((id, k) => (
      <span key={`i${k}`} style={{ display: "contents" }}><Orb id={id} /><span>{info(id).name}</span></span>
    )),
    (k) => <b key={`p${k}`} className="op">+</b>,
  );
  return (
    <div className="banner on">
      {banner.kind === "ok" ? (
        <>
          <span className="tag">{banner.isNew ? "Nouvelle transmutation" : "Transmutation"}</span>
          {eq}
          <b className="op">→</b>
          <Orb id={banner.out} />
          <span><b>{info(banner.out).name}</b></span>
        </>
      ) : (
        <>
          <span className="tag dim">Rien ne naît</span>
          {eq}
          <b className="op">→</b>
          <span className="dim">aucune recette connue.</span>
          {banner.near.length > 0 && (
            <>
              <span className="dim">Leurs atomes ressemblent à :</span>
              {banner.near.map(([id, v]) => (
                <Chip key={id} id={id}><b>{Math.round(v * 100)} %</b></Chip>
              ))}
            </>
          )}
        </>
      )}
      <button className="x" onClick={close}>✕</button>
    </div>
  );
}

function Hints({ sel }: { sel: string[] }) {
  const tryRecipe = useAtlas((s) => s.tryRecipe);
  const add = useAtlas((s) => s.addToCauldron);
  if (!sel.length) {
    const glass = RECS.findIndex((r) => r.out === "verre" && r.ins.length === 2);
    const ch = RECS.findIndex((r) => r.key === keyOf(["C", "H"]));
    return (
      <div id="hints">
        <p className="dim small">
          Glisse des matières ou des atomes ici (ou bouton « ＋ Au creuset »). Exemple à essayer :{" "}
          <button className="linkbtn" onClick={() => tryRecipe(glass)}>Sable + Feu</button>,{" "}
          <button className="linkbtn" onClick={() => tryRecipe(ch)}>Carbone + Hydrogène</button>.
        </p>
      </div>
    );
  }
  const others: Record<string, number> = {};
  RECS.filter((r) => r.ins.length > sel.length && msContains(r.ins, sel)).forEach((r) => {
    const rest = [...r.ins];
    sel.forEach((s) => { const i = rest.indexOf(s); if (i >= 0) rest.splice(i, 1); });
    rest.forEach((x) => (others[x] = (others[x] || 0) + 1));
  });
  const ids = Object.keys(others).sort((a, b) => others[b] - others[a]).slice(0, 10);
  return (
    <div id="hints">
      {ids.length > 0 && (
        <div className="chips">
          <span className="dim small">✦ Ça pourrait réagir avec :</span>
          {ids.map((id) => <Chip key={id} id={id} onClick={() => add(id)} />)}
        </div>
      )}
    </div>
  );
}

function Tray() {
  const slots = useAtlas((s) => s.slots);
  const found = useAtlas((s) => s.found);
  const pulseTick = useAtlas((s) => s.pulseTick);
  const { addToCauldron, removeSlot, clearSlots, mix, randomHint } = useAtlas.getState();
  const dragging = useUi((s) => s.dragging);
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sel = slots.filter((x): x is string => !!x);

  useEffect(() => {
    if (pulseTick) restartClass(ref.current, "pulse");
  }, [pulseTick]);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    useUi.getState().setDragging(false);
    const id = e.dataTransfer.getData("text/plain");
    if (exists(id)) addToCauldron(id);
  };

  return (
    <div
      ref={ref}
      className={`tray${dragging ? " drop" : ""}${over ? " over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <div className="tray-head">
        <b>⚗ Le creuset</b>
        <span>Combine 2 à 4 ingrédients pour fabriquer une nouvelle matière — ex. <i>Sable + Feu → Verre</i>, <i>Fer + Carbone → Acier</i>.</span>
        <span className="grim-count">📜 {found.size} / {RECS.length} recettes trouvées</span>
      </div>
      <div className="tray-row">
        <div className="slots">
          {slots.map((id, k) =>
            id ? (
              <button key={k} className="slot full" style={cssVars({ "--c": info(id).c })} title={`Retirer ${info(id).name}`} onClick={() => removeSlot(k)}>
                <Orb id={id} /><small>{info(id).name}</small><span className="x">✕</span>
              </button>
            ) : (
              <div key={k} className="slot"><span className="plus">+</span></div>
            ),
          )}
        </div>
        <div className="tray-btns">
          <button className="btn gold" disabled={!sel.length} onClick={mix}>Mélanger</button>
          <button className="btn" onClick={clearSlots}>Vider</button>
          <button className="btn" title="Un indice au hasard" onClick={randomHint}>☩ Indice</button>
        </div>
      </div>
      <Hints sel={sel} />
    </div>
  );
}

export function Stage() {
  const path = useAtlas((s) => s.path);
  const cur = useAtlas((s) => s.cur);
  const boilTick = useAtlas((s) => s.boilTick);
  const { goBack, addToCauldron } = useAtlas.getState();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (boilTick) restartClass(ref.current, "boil");
  }, [boilTick]);

  return (
    <section className="stage" ref={ref}>
      <div className="stage-top">
        <button className="back" title="Retour" disabled={path.length < 2} onClick={goBack}>←</button>
        <Crumbs />
        <button className="btn small" onClick={() => addToCauldron(cur)}>＋ Au creuset</button>
      </div>
      <BannerBar />
      <Graph />
      <Tray />
    </section>
  );
}
