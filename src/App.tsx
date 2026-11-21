import { useEffect } from "react";
import { Header, Sigil, Welcome } from "./components/Header";
import { Grimoire } from "./components/Grimoire";
import { Lexicon } from "./components/Lexicon";
import { Library } from "./components/Library";
import { Stage } from "./components/Stage";
import { InfoPanel } from "./components/InfoPanel";
import { Lab } from "./components/Lab";
import { Traditions } from "./components/Traditions";
import { Tooltip, Toast } from "./components/Overlays";
import { useAtlas } from "./store/atlas";

export default function App() {
  // Retour arrière dans le graphe avec la touche Retour (hors champ de saisie)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (e.key === "Backspace" && tag !== "INPUT" && tag !== "TEXTAREA") useAtlas.getState().goBack();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Sigil />
      <Header />
      <Welcome />
      <div className="app" id="atlas">
        <Library />
        <Stage />
        <InfoPanel />
      </div>
      <Lab />
      <Grimoire />
      <Traditions />
      <Lexicon />
      <footer>
        <div className="epitaph">Memento, homo, quia pulvis es, et in pulverem reverteris.</div>
        Compositions moyennes et simplifiées, en % de la masse, à but pédagogique. Les formules des protéines, de l'ADN et de la lignine sont des
        moyennes ; certaines recettes sont simplifiées et le signalent.
      </footer>
      <Tooltip />
      <Toast />
    </>
  );
}
