/* Infobulle (attribut data-tip) et toast */
import { useEffect, useRef, useState } from "react";
import { useUi } from "../store/ui";

export function Tooltip() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tip = ref.current!;
    const onMove = (e: MouseEvent) => {
      const t = (e.target as Element | null)?.closest?.("[data-tip]") as HTMLElement | SVGElement | null;
      if (!t) { tip.classList.remove("on"); return; }
      tip.textContent = t.dataset.tip ?? "";
      tip.classList.add("on");
      tip.style.left = Math.min(e.clientX + 14, innerWidth - tip.offsetWidth - 8) + "px";
      tip.style.top = e.clientY + 16 + "px";
    };
    const hide = () => tip.classList.remove("on");
    // écrans tactiles : toucher un mot souligné affiche sa définition quelques secondes
    let timer = 0;
    const onTap = (e: MouseEvent) => {
      const t = (e.target as Element | null)?.closest?.(".gl") as HTMLElement | null;
      if (!t) return;
      const r = t.getBoundingClientRect();
      tip.textContent = t.dataset.tip ?? "";
      tip.classList.add("on");
      tip.style.left = Math.max(8, Math.min(r.left, innerWidth - tip.offsetWidth - 8)) + "px";
      tip.style.top = r.bottom + 8 + "px";
      clearTimeout(timer);
      timer = window.setTimeout(hide, 4000);
    };
    document.addEventListener("click", onTap);
    document.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", hide, true);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onTap);
      window.removeEventListener("scroll", hide, true);
    };
  }, []);
  return <div className="tip" ref={ref} />;
}

export function Toast() {
  const msg = useUi((s) => s.toastMsg);
  const tick = useUi((s) => s.toastTick);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!tick) return;
    setOn(true);
    const t = setTimeout(() => setOn(false), 1800);
    return () => clearTimeout(t);
  }, [tick]);
  return <div className={`toast${on ? " on" : ""}`}>{msg}</div>;
}
