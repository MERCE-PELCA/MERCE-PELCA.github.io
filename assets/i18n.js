/* PELCA — choix de la langue (anglais, français), commun à toutes les pages.
   Chargé dans <head> sans « defer » : si le visiteur a choisi une autre langue que l'anglais,
   la page reste masquée le temps de la traduction (pas de flash en anglais).

   Les pages sont écrites en anglais ; ce script remplace chaque texte connu par sa traduction
   (dictionnaires ci-dessous, clés = textes exacts des pages) et remet l'anglais au retour.
   Les textes ajoutés ensuite par les scripts (compteur de résultats, messages) sont suivis.
   Les titres d'articles, auteurs et citations ne sont pas dans les dictionnaires : ils restent
   tels quels. Une zone marquée data-i18n-skip gère sa propre traduction (outil LCIC), en
   écoutant l'événement « pelca:lang ».

   Bouton : .lang-switch (« EN FR », langue en cours en surbrillance), à gauche du mode nuit :
   un clic passe d'une langue à l'autre.
   Pour ajouter une traduction : ajouter « "texte anglais exact": "traduction" » dans fr. */
(() => {
  const KEY = "pelca-lang";
  const LANGS = ["en", "fr"];
  const SWITCH_LABEL = { en: "Passer en français", fr: "Switch to English" };
  const root = document.documentElement;
  let lang = "en";
  try { const saved = localStorage.getItem(KEY); if (LANGS.includes(saved)) lang = saved; } catch (e) {}
  root.lang = lang;

  if (lang !== "en") {
    root.classList.add("i18n-pending");
    const st = document.createElement("style");
    st.textContent = ".i18n-pending body { visibility: hidden; }";
    document.head.appendChild(st);
    setTimeout(() => root.classList.remove("i18n-pending"), 1500);   // sécurité
  }

  const DICT = {
    fr: {
      "Skip to content": "Aller au contenu",
      "Home": "Accueil",
      "Software: PELCA": "Logiciel : PELCA",
      "PELCA Plugins": "Plugins PELCA",
      "· All rights reserved": "· Tous droits réservés",
      "PELCA home": "Accueil PELCA",
      "Main navigation": "Navigation principale",
      "PELCA newsletter": "Newsletter PELCA",
      "Open navigation": "Ouvrir la navigation",
      "Mobile navigation": "Navigation mobile",
      "Switch to dark mode": "Passer en mode sombre",
      "Switch to light mode": "Passer en mode clair",
      "PELCA — Power Electronics Life Cycle Assessment": "PELCA — Analyse du cycle de vie en électronique de puissance",
      "is now available.": "est maintenant disponible.",
      "Assess the environmental impacts, life cycle costs of your power-electronic systems.": "Évaluez les impacts environnementaux et le coût du cycle de vie de vos systèmes d'électronique de puissance.",
      "What is PELCA?": "Qu'est-ce que PELCA ?",
      "Discover PELCA 2.0": "Découvrir PELCA 2.0",
      "Read the research": "Lire les travaux de recherche",
      "Get the software": "Obtenir le logiciel",
      "Extend your analysis": "Étendre votre analyse",
      "TRAINING RESOURCES": "RESSOURCES DE FORMATION",
      "Video tutorials on PELCA and its assessment methods.": "Tutoriels vidéo sur PELCA et ses méthodes d'évaluation.",
      "Algorithm": "Algorithme",
      "Examples": "Exemples",
      "Open the MOOC": "Ouvrir le MOOC",
      "Application examples": "Exemples d'application",
      "Inverter": "Onduleur",
      "A power-electronic system comprising an IGBT power module (750 V, 820 A) and a DC-bus filter capacitor.": "Un système d'électronique de puissance composé d'un module de puissance IGBT (750 V, 820 A) et d'un condensateur de filtrage du bus continu.",
      "Download inventory": "Télécharger l'inventaire",
      "Video": "Vidéo",
      "Coming soon": "Bientôt disponible",
      "DC static circuit breaker – SiC MOSFET transistor protection. 800 V/30 A demonstrator; 2 × MSC025SMA120B4.": "Disjoncteur statique DC – protection par transistors MOSFET SiC. Démonstrateur 800 V/30 A ; 2 × MSC025SMA120B4.",
      "Watch the video": "Voir la vidéo",
      "Contributors": "Contributeurs",
      "contact us": "nous contacter",
      "PELCA project is coordinated by Mitsubishi Electric R&D Centre Europe. It was initiated as a follow-up of a first collaboration with ENS Rennes, SATIE Laboratory. More collaborations are welcome to contribute better to new examples and new software features. If you are interested, please contact us.": "Le projet PELCA est coordonné par Mitsubishi Electric R&D Centre Europe. Il fait suite à une première collaboration avec l'ENS Rennes et le laboratoire SATIE. D'autres collaborations sont les bienvenues pour enrichir les exemples et les fonctionnalités du logiciel. Si vous êtes intéressé, contactez-nous.",
      "(Power Electronics Life Cycle Assessment) is an open‑source tool that quantifies the impacts of power‑electronics systems across their entire life cycle.": "(Power Electronics Life Cycle Assessment) est un outil open source qui quantifie les impacts des systèmes d'électronique de puissance sur l'ensemble de leur cycle de vie.",
      "It natively supports circular‑economy practices such as preventive and curative maintenance.": "Il prend en charge nativement les pratiques d'économie circulaire comme la maintenance préventive et curative.",
      "With PELCA, you can model products and scenarios (manufacturing, use, and end-of-life) and obtain environmental and economic impact results to guide design and decision‑making.": "Avec PELCA, vous modélisez des produits et des scénarios (fabrication, usage et fin de vie) et obtenez des résultats d'impacts environnementaux et économiques pour orienter la conception et la prise de décision.",
      "Discover PELCA 2.0 on GitHub": "Découvrir PELCA 2.0 sur GitHub",
      "Explore PELCA resources": "Explorer les ressources PELCA",
      "MOOC topics": "Thèmes du MOOC",
      "Infineon FS820R08A6P2B IGBT power module": "Module de puissance IGBT Infineon FS820R08A6P2B",
      "Microchip MSCDR-EFUSE-006 E-Fuse demonstrator board": "Carte de démonstration E-Fuse Microchip MSCDR-EFUSE-006",
      "Mitsubishi Electric R&D Centre Europe website": "Site de Mitsubishi Electric R&D Centre Europe",
      "ENS Rennes website": "Site de l'ENS Rennes",
      "SATIE website": "Site du laboratoire SATIE",
      "IETR website": "Site de l'IETR",
      "Acsystème website": "Site d'Acsystème",
      "Close presentation": "Fermer la présentation",
      "Open the interactive LCIC tool": "Ouvrir l'outil interactif CICV",
      "COMPLEMENTARY TOOLS FOR PELCA 2.0": "OUTILS COMPLÉMENTAIRES POUR PELCA 2.0",
      "PELCA is complemented by a range of plugins. You can find the available plugins below.": "PELCA est complété par plusieurs plugins. Vous trouverez ci-dessous les plugins disponibles.",
      "Assess manufacturing impacts.": "Évaluer les impacts de fabrication.",
      "Compute the environmental impacts of silicon IGBT manufacturing using a configurable inventory model.": "Calculez les impacts environnementaux de la fabrication d'IGBT en silicium grâce à un modèle d'inventaire paramétrable.",
      "Adjust die dimensions, wafer parameters and manufacturing yields.": "Ajustez les dimensions de la puce, les paramètres du wafer et les rendements de fabrication.",
      "Explore wafer fab location, electricity mix and process assumptions.": "Explorez le lieu de fabrication des wafers, le mix électrique et les hypothèses de procédé.",
      "Feed the manufacturing impact results into PELCA.": "Intégrez les résultats d'impact de fabrication dans PELCA.",
      "Get the plugin": "Obtenir le plugin",
      "Model component reliability.": "Modéliser la fiabilité des composants.",
      "Estimate reliability parameters for the main replaceable units of power converters, based on their operating profiles.": "Estimez les paramètres de fiabilité des principales unités remplaçables des convertisseurs de puissance, à partir de leurs profils de fonctionnement.",
      "Evaluate fans, capacitor banks, inverter power modules and rectifier stages.": "Évaluez les ventilateurs, les bancs de condensateurs, les modules de puissance d'onduleur et les étages redresseurs.",
      "Account for operating conditions and applicable failure and ageing models.": "Tenez compte des conditions de fonctionnement et des modèles de défaillance et de vieillissement applicables.",
      "Transfer reliability and replacement inputs into PELCA.": "Transférez les données de fiabilité et de remplacement dans PELCA.",
      "Available PELCA plugins": "Plugins PELCA disponibles",
      "Video tutorials on PELCA, its assessment methods and application examples.": "Tutoriels vidéo sur PELCA, ses méthodes d'évaluation et des exemples d'application.",
      "10 videos": "10 vidéos",
      "5 topics": "5 thèmes",
      "Advanced topics": "Sujets avancés",
      "The tutorials labelled": "Les tutoriels marqués",
      "were recorded using that version. The new installation video covers": "ont été enregistrés avec cette version. La nouvelle vidéo d'installation porte sur",
      "The V1.4 videos were recorded in French. In YouTube Settings, check the available audio tracks and subtitles and select English when available.": "Les vidéos V1.4 ont été enregistrées en français. Dans les paramètres YouTube, des pistes audio et des sous-titres dans d'autres langues peuvent être disponibles.",
      "Introduction to PELCA": "Introduction à PELCA",
      "PELCA (Power Electronics Life Cycle Assessment) is an open-source project aimed at assessing the environmental impacts over the life cycle of modular and diagnosable power-electronics systems. Modularity and diagnosability support circular-economy practices such as maintenance, repair and reuse. PELCA calculates the impacts associated with the manufacturing, use and replacement of power-electronics products.": "PELCA (Power Electronics Life Cycle Assessment) est un projet open source qui vise à évaluer les impacts environnementaux sur le cycle de vie des systèmes d'électronique de puissance modulaires et diagnosticables. La modularité et la diagnosticabilité favorisent les pratiques d'économie circulaire comme la maintenance, la réparation et le réemploi. PELCA calcule les impacts liés à la fabrication, à l'usage et au remplacement des produits d'électronique de puissance.",
      "Watch video": "Voir la vidéo",
      "Open on YouTube": "Ouvrir sur YouTube",
      "Messages & perspectives": "Messages et perspectives",
      "Installation guide": "Guide d'installation",
      "Follow the PELCA V2.0 installation tutorial for Windows, macOS and Linux. Refer to the GitHub guide for the current installation steps.": "Suivez le tutoriel d'installation de PELCA V2.0 pour Windows, macOS et Linux. Consultez le guide GitHub pour les étapes d'installation à jour.",
      "Installation for Windows, macOS and Linux": "Installation pour Windows, macOS et Linux",
      "One installation tutorial for Windows, macOS and Linux.": "Un seul tutoriel d'installation pour Windows, macOS et Linux.",
      "PELCA V1.4 installation": "Installation de PELCA V1.4",
      "Previous tutorials by operating system": "Anciens tutoriels par système d'exploitation",
      "Installation tutorials recorded with PELCA V1.4, organised by operating system.": "Tutoriels d'installation enregistrés avec PELCA V1.4, classés par système d'exploitation.",
      "Two levels of modularity for an inverter: six replaceable units (a), or one replaceable unit (b).": "Deux niveaux de modularité pour un onduleur : six unités remplaçables (a) ou une seule unité remplaçable (b).",
      "A Replaceable Unit (RU) is a part of the system that can be dismantled and replaced during maintenance. When an RU is replaced, its age is reset to zero.": "Une unité remplaçable (RU) est une partie du système qui peut être démontée et remplacée lors de la maintenance. Quand une RU est remplacée, son âge est remis à zéro.",
      "In case (a), six RUs allow individual power switches to be replaced. In case (b), the inverter is a single RU, so the whole system must be replaced when a fault occurs.": "Dans le cas (a), six RU permettent de remplacer chaque interrupteur de puissance séparément. Dans le cas (b), l'onduleur forme une seule RU : tout le système doit être remplacé en cas de défaut.",
      "Algorithm documentation": "Documentation de l'algorithme",
      "The PELCA algorithm": "L'algorithme PELCA",
      "Current version": "Version actuelle",
      "View status": "Voir le statut",
      "The PELCA V2.0 algorithm video will be available soon.": "La vidéo sur l'algorithme de PELCA V2.0 sera bientôt disponible.",
      "Explore two power-electronics systems with their inventories and documentation.": "Découvrez deux systèmes d'électronique de puissance avec leurs inventaires et leur documentation.",
      "Inverter video tutorial.": "Tutoriel vidéo sur l'onduleur.",
      "Example: DC breaker / E-Fuse": "Exemple : disjoncteur DC / E-Fuse",
      "Understanding the LCIC": "Comprendre la CICV",
      "Explore the parametric life cycle impact curve (LCIC): adjust design, use and end-of-use parameters and see how the cumulative environmental impact of a power electronic converter evolves over its life.": "Découvrez la courbe d'impact paramétrique sur le cycle de vie (CICV) : réglez les paramètres de conception, d'usage et de fin d'usage et observez l'évolution de l'impact environnemental cumulé d'un convertisseur d'électronique de puissance au cours de sa vie.",
      "Use": "Usage",
      "End of use": "Fin d'usage",
      "How to read the curve": "Lire la courbe",
      "Production": "Fabrication",
      "initial jump at t = 0": "saut initial à t = 0",
      "slope: electrical losses × mix": "pente : pertes électriques × mix",
      "Failure": "Défaillance",
      "jump: part + end of use of the removed part": "saut : pièce + fin d'usage de la pièce retirée",
      "final jump: burden, or credit when recycling or repairing": "saut final : charge, ou crédit si on recycle ou répare",
      "Values are illustrative: only trends matter.": "Valeurs illustratives : seules les tendances comptent.",
      "Course overview": "Aperçu du cours",
      "Video versions and languages": "Versions et langues des vidéos",
      "An inverter modelled as six replaceable power switches or as one replaceable unit.": "Un onduleur modélisé sous forme de six interrupteurs de puissance remplaçables ou d'une seule unité remplaçable.",
      "SCIENTIFIC RESOURCES": "RESSOURCES SCIENTIFIQUES",
      "Explore publications, theses, presentations and lectures related to PELCA and life cycle assessment in power electronics.": "Parcourez les publications, thèses, présentations et cours liés à PELCA et à l'analyse du cycle de vie en électronique de puissance.",
      "Search resources": "Rechercher des ressources",
      "Year": "Année",
      "All years": "Toutes",
      "Sort by": "Trier par",
      "Newest first": "Récentes d'abord",
      "Oldest first": "Anciennes d'abord",
      "Title A–Z": "Titre A–Z",
      "All resources": "Toutes les ressources",
      "PhD theses": "Thèses de doctorat",
      "Scientific papers": "Articles scientifiques",
      "Presentations": "Présentations",
      "Lectures": "Cours",
      "Clear filters": "Effacer les filtres",
      "Scientific paper": "Article scientifique",
      "Presentation": "Présentation",
      "Lecture": "Cours",
      "PhD thesis": "Thèse de doctorat",
      "Copy citation": "Copier la citation",
      "Read resource": "Lire la ressource",
      "No resources match your search. Try another keyword or clear the filters.": "Aucune ressource ne correspond à votre recherche. Essayez un autre mot-clé ou effacez les filtres.",
      "Browse resources": "Parcourir les ressources",
      "Title, author, venue or keyword": "Titre, auteur, revue, conférence ou mot-clé",
      "Filter by resource type": "Filtrer par type de ressource",
      "Citation copied.": "Citation copiée.",
      "Select the citation text to copy it.": "Sélectionnez le texte de la citation pour le copier.",
      "Watch this video on YouTube to play it from this local preview.": "Regardez cette vidéo sur YouTube pour la lire depuis cet aperçu local.",
      "Embedded playback is unavailable in this browser. Watch this video directly on YouTube.": "La lecture intégrée n'est pas disponible dans ce navigateur. Regardez cette vidéo directement sur YouTube.",
      "YouTube could not play this embedded video. Open it on YouTube for more information.": "YouTube n'a pas pu lire cette vidéo intégrée. Ouvrez-la sur YouTube pour en savoir plus.",
    },
  };
  const MONTHS = {
    fr: { Jan: "janv.", Feb: "févr.", Mar: "mars", Apr: "avr.", May: "mai", Jun: "juin", Jul: "juil.", Aug: "août", Sep: "sept.", Oct: "oct.", Nov: "nov.", Dec: "déc." },
  };
  const RESOURCES = { fr: ["ressource", "ressources"] };
  const RULES = [
    [/^(\d+) resources?$/, (m, n) => `${n} ${RESOURCES[lang][n === "1" ? 0 : 1]}`],
    [/^(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})$/, (m, d, mo, y) => `${d} ${MONTHS[lang][mo]} ${y}`],
  ];
  const ATTRS = ["aria-label", "title", "placeholder", "alt"];

  function translate(en) {
    if (lang === "en") return en;
    const core = en.trim();
    if (!core) return en;
    const key = core.replace(/\s+/g, " ");
    let out = DICT[lang][key];
    if (out === undefined) {
      for (const [re, fn] of RULES) { if (re.test(key)) { out = key.replace(re, fn); break; } }
    }
    if (out === undefined) return en;
    return en.match(/^\s*/)[0] + out + en.match(/\s*$/)[0];
  }

  // Texte anglais d'origine de chaque nœud, et dernière valeur posée par ce script
  const origText = new WeakMap(), setText = new WeakMap();
  const origAttr = new WeakMap(), setAttr = new WeakMap();
  const skipped = el => !!(el && el.closest && el.closest("script, style, [data-i18n-skip], .lang-switch"));

  function doText(node) {
    if (skipped(node.parentElement)) return;
    if (!origText.has(node) || node.nodeValue !== setText.get(node)) origText.set(node, node.nodeValue);
    const value = translate(origText.get(node));
    setText.set(node, value);
    if (node.nodeValue !== value) node.nodeValue = value;
  }
  function doAttrs(el) {
    if (skipped(el)) return;
    let o = origAttr.get(el), s = setAttr.get(el);
    if (!o) { o = {}; s = {}; origAttr.set(el, o); setAttr.set(el, s); }
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const cur = el.getAttribute(a);
      if (!(a in o) || cur !== s[a]) o[a] = cur;
      const value = translate(o[a]);
      s[a] = value;
      if (cur !== value) el.setAttribute(a, value);
    }
  }
  function walk(node) {
    if (node.nodeType === 3) return doText(node);
    if (node.nodeType !== 1 || skipped(node)) return;
    doAttrs(node);
    for (let c = node.firstChild; c; c = c.nextSibling) walk(c);
  }

  let origTitle = null;
  function doTitle() {
    if (origTitle === null) origTitle = document.title;
    if (DICT.fr[origTitle] !== undefined) document.title = translate(origTitle);
  }

  // ---------- Bouton EN ⇄ FR (la surbrillance suit <html lang>, voir theme.css) ----------
  function syncSwitches() {
    document.querySelectorAll(".lang-switch").forEach(b => {
      b.setAttribute("aria-label", SWITCH_LABEL[lang]);
      b.title = SWITCH_LABEL[lang];
      b.setAttribute("lang", lang === "fr" ? "en" : "fr");
    });
  }

  function translateAll() {
    root.lang = lang;
    syncSwitches();
    if (document.body) walk(document.body);
    doTitle();
  }

  function setLang(next) {
    if (!LANGS.includes(next) || next === lang) return;
    lang = next;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    translateAll();
    window.dispatchEvent(new CustomEvent("pelca:lang", { detail: lang }));
  }
  window.PELCA_I18N = { get lang() { return lang; }, setLang };

  document.addEventListener("DOMContentLoaded", () => {
    translateAll();
    root.classList.remove("i18n-pending");
    document.querySelectorAll(".lang-switch").forEach(b =>
      b.addEventListener("click", () => setLang(lang === "fr" ? "en" : "fr")));

    // Textes modifiés ou ajoutés plus tard par les scripts de la page
    new MutationObserver(records => {
      for (const r of records) {
        if (r.type === "childList") r.addedNodes.forEach(walk);
        else if (r.type === "characterData") doText(r.target);
        else if (r.type === "attributes" && r.target.nodeType === 1) doAttrs(r.target);
      }
    }).observe(document.body, { childList: true, characterData: true, attributes: true, attributeFilter: ATTRS, subtree: true });
  });
})();
