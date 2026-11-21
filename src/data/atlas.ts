/* ============================================================
   ATLAS DES ÉLÉMENTS — base de données
   Éléments (118), matières, recettes du creuset
   ============================================================ */
import type { Famille, Alchimie, Categorie, Matiere, Recette, Composition } from "./types";

/* ---------- Familles du tableau périodique ---------- */
export const FAMILLES: Record<string, Famille> = {
  am:  { n: "Métaux alcalins",        c: "#ff8a65" },
  ate: { n: "Métaux alcalino-terreux", c: "#ffb74d" },
  mt:  { n: "Métaux de transition",   c: "#e6c86e" },
  mp:  { n: "Métaux pauvres",         c: "#9ccc8c" },
  md:  { n: "Métalloïdes",            c: "#5fd3b5" },
  nm:  { n: "Non-métaux",             c: "#5ab8f5" },
  ha:  { n: "Halogènes",              c: "#8fa7ff" },
  gn:  { n: "Gaz nobles",             c: "#c08cff" },
  la:  { n: "Lanthanides",            c: "#f48fb1" },
  ac:  { n: "Actinides",              c: "#e57373" },
  in:  { n: "Propriétés inconnues",   c: "#8d8d99" }
};

/* Z | symbole | nom | masse | famille | note */
export const ELEMENTS_RAW = `
1|H|Hydrogène|1.008|nm|L'élément le plus abondant de l'Univers (≈74 % de la matière visible). Carburant des étoiles, il est dans l'eau et dans toutes les molécules du vivant.
2|He|Hélium|4.0026|gn|Gaz noble très léger, fabriqué par la fusion dans le Soleil. Ballons, refroidissement des IRM.
3|Li|Lithium|6.94|am|Le métal le plus léger, si mou qu'il se coupe au couteau. Cœur des batteries de téléphones et de voitures électriques.
4|Be|Béryllium|9.0122|ate|Métal léger et rigide, mais toxique. Dans les émeraudes (béryl) et les miroirs du télescope James Webb.
5|B|Bore|10.81|md|Métalloïde dur. Dans le verre Pyrex (borosilicate), le borax et les aimants néodyme.
6|C|Carbone|12.011|nm|La base de toute la chimie du vivant. Selon l'arrangement de ses atomes : diamant, graphite, graphène, suie. Présent dans le bois, les plastiques, le pétrole… et toi.
7|N|Azote|14.007|nm|78 % de l'air. Indispensable aux protéines et à l'ADN ; les engrais sont fabriqués à partir de l'azote de l'air.
8|O|Oxygène|15.999|nm|21 % de l'air, ≈46 % de la croûte terrestre et ≈65 % de la masse du corps humain. C'est lui qui entretient le feu.
9|F|Fluor|18.998|ha|Le plus réactif de tous les éléments. Dans le dentifrice (fluorure) et le Téflon.
10|Ne|Néon|20.180|gn|Gaz noble qui brille en rouge-orangé dans les enseignes lumineuses.
11|Na|Sodium|22.990|am|Métal mou qui explose au contact de l'eau. Avec le chlore, il forme le sel de table. Présent dans le verre et le savon.
12|Mg|Magnésium|24.305|ate|Brûle avec une lumière blanche aveuglante. Au cœur de chaque molécule de chlorophylle ; alliages légers pour l'aéronautique.
13|Al|Aluminium|26.982|mp|Le métal le plus abondant de la croûte terrestre. Léger et protégé par sa fine couche d'oxyde : canettes, avions, papier alu.
14|Si|Silicium|28.085|md|2ᵉ élément de la croûte terrestre (≈28 %). Le sable, le verre, les roches… et les puces électroniques.
15|P|Phosphore|30.974|nm|Dans l'ADN, l'ATP (la « pile » des cellules) et les os. Le grattoir des boîtes d'allumettes.
16|S|Soufre|32.06|nm|Le Soufre des alchimistes, principe de ce qui brûle. Jaune, odeur d'œuf pourri dans ses composés. Vulcanise le caoutchouc ; présent dans les cheveux.
17|Cl|Chlore|35.45|ha|Gaz verdâtre toxique. Avec le sodium : le sel. Désinfecte l'eau des piscines et entre dans le PVC.
18|Ar|Argon|39.948|gn|≈1 % de l'air. Gaz inerte : ampoules, soudure, double vitrage.
19|K|Potassium|39.098|am|Métal très réactif, essentiel aux nerfs et aux muscles. C'est la « potasse » des cendres de bois. Les bananes en sont riches.
20|Ca|Calcium|40.078|ate|Os, dents, coquillages, calcaire, marbre, ciment, plâtre : le calcium est partout où c'est dur et blanc.
21|Sc|Scandium|44.956|mt|Métal rare et léger, ajouté à l'aluminium pour des cadres de vélo haut de gamme.
22|Ti|Titane|47.867|mt|Aussi solide que l'acier mais 45 % plus léger, ne rouille pas : prothèses, avions, montres. Son oxyde est le blanc des peintures et du dentifrice.
23|V|Vanadium|50.942|mt|Rend l'acier plus dur (outils, clés à molette). Batteries pour stocker l'électricité.
24|Cr|Chrome|51.996|mt|Rend l'acier inoxydable et brillant. Donne leur rouge aux rubis et leur vert aux émeraudes.
25|Mn|Manganèse|54.938|mt|Indispensable à la fabrication de l'acier. Piles alcalines.
26|Fe|Fer|55.845|mt|Le métal de Mars ♂ chez les alchimistes. Cœur de la Terre, base de l'acier, et présent dans ton sang (hémoglobine) — c'est lui qui le rend rouge.
27|Co|Cobalt|58.933|mt|Le bleu de cobalt des céramiques et des vitraux. Batteries lithium-ion, aimants.
28|Ni|Nickel|58.693|mt|Pièces de monnaie, acier inoxydable, batteries. Le noyau terrestre est un alliage fer-nickel.
29|Cu|Cuivre|63.546|mt|Le métal de Vénus ♀. Excellent conducteur : tous les câbles électriques. Avec l'étain → bronze, avec le zinc → laiton.
30|Zn|Zinc|65.38|mt|Protège l'acier de la rouille (galvanisation). Avec le cuivre → laiton. Crème solaire (oxyde de zinc).
31|Ga|Gallium|69.723|mp|Fond dans la main (29,8 °C). Dans les LED et les puces haute fréquence.
32|Ge|Germanium|72.630|md|Le métalloïde des premiers transistors ; fibre optique, optiques infrarouges.
33|As|Arsenic|74.922|md|Le poison historique, la « poudre de succession ». Utilisé dans certains semi-conducteurs.
34|Se|Sélénium|78.971|nm|Sensible à la lumière : ancien cœur des photocopieurs. Oligo-élément vital à petite dose.
35|Br|Brome|79.904|ha|Un des deux seuls éléments liquides à température ambiante, rouge-brun et à l'odeur forte.
36|Kr|Krypton|83.798|gn|Gaz noble rare : flashs photo, double vitrage haut de gamme.
37|Rb|Rubidium|85.468|am|Métal alcalin très réactif ; horloges atomiques.
38|Sr|Strontium|87.62|ate|Donne la couleur rouge vif aux feux d'artifice.
39|Y|Yttrium|88.906|mt|LED blanches, lasers, supraconducteurs.
40|Zr|Zirconium|91.224|mt|Gaines du combustible nucléaire ; la zircone imite le diamant et sert en dentisterie.
41|Nb|Niobium|92.906|mt|Aimants supraconducteurs des IRM et des accélérateurs de particules.
42|Mo|Molybdène|95.95|mt|Durcit l'acier à haute température ; présent dans les enzymes des plantes.
43|Tc|Technétium|98|mt|Premier élément fabriqué artificiellement (1937). Radioactif ; imagerie médicale.
44|Ru|Ruthénium|101.07|mt|Métal du groupe du platine ; contacts électriques, disques durs.
45|Rh|Rhodium|102.91|mt|Un des métaux les plus chers : pots catalytiques, plaquage de l'or blanc.
46|Pd|Palladium|106.42|mt|Pots catalytiques, électronique, bijoux en or blanc.
47|Ag|Argent|107.87|mt|Le métal de la Lune ☽. Meilleur conducteur électrique et thermique de tous. Bijoux, miroirs, photo argentique.
48|Cd|Cadmium|112.41|mt|Toxique ; anciennes batteries Ni-Cd et pigments jaunes des peintres.
49|In|Indium|114.82|mp|L'oxyde d'indium-étain est la couche transparente et conductrice de tous les écrans tactiles.
50|Sn|Étain|118.71|mp|Le métal de Jupiter ♃. Soudure électronique, fer-blanc des boîtes de conserve, bronze.
51|Sb|Antimoine|121.76|md|Durcit le plomb ; le khôl de l'Égypte antique en contenait.
52|Te|Tellure|127.60|md|Rare ; panneaux solaires (tellurure de cadmium).
53|I|Iode|126.90|ha|Désinfectant, ajouté au sel, indispensable à la thyroïde. Ses vapeurs sont violettes.
54|Xe|Xénon|131.29|gn|Phares au xénon, moteurs ioniques des satellites, anesthésique.
55|Cs|Césium|132.91|am|Définit la seconde (horloges atomiques). Fond à 28 °C.
56|Ba|Baryum|137.33|ate|Rend l'intestin visible aux rayons X ; donne le vert des feux d'artifice.
57|La|Lanthane|138.91|la|Objectifs d'appareils photo, batteries des voitures hybrides.
58|Ce|Cérium|140.12|la|Pierre à briquet, poudre pour polir le verre.
59|Pr|Praséodyme|140.91|la|Aimants puissants, verres de protection des souffleurs de verre.
60|Nd|Néodyme|144.24|la|Les aimants les plus puissants : moteurs électriques, éoliennes, écouteurs.
61|Pm|Prométhium|145|la|Radioactif, presque absent sur Terre.
62|Sm|Samarium|150.36|la|Aimants samarium-cobalt résistants à la chaleur.
63|Eu|Europium|151.96|la|Luminescence des écrans ; encre anti-contrefaçon des billets en euro (sous UV).
64|Gd|Gadolinium|157.25|la|Produit de contraste injecté pour les IRM.
65|Tb|Terbium|158.93|la|Le vert des écrans et des ampoules fluocompactes.
66|Dy|Dysprosium|162.50|la|Rend les aimants néodyme résistants à la chaleur (voitures électriques).
67|Ho|Holmium|164.93|la|Record de moment magnétique ; lasers médicaux.
68|Er|Erbium|167.26|la|Amplifie la lumière dans les fibres optiques d'Internet.
69|Tm|Thulium|168.93|la|Une des terres rares les plus rares ; rayons X portables.
70|Yb|Ytterbium|173.05|la|Horloges atomiques ultra-précises, lasers.
71|Lu|Lutécium|174.97|la|Nommé d'après Lutèce (Paris). Imagerie médicale TEP.
72|Hf|Hafnium|178.49|mt|Barres de contrôle des réacteurs nucléaires, puces électroniques.
73|Ta|Tantale|180.95|mt|Condensateurs de tous les téléphones (extrait du coltan).
74|W|Tungstène|183.84|mt|Le plus haut point de fusion des métaux (3422 °C). Filaments d'ampoules, outils de coupe.
75|Re|Rhénium|186.21|mt|Un des éléments les plus rares ; superalliages des réacteurs d'avion.
76|Os|Osmium|190.23|mt|L'élément le plus dense (22,6 g/cm³). Pointes de stylos plume.
77|Ir|Iridium|192.22|mt|Le plus résistant à la corrosion ; une fine couche d'iridium dans les roches marque la chute de l'astéroïde des dinosaures.
78|Pt|Platine|195.08|mt|Métal noble : pots catalytiques, bijoux, électrodes, médicaments anticancer.
79|Au|Or|196.97|mt|Le métal du Soleil ☉, but ultime des alchimistes. Ne s'oxyde jamais. Forgé dans les collisions d'étoiles à neutrons.
80|Hg|Mercure|200.59|mt|Le seul métal liquide. Métal de Mercure ☿ et principe alchimique de tout ce qui est fluide et volatil. Toxique.
81|Tl|Thallium|204.38|mp|Très toxique ; autrefois utilisé comme mort-aux-rats.
82|Pb|Plomb|207.2|mp|Le métal de Saturne ♄. Lourd et mou ; batteries de voiture, protection contre les rayons X. Toxique.
83|Bi|Bismuth|208.98|mp|Forme de magnifiques cristaux irisés en escalier ; médicaments pour l'estomac.
84|Po|Polonium|209|mp|Extrêmement radioactif, découvert par Marie Curie et nommé d'après la Pologne.
85|At|Astate|210|ha|L'élément naturel le plus rare : moins de 1 g dans toute la croûte terrestre.
86|Rn|Radon|222|gn|Gaz radioactif qui s'échappe du granit et s'accumule dans les caves.
87|Fr|Francium|223|am|Ultra-rare et instable ; découvert par Marguerite Perey et nommé d'après la France.
88|Ra|Radium|226|ate|Découvert par Pierre et Marie Curie ; il faisait briller les cadrans des montres.
89|Ac|Actinium|227|ac|Radioactif, luit en bleu dans le noir ; radiothérapie.
90|Th|Thorium|232.04|ac|Combustible nucléaire envisagé pour l'avenir ; anciens manchons de lampes à gaz.
91|Pa|Protactinium|231.04|ac|Rare et très radioactif.
92|U|Uranium|238.03|ac|Combustible des centrales nucléaires. Le plus lourd élément présent en quantité dans la nature.
93|Np|Neptunium|237|ac|Premier élément au-delà de l'uranium ; produit dans les réacteurs.
94|Pu|Plutonium|244|ac|Produit dans les réacteurs ; alimente en électricité des sondes spatiales comme Voyager et Curiosity.
95|Am|Américium|243|ac|Une minuscule pastille dans les détecteurs de fumée.
96|Cm|Curium|247|ac|Nommé en l'honneur des Curie ; source d'énergie pour sondes spatiales.
97|Bk|Berkélium|247|ac|Synthétique. Nommé d'après Berkeley, où il a été créé.
98|Cf|Californium|251|ac|Synthétique ; puissante source de neutrons (démarrage de réacteurs).
99|Es|Einsteinium|252|ac|Synthétique. Nommé d'après Albert Einstein.
100|Fm|Fermium|257|ac|Synthétique. Nommé d'après Enrico Fermi.
101|Md|Mendélévium|258|ac|Synthétique. Nommé d'après Dmitri Mendeleïev, l'inventeur du tableau périodique (1869).
102|No|Nobélium|259|ac|Synthétique. Nommé d'après Alfred Nobel.
103|Lr|Lawrencium|266|ac|Synthétique. Nommé d'après Ernest Lawrence, inventeur du cyclotron.
104|Rf|Rutherfordium|267|mt|Synthétique, quelques atomes seulement. Nommé d'après Ernest Rutherford.
105|Db|Dubnium|268|mt|Synthétique. Nommé d'après Doubna, ville de recherche russe.
106|Sg|Seaborgium|269|mt|Synthétique. Nommé d'après Glenn Seaborg, de son vivant.
107|Bh|Bohrium|270|mt|Synthétique. Nommé d'après Niels Bohr.
108|Hs|Hassium|277|mt|Synthétique. Nommé d'après la Hesse (Allemagne).
109|Mt|Meitnérium|278|in|Synthétique. Nommé d'après Lise Meitner, qui expliqua la fission nucléaire.
110|Ds|Darmstadtium|281|in|Synthétique. Nommé d'après Darmstadt.
111|Rg|Roentgenium|282|in|Synthétique. Nommé d'après Wilhelm Röntgen, découvreur des rayons X.
112|Cn|Copernicium|285|in|Synthétique. Nommé d'après Nicolas Copernic.
113|Nh|Nihonium|286|in|Synthétique. « Nihon » = Japon, premier élément découvert en Asie.
114|Fl|Flérovium|289|in|Synthétique. Nommé d'après Gueorgui Flerov.
115|Mc|Moscovium|290|in|Synthétique. Nommé d'après Moscou.
116|Lv|Livermorium|293|in|Synthétique. Nommé d'après le laboratoire de Livermore.
117|Ts|Tennesse|294|in|Synthétique. Nommé d'après le Tennessee.
118|Og|Oganesson|294|in|Le plus lourd élément connu : quelques atomes, une milliseconde. Nommé d'après Youri Oganessian.
`;

/* Correspondances alchimiques */
export const ALCHIMIE: Record<string, Alchimie> = {
  Au: { sym: "☉", astre: "Soleil" },
  Ag: { sym: "☽", astre: "Lune" },
  Fe: { sym: "♂", astre: "Mars" },
  Cu: { sym: "♀", astre: "Vénus" },
  Hg: { sym: "☿", astre: "Mercure" },
  Sn: { sym: "♃", astre: "Jupiter" },
  Pb: { sym: "♄", astre: "Saturne" }
};

/* ---------- Catégories de matières ---------- */
export const CATS: Record<string, Categorie> = {
  esot: { n: "Éléments classiques",      c: "#f2c14e", e: "✨" },
  mol:  { n: "Molécules & gaz",          c: "#4fc3f7", e: "🧪" },
  min:  { n: "Minéraux & roches",        c: "#c8a27a", e: "🪨" },
  gem:  { n: "Pierres précieuses",       c: "#ec7bd0", e: "💎" },
  met:  { n: "Métaux & alliages",        c: "#9fb3c8", e: "⚙️" },
  cons: { n: "Construction",             c: "#ff9e57", e: "🧱" },
  plas: { n: "Plastiques & polymères",   c: "#b388ff", e: "🛍️" },
  fuel: { n: "Combustibles & énergie",   c: "#ff6b6b", e: "🛢️" },
  org:  { n: "Vivant & naturel",         c: "#7bd389", e: "🌿" },
  food: { n: "Cuisine",                  c: "#ffd166", e: "🍞" }
};

/* ---------- Matières ----------
   f : formule chimique (substance pure)
   c : composition [[id, % en masse], …] (mélange) — un id d'1 ou 2 lettres avec majuscule = élément
   s : structure (comment c'est organisé)
   x : indivisible (concept / énergie) — texte
*/
const LAVE: Composition = [["silice",50],["alumine",15],["hematite",11],["chaux",10],["magnesie",8],["na2o",4],["potasse",2]];

export const MATIERES: Matiere[] = [
  /* ===== Éléments classiques ===== */
  { id:"feu", n:"Feu", e:"🔥", cat:"esot", sym:"up", qual:"Chaud & sec",
    d:"Pour les Grecs, l'élément chaud et sec, celui qui transforme tout. Pour la science, le feu n'est pas une matière mais une réaction : la combustion. Un combustible (bois, gaz…) s'associe à l'oxygène de l'air en libérant chaleur et lumière ; la flamme, c'est du gaz si chaud qu'il brille.",
    c:[["diazote",70],["co2",14],["vapeur",12],["dioxygene",3],["suie",1]],
    s:"Des gaz brûlants (CO₂, vapeur d'eau, azote de l'air) qui émettent de la lumière ; le jaune vient de minuscules grains de suie chauffés au rouge.",
    note:"Ici, « Feu » sert aussi d'ingrédient « chaleur » dans le creuset." },
  { id:"eau", n:"Eau", e:"💧", cat:"esot", sym:"down", qual:"Froid & humide", f:"H2O",
    d:"Élément froid et humide des Grecs. En vrai, une molécule toute simple : 2 atomes d'hydrogène + 1 d'oxygène. Elle couvre 71 % de la Terre et représente ~60 % de ton corps. C'est la seule substance courante qu'on trouve naturellement sous les trois états : glace, liquide, vapeur.",
    s:"Molécule coudée (104,5°). Les molécules s'accrochent entre elles par des « liaisons hydrogène » : c'est pour ça que l'eau monte dans les plantes et que la glace flotte." },
  { id:"terre", n:"Terre", e:"🌍", cat:"esot", sym:"downbar", qual:"Froid & sec",
    d:"Élément froid et sec des Grecs, celui de la stabilité. Le sol réel est un mélange : grains de roche (sable, argile), matière organique décomposée (humus), eau et air. Il faut environ 100 ans pour former 1 cm de sol fertile.",
    c:[["sable",40],["argile",25],["eau",20],["humus",7],["calcaire",5],["hematite",3]] },
  { id:"air", n:"Air", e:"💨", cat:"esot", sym:"upbar", qual:"Chaud & humide",
    d:"Élément chaud et humide des Grecs, le souffle. En vrai : un mélange de gaz, 78 % d'azote, 21 % d'oxygène, ~1 % d'argon et des traces de CO₂ et de vapeur d'eau (en volume). Un litre d'air pèse environ 1,2 g.",
    c:[["diazote",75.5],["dioxygene",23.1],["Ar",1.3],["co2",0.06]] },
  { id:"ether", n:"Éther (Quintessence)", e:"✨", cat:"esot", sym:"circle", qual:"Ni chaud ni froid, éternel",
    d:"Le 5ᵉ élément d'Aristote, la matière pure et éternelle dont seraient faits les astres. Au XIXᵉ siècle, les physiciens cherchaient encore un « éther » qui transporterait la lumière : l'expérience de Michelson et Morley (1887) a montré qu'il n'existe pas. Aujourd'hui, le mystère est ailleurs : 95 % de l'Univers (matière noire et énergie noire) reste inconnu.",
    x:"Un concept philosophique : il n'est fait de rien de mesurable." },
  { id:"bois", n:"Bois", e:"🌳", cat:"org", esot:true,
    d:"Élément du printemps et de la croissance dans le Wu Xing chinois. Comme matériau, un composite naturel génial : des fibres de cellulose (comme des câbles) noyées dans la lignine (la « colle » qui rend l'arbre rigide). Le bois sec contient environ 50 % de carbone… qui vient du CO₂ de l'air !",
    c:[["cellulose",45],["hemicellulose",25],["lignine",25],["resine",4],["cendre",1]],
    s:"Des tubes creux alignés dans le sens du tronc (les cernes), faits de fibres de cellulose collées par la lignine. Comme du béton armé : la cellulose = l'acier, la lignine = le béton." },
  { id:"metal", n:"Métal", e:"⚙️", cat:"esot",
    d:"Élément de l'automne dans le Wu Xing chinois. Les alchimistes connaissaient 7 métaux, chacun lié à un astre : Or-Soleil, Argent-Lune, Fer-Mars, Cuivre-Vénus, Mercure-Mercure, Étain-Jupiter, Plomb-Saturne. Pour la science, un métal est un élément dont les électrons circulent librement entre les atomes : d'où l'éclat, la conduction électrique et le fait qu'on puisse le tordre. 95 des 118 éléments sont des métaux.",
    see:["Au","Ag","Fe","Cu","Hg","Sn","Pb"],
    x:"Une famille, pas une substance : ouvre l'un des 7 métaux ci-dessous." },
  { id:"vide", n:"Vide (Kū)", e:"🕳️", cat:"esot",
    d:"Dans la tradition japonaise (Godai), le Vide est le 5ᵉ élément : le ciel, l'esprit, ce qui contient tout. En physique, même le vide parfait bouillonne de fluctuations quantiques. Et un atome est lui-même du vide à 99,9999999 % : si le noyau était une bille au centre d'un stade, les électrons tourneraient dans les gradins.",
    x:"Le vide, c'est l'absence de matière." },
  { id:"lumiere", n:"Lumière", e:"🌟", cat:"esot",
    d:"Faite de photons, des grains d'énergie sans masse qui voyagent à 300 000 km/s. Ce n'est pas de la matière : c'est elle qui fait pousser les plantes (photosynthèse). La lumière blanche contient toutes les couleurs.",
    x:"De l'énergie pure (photons), pas de la matière." },
  { id:"foudre", n:"Foudre / Électricité", e:"⚡", cat:"esot",
    d:"Une décharge électrique géante : un éclair chauffe l'air à 30 000 °C, cinq fois la surface du Soleil, et le transforme en plasma. Dans ce labo, la foudre sert d'ingrédient « électricité » (pour l'électrolyse : aluminium, soude…).",
    x:"Des électrons en mouvement : de l'énergie, pas une matière." },
  { id:"soleil", n:"Soleil", e:"☀️", cat:"esot",
    d:"Une boule de plasma où l'hydrogène fusionne en hélium : 600 millions de tonnes par seconde. Tous les atomes plus lourds que le fer sur Terre (or, uranium, iode…) viennent d'étoiles mortes ou de collisions d'étoiles. Tu es littéralement fait de poussière d'étoiles.",
    c:[["H",73.5],["He",24.9],["O",0.77],["C",0.29],["Fe",0.16],["Ne",0.12],["N",0.09],["Si",0.07],["Mg",0.05],["S",0.04]] },
  { id:"vapeur", n:"Vapeur", e:"♨️", cat:"esot", f:"H2O",
    d:"L'eau à l'état gazeux, qui est… invisible ! Le panache blanc au-dessus d'une casserole, c'est déjà de l'eau recondensée en gouttelettes. Même molécule que l'eau et la glace : seul l'écart entre les molécules change.",
    s:"Molécules d'eau libres qui volent dans tous les sens, très éloignées les unes des autres." },
  { id:"glace", n:"Glace", e:"🧊", cat:"esot", f:"H2O",
    d:"L'eau solide. Ses molécules s'arrangent en cristal hexagonal plein de trous, ce qui la rend moins dense que l'eau liquide : la glace flotte (heureusement pour les poissons). C'est aussi pour ça que les flocons ont 6 branches.",
    s:"Réseau hexagonal régulier tenu par les liaisons hydrogène." },
  { id:"nuage", n:"Nuage", e:"☁️", cat:"esot",
    d:"De l'air chargé de milliards de gouttelettes ou cristaux de glace microscopiques. Un petit cumulus pèse environ 500 tonnes d'eau, mais elle est si dispersée qu'elle flotte.",
    c:[["air",99.6],["eau",0.4]] },
  { id:"boue", n:"Boue", e:"🟤", cat:"esot",
    d:"De la terre gorgée d'eau. L'argile qu'elle contient la rend collante et modelable : c'est le premier matériau de construction (adobe, torchis).",
    c:[["terre",60],["eau",40]] },
  { id:"lave", n:"Lave", e:"🌋", cat:"esot",
    d:"Roche fondue (1000-1200 °C) venue du manteau terrestre. En refroidissant lentement, elle devient du basalte ; trempée très vite, de l'obsidienne (un verre naturel).",
    c:LAVE, s:"Un liquide de silicates désordonnés, comme du verre fondu." },
  { id:"arc", n:"Arc-en-ciel", e:"🌈", cat:"esot",
    d:"La lumière blanche du Soleil, déviée et décomposée par des millions de gouttes de pluie, chacune agissant comme un petit prisme. On le voit toujours dos au Soleil, à 42° de l'ombre de sa tête.",
    x:"Un phénomène optique : de la lumière + de l'eau, rien de plus." },
  { id:"pierre_philo", n:"Pierre philosophale", e:"🔴", cat:"esot",
    d:"Le but du Grand Œuvre des alchimistes : transformer les métaux en or et offrir l'immortalité. Elle n'existe pas… mais la transmutation, si ! En 1980, Glenn Seaborg a transformé du bismuth en or dans un accélérateur de particules — pour un coût infiniment supérieur à celui de l'or obtenu.",
    x:"Une légende : impossible à décomposer." },

  /* ===== Molécules & gaz ===== */
  { id:"dioxygene", n:"Dioxygène", e:"🫧", cat:"mol", f:"O2", d:"L'oxygène qu'on respire : deux atomes d'oxygène liés. Sans lui, pas de feu ni de respiration." },
  { id:"diazote", n:"Diazote", e:"🌬️", cat:"mol", f:"N2", d:"Gaz très stable (ses deux atomes sont liés par une triple liaison), 78 % de l'air. On le respire sans l'utiliser." },
  { id:"dihydrogene", n:"Dihydrogène", e:"🎈", cat:"mol", f:"H2", d:"Le gaz le plus léger. Il brûle en ne produisant que de l'eau : un carburant d'avenir." },
  { id:"ozone", n:"Ozone", e:"🛡️", cat:"mol", f:"O3", d:"Trois atomes d'oxygène. Là-haut (stratosphère), la couche d'ozone filtre les UV du Soleil ; au sol, c'est un polluant irritant." },
  { id:"co2", n:"Dioxyde de carbone", e:"😮‍💨", cat:"mol", f:"CO2", d:"Ce qu'on expire, ce que produit toute combustion, ce que les plantes absorbent pour pousser. Gaz à effet de serre. Solide, c'est la « carboglace ».", s:"Molécule linéaire O=C=O." },
  { id:"co", n:"Monoxyde de carbone", e:"☠️", cat:"mol", f:"CO", d:"Gaz toxique sans odeur produit par une combustion qui manque d'oxygène (chaudière mal réglée). Il prend la place de l'oxygène dans le sang." },
  { id:"methane", n:"Méthane", e:"🔵", cat:"fuel", f:"CH4", d:"Le plus simple des hydrocarbures : 1 carbone + 4 hydrogènes. Principal composant du gaz naturel ; aussi produit par les vaches et les marais.", s:"Un carbone au centre d'un tétraèdre de 4 hydrogènes." },
  { id:"propane", n:"Propane", e:"🏕️", cat:"fuel", f:"C3H8", d:"Hydrocarbure à 3 carbones : le gaz des bouteilles de camping et des barbecues." },
  { id:"octane", n:"Essence (octane)", e:"⛽", cat:"fuel", f:"C8H18", d:"Un des principaux hydrocarbures de l'essence : une chaîne de 8 carbones entourée d'hydrogènes.", s:"Chaîne de 8 carbones : la même famille que le polyéthylène, en beaucoup plus court." },
  { id:"paraffine", n:"Paraffine (cire de bougie)", e:"🕯️", cat:"fuel", f:"C25H52", d:"Hydrocarbure solide tiré du pétrole. Presque la même chose que le polyéthylène (plastique des sacs) mais avec des chaînes 1000 fois plus courtes : c'est pour ça qu'elle fond si facilement.", s:"Chaînes d'environ 25 carbones." },
  { id:"ethylene", n:"Éthylène", e:"🧪", cat:"mol", f:"C2H4", d:"Petite molécule tirée du pétrole. En l'accrochant des milliers de fois bout à bout, on obtient le polyéthylène, le plastique n°1. C'est aussi l'hormone gazeuse qui fait mûrir les fruits !", s:"Deux carbones reliés par une double liaison : c'est elle qui « s'ouvre » pour s'accrocher aux voisines." },
  { id:"ammoniac", n:"Ammoniac", e:"🧴", cat:"mol", f:"NH3", d:"Gaz piquant, base de tous les engrais azotés. Le procédé Haber-Bosch, qui le fabrique à partir de l'air, nourrit indirectement la moitié de l'humanité." },
  { id:"ethanol", n:"Éthanol (alcool)", e:"🍶", cat:"mol", f:"C2H6O", d:"L'alcool des boissons, produit par des levures qui mangent du sucre. Aussi désinfectant et biocarburant." },
  { id:"acide_acetique", n:"Acide acétique", e:"🧪", cat:"mol", f:"C2H4O2", d:"Ce qui rend le vinaigre acide : de l'alcool que des bactéries ont oxydé." },
  { id:"h2so4", n:"Acide sulfurique", e:"⚗️", cat:"mol", f:"H2SO4", d:"Le produit chimique le plus fabriqué au monde (engrais, batteries de voiture). L'« huile de vitriol » des alchimistes. Très corrosif." },
  { id:"hcl", n:"Acide chlorhydrique", e:"🧪", cat:"mol", f:"HCl", d:"Ton estomac en produit pour digérer. L'« esprit de sel » des alchimistes." },
  { id:"sel", n:"Sel (chlorure de sodium)", e:"🧂", cat:"mol", f:"NaCl", d:"Un métal explosif (sodium) + un gaz toxique (chlore) = ce que tu mets sur tes frites. Pour Paracelse, le « Sel » était l'un des trois principes de la matière : le corps, ce qui reste solide.", s:"Cristal cubique : sodium et chlore alternés comme un damier en 3D. Regarde un grain à la loupe : c'est un petit cube !" },
  { id:"soude", n:"Soude caustique", e:"🧴", cat:"mol", f:"NaOH", d:"Base très corrosive. Sert à fabriquer le savon et le papier ; c'est le déboucheur de canalisations." },
  { id:"carbonate_sodium", n:"Carbonate de sodium", e:"🧺", cat:"mol", f:"Na2CO3", d:"Les « cristaux de soude » : lessive d'autrefois et ingrédient clé du verre, qu'il fait fondre à plus basse température." },
  { id:"potasse", n:"Potasse", e:"🪣", cat:"mol", f:"K2CO3", d:"Carbonate de potassium, autrefois tiré des cendres de bois lavées dans un pot (« pot-ash »). Savon mou, verre, engrais." },
  { id:"na2o", n:"Oxyde de sodium", e:"⚪", cat:"mol", f:"Na2O", d:"Forme sous laquelle le sodium se trouve dans le verre et les laves." },
  { id:"magnesie", n:"Magnésie", e:"🤍", cat:"min", f:"MgO", d:"Oxyde de magnésium : poudre blanche très résistante à la chaleur (briques de fours), présente dans les roches volcaniques." },
  { id:"cellulose", n:"Cellulose", e:"🌿", cat:"org", f:"C6H10O5", d:"Le polymère le plus abondant sur Terre : des milliers de molécules de glucose enchaînées en longues fibres. Bois, coton, papier en sont faits.", s:"Longues chaînes droites de glucose, empilées et soudées entre elles : des fibres très solides que presque aucun animal ne sait digérer." },
  { id:"hemicellulose", n:"Hémicellulose", e:"🌾", cat:"org", f:"C5H8O4", d:"Polymère de sucres ramifié qui fait le lien entre les fibres de cellulose et la lignine." },
  { id:"lignine", n:"Lignine", e:"🪵", cat:"org", f:"C10H12O3", d:"La « colle » en 3D du bois, qui rend les arbres rigides et imperméables. C'est elle qui fait jaunir le vieux papier au soleil.", s:"Réseau 3D désordonné de petits cycles carbonés." },
  { id:"resine", n:"Résine (colophane)", e:"🌲", cat:"org", f:"C20H30O2", d:"La sève collante des pins, qui cicatrise les blessures de l'arbre. Les violonistes en frottent leur archet." },
  { id:"amidon", n:"Amidon", e:"🥔", cat:"food", f:"C6H10O5", d:"Réserve d'énergie des plantes : pomme de terre, blé, riz. Exactement la même formule que la cellulose ! Seule la façon d'accrocher les glucoses diffère : l'amidon se digère, la cellulose non.", s:"Chaînes de glucose enroulées en hélice (au lieu de droites pour la cellulose)." },
  { id:"glucose", n:"Glucose", e:"🍬", cat:"food", f:"C6H12O6", d:"Le sucre-carburant de toutes les cellules vivantes, fabriqué par les plantes avec de la lumière, de l'eau et du CO₂.", s:"Un anneau de 5 carbones et 1 oxygène, décoré de groupes –OH." },
  { id:"saccharose", n:"Sucre (saccharose)", e:"🍚", cat:"food", f:"C12H22O11", d:"Le sucre de table : un glucose + un fructose accrochés. Tiré de la canne à sucre ou de la betterave." },
  { id:"lactose", n:"Lactose", e:"🥛", cat:"food", f:"C12H22O11", d:"Le sucre du lait : glucose + galactose. Même formule que le sucre de table, mais assemblé différemment." },
  { id:"graisse", n:"Graisse (triglycéride)", e:"🥓", cat:"food", f:"C57H110O6", d:"Trois longues chaînes d'acides gras accrochées à un glycérol. Réserve d'énergie des animaux. Avec de la soude, ça devient du savon.", s:"Une « fourchette » à 3 dents : 3 chaînes hydrocarbonées sur un petit squelette de glycérol." },
  { id:"huile", n:"Huile végétale", e:"🫒", cat:"food", f:"C57H104O6", d:"Comme la graisse, mais ses chaînes ont des « coudes » (doubles liaisons) qui les empêchent de bien s'empiler : elle reste liquide." },
  { id:"proteine", n:"Protéine (moyenne)", e:"🧬", cat:"org", f:"C4.9H7.8N1.4O1.5S0.04", d:"Longues chaînes d'acides aminés repliées en formes précises : muscles, enzymes, anticorps, hormones. C'est l'azote qui les distingue des sucres et des graisses. (Formule moyenne par acide aminé.)", s:"Un « collier de perles » de 20 sortes d'acides aminés, replié en 3D comme un origami." },
  { id:"collagene", n:"Collagène", e:"🦵", cat:"org", f:"C4.4H6.9N1.3O1.4", d:"La protéine la plus abondante de ton corps : peau, tendons, cartilage, os. Cuit, il donne la gélatine.", s:"Trois chaînes tressées en triple hélice, comme une corde." },
  { id:"keratine", n:"Kératine", e:"💇", cat:"org", f:"C4.6H7.5N1.3O1.4S0.25", d:"Protéine riche en soufre : cheveux, ongles, laine, plumes, cornes, sabots. Le soufre forme des ponts entre les chaînes — d'où l'odeur des cheveux brûlés." },
  { id:"chlorophylle", n:"Chlorophylle", e:"🍃", cat:"org", f:"C55H72MgN4O5", d:"Le pigment vert des plantes, avec un atome de magnésium en son centre. Elle capte la lumière rouge et bleue et renvoie le vert.", s:"Un grand anneau (porphyrine) avec un magnésium au milieu — presque le même que l'hème de ton sang, qui a un fer à la place !" },
  { id:"adn", n:"ADN", e:"🧬", cat:"org", f:"C9.75H12.25N3.75O6P", d:"La molécule de l'hérédité : une double hélice. Déroulé, l'ADN d'une seule de tes cellules mesure environ 2 mètres. (Formule moyenne par maillon.)", s:"Une échelle torsadée : montants sucre-phosphate, barreaux faits de 4 « lettres » A, T, G, C." },
  { id:"cafeine", n:"Caféine", e:"☕", cat:"food", f:"C8H10N4O2", d:"Molécule amère fabriquée par le caféier pour repousser les insectes. Chez toi, elle bloque le signal de fatigue." },

  /* ===== Minéraux & roches ===== */
  { id:"silice", n:"Silice (quartz)", e:"🔹", cat:"min", f:"SiO2", d:"Le minéral le plus courant des continents. Cristallisée : quartz, améthyste, cristal de roche. Désordonnée : verre. Le sable en est surtout fait.", s:"Chaque silicium entouré de 4 oxygènes (tétraèdres) reliés en réseau 3D." },
  { id:"calcaire", n:"Calcaire (carbonate de calcium)", e:"🐚", cat:"min", f:"CaCO3", d:"Coquillages, craie, marbre, perles, tartre de la bouilloire, stalactites : tout ça, c'est du CaCO₃. Beaucoup de calcaire vient de squelettes d'organismes marins." },
  { id:"gypse", n:"Gypse", e:"🤍", cat:"min", f:"CaSO4·2H2O", d:"Minéral si tendre qu'on le raye à l'ongle. Cuit, il donne le plâtre ; et le plâtre qui « prend » redevient… du gypse.", s:"Feuillets de sulfate de calcium séparés par des couches de molécules d'eau." },
  { id:"alumine", n:"Alumine (corindon)", e:"⬜", cat:"min", f:"Al2O3", d:"Oxyde d'aluminium. Cristallisé : le corindon, 2ᵉ minéral le plus dur après le diamant. Une pincée de chrome → rubis ; fer et titane → saphir." },
  { id:"hematite", n:"Hématite (oxyde de fer)", e:"🟥", cat:"min", f:"Fe2O3", d:"Le principal minerai de fer. C'est lui qui rend Mars rouge, colore la terre cuite et servait d'ocre rouge aux peintres de Lascaux." },
  { id:"magnetite", n:"Magnétite", e:"🧲", cat:"min", f:"Fe3O4", d:"Pierre naturellement aimantée : la première boussole. Certains oiseaux en ont des grains pour s'orienter." },
  { id:"rouille", n:"Rouille", e:"🟧", cat:"min", f:"Fe2O3·H2O", d:"Oxyde de fer hydraté. Elle s'effrite et laisse passer l'air, donc le fer continue de rouiller jusqu'au cœur (contrairement à l'aluminium, protégé par son oxyde)." },
  { id:"hydroxyapatite", n:"Hydroxyapatite", e:"🦷", cat:"min", f:"Ca10(PO4)6(OH)2", d:"Le minéral des os et des dents : phosphate de calcium. L'émail des dents en est fait à 96 %." },
  { id:"kaolinite", n:"Kaolin (kaolinite)", e:"🏺", cat:"min", f:"Al2Si2O5(OH)4", d:"Argile blanche très pure, base de la porcelaine (Limoges). Aussi dans le papier glacé et certains cosmétiques.", s:"Empilement de feuillets microscopiques : entre eux, l'eau se glisse, et l'argile devient modelable." },
  { id:"feldspath", n:"Feldspath", e:"🩷", cat:"min", f:"KAlSi3O8", d:"Le minéral le plus abondant de la croûte terrestre ; c'est lui qui donne au granit ses cristaux roses ou blancs." },
  { id:"mica", n:"Mica", e:"✨", cat:"min", f:"KAl3Si3O10(OH)2", d:"Se clive en feuilles transparentes ultra-fines : les paillettes naturelles des maquillages et des roches qui brillent." },
  { id:"pyrite", n:"Pyrite", e:"🟨", cat:"min", f:"FeS2", d:"L'« or des fous » : cristaux cubiques dorés presque parfaits. Frappée contre l'acier, elle fait des étincelles (d'où son nom, du grec « feu »)." },
  { id:"galene", n:"Galène", e:"⬛", cat:"min", f:"PbS", d:"Principal minerai de plomb, en cubes gris argenté. Elle servait de détecteur dans les premiers postes radio." },
  { id:"cinabre", n:"Cinabre", e:"🔴", cat:"min", f:"HgS", d:"Minerai rouge vif de mercure : le vermillon des peintres. Pour les alchimistes, l'union parfaite du Soufre et du Mercure, les deux principes des métaux." },
  { id:"malachite", n:"Malachite (vert-de-gris)", e:"💚", cat:"gem", f:"Cu2CO3(OH)2", d:"Minéral vert à bandes et minerai de cuivre. C'est (presque) la même chose que la patine verte sur les toits en cuivre et la Statue de la Liberté." },
  { id:"sable", n:"Sable", e:"🏖️", cat:"min", d:"Des grains de roche érodée, surtout du quartz. Les plages blanches des tropiques sont souvent faites de calcaire (débris de coraux et coquillages).", c:[["silice",90],["feldspath",5],["calcaire",3],["hematite",2]] },
  { id:"argile", n:"Argile", e:"🏺", cat:"min", d:"Des minéraux en feuillets microscopiques. Mouillée, elle devient plastique et se modèle ; cuite, elle durcit pour toujours (poterie, brique).", c:[["kaolinite",60],["silice",20],["mica",8],["hematite",7],["calcaire",5]] },
  { id:"granite", n:"Granit", e:"🪨", cat:"min", d:"La roche des continents, née d'un magma refroidi très lentement en profondeur : on voit les cristaux à l'œil nu (quartz gris, feldspath rose, mica noir brillant).", c:[["feldspath",60],["silice",30],["mica",10]] },
  { id:"gravier", n:"Gravier", e:"🪨", cat:"cons", d:"Morceaux de roche concassée (granit, calcaire…), squelette du béton et des routes.", c:[["granite",60],["calcaire",40]] },
  { id:"marbre", n:"Marbre", e:"🏛️", cat:"min", d:"Du calcaire recuit et recristallisé par la chaleur et la pression des montagnes. Les veines colorées viennent d'impuretés (fer, argile).", c:[["calcaire",98],["silice",1],["hematite",1]] },
  { id:"craie", n:"Craie", e:"🖍️", cat:"min", d:"Des milliards de squelettes microscopiques d'algues accumulés au fond des mers (falaises d'Étretat, de Douvres). Les craies de tableau modernes sont souvent… du gypse.", c:[["calcaire",98],["silice",2]] },
  { id:"basalte", n:"Basalte", e:"🌑", cat:"min", d:"La roche du fond des océans et de nombreux volcans : de la lave refroidie. Elle forme parfois des colonnes hexagonales (Chaussée des Géants).", c:LAVE },
  { id:"obsidienne", n:"Obsidienne", e:"🖤", cat:"min", d:"Verre volcanique noir : une lave refroidie si vite que les atomes n'ont pas eu le temps de s'ordonner. Son tranchant est plus fin que celui d'un scalpel.", c:[["silice",74],["alumine",14],["na2o",4],["potasse",4],["hematite",2],["chaux",1],["magnesie",1]], s:"Désordonnée comme le verre : aucun cristal." },
  { id:"bauxite", n:"Bauxite", e:"🟫", cat:"min", d:"Roche rougeâtre, minerai de l'aluminium. Nommée d'après Les Baux-de-Provence, où on l'a découverte en 1821.", c:[["alumine",55],["hematite",20],["eau",17],["silice",8]] },
  { id:"cendre", n:"Cendre", e:"🩶", cat:"min", d:"Ce qui reste quand le feu a emporté le carbone, l'hydrogène et l'oxygène : les minéraux que la plante avait puisés dans le sol. Mélangée à l'eau, elle donnait la lessive d'autrefois.", c:[["calcaire",40],["potasse",25],["silice",15],["magnesie",10],["hydroxyapatite",8],["hematite",2]] },
  { id:"eau_mer", n:"Eau de mer", e:"🌊", cat:"esot", d:"De l'eau avec environ 35 g de sels par litre, surtout du sel de table, apportés par les rivières pendant des millions d'années.", c:[["eau",96.5],["sel",2.75],["Mg",0.13],["S",0.09],["O",0.18],["Ca",0.04],["K",0.04]] },
  { id:"humus", n:"Humus", e:"🪱", cat:"org", d:"Matière organique décomposée par les vers, les champignons et les bactéries : noire, fertile, elle retient l'eau comme une éponge.", c:[["C",55],["O",33],["H",5],["N",4],["S",1],["P",1],["Ca",1]] },

  /* ===== Pierres précieuses & carbone ===== */
  { id:"diamant", n:"Diamant", e:"💎", cat:"gem", f:"C", d:"Du carbone pur, formé à 150 km sous terre. Le matériau naturel le plus dur. Exactement la même composition que la mine de crayon !", s:"Chaque atome de carbone lié à 4 voisins en tétraèdre : un réseau 3D rigide dans toutes les directions." },
  { id:"graphite", n:"Graphite", e:"✏️", cat:"min", f:"C", d:"Du carbone pur, comme le diamant, mais en feuillets empilés qui glissent les uns sur les autres : c'est pour ça que la mine de crayon laisse une trace. Il conduit l'électricité.", s:"Feuillets d'hexagones (comme du grillage à poule) empilés et faiblement liés." },
  { id:"graphene", n:"Graphène", e:"🕸️", cat:"min", f:"C", d:"Un seul feuillet de graphite, épais d'un atome. 200 fois plus résistant que l'acier à épaisseur égale, transparent, conducteur. Découvert en 2004… avec du scotch !", s:"Un unique feuillet d'hexagones de carbone." },
  { id:"rubis", n:"Rubis", e:"❤️", cat:"gem", d:"Du corindon (alumine) + une pincée de chrome = rouge sang.", c:[["alumine",99],["Cr",1]] },
  { id:"saphir", n:"Saphir", e:"💙", cat:"gem", d:"Du corindon + un peu de fer et de titane = bleu. Les verres de montres de luxe sont en saphir synthétique, quasi inrayables.", c:[["alumine",99],["Fe",0.6],["Ti",0.4]] },
  { id:"beryl", n:"Béryl", e:"🔷", cat:"gem", f:"Be3Al2Si6O18", d:"Silicate de béryllium et d'aluminium. Incolore à l'état pur ; coloré, il devient émeraude (vert) ou aigue-marine (bleu)." },
  { id:"emeraude", n:"Émeraude", e:"💚", cat:"gem", d:"Du béryl + des traces de chrome = vert intense.", c:[["beryl",99.5],["Cr",0.5]] },
  { id:"amethyste", n:"Améthyste", e:"💜", cat:"gem", d:"Du quartz violet : des traces de fer + la radioactivité naturelle des roches qui modifie le cristal.", c:[["silice",99.9],["Fe",0.1]] },
  { id:"ambre", n:"Ambre", e:"🟠", cat:"gem", f:"C10H16O", d:"De la résine de conifère fossilisée depuis des millions d'années, parfois avec des insectes piégés dedans." },
  { id:"perle", n:"Perle", e:"🦪", cat:"gem", d:"Des couches de nacre (carbonate de calcium + protéine) déposées par l'huître autour d'un intrus.", c:[["calcaire",92],["proteine",5],["eau",3]] },

  /* ===== Métaux & alliages ===== */
  { id:"acier", n:"Acier", e:"🔩", cat:"met", d:"Du fer avec un peu de carbone (moins de 2 %). Les petits atomes de carbone bloquent le glissement des atomes de fer : l'acier est bien plus dur que le fer pur. Le matériau de la révolution industrielle.", c:[["Fe",98.5],["C",0.8],["Mn",0.7]], s:"Cristaux de fer avec des atomes de carbone coincés dans les interstices." },
  { id:"inox", n:"Acier inoxydable", e:"🍴", cat:"met", d:"De l'acier avec du chrome et du nickel. Le chrome forme une couche d'oxyde invisible qui se répare toute seule : il ne rouille pas. Couverts, éviers, instruments chirurgicaux.", c:[["Fe",70.5],["Cr",18],["Ni",10],["Mn",1.4],["C",0.1]] },
  { id:"fonte", n:"Fonte", e:"🍳", cat:"met", d:"Du fer très chargé en carbone (2 à 4 %). Elle fond plus facilement et se moule bien, mais elle est cassante. Poêles, plaques d'égout, radiateurs anciens.", c:[["Fe",95],["C",3.5],["Si",1.5]] },
  { id:"bronze", n:"Bronze", e:"🔔", cat:"met", d:"Cuivre + étain : le premier grand alliage de l'humanité (âge du bronze, vers -3000). Cloches, statues, médailles.", c:[["Cu",88],["Sn",12]] },
  { id:"laiton", n:"Laiton", e:"🎺", cat:"met", d:"Cuivre + zinc : doré et facile à usiner. Instruments de musique (« les cuivres »), poignées de porte, clés.", c:[["Cu",65],["Zn",35]] },
  { id:"or18", n:"Or 18 carats", e:"💍", cat:"met", d:"75 % d'or, le reste en argent et cuivre. L'or pur (24 carats) est trop mou pour un bijou du quotidien.", c:[["Au",75],["Ag",12.5],["Cu",12.5]] },
  { id:"electrum", n:"Électrum", e:"🪙", cat:"met", d:"Alliage naturel d'or et d'argent : les toutes premières pièces de monnaie (royaume de Lydie, vers -600).", c:[["Au",70],["Ag",30]] },
  { id:"argent925", n:"Argent sterling", e:"🥄", cat:"met", d:"92,5 % d'argent + du cuivre pour le durcir : l'argenterie et les bijoux poinçonnés « 925 ».", c:[["Ag",92.5],["Cu",7.5]] },
  { id:"duralumin", n:"Duralumin", e:"✈️", cat:"met", d:"Aluminium renforcé par du cuivre et du magnésium : la structure des avions depuis les Zeppelins.", c:[["Al",94],["Cu",4],["Mg",1],["Mn",1]] },
  { id:"soudure", n:"Soudure à l'étain", e:"🔧", cat:"met", d:"Fond à 227 °C : sert à relier les composants électroniques sur les cartes.", c:[["Sn",99.3],["Cu",0.7]] },
  { id:"ferrocerium", n:"Pierre à briquet", e:"🪨", cat:"met", d:"Alliage de terres rares (cérium, lanthane) et de fer : gratté, il projette des étincelles très chaudes.", c:[["Ce",50],["La",25],["Fe",19],["Nd",4],["Pr",2]] },
  { id:"aimant", n:"Aimant néodyme", e:"🧲", cat:"met", f:"Nd2Fe14B", d:"Les aimants permanents les plus puissants : moteurs de voitures électriques, éoliennes, disques durs, écouteurs." },
  { id:"miroir", n:"Miroir", e:"🪞", cat:"met", d:"Une plaque de verre dont le dos est recouvert d'une couche d'argent (ou d'aluminium) de quelques millièmes de millimètre.", c:[["verre",99.5],["Ag",0.5]] },

  /* ===== Construction ===== */
  { id:"chaux", n:"Chaux vive", e:"⚪", cat:"cons", f:"CaO", d:"Du calcaire cuit à 900 °C, qui a perdu son CO₂. Elle réagit violemment avec l'eau en chauffant." },
  { id:"chaux_eteinte", n:"Chaux éteinte", e:"🪣", cat:"cons", f:"Ca(OH)2", d:"Le mortier des Romains et des cathédrales. Elle durcit lentement en reprenant le CO₂ de l'air… et redevient du calcaire : la boucle est bouclée." },
  { id:"platre", n:"Plâtre", e:"⬜", cat:"cons", f:"CaSO4·0.5H2O", d:"Du gypse cuit à ~150 °C qui a perdu une partie de son eau. Remis dans l'eau, il la reprend et durcit en cristaux enchevêtrés : il redevient du gypse !", s:"Poudre de cristaux déshydratés, avides d'eau." },
  { id:"ciment", n:"Ciment", e:"🏗️", cat:"cons", d:"Calcaire + argile cuits à 1450 °C puis broyés avec un peu de gypse. Mélangé à l'eau, il fait pousser des cristaux en aiguilles qui collent tout ensemble.", c:[["chaux",63],["silice",21],["alumine",6],["gypse",5],["hematite",3],["magnesie",2]] },
  { id:"mortier", n:"Mortier", e:"🧱", cat:"cons", d:"Ciment (ou chaux) + sable + eau : la « colle » entre les briques et les pierres.", c:[["sable",65],["ciment",20],["eau",15]] },
  { id:"beton", n:"Béton", e:"🏢", cat:"cons", d:"Ciment + eau + sable + gravier. Le matériau le plus utilisé au monde après l'eau. Le béton romain (chaux + cendre volcanique) tient depuis 2000 ans.", c:[["gravier",52],["sable",30],["ciment",12],["eau",6]], s:"Des cailloux et du sable soudés par une pâte de ciment durci." },
  { id:"brique", n:"Brique", e:"🧱", cat:"cons", d:"De l'argile moulée et cuite vers 1000 °C. Sa couleur rouge vient de l'oxyde de fer.", c:[["silice",55],["alumine",25],["hematite",7],["chaux",5],["magnesie",3],["potasse",3],["na2o",2]] },
  { id:"verre", n:"Verre", e:"🪟", cat:"cons", d:"Un solide… organisé comme un liquide figé. Du sable (silice) fondu avec de la soude (pour fondre plus bas) et de la chaux (pour ne pas se dissoudre dans l'eau).", c:[["silice",72],["na2o",14],["chaux",10],["magnesie",3],["alumine",1]], s:"Mêmes tétraèdres SiO₄ que le quartz, mais assemblés en désordre : pas de cristal, d'où la transparence." },
  { id:"porcelaine", n:"Porcelaine", e:"🍵", cat:"cons", d:"Kaolin + quartz + feldspath cuits à 1400 °C : blanche, dure, presque translucide. Inventée en Chine il y a plus de 1000 ans.", c:[["kaolinite",50],["silice",25],["feldspath",25]] },
  { id:"asphalte", n:"Asphalte (enrobé)", e:"🛣️", cat:"cons", d:"Le revêtement des routes : du gravier collé par du bitume.", c:[["gravier",94],["bitume",6]] },
  { id:"placo", n:"Plaque de plâtre (placo)", e:"📋", cat:"cons", d:"Du gypse pris en sandwich entre deux feuilles de carton : les cloisons de la plupart des maisons.", c:[["gypse",90],["papier",10]] },
  { id:"fulgurite", n:"Fulgurite", e:"⚡", cat:"min", d:"Un tube de verre naturel, creux et tortueux, formé quand la foudre frappe le sable et le fait fondre en une fraction de seconde.", c:[["silice",95],["alumine",3],["hematite",2]] },

  /* ===== Plastiques & polymères ===== */
  { id:"pe", n:"Polyéthylène (PE)", e:"🛍️", cat:"plas", f:"C2H4", d:"Le plastique le plus produit au monde : sacs, bouteilles de lait, films alimentaires. Juste une très longue chaîne de –CH₂–. Même recette atomique que l'éthylène, et presque la même que la paraffine des bougies !", s:"Des chaînes de dizaines de milliers de carbones, enchevêtrées comme des spaghettis." },
  { id:"pp", n:"Polypropylène (PP)", e:"🥡", cat:"plas", f:"C3H6", d:"Boîtes alimentaires, bouchons, pare-chocs, chaises de jardin. Résiste mieux à la chaleur que le PE." },
  { id:"pvc", n:"PVC", e:"🚰", cat:"plas", f:"C2H3Cl", d:"Tuyaux, fenêtres, gaines de câbles. 57 % de sa masse est du chlore… qui vient du sel de mer !" },
  { id:"pet", n:"PET (polyester)", e:"🍼", cat:"plas", f:"C10H8O4", d:"Les bouteilles d'eau ET les fibres polyester des vêtements polaires : c'est le même plastique, sous deux formes." },
  { id:"ps", n:"Polystyrène", e:"📦", cat:"plas", f:"C8H8", d:"Gobelets, boîtiers de CD. Expansé avec du gaz, il devient le polystyrène blanc des emballages (98 % d'air)." },
  { id:"nylon", n:"Nylon", e:"🧦", cat:"plas", f:"C12H22N2O2", d:"La première fibre synthétique (1935) : collants, cordes, brosses à dents. Il contient de l'azote, comme la soie qu'il devait imiter." },
  { id:"pmma", n:"Plexiglas (PMMA)", e:"🔲", cat:"plas", f:"C5H8O2", d:"Verre acrylique : plus léger et moins cassant que le verre. Aquariums géants, vitres d'avion, enseignes." },
  { id:"pc", n:"Polycarbonate", e:"🥽", cat:"plas", f:"C16H14O3", d:"Transparent et quasi incassable : visières, verres de lunettes, CD et Blu-ray." },
  { id:"teflon", n:"Téflon (PTFE)", e:"🍳", cat:"plas", f:"C2F4", d:"Une chaîne de carbone entièrement entourée d'atomes de fluor : rien n'y accroche. Découvert par accident en 1938.", s:"Comme le polyéthylène, mais chaque hydrogène remplacé par un fluor." },
  { id:"silicone", n:"Silicone", e:"🧁", cat:"plas", f:"C2H6OSi", d:"Une chaîne de silicium et d'oxygène (comme le quartz) décorée de groupes carbonés : souple, résiste à la chaleur. Moules à gâteau, joints, implants.", s:"Squelette –Si–O–Si–O– : à mi-chemin entre le sable et le plastique." },
  { id:"caoutchouc", n:"Caoutchouc naturel", e:"🎈", cat:"plas", f:"C5H8", d:"Le latex de l'hévéa : des chaînes de polyisoprène. Collant et fragile tant qu'il n'est pas « vulcanisé » avec du soufre.", s:"Chaînes en pelote qui se déroulent quand on tire, et se ré-enroulent : d'où l'élasticité." },
  { id:"pneu", n:"Pneu", e:"🛞", cat:"plas", d:"Caoutchouc vulcanisé renforcé de noir de carbone (d'où sa couleur noire), de fils d'acier et de textile.", c:[["caoutchouc",40],["suie",28],["acier",13],["silice",8],["nylon",5],["huile",2.5],["S",2],["Zn",1.5]] },
  { id:"bakelite", n:"Bakélite", e:"☎️", cat:"plas", f:"C7H6O", d:"Le tout premier plastique entièrement synthétique (1907) : vieux téléphones, prises électriques. Une fois durci, il ne fond plus jamais." },

  /* ===== Combustibles ===== */
  { id:"petrole", n:"Pétrole", e:"🛢️", cat:"fuel", d:"Les restes de plancton enfouis et « cuits » pendant des millions d'années. Un mélange de milliers d'hydrocarbures (carbone + hydrogène). On le raffine en gaz, essence, kérosène, bitume… et en plastiques.", c:[["octane",40],["bitume",40],["propane",8],["methane",4],["paraffine",6],["S",2]] },
  { id:"gaz_naturel", n:"Gaz naturel", e:"🔥", cat:"fuel", d:"Surtout du méthane, piégé sous terre avec le pétrole. Le gaz de la cuisinière et du chauffage.", c:[["methane",90],["propane",5],["diazote",3],["co2",2]] },
  { id:"bitume", n:"Bitume", e:"⬛", cat:"fuel", d:"La partie la plus lourde et collante du pétrole : des molécules géantes. Déjà utilisé pour étanchéifier les bateaux à Babylone.", c:[["C",84],["H",10],["S",4],["N",1],["O",1]] },
  { id:"charbon", n:"Charbon (houille)", e:"⚫", cat:"fuel", d:"Les forêts géantes du Carbonifère (-300 millions d'années), enfouies et compressées.", c:[["C",80],["O",8],["H",5],["cendre",4],["N",1.5],["S",1.5]] },
  { id:"charbon_bois", n:"Charbon de bois", e:"♨️", cat:"fuel", d:"Du bois chauffé sans air : l'eau et les gaz partent, il reste surtout du carbone. Brûle plus chaud et sans fumée.", c:[["C",85],["O",6],["cendre",6],["H",3]] },
  { id:"suie", n:"Suie (noir de carbone)", e:"🌑", cat:"fuel", d:"Du carbone presque pur en particules de quelques nanomètres. Encre de Chine, pneus, mascara.", c:[["C",96],["O",2],["H",1],["S",1]] },
  { id:"encre", n:"Encre d'imprimerie", e:"🖋️", cat:"fuel", d:"Des pigments (noir de carbone) dispersés dans de l'huile et de la résine.", c:[["huile",60],["suie",20],["resine",20]] },
  { id:"mine", n:"Mine de crayon", e:"✏️", cat:"min", d:"Contrairement à son nom, il n'y a pas de plomb : c'est du graphite mélangé à de l'argile. Plus d'argile = mine plus dure (H), plus de graphite = plus grasse (B).", c:[["graphite",65],["argile",35]] },

  /* ===== Vivant & naturel ===== */
  { id:"papier", n:"Papier", e:"📄", cat:"org", d:"Des fibres de cellulose (bois, coton) séparées dans l'eau puis feutrées en feuille. On y ajoute souvent du kaolin pour le rendre blanc et lisse.", c:[["cellulose",80],["hemicellulose",8],["kaolinite",6],["lignine",4],["eau",2]] },
  { id:"coton", n:"Coton", e:"👕", cat:"org", d:"Les poils qui entourent les graines du cotonnier : de la cellulose presque pure.", c:[["cellulose",94],["eau",3],["proteine",1.5],["cendre",1],["graisse",0.5]] },
  { id:"lin", n:"Lin", e:"🪢", cat:"org", d:"Fibres tirées de la tige de la plante : le plus vieux textile connu (plus de 30 000 ans).", c:[["cellulose",72],["hemicellulose",17],["eau",8],["lignine",3]] },
  { id:"laine", n:"Laine", e:"🐑", cat:"org", d:"Les poils du mouton : de la kératine, comme tes cheveux, recouverte de lanoline (une graisse).", c:[["keratine",85],["graisse",10],["eau",5]] },
  { id:"soie", n:"Soie", e:"🐛", cat:"org", d:"Une protéine (fibroïne) filée par la chenille du bombyx pour construire son cocon : jusqu'à 1,5 km de fil par cocon.", c:[["proteine",98],["eau",2]] },
  { id:"cuir", n:"Cuir", e:"👞", cat:"org", d:"De la peau d'animal (collagène) tannée pour qu'elle ne pourrisse pas.", c:[["collagene",85],["eau",10],["graisse",5]] },
  { id:"os", n:"Os", e:"🦴", cat:"org", d:"Un composite vivant : du minéral dur (hydroxyapatite) armé de fibres souples de collagène. Plus solide que le béton à poids égal.", c:[["hydroxyapatite",65],["collagene",25],["eau",10]], s:"Du « béton armé » biologique : cristaux de phosphate de calcium autour d'un treillis de collagène." },
  { id:"email", n:"Émail dentaire", e:"🦷", cat:"org", d:"La matière la plus dure de ton corps : presque entièrement minérale.", c:[["hydroxyapatite",96],["eau",3],["proteine",1]] },
  { id:"cheveu", n:"Cheveu", e:"💇‍♀️", cat:"org", d:"De la kératine, avec un peu d'eau et de lipides. Un cheveu peut supporter environ 100 g.", c:[["keratine",90],["eau",8],["graisse",2]] },
  { id:"corps", n:"Corps humain", e:"🧍", cat:"org", d:"≈60 % d'eau. En comptant en masse, tu es surtout de l'oxygène ; en comptant les atomes, 62 % sont des atomes d'hydrogène. Une douzaine d'éléments font 99,9 % de toi.", c:[["O",65],["C",18.5],["H",9.5],["N",3.2],["Ca",1.5],["P",1],["K",0.4],["S",0.3],["Na",0.2],["Cl",0.2],["Mg",0.05],["Fe",0.006]] },
  { id:"sang", n:"Sang", e:"🩸", cat:"org", d:"Surtout de l'eau, des protéines (dont l'hémoglobine, avec son atome de fer qui transporte l'oxygène), du sel et du sucre.", c:[["eau",80],["proteine",18],["sel",0.9],["graisse",0.5],["glucose",0.1],["Fe",0.05]] },
  { id:"feuille", n:"Feuille", e:"🍃", cat:"org", d:"L'usine à sucre de la plante : elle capte la lumière avec la chlorophylle et fabrique du glucose avec l'eau et le CO₂ de l'air.", c:[["eau",75],["cellulose",10],["hemicellulose",6],["proteine",4],["lignine",2],["cendre",2],["chlorophylle",1]] },
  { id:"levure", n:"Levure", e:"🦠", cat:"org", d:"Un champignon microscopique qui mange du sucre et rejette de l'alcool et du CO₂ : il fait lever le pain et fermenter le vin et la bière.", c:[["proteine",45],["amidon",35],["adn",8],["graisse",6],["cendre",6]] },
  { id:"cire", n:"Cire d'abeille", e:"🐝", cat:"org", f:"C46H92O2", d:"Fabriquée par les abeilles avec des glandes de leur ventre pour construire les alvéoles hexagonales." },
  { id:"coquillage", n:"Coquillage", e:"🐚", cat:"org", d:"Du carbonate de calcium cristallisé autour d'une trame de protéines, fabriqué par le mollusque à partir de l'eau de mer.", c:[["calcaire",95],["proteine",5]] },

  /* ===== Cuisine ===== */
  { id:"lait", n:"Lait", e:"🥛", cat:"food", d:"Une émulsion : des gouttelettes de graisse et des protéines (caséine) en suspension dans de l'eau sucrée (lactose). Il est blanc parce que ces gouttelettes diffusent la lumière.", c:[["eau",87],["lactose",4.8],["graisse",3.7],["proteine",3.3],["hydroxyapatite",0.7]] },
  { id:"beurre", n:"Beurre", e:"🧈", cat:"food", d:"La graisse du lait séparée en battant la crème : les gouttelettes s'agglomèrent.", c:[["graisse",82],["eau",16],["proteine",1],["lactose",1]] },
  { id:"farine", n:"Farine", e:"🌾", cat:"food", d:"Des grains de blé moulus : surtout de l'amidon, plus des protéines (le gluten) qui donnent son élasticité à la pâte.", c:[["amidon",72],["eau",13],["proteine",11],["cellulose",3],["graisse",1]] },
  { id:"pain", n:"Pain", e:"🍞", cat:"food", d:"Farine + eau + levure + sel, cuits. Les trous de la mie, ce sont les bulles de CO₂ rejetées par la levure.", c:[["amidon",50],["eau",35],["proteine",9],["cellulose",3],["sel",1.5],["graisse",1.5]] },
  { id:"miel", n:"Miel", e:"🍯", cat:"food", d:"Le nectar des fleurs concentré par les abeilles : surtout du glucose et du fructose. Il ne se périme (presque) jamais.", c:[["glucose",72],["eau",18],["saccharose",8],["proteine",1],["cendre",1]] },
  { id:"vinaigre", n:"Vinaigre", e:"🫗", cat:"food", d:"Du vin (ou cidre) dont l'alcool a été transformé en acide acétique par des bactéries.", c:[["eau",94],["acide_acetique",6]] },
  { id:"vin", n:"Vin", e:"🍷", cat:"food", d:"Du jus de raisin fermenté : les levures ont mangé le sucre et produit de l'alcool.", c:[["eau",86],["ethanol",12],["glucose",1.5],["cendre",0.5]] },
  { id:"chocolat", n:"Chocolat noir", e:"🍫", cat:"food", d:"Fèves de cacao fermentées, torréfiées et broyées, avec du sucre. Il contient de la théobromine, une cousine de la caféine (toxique pour les chiens).", c:[["saccharose",45],["graisse",32],["cellulose",8],["proteine",7],["amidon",4],["cendre",2],["cafeine",1],["eau",1]] },
  { id:"savon", n:"Savon", e:"🧼", cat:"mol", f:"C18H35NaO2", d:"Stéarate de sodium : une tête qui aime l'eau, une longue queue qui aime le gras. Les molécules entourent les saletés grasses et les emportent avec l'eau.", s:"Molécule « têtard » : tête ionique + queue hydrocarbonée." }
];

/* ---------- Recettes du creuset ----------
   [ingrédients], résultat, explication, sous-produits(optionnel)
*/
export const RECETTES: Recette[] = [
  // --- Éléments & météo
  [["eau","feu"],"vapeur","Chauffée à 100 °C, l'eau bout : ses molécules s'arrachent les unes des autres et s'envolent."],
  [["glace","feu"],"eau","À 0 °C, le cristal de glace se défait : les molécules glissent à nouveau les unes sur les autres."],
  [["eau","air"],"nuage","L'eau s'évapore, monte avec l'air chaud, se refroidit en altitude et se condense en gouttelettes autour de grains de poussière."],
  [["vapeur","air"],"nuage","La vapeur se refroidit dans l'air et se condense en milliards de gouttelettes."],
  [["nuage","air"],"foudre","Dans un nuage d'orage, les courants d'air font s'entrechoquer grêlons et cristaux de glace : ils se chargent électriquement jusqu'à la décharge."],
  [["terre","eau"],"boue","L'eau s'infiltre entre les grains et colle l'argile : de la boue."],
  [["terre","feu"],"lave","Au-delà de 1000 °C, la roche fond. Dans la nature, ça se passe à des dizaines de kilomètres sous nos pieds."],
  [["lave","air"],"basalte","En refroidissant à l'air, la lave cristallise lentement et devient du basalte."],
  [["lave","eau"],"obsidienne","Trempée brutalement, la lave n'a pas le temps de cristalliser : elle se fige en verre naturel. (Simplifié : l'obsidienne vient surtout de laves riches en silice.)"],
  [["terre","air"],"sable","Le vent et l'érosion réduisent les roches en grains (simplifié : il faut des milliers d'années)."],
  [["granite","eau"],"sable","Pendant des millénaires, l'eau désagrège le granit : le quartz résiste et devient du sable."],
  [["feldspath","eau"],"kaolinite","La pluie, un peu acide, transforme lentement le feldspath du granit en kaolin : c'est l'origine des argiles blanches (Limoges, Cornouailles)."],
  [["lumiere","eau"],"arc","Chaque goutte d'eau dévie et décompose la lumière blanche en couleurs."],
  [["eau","sel"],"eau_mer","Le sel se dissout : chaque grain se défait en ions sodium et chlorure entourés de molécules d'eau."],
  [["eau_mer","feu"],"sel","L'eau s'évapore, le sel reste : c'est le principe des marais salants (avec le Soleil et le vent)."],
  [["eau_mer","soleil"],"sel","Marais salants : le Soleil évapore l'eau, les cristaux de sel apparaissent."],
  [["feu","eau","terre","air"],"ether","Les quatre éléments réunis… Pour Aristote, la quintessence est justement ce qui n'est fait d'aucun des quatre. Clin d'œil alchimique : ça ne marche pas en vrai !"],

  // --- Atomes → molécules
  [["H","H"],"dihydrogene","Deux atomes d'hydrogène partagent leurs électrons : ils forment la molécule H₂."],
  [["O","O"],"dioxygene","Deux atomes d'oxygène s'associent : le O₂ qu'on respire."],
  [["O","O","O"],"ozone","Trois oxygènes : l'ozone, formé dans la haute atmosphère par les UV du Soleil."],
  [["N","N"],"diazote","Deux azotes liés par une triple liaison, l'une des plus solides de la chimie."],
  [["H","O"],"eau","2 H₂ + O₂ → 2 H₂O. La réaction libère énormément d'énergie : c'est ce qui propulse certaines fusées."],
  [["dihydrogene","dioxygene"],"eau","2 H₂ + O₂ → 2 H₂O : en brûlant, l'hydrogène ne produit que de l'eau."],
  [["C","O"],"co2","Le carbone s'unit à deux oxygènes : CO₂."],
  [["C","H"],"methane","Carbone + hydrogène = les hydrocarbures. Le plus simple : le méthane CH₄. En allongeant la chaîne de carbones : propane, essence, paraffine… puis polyéthylène, le plastique ! Ils ont tous la même recette atomique (C + H) : seule la longueur de la chaîne change."],
  [["C","C"],"graphite","À pression normale, les atomes de carbone s'arrangent en feuillets d'hexagones : le graphite."],
  [["C","F"],"teflon","Carbone + fluor : une chaîne de carbones entièrement « blindée » de fluor. Rien n'y accroche."],
  [["N","H"],"ammoniac","Un azote + trois hydrogènes : NH₃."],
  [["diazote","dihydrogene"],"ammoniac","Procédé Haber-Bosch (1909) : 450 °C, 200 fois la pression atmosphérique et un catalyseur au fer. Les engrais qui en sortent nourrissent la moitié de l'humanité."],
  [["Na","Cl"],"sel","Un métal qui explose dans l'eau + un gaz toxique… = le sel de table. La chimie, c'est magique."],
  [["Fe","O"],"hematite","Le fer s'oxyde : 4 Fe + 3 O₂ → 2 Fe₂O₃."],
  [["Al","O"],"alumine","L'aluminium s'oxyde instantanément à l'air : une couche d'alumine invisible le protège."],
  [["Si","O"],"silice","Silicium + oxygène = silice, la matière du sable et du quartz."],
  [["Fe","S"],"pyrite","Fer + soufre = pyrite, l'« or des fous »."],
  [["Pb","S"],"galene","Plomb + soufre = galène."],
  [["Hg","S"],"cinabre","Pour les alchimistes, l'union parfaite des deux principes : le Soufre (ce qui brûle) et le Mercure (ce qui coule). Toute la matière des métaux en découlerait."],
  [["H","H","feu"],"He","La fusion nucléaire : 4 noyaux d'hydrogène fusionnent en 1 noyau d'hélium. Il faut 15 millions de degrés — c'est ce qui se passe au cœur du Soleil."],
  [["dihydrogene","soleil"],"He","Au cœur du Soleil, l'hydrogène fusionne en hélium en libérant l'énergie qui nous éclaire."],

  // --- Feu & combustions
  [["C","feu"],"co2","Le carbone brûle : C + O₂ → CO₂."],
  [["charbon","feu"],"co2","Le charbon brûle en libérant du CO₂ ; il reste de la cendre.",["cendre"]],
  [["charbon_bois","feu"],"co2","Le charbon de bois brûle sans fumée, presque uniquement en CO₂.",["cendre"]],
  [["methane","feu"],"co2","CH₄ + 2 O₂ → CO₂ + 2 H₂O : la flamme bleue de la gazinière.",["vapeur"]],
  [["ethanol","feu"],"co2","L'alcool brûle avec une flamme bleue presque invisible.",["vapeur"]],
  [["diamant","feu"],"co2","Un diamant brûle vers 800 °C dans l'air ! Lavoisier l'a démontré en 1772 : c'est bien du carbone."],
  [["glucose","dioxygene"],"co2","La respiration cellulaire : tes cellules « brûlent » lentement le glucose pour en tirer de l'énergie. C'est pour ça que tu expires du CO₂ et de la vapeur d'eau.",["vapeur"]],
  [["bois","feu"],"cendre","À l'air libre, le bois brûle : carbone, hydrogène et oxygène partent en fumée (CO₂ + vapeur d'eau). Il ne reste que les minéraux.",["co2","vapeur"]],
  [["papier","feu"],"cendre","La cellulose brûle et part en CO₂ et vapeur ; restent les charges minérales.",["co2"]],
  [["coton","feu"],"cendre","Le coton (cellulose) brûle presque entièrement.",["co2"]],
  [["bois","feu","terre"],"charbon_bois","La charbonnière : on couvre le bois de terre pour l'étouffer. Chauffé sans air (pyrolyse), il perd son eau et ses gaz : reste le carbone."],
  [["os","feu"],"hydroxyapatite","Calciné, l'os perd son collagène : il reste le minéral blanc. La cendre d'os sert à faire la porcelaine « bone china »."],
  [["cinabre","feu"],"Hg","Chauffé, le cinabre libère du mercure (en vapeurs très toxiques) : la plus vieille réaction alchimique connue."],
  [["galene","feu"],"Pb","Grillée puis réduite, la galène donne du plomb — l'une des premières métallurgies."],

  // --- Minéraux & construction
  [["sable","feu"],"verre","Version simplifiée : la silice pure fond vers 1700 °C. En vrai on ajoute de la soude et de la chaux — essaie Sable + Carbonate de sodium + Calcaire + Feu."],
  [["silice","feu"],"verre","La silice fondue refroidie trop vite pour cristalliser = du verre (simplifié)."],
  [["sable","carbonate_sodium","calcaire","feu"],"verre","La vraie recette du verre, inchangée depuis l'Antiquité : sable (silice) + soude (pour fondre à « seulement » 1500 °C) + chaux (pour le rendre insoluble)."],
  [["foudre","sable"],"fulgurite","La foudre chauffe le sable à plus de 1800 °C en un instant : il fond et se fige en tube de verre."],
  [["verre","Ag"],"miroir","On dépose une fine couche d'argent au dos du verre (réaction de Tollens, 1835)."],
  [["argile","feu"],"brique","Vers 1000 °C, les feuillets d'argile perdent leur eau et se soudent : c'est irréversible."],
  [["kaolinite","feu"],"porcelaine","Le kaolin cuit à très haute température devient de la porcelaine (simplifié : on ajoute quartz et feldspath)."],
  [["kaolinite","silice","feldspath","feu"],"porcelaine","La recette chinoise : kaolin + quartz + feldspath, cuits à 1400 °C. Le feldspath fond et soude le tout."],
  [["calcaire","feu"],"chaux","À 900 °C : CaCO₃ → CaO + CO₂. Le four à chaux.",["co2"]],
  [["chaux","eau"],"chaux_eteinte","CaO + H₂O → Ca(OH)₂. La réaction chauffe tellement que l'eau peut bouillir !"],
  [["chaux_eteinte","co2"],"calcaire","Le mortier à la chaux durcit pendant des années en absorbant le CO₂ de l'air : il redevient du calcaire. Le cycle de la chaux est bouclé."],
  [["chaux_eteinte","air"],"calcaire","Au contact du CO₂ de l'air, la chaux éteinte durcit lentement et redevient du calcaire."],
  [["calcaire","terre","feu"],"marbre","Le métamorphisme : enfoui sous les montagnes, chauffé et comprimé, le calcaire recristallise en marbre."],
  [["gypse","feu"],"platre","À ~150 °C, le gypse perd les trois quarts de son eau : CaSO₄·2H₂O → CaSO₄·½H₂O.",["vapeur"]],
  [["platre","eau"],"gypse","La prise : le plâtre récupère son eau et recristallise en gypse. Ça chauffe un peu, et ça durcit en 10 minutes."],
  [["calcaire","argile","feu"],"ciment","Calcaire (80 %) + argile (20 %) cuits à 1450 °C : on obtient le clinker, broyé avec un peu de gypse = ciment Portland."],
  [["ciment","eau","sable"],"mortier","Le ciment s'hydrate et colle les grains de sable entre eux."],
  [["ciment","eau","sable","gravier"],"beton","La recette du béton : environ 1 volume de ciment, 2 de sable, 3 de gravier, et de l'eau."],
  [["mortier","gravier"],"beton","Du mortier + du gravier = du béton."],
  [["gravier","bitume"],"asphalte","Le bitume chaud enrobe le gravier ; en refroidissant, il durcit : une route."],
  [["gypse","papier"],"placo","Une plaque de gypse prise entre deux cartons."],
  [["graphite","argile"],"mine","Graphite + argile, cuits : la mine de crayon (inventée par Nicolas-Jacques Conté en 1795)."],
  [["graphite","terre","feu"],"diamant","À 150 km de profondeur, 1200 °C et 50 000 fois la pression atmosphérique, les feuillets de graphite se réorganisent en réseau 3D : diamant."],
  [["C","terre","feu"],"diamant","Sous l'énorme pression des profondeurs, le carbone se compacte en diamant."],
  [["resine","terre"],"ambre","Enfouie pendant des millions d'années, la résine durcit et se fossilise en ambre."],

  // --- Métallurgie
  [["Fe","C"],"acier","Un peu de carbone (moins de 2 %) dans le fer : les atomes de carbone bloquent les glissements, l'acier est bien plus dur."],
  [["Fe","charbon","feu"],"acier","La forge : le fer chauffé dans le charbon absorbe du carbone en surface."],
  [["hematite","charbon","feu"],"fonte","Le haut fourneau : le carbone du charbon arrache l'oxygène au minerai (Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂). Le fer liquide absorbe beaucoup de carbone : c'est de la fonte.",["co2"]],
  [["hematite","C"],"Fe","Réduction : le carbone vole l'oxygène du minerai de fer. Le principe de toute la sidérurgie depuis 3000 ans.",["co2"]],
  [["fonte","air","feu"],"acier","Le convertisseur Bessemer (1856) : on souffle de l'air dans la fonte liquide pour brûler l'excès de carbone."],
  [["acier","Cr","Ni"],"inox","L'acier + 18 % de chrome + 10 % de nickel : l'inox « 18/10 » des casseroles."],
  [["acier","Cr"],"inox","Au-delà de 10,5 % de chrome, l'acier devient inoxydable."],
  [["Fe","Cr","Ni"],"inox","Fer + chrome + nickel = acier inoxydable."],
  [["Cu","Sn"],"bronze","Le cuivre seul est mou ; avec 12 % d'étain, il devient dur et coule bien dans les moules. Début de l'âge du bronze."],
  [["Cu","Zn"],"laiton","Cuivre + zinc : un alliage doré, utilisé depuis les Romains."],
  [["Au","Ag"],"electrum","Or + argent : l'électrum, alliage naturel des premières pièces de monnaie."],
  [["Au","Ag","Cu"],"or18","75 % d'or + argent + cuivre = or 18 carats, assez dur pour un bijou."],
  [["Ag","Cu"],"argent925","92,5 % d'argent + 7,5 % de cuivre = argent sterling."],
  [["Al","Cu"],"duralumin","De l'aluminium durci par du cuivre (inventé en 1906)."],
  [["Al","Cu","Mg"],"duralumin","Aluminium + cuivre + magnésium : le duralumin des avions."],
  [["Ce","Fe"],"ferrocerium","Cérium + fer : la pierre à briquet (inventée par Carl Auer von Welsbach, 1903)."],
  [["Nd","Fe","B"],"aimant","Néodyme + fer + bore : les aimants les plus puissants au monde (1982)."],
  [["Fe","eau"],"rouille","Le fer rouille au contact de l'eau… et de l'oxygène de l'air dissous dedans."],
  [["Fe","eau","air"],"rouille","Fer + eau + oxygène = rouille. Le sel accélère la réaction (bord de mer)."],
  [["acier","eau"],"rouille","L'acier rouille aussi (contrairement à l'inox)."],
  [["acier","eau","air"],"rouille","L'acier rouille au contact de l'eau et de l'air."],
  [["Cu","air"],"malachite","Avec les années, le cuivre se couvre d'une patine verte de carbonate de cuivre (vert-de-gris)."],
  [["Cu","eau","air"],"malachite","La patine verte de la Statue de la Liberté : à l'origine, elle était couleur cuivre !"],
  [["bauxite","foudre"],"Al","Procédé Hall-Héroult : électrolyse de l'alumine à 960 °C, qui demande énormément d'électricité. Au XIXᵉ siècle, l'aluminium valait plus cher que l'or : Napoléon III réservait ses couverts en alu à ses invités les plus prestigieux."],
  [["alumine","foudre"],"Al","L'électrolyse sépare l'aluminium de l'oxygène."],
  [["silice","C","feu"],"Si","Dans un four à arc à 2000 °C, le carbone arrache l'oxygène de la silice : on obtient du silicium, base des puces électroniques et des panneaux solaires.",["co2"]],
  [["silice","C","foudre"],"Si","Four à arc électrique : SiO₂ + 2 C → Si + 2 CO."],
  [["sel","eau","foudre"],"soude","Électrolyse de l'eau salée : on récupère de la soude, du chlore et de l'hydrogène. Un pilier de l'industrie chimique.",["Cl","dihydrogene"]],
  [["Pb","pierre_philo"],"Au","Le rêve des alchimistes : le plomb changé en or ! En vrai, c'est possible… dans un accélérateur de particules, en arrachant 3 protons au noyau, pour un prix astronomique."],
  [["S","Hg","sel"],"pierre_philo","Les trois principes de Paracelse — Soufre (l'âme), Mercure (l'esprit), Sel (le corps) — réunis dans le Grand Œuvre. Spoiler : personne n'y est jamais arrivé."],

  // --- Gemmes
  [["alumine","Cr"],"rubis","Un peu de chrome dans le corindon absorbe le vert et le bleu : il reste un rouge éclatant."],
  [["alumine","Fe","Ti"],"saphir","Le fer et le titane échangent des électrons et colorent le corindon en bleu."],
  [["alumine","Fe"],"saphir","Corindon + fer : saphir (souvent jaune ou bleu pâle)."],
  [["beryl","Cr"],"emeraude","Béryl + chrome = émeraude."],
  [["silice","Fe"],"amethyste","Quartz + traces de fer + radioactivité naturelle = violet."],

  // --- Pétrochimie & plastiques
  [["petrole","feu"],"octane","Distillation : chauffé dans une colonne, le pétrole se sépare selon la taille des molécules. Gaz en haut, puis essence, kérosène, gazole… bitume au fond.",["propane","paraffine","bitume"]],
  [["petrole","vapeur"],"ethylene","Vapocraquage : à 850 °C avec de la vapeur, on casse les grosses molécules du pétrole en petites, dont l'éthylène, brique de base des plastiques."],
  [["ethylene","Ti"],"pe","Polymérisation avec un catalyseur au titane (Ziegler-Natta, prix Nobel 1963) : des dizaines de milliers d'éthylènes s'accrochent bout à bout → polyéthylène."],
  [["ethylene","ethylene"],"pe","Des éthylènes qui s'accrochent les uns aux autres en chaîne : c'est la polymérisation (en vrai, il faut un catalyseur et de la pression)."],
  [["ethylene","ethylene","ethylene"],"pe","Polymérisation : des milliers de petites molécules d'éthylène enchaînées = polyéthylène."],
  [["ethylene","Cl"],"pvc","Éthylène + chlore → chlorure de vinyle, puis polymérisation → PVC."],
  [["ethylene","F"],"teflon","En remplaçant tous les hydrogènes par du fluor, on obtient le Téflon (PTFE)."],
  [["propane","Ti"],"pp","Le propane est transformé en propylène, puis enchaîné avec un catalyseur au titane : polypropylène."],
  [["petrole","ethylene"],"ps","Le benzène tiré du pétrole + l'éthylène → styrène, puis polymérisation → polystyrène."],
  [["ethylene","petrole","air"],"pet","L'éthylène oxydé donne l'éthylène glycol (un antigel) ; le pétrole donne l'acide téréphtalique. Ensemble → PET."],
  [["petrole","ammoniac"],"nylon","Simplifié : les deux briques du nylon (acide adipique et hexaméthylènediamine) sont fabriquées à partir du pétrole et de l'ammoniac."],
  [["silice","methane"],"silicone","Procédé Müller-Rochow (simplifié) : du silicium tiré de la silice + des groupes méthyle → chaînes de silicone."],
  [["Si","methane"],"silicone","Silicium + chlorure de méthyle → silicones (procédé Müller-Rochow, simplifié)."],
  [["caoutchouc","S"],"pneu","La vulcanisation (Goodyear, 1839) : chauffé avec du soufre, le caoutchouc forme des ponts entre ses chaînes et devient élastique et solide."],
  [["caoutchouc","S","feu"],"pneu","Vulcanisation : soufre + chaleur créent des ponts entre les chaînes de caoutchouc."],
  [["caoutchouc","suie","S"],"pneu","Caoutchouc + noir de carbone (renfort, couleur noire) + soufre (vulcanisation) = la gomme des pneus."],
  [["suie","huile"],"encre","Le noir de carbone dispersé dans l'huile : encre d'imprimerie (et peinture noire depuis la préhistoire)."],

  // --- Vivant & cuisine
  [["co2","eau","lumiere"],"glucose","La photosynthèse : 6 CO₂ + 6 H₂O + lumière → C₆H₁₂O₆ + 6 O₂. La réaction qui nourrit presque toute la vie sur Terre.",["dioxygene"]],
  [["air","eau","lumiere","terre"],"bois","Un arbre qui pousse ! Surprise : environ 95 % de la masse sèche d'un arbre vient du CO₂ de l'air, pas du sol. La terre n'apporte que l'eau et quelques minéraux."],
  [["glucose","glucose"],"cellulose","Les plantes accrochent des milliers de glucoses en chaînes : droites = cellulose (fibres), en hélice = amidon (réserve)."],
  [["glucose","levure"],"ethanol","La fermentation : les levures mangent le sucre et rejettent de l'alcool et du CO₂ (C₆H₁₂O₆ → 2 C₂H₆O + 2 CO₂).",["co2"]],
  [["glucose","eau","levure"],"vin","La fermentation alcoolique du jus de raisin.",["co2"]],
  [["ethanol","air"],"vinaigre","Des bactéries (acétobacter) transforment l'alcool en acide acétique avec l'oxygène de l'air : le vin tourne au vinaigre."],
  [["vin","air"],"vinaigre","Laissé à l'air, le vin se transforme en vinaigre (d'où le nom : vin aigre)."],
  [["graisse","soude"],"savon","La saponification : la soude coupe la graisse en glycérine et en savon."],
  [["huile","soude"],"savon","Huile + soude = savon (le savon de Marseille, c'est de l'huile d'olive + soude)."],
  [["graisse","cendre"],"savon","Le savon des Gaulois : graisse + potasse tirée des cendres de bois."],
  [["huile","potasse"],"savon","Huile + potasse = savon mou (savon noir)."],
  [["bois","eau"],"papier","On broie le bois dans l'eau pour en séparer les fibres de cellulose, puis on les étale en feuille (simplifié)."],
  [["bois","eau","soude"],"papier","Le procédé kraft : la soude dissout la lignine et libère les fibres de cellulose, plus pures et plus solides."],
  [["farine","eau","levure","feu"],"pain","La levure produit du CO₂ qui gonfle la pâte ; la cuisson fige le tout. Les trous de la mie sont des bulles de gaz."],
  [["farine","eau","feu"],"pain","Sans levure : un pain plat (pita, galette, pain azyme)."],
  [["lait","air"],"beurre","Le barattage : en battant la crème, les gouttelettes de graisse s'agglomèrent et se séparent du petit-lait."],
  [["os","eau","feu"],"collagene","En faisant mijoter longtemps des os, le collagène se libère (et devient gélatine) : c'est le principe du bouillon."]
];

/* Thèmes du grimoire : [nom, emoji, nombre de recettes] dans l'ordre de RECETTES */
export const RECETTE_THEMES: [string, string, number][] = [
  ["Éléments & météo", "🌦️", 17],
  ["Atomes → molécules", "⚛️", 21],
  ["Feu & combustions", "🔥", 14],
  ["Minéraux & construction", "🧱", 25],
  ["Métallurgie", "⚙️", 30],
  ["Gemmes", "💎", 5],
  ["Pétrochimie & plastiques", "🛢️", 17],
  ["Vivant & cuisine", "🍞", 17],
];
