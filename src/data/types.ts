export interface Famille { n: string; c: string }
export interface Alchimie { sym: string; astre: string }
export interface Categorie { n: string; c: string; e: string }

/** [id, % en masse] */
export type Composition = [string, number][];

export interface Matiere {
  id: string;
  /** nom */
  n: string;
  /** emoji */
  e: string;
  cat: string;
  /** description */
  d: string;
  /** formule chimique (substance pure) */
  f?: string;
  /** composition (mélange) */
  c?: Composition;
  /** structure */
  s?: string;
  /** indivisible (concept / énergie) */
  x?: string;
  note?: string;
  see?: string[];
  /** symbole alchimique (éléments classiques) */
  sym?: string;
  /** qualités d'Aristote */
  qual?: string;
  /** appartient aussi à une tradition ésotérique (ex. Bois, Métal du Wu Xing) */
  esot?: boolean;
}

/** [ingrédients, résultat, explication, sous-produits?] */
export type Recette = [string[], string, string, string[]?];

/** [id, nom, formule, SMILES simplifié, ΔHf kJ/mol, groupe, description, id atlas] */
export type SpeciesRaw = [string, string, string, string, number, string, string, string | null];

export interface Protocol {
  r: string[];
  p: string[];
  c: string[];
  steps: string[];
  tip?: string;
  warn?: string;
}

export interface KnownRecipe {
  t: string;
  for: string[];
  r?: string[];
  eq?: string;
  txt: string;
}
