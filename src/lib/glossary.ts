/* Petit lexique en langage courant.
   Chaque entrée : [mot affiché, formes reconnues dans les textes (regex), définition simple] */
export const GLOSSARY: [string, string, string][] = [
  ["Atome", "atomes?", "La plus petite brique de la matière (invisible, un milliardième de mètre). Il en existe 118 sortes : ce sont les éléments du tableau périodique."],
  ["Molécule", "mol[ée]cules?", "Un petit groupe d'atomes accrochés ensemble. Ex. : l'eau, c'est 1 atome d'oxygène + 2 d'hydrogène."],
  ["Élément", "éléments? chimiques?", "Une sorte d'atome (fer, carbone, oxygène…). Les Grecs appelaient « éléments » le feu, l'air, l'eau et la terre, mais ce n'est pas le même sens."],
  ["Liaison", "liaisons?", "Le « crochet » qui retient deux atomes ensemble dans une molécule."],
  ["Ion", "ions?", "Un atome qui a gagné ou perdu une charge électrique (+ ou −). Les + et les − s'attirent, comme des aimants : c'est ce qui tient le sel."],
  ["Réaction chimique", "réactions?|réagi(?:t|ssent|r)", "Quand des atomes se séparent et se réassemblent autrement : on obtient de nouvelles substances (bois → cendre + fumée)."],
  ["Combustion", "combustions?|brûle(?:r|nt)?", "Brûler, c'est une réaction avec l'oxygène de l'air qui dégage chaleur et lumière."],
  ["Oxyde", "oxydes?", "Une substance faite d'un élément accroché à de l'oxygène. La rouille est un oxyde de fer."],
  ["Oxyder", "s'oxyde(?:nt)?|oxyd(?:er|ation|é|ée|és)", "S'associer à de l'oxygène. C'est ce qui fait rouiller le fer ou brunir une pomme coupée."],
  ["Acide", "acides?", "Substance qui « pique » et attaque certaines matières (citron, vinaigre, acide de batterie). Elle s'annule avec une base."],
  ["Base", "bases? fortes?|une base", "Le contraire d'un acide (savon, soude, javel). Mélangés, acide et base se neutralisent."],
  ["Neutraliser", "neutralis(?:e|er|ent|ation)", "Mélanger un acide et une base pour qu'ils s'annulent : on obtient souvent de l'eau et un sel."],
  ["Catalyseur", "catalyseurs?", "Un « accélérateur » : il fait aller une réaction beaucoup plus vite sans être consommé."],
  ["Exothermique", "exothermiques?", "Une réaction qui dégage de la chaleur (comme un feu)."],
  ["Endothermique", "endothermiques?", "Une réaction qui a besoin qu'on lui fournisse de la chaleur ou de l'énergie pour avoir lieu."],
  ["Énergie de formation", "énergie de formation", "Indique si une molécule est « stable » (nombre négatif : elle ne cherche pas à changer) ou « réactive » (nombre positif)."],
  ["kJ", "kJ(?:/mol)?", "Kilojoule : une unité d'énergie. 100 kJ ≈ l'énergie pour chauffer un verre d'eau de 0 à 100 °C."],
  ["Alliage", "alliages?", "Un mélange de métaux fondus ensemble (le bronze = cuivre + étain)."],
  ["Polymère", "polymères?", "Une très longue chaîne faite de la même petite molécule répétée des milliers de fois (plastiques, cellulose, ADN)."],
  ["Cristal", "cristaux|cristal|cristallise(?:r|nt)?", "Une matière dont les atomes sont rangés en motif régulier, comme un carrelage en 3D."],
  ["Minerai", "minerais?", "Une roche qui contient assez de métal pour qu'on l'extraie."],
  ["Électrolyse", "électrolyses?", "Casser une substance en y faisant passer du courant électrique."],
  ["Hydrocarbure", "hydrocarbures?", "Molécule faite uniquement de carbone et d'hydrogène : gaz, essence, pétrole, cire."],
  ["Fermentation", "ferment(?:ation|é|ée|és|ées|er)s?", "Des levures ou bactéries « mangent » du sucre et le transforment (en alcool, en acide…)."],
  ["Distillation", "distill(?:ation|er|é|ée)s?", "Chauffer un liquide puis refroidir sa vapeur pour séparer ce qui bout à des températures différentes."],
  ["Carbonate", "carbonates?", "Une famille de minéraux contenant du carbone et de l'oxygène (calcaire, craie, bicarbonate). Ils moussent avec les acides."],
  ["Silicate", "silicates?", "Minéraux faits de silicium et d'oxygène : la grande majorité des roches, du sable et de l'argile."],
  ["Radical", "radica(?:l|ux)", "Un atome ou une molécule « incomplet », extrêmement réactif : il s'accroche à la première chose venue."],
  ["Radioactif", "radioacti(?:f|ve|fs|ves)", "Un atome instable qui se désintègre tout seul en émettant un rayonnement."],
  ["pH", "pH", "Une échelle de 0 à 14 : en dessous de 7 c'est acide, au-dessus c'est basique, 7 c'est neutre (l'eau pure)."],
  ["Sublimer", "sublim(?:e|er|ation|ent)", "Passer directement de solide à gaz, sans devenir liquide."],
  ["Émulsion", "émulsions?", "Des gouttelettes d'un liquide dispersées dans un autre qui ne s'y mélange pas (lait, mayonnaise)."],
  ["Composite", "composites?", "Un matériau qui combine deux matières pour avoir le meilleur des deux (béton armé, bois, os)."],
  ["Protéine", "protéines?", "Longues molécules du vivant (muscles, cheveux, enzymes), faites d'une chaîne d'acides aminés."],
  ["Noyau", "noyaux?", "Le cœur minuscule de l'atome, fait de protons et de neutrons. Presque toute la masse de l'atome est là."],
  ["Proton", "protons?", "Une particule du noyau, de charge +. Leur nombre décide de l'élément : 6 protons = carbone, 79 = or."],
  ["Neutron", "neutrons?", "Une particule du noyau sans charge électrique. Lancé sur un autre noyau, il peut le casser ou le transformer."],
  ["Fusion nucléaire", "fusion nucléaire|fusionnent", "Deux petits noyaux qui se collent pour en faire un plus gros. C'est ce qui fait briller le Soleil."],
  ["Fission", "fissions?(?: nucléaires?)?", "Un gros noyau qui se casse en deux plus petits, en libérant beaucoup d'énergie (centrales nucléaires)."],
  ["Désintégration", "désintégr(?:ation|e|ent)s?", "Un noyau instable qui se transforme tout seul en un autre, en éjectant un morceau de lui-même."],
  ["Transmutation", "transmutations?", "Changer un élément en un autre. Le rêve des alchimistes : impossible par la chimie, possible en touchant au noyau."],
  ["Isotope","isotopes?", "Versions d'un même élément avec un poids légèrement différent."],
  ["Formule", "formules?", "L'écriture d'une molécule : H₂O veut dire 2 atomes d'hydrogène (H) et 1 d'oxygène (O)."],
  ["% de la masse", "% de la masse", "La part du poids total. « 60 % d'eau » : sur 10 kg, 6 kg sont de l'eau."],
];

const ENTRIES = GLOSSARY.map(([word, pattern, def]) => ({ word, re: new RegExp(`^(?:${pattern})$`, "iu"), def }));

/** Une seule regex qui trouve tous les termes, en respectant les limites de mots (accents compris). */
export const GLOSS_RE = new RegExp(
  `(?<![\\p{L}\\p{N}])(${GLOSSARY.map((g) => g[1]).join("|")})(?![\\p{L}\\p{N}])`,
  "giu",
);

export function lookup(match: string): { word: string; def: string } | null {
  const e = ENTRIES.find((x) => x.re.test(match));
  return e ? { word: e.word, def: e.def } : null;
}
