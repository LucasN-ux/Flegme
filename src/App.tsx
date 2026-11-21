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
import { BottomTabs, TABS } from "./components/Nav";
import { RecipeModal } from "./components/RecipeModal";
import { useAtlas } from "./store/atlas";
import { info } from "./lib/chem";
import { useRoute } from "./router";

const SITE = "Atlas des Éléments";

export default function App() {
  const route = useRoute();
  const cur = useAtlas((s) => s.cur);

  // Retour arrière dans le graphe avec la touche Retour (hors champ de saisie)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (e.key === "Backspace" && tag !== "INPUT" && tag !== "TEXTAREA" && route.page === "atlas") useAtlas.getState().goBack();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [route.page]);

  // Titre de l'onglet du navigateur
  useEffect(() => {
    const tab = TABS.find((t) => t.page === route.page)!;
    document.title = route.page === "atlas" ? `${info(cur).name} — ${SITE}` : `${tab.label} — ${SITE}`;
  }, [route.page, cur]);

  // Fermer la fenêtre de recette quand on change de page
  useEffect(() => {
    useAtlas.getState().closeModal();
  }, [route.page]);

  return (
    <>
      <Sigil />
      <Header />
      <main className={`page page-${route.page}`}>
        {route.page === "atlas" && (
          <>
            <Welcome />
            <div className="app" id="atlas">
              <Library />
              <Stage />
              <InfoPanel />
            </div>
          </>
        )}
        {route.page === "labo" && <Lab />}
        {route.page === "grimoire" && <Grimoire />}
        {route.page === "traditions" && <Traditions />}
        {route.page === "lexique" && <Lexicon />}
      </main>
      <footer>
        <div className="epitaph">Memento, homo, quia pulvis es, et in pulverem reverteris.</div>
        Compositions moyennes et simplifiées, en % de la masse, à but pédagogique. Les formules des protéines, de l'ADN et de la lignine sont des
        moyennes ; certaines recettes sont simplifiées et le signalent.
      </footer>
      <BottomTabs />
      <RecipeModal />
      <Tooltip />
      <Toast />
    </>
  );
}
