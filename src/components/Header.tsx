import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { search, info } from "../lib/chem";
import { useAtlas } from "../store/atlas";
import { Orb } from "./ui";

function Search() {
  const focus = useAtlas((s) => s.focus);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const res = search(q);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (e.key === "/" && tag !== "INPUT") {
        e.preventDefault();
        input.current?.focus();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const pick = (id: string) => {
    setOpen(false);
    setQ("");
    focus(id);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!res.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + res.length) % res.length);
    }
    if (e.key === "Enter") {
      pick(res[idx].id);
      input.current?.blur();
    }
  };

  return (
    <div className="search" ref={wrap}>
      <span className="ico">⌕</span>
      <input
        ref={input}
        value={q}
        placeholder="Chercher… ( / )"
        autoComplete="off"
        onChange={(e) => {
          setQ(e.target.value);
          setIdx(0);
          setOpen(!!e.target.value.trim());
        }}
        onKeyDown={onKeyDown}
      />
      <div className={`search-res${open && q.trim() ? " on" : ""}`}>
        {res.length ? (
          res.map((x, k) => (
            <button key={x.id} className={k === idx ? "sel" : ""} onClick={() => pick(x.id)}>
              <Orb id={x.id} />
              <span>{info(x.id).name}</span>
              <span className="sub">{x.sub}</span>
            </button>
          ))
        ) : (
          <div className="dim" style={{ padding: 10 }}>Rien trouvé</div>
        )}
      </div>
    </div>
  );
}

export function Sigil() {
  return (
    <div className="sigil" aria-hidden="true">
      <svg viewBox="0 0 600 600" fill="none" stroke="#e9e4d8" strokeWidth="1">
        <circle cx="300" cy="300" r="290" /><circle cx="300" cy="300" r="270" />
        <circle cx="300" cy="300" r="180" /><circle cx="300" cy="300" r="60" />
        <path d="M300 30 L534 435 L66 435 Z" /><path d="M300 570 L534 165 L66 165 Z" />
        <rect x="173" y="173" width="254" height="254" transform="rotate(45 300 300)" />
        <path d="M300 10 V590 M10 300 H590" strokeDasharray="2 8" />
        <g fontFamily="serif" fontSize="22" fill="#e9e4d8" stroke="none" textAnchor="middle">
          <text x="300" y="25">☉</text><text x="300" y="595">☽</text><text x="18" y="307">♄</text>
          <text x="582" y="307">♃</text><text x="96" y="104">♂</text><text x="504" y="104">♀</text>
          <text x="96" y="512">☿</text><text x="504" y="512">⊕</text>
        </g>
      </svg>
    </div>
  );
}

export function Header() {
  return (
    <header className="top">
      <div className="brand">
        <svg className="brand-logo" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="29" fill="none" stroke="#e9b949" strokeWidth="2" />
          <path d="M32 9 L52 44 L12 44 Z" fill="none" stroke="#e9b949" strokeWidth="2" />
          <path d="M32 55 L52 20 L12 20 Z" fill="none" stroke="#e9b949" strokeWidth="2" opacity=".55" />
          <circle cx="32" cy="32" r="6" fill="#e9b949" />
        </svg>
        <div>
          <h1>Atlas des <em>Éléments</em></h1>
          <small>Tout n'est que poussière d'étoiles — et tout y retournera</small>
        </div>
      </div>
      <ol className="howto">
        <li><b>1</b> Choisis une matière ou un atome</li>
        <li><b>2</b> Clique les bulles pour descendre jusqu'aux atomes</li>
        <li><b>3</b> Glisse des ingrédients dans le creuset pour en créer d'autres</li>
      </ol>
      <nav className="jump">
        <a href="#atlas">Atlas</a><a href="#lab">Laboratoire</a><a href="#traditions">Traditions</a><a href="#grimoire">Grimoire</a>
      </nav>
      <Search />
    </header>
  );
}
