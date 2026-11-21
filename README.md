# Flegme — Atlas des Éléments

> Tout n'est que poussière d'étoiles — et tout y retournera.

Atlas interactif de la matière : descends des matériaux jusqu'aux atomes, combine des ingrédients dans le creuset,
fais réagir des molécules au laboratoire et explore les traditions (Aristote, Wu Xing, métaux planétaires, Paracelse).

## Stack

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript
- [Zustand](https://zustand.docs.pmnd.rs) pour l'état (atlas, creuset, labo)
- Aucun backend : site statique, prêt pour Vercel

## Développement

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + build dans dist/
npm run preview  # sert le build
```

## Structure

```
src/
  data/        données brutes : éléments, matières, recettes, espèces du labo
  lib/         logique pure : formules, compositions atomiques, mise en page 2D des molécules, chimie du labo
  store/       stores Zustand (atlas + creuset, laboratoire, UI)
  components/  Header, Library, Stage/Graph, InfoPanel, Lab, Traditions, overlays
  styles.css   feuille de style
```

## Déploiement sur Vercel

1. Sur [vercel.com/new](https://vercel.com/new), importer le dépôt GitHub `LucasN-ux/Flegme`.
2. Vercel détecte Vite (`vercel.json` fixe `npm run build` → `dist/`). Aucune variable d'environnement n'est nécessaire.
3. Chaque push sur `main` redéploie le site.
