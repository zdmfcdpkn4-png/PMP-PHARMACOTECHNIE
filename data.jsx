// data.jsx — content for PMP Pharmacotechnie POP Métal
// All names are fictional / parody. No real hospital affiliation.

const PMP_TRACKS = [
  { n: 1,  title: "Panique en Pharmaco",      sub: "(Single officiel · 2026)",                       dur: "—:—", bpm: 138, dci: "Adrénaline 1mg IM",       key: "E-min",  type: "single", audio: "assets/audio/panique-en-pharmaco.mp3",  featured: true },
  { n: 2,  title: "Noël en Pharmaco",         sub: "(Christmas EP · feat. Comité de Garde)",         dur: "—:—", bpm: 124, dci: "Glühwein QSP",            key: "G-maj",  type: "single", audio: "assets/audio/noel-en-pharmaco.mp3",     featured: true },
  { n: 3,  title: "La Riposte de Noël",       sub: "(Suite officielle · Christmas Bonus)",           dur: "—:—", bpm: 132, dci: "Glühwein 2× / Cannelle",  key: "A-min",  type: "single", audio: "assets/audio/la-riposte-de-noel.mp3",   featured: true },
  { n: 4,  title: "Pharmaco Flow",            sub: "(Single officiel · rap pharma)",                 dur: "—:—", bpm: 96,  dci: "Codéine de la rime",       key: "A-min",  type: "single", audio: "assets/audio/pharmaco-flow.mp3",        featured: true },
  { n: 5,  title: "Mauvaise Chimio",          sub: "(Bad-trip ballad · feat. Comité de Vigilance)",  dur: "—:—", bpm: 88,  dci: "Erreur de dilution",      key: "E-min",  type: "single", audio: "assets/audio/mauvaise-chimio-n.mp3",    featured: true },
  { n: 6,  title: "Stéphanie, Princesse de la Déconne", sub: "(Hommage · session blouse)",          dur: "—:—", bpm: 118, dci: "Fou rire QSP",            key: "A-maj",  type: "single", audio: "assets/audio/stephanie-princesse-deconne.mp3", featured: true },
  { n: 7,  title: "Silence Ça Pousse",        sub: "(Session 24 novembre · live au labo)",           dur: "—:—", bpm: 102, dci: "Hubert Reeves QSP",       key: "E-min",  type: "live",   audio: "assets/audio/audio-2025-11-24.mp3",     featured: true },
  { n: 8,  title: "Calendrier de l'Avent",    sub: "(Session 6 décembre · pré-prod hivernale)",      dur: "—:—", bpm: 108, dci: "Chocolat × 24",           key: "G-min",  type: "live",   audio: "assets/audio/audio-2025-12-06.mp3",     featured: true },
  { n: 9,  title: "Jean-Kévin & les Plannings Infernaux", sub: "(Session 27 mars · live au labo)",        dur: "—:—", bpm: 110, dci: "Planning QSP 24h/24",     key: "B-min",  type: "live",   audio: "assets/audio/audio-2026-03-27.mp3",     featured: true },
  { n: 10, title: "Freestyle en Pharmaco",    sub: "(Prépa Lab · take 1 · battle de rimes pharma)",  dur: "—:—", bpm: 98,  dci: "Mannitol 5%",             key: "A-min",  type: "freestyle", audio: "assets/audio/prepa-lab-freestyle-2.mp3", featured: true },
  { n: 11, title: "Posologie Slam",           sub: "(Prépa Lab · take 2 · slam des doses)",          dur: "—:—", bpm: 104, dci: "Caféine 200mg",           key: "C-min",  type: "freestyle", audio: "assets/audio/prepa-lab-freestyle-3.mp3", featured: true },
  { n: 12, title: "Operation Pharma",         sub: "(Single officiel)",                              dur: "—:—", bpm: 140, dci: "Bleu de méthylène 1%",    key: "A-min",  type: "single", audio: "assets/audio/operation-pharma.mp3",     featured: true },
  { n: 13, title: "Awake in Pharmaco",        sub: "(Single officiel)",                              dur: "—:—", bpm: 132, dci: "Caféine 200mg",           key: "C-min",  type: "single", audio: "assets/audio/awake-in-pharmaco.mp3",    featured: true },
  { n: 14, title: "Pharmaco Storm",           sub: "(Single officiel)",                              dur: "—:—", bpm: 156, dci: "Furosémide 40mg IV",      key: "D-min",  type: "single", audio: "assets/audio/pharmaco-storm.mp3",       featured: true },
  { n: 15, title: "Pharmacobar United",       sub: "(Hymne · feat. Equipe de Garde)",                dur: "—:—", bpm: 128, dci: "Solution buvable QSP",    key: "G-maj",  type: "anthem", audio: "assets/audio/pharmacobar-united.mp3",   featured: true },
  { n: 16, title: "JP contre la Charlotte Infernale", sub: "(Single officiel · hymne anti-contamination)",  dur: "—:—", bpm: 122, dci: "Air filtré HEPA QSP",     key: "D-min",  type: "single", audio: "assets/audio/keeper-of-the-flow.mp3",   featured: true },
  { n: 17, title: "AMM Refusée",              sub: "feat. Comité d'Éthique · démo",                  dur: "3:47", bpm: 168, dci: "Placebo HCl",            key: "G-maj",  type: "pop-metal"  },
  { n: 18, title: "QSP 666",                  sub: "(Quantité Suffisante Pour l'Au-delà · démo)",    dur: "5:33", bpm: 178, dci: "Excipient ad lib.",      key: "F#-min", type: "black-pop"  },
];

const PMP_CONCERTS = [
  { date: "12.09.26", city: "La Roche-sur-Yon", venue: "Salle de Préparation 3B",   etab: "CH Côte de Lumière (fictif)", status: "complet"   },
  { date: "14.09.26", city: "Nantes",           venue: "Cantine du personnel · 23h59", etab: "Polyclinique de l'Erdre (fictif)", status: "billets" },
  { date: "21.09.26", city: "Cholet",           venue: "Réfectoire · soirée TPN",   etab: "Centre Médical du Bocage (fictif)", status: "billets" },
  { date: "05.10.26", city: "Paris",            venue: "Amphi A · festival OncoMétal", etab: "Hôpital du Faubourg (fictif)", status: "billets" },
  { date: "12.10.26", city: "Bordeaux",         venue: "Vestiaire Hommes",          etab: "Clinique des Sables (fictif)", status: "privé"    },
  { date: "19.10.26", city: "Rennes",           venue: "Sous-sol Pharmacie · Death-Stage", etab: "Polyclinique du Léon (fictif)", status: "billets"},
  { date: "31.10.26", city: "Lille",            venue: "Morgue · Halloween Special", etab: "Hôpital de Bois-Joli (fictif)", status: "rare"    },
  { date: "08.11.26", city: "Le Mans",          venue: "Cafétéria · Excipient Fest", etab: "CH des 24 Heures (fictif)", status: "billets"   },
  { date: "22.11.26", city: "Strasbourg",       venue: "Stérilisation Centrale",    etab: "Hôpital Kléber (fictif)", status: "billets"    },
  { date: "13.12.26", city: "Lyon",             venue: "Hotte n°4 · acoustique",    etab: "Centre Gerland (fictif)", status: "complet"    },
];

const PMP_MERCH = [
  { id: "tshirt",    name: "T-shirt PMP",              tag: "Posologie Maximale",       price: 25,  cat: "Textile",  swatch: ["ink","pink"] },
  { id: "hoodie",    name: "Sweat capuche ZAC",        tag: "Zone à Atmosphère Crématoire", price: 55, cat: "Textile", swatch: ["ink","mustard"] },
  { id: "mug",       name: "Mug céramique",            tag: "Excipient à Effet Notoire", price: 12, cat: "Maison",   swatch: ["bone","orange"] },
  { id: "pilulier",  name: "Pilulier de tournée",      tag: "World Tour MMXXVI · 7 jours", price: 18, cat: "Collector", swatch: ["pink","ink"] },
  { id: "plectre",   name: "Médiators gélules (×5)",   tag: "Lot 250mg LP",             price: 8,   cat: "Musique",  swatch: ["pink","mustard","orange"] },
  { id: "tote",      name: "Tote bag",                 tag: "Préparation Magistrale",   price: 15,  cat: "Textile",  swatch: ["bone","ink"] },
  { id: "stickers",  name: "Pack stickers DCI",        tag: "12 vignettes · adhésif fort", price: 6, cat: "Papeterie", swatch: ["orange","pink","mustard","ink"] },
  { id: "vinyle",    name: "Vinyle 33t « AMM Refusée »", tag: "Pressage limité 666 ex.", price: 28, cat: "Musique",   swatch: ["ink"] },
  { id: "patch",     name: "Patch brodé monogramme",   tag: "à coudre sur blouse",      price: 10,  cat: "Collector", swatch: ["mustard","ink"] },
  { id: "charlotte", name: "Charlotte stérile dédicacée", tag: "EPI usage unique · signée", price: 35, cat: "Collector", swatch: ["bone","pink"] },
  { id: "sombrero",  name: "Sombrero PMP « Olé Pharmaco »", tag: "Tournée Palma · édition limitée", price: 32, cat: "Collector", swatch: ["mustard","pink"] },
];

const PMP_COCKTAILS = [
  { id: "qsp666",     name: "QSP 666",                  base: "Rhum brun · gingembre · sirop d'épices", notice: "Posologie : 1 verre / nuit · ne pas dépasser la dose prescrite", dci: "Rhum 40° QSP 100 mL", abv: 22, color: "pink",    glass: "tumbler", emoji: "🥃", price: 9 },
  { id: "perfu-spritz", name: "Perfu-Spritz",           base: "Aperol · prosecco · eau gazeuse",         notice: "Voie intraveineuse interdite · à boire en perfusion lente", dci: "Aperol 11° QSP 200 mL", abv: 11, color: "orange",  glass: "calice",  emoji: "🧉", price: 8 },
  { id: "ammrefuse",  name: "AMM Refusée",              base: "Gin · curaçao bleu · tonic",              notice: "RCP indisponible · à consommer sous contrôle d'un confrère", dci: "Gin 47° QSP 150 mL", abv: 18, color: "mustard", glass: "highball",emoji: "🪻", price: 10 },
  { id: "panique",    name: "Panique en Pharmaco",      base: "Tequila · jus de citron vert · piment",    notice: "Effet indésirable fréquent : envie soudaine de chanter",     dci: "Tequila 38° QSP 80 mL",  abv: 24, color: "pink",    glass: "shooter", emoji: "🌶️", price: 7 },
  { id: "noel",       name: "Noël en Pharmaco",         base: "Vin chaud · cannelle · clou de girofle",    notice: "Édition limitée · décembre uniquement · servi à 70°C",         dci: "Glühwein 13° QSP 200 mL", abv: 13, color: "orange",  glass: "mug",     emoji: "🎄", price: 8 },
  { id: "preparation", name: "Préparation Magistrale", base: "Vodka · lait de coco · grenadine",         notice: "À reconstituer extemporanément · agiter avant emploi",         dci: "Vodka 40° QSP 180 mL",   abv: 17, color: "lilac",   glass: "calice",  emoji: "⚗️", price: 9 },
  { id: "hotteflux",  name: "Hotte à Flux",             base: "Absinthe · menthe · soda — fumée carboglace", notice: "Servir sous hotte à flux laminaire · ISO 5 obligatoire",   dci: "Absinthe 68° QSP 60 mL", abv: 30, color: "mustard", glass: "fume",    emoji: "💨", price: 12 },
  { id: "codeine",    name: "Codéine Sans Codéine",     base: "Sirop de bourgeons · soda · citron — sans alcool", notice: "Liste 0 · accessible sans ordonnance · 0,0% alcool",   dci: "Sirop QSP 250 mL",       abv: 0,  color: "pink",    glass: "tumbler", emoji: "🍋", price: 5 },
  { id: "lyophilise", name: "Lyophilise mon Cœur",      base: "Champagne · perle de menthe · cœur cristallisé", notice: "Cristaux croquants pour libération immédiate",            dci: "Champagne 12° QSP 150 mL", abv: 12, color: "lilac",   glass: "flute",   emoji: "💎", price: 14 },
  { id: "stupef",     name: "Stupéfiant n°II",          base: "Whisky tourbé · sirop d'érable · fumée",   notice: "Sous cadenas double · à consommer dans la réserve",            dci: "Whisky 46° QSP 60 mL",   abv: 28, color: "ink",     glass: "tumbler", emoji: "🔒", price: 13 },
  { id: "gardenuit",  name: "Garde de Nuit",            base: "Vodka · liqueur de café · espresso double · sirop sucre roux", notice: "Indication : vigilance nocturne · 1 dose / garde · attention à la tachycardie", dci: "Caféine 80mg / Vodka 40°", abv: 18, color: "ink", glass: "calice", emoji: "☕", price: 11 },
];

const PMP_MEMBERS = [
  { stage: "ERWIN",        role: "Fondateur · frontman · storyteller rap/rock",     desc: "L'origine du groupe. Pose les rimes comme on pose une perfu : sans bulle, sans hésitation.", icon: "mic",     accent: "pink"    },
  { stage: "AMANDINE",     role: "Directrice artistique · claviers symphoniques",  desc: "Pilote la production chimio comme un chef d'orchestre dirige une symphonie. Créativité débordante : invente une nouvelle galénique entre deux refrains, signe les set-lists au cordeau. Golden duo certifié SQCDP.", icon: "keys", accent: "pink" },
  { stage: "AMÉLIE",       role: "Ingénieure son · chasseuse de risques",             desc: "Traque les anomalies comme on traque une fausse note. La moindre dérive de mix, la moindre erreur de dilution — elle voit tout, elle entend tout. Pharmacovigilance niveau bionique.", icon: "mixer", accent: "orange" },
  { stage: "CLAIRE",       role: "Guitare rythmique · infiltrée du préparatoire",   desc: "Riff sec et propre, double opération : sur scène et sous hotte. Agente n°1 du commando préparatoire, témoigne en accords mineurs des secrets du laboratoire.", icon: "guitar", accent: "mustard" },
  { stage: "ALICIA",       role: "Synthés · ambiances synthétiques mystérieuses",   desc: "Spécialiste des textures qui font frémir : nappes vaporées, drones médicaux, glitchs de couloir d'hôpital la nuit. Posologie de mystère : 1 dose, mais on en redemande.", icon: "synth", accent: "lilac" },
  { stage: "CONSTANCE",    role: "Violon symphonique",                               desc: "Archet de précision. Cartographie les planques de la salle de prépa entre deux solos.",            icon: "violin",  accent: "pink"    },
  { stage: "FLORA",        role: "Chœurs · survivante du préparatoire",             desc: "Courageuse comme on l'est après avoir affronté la salle blanche à 6h du matin. Sa voix monte en même temps que sa bravoure : un peu tremblante au début, intense à la fin.", icon: "heart", accent: "orange" },
  { stage: "SYLVIE",       role: "Coach vocale · reine du calcul mental",            desc: "Reine incontestée du calcul mental ET des refrains. Connaît toutes les posologies par cœur, et tous les ponts musicaux à la virgule près. Chaîne officielle : Nagui.", icon: "mic", accent: "mustard" },
  { stage: "LAURA",        role: "Percussions · pads électroniques",                 desc: "Tape le tempo en rêvant des Baléares. Cible : finir la set-list à Palma.",                          icon: "drums",   accent: "lilac"   },
  { stage: "ANAÏS",        role: "Sound design · détection d'anomalies",             desc: "Œil de lynx et oreille de chauve-souris. Repère un gant percé à 5 mètres.",                         icon: "wave",    accent: "pink"    },
  { stage: "ELSA",         role: "Direction lumière · œil de lynx du laboratoire",   desc: "Détecte le grain de poussière comme la fausse note. Sa cabine éclaire le live comme elle inspecte les manches stériles : sans rater une bavure.", icon: "bulb", accent: "orange" },
  { stage: "MARIE T.",     role: "Batterie · métronome silencieux de prod",         desc: "120 BPM constants, sans dire un mot. La production chimio sort à l'heure, le set aussi. Le mot retard n'existe pas dans son vocabulaire.", icon: "drums", accent: "mustard" },
  { stage: "JULIEN",       role: "Technicien scène · live sampling",                 desc: "Casque vissé, encode les chimios sur du heavy metal. Efficacité : +20 %.",                          icon: "headphones", accent: "lilac" },
  { stage: "JULIE",        role: "Voix pop lead · tempo & énergie",                  desc: "Donne le tempo en chantant, raquette ou guitare toujours à portée de main. Cardio du groupe, fréquence cardiaque > 180 BPM en concert.", icon: "mic", accent: "pink" },
  { stage: "NADINE",       role: "Énergie scène · marathonienne rock",               desc: "42 km en chantant « L'aventurière » sans souffler. Esprit Indochine gravé sur le bandeau, baskets toujours prêtes pour un encore.", icon: "bolt", accent: "orange" },
  { stage: "JEAN-KEVIN",   role: "Tour manager · planification",                     desc: "Cadre de santé. A inventé le headbang en charlotte stérile. Slogan : « Jean-K, c'est la K. »",     icon: "clip",    accent: "mustard" },
  { stage: "DYLAN",        role: "Maintenance instruments · setup propre",           desc: "Sans poussière à l'horizon. Une particule détectée, c'est le solo de batterie.",                    icon: "wrench",  accent: "lilac"   },
  { stage: "AUDREY",       role: "Logistique · responsable conteneurs",              desc: "Pilote les containers comme les caisses de tournée. Lever de rideau à 6 h pile.",                   icon: "box",     accent: "pink"    },
  { stage: "NATACHA",      role: "Coordination backstage",                           desc: "Co-pilote conteneurs et coulisses. L'horaire, c'est sacré.",                                        icon: "box",     accent: "orange"  },
  { stage: "KAREN",        role: "Backstage vibes · réseaux sociaux",                desc: "Coup de cœur discret en pneumo. Garde ses tubes au chaud et son crush plus chaud encore.",          icon: "phone",   accent: "mustard" },
  { stage: "PATRICIA « PAT »", role: "Pull de Noël · concours de bottereaux",                 desc: "Son pull de Noël clignote plus fort que la console lumière. Régente incontestée du concours de bottereaux : sa pâte dorée met le moral en place IV.", icon: "star",    accent: "pink"    },
  { stage: "JULIETTE",     role: "Chorégraphie · danse",                             desc: "Partenaire de slow officielle de Julien — uniquement le 24 décembre.",                              icon: "spark",   accent: "lilac"   },
  { stage: "STÉPHANIE",    role: "Spoken-word ambient",                              desc: "« Silence, ça pousse. » Princesse de la déconne, cite Hubert Reeves entre deux préparations.",     icon: "leaf",    accent: "orange"  },
  { stage: "LUCILLE",      role: "Chœurs folk-rock · âme québécoise",                desc: "Reprend les Cowboys Fringants entre deux préparations. « Les étoiles filantes » en boucle, chapeau de cow-boy sur la blouse.", icon: "feather", accent: "mustard" },
  { stage: "LUDIVINE",     role: "Basse · dose standard parfaite",                  desc: "4 cordes, dose pile poil. Posologie maximale en bas du spectre, jamais un milligramme de trop. Référence absolue du groupe pour la stabilité rythmique.", icon: "bass", accent: "pink" },
  { stage: "SONIA",        role: "Guide CHD Spirit · rythmique tonique",            desc: "L'âme électrique du groupe. Pulse l'énergie collective, mobilise les troupes avant chaque set, fait taper du pied tout le service. Tonique, jamais éteinte.", icon: "lotus", accent: "lilac" },
  { stage: "ANNE-LISE",    role: "Arrangements symphoniques · gardienne du tempo",   desc: "Pose les cordes par-dessus les guitares au millimètre. Partitions au cordeau comme une chimio, et garde le rythme de fer même quand tout le groupe décanne.", icon: "note", accent: "orange" },
  { stage: "PAUL G.",      role: "Antagoniste humoristique · Pharmaco Tour",         desc: "Le méchant officiel de la tournée. Cape noire, blouse rouge, monologue théâtral à chaque pont musical. Mission : faire peur, faire rire, parfois les deux à la fois.", icon: "skull", accent: "pink" },
  { stage: "MARION",       role: "Claviers atmosphériques · harmonies ambient",      desc: "Ninja des nappes : entre et sort de la scène sans qu'on la voie, mais c'est elle qui tient tout le mix. Posologie de discrétion : 1 sourire à jeun, efficacité prouvée.", icon: "keys",    accent: "lilac"   },
  { stage: "PAULINE",      role: "Voix pop-rock · harmonies lumineuses",            desc: "Apporte la lumière vocale du groupe. Positive attitude posologique : sourire QSP 24h/24, harmonies pop-rock qui répondent à Julie en parfait tag-team.", icon: "mic", accent: "orange" },
  { stage: "MANON",        role: "Guitare lead",                                     desc: "Énergie de l'entretien à fond les ballons : « ça shred ou ça shred pas ? ». Sa wah-wah s'entend jusqu'à la pharmacie du 3e étage.", icon: "guitar",  accent: "mustard" },
  { stage: "TITIANE",      role: "Violoncelle symphonique",                          desc: "Archet rieur et notes pétillantes. Apporte la joie même dans les morceaux les plus doom — pure rayon de soleil.", icon: "cello",   accent: "pink"    },
  { stage: "DELPHINE",     role: "Direction visuelle · scénographie Pharmaco Tour",  desc: "Conçoit la scène comme une salle blanche : tout est à sa place, rien n'est superflu. Signe la scénographie du Pharmaco Tour de A à Z, lumières, costumes, décors, vidéo murale.", icon: "shape", accent: "lilac" },
  { stage: "MARIE P.",     role: "Contrôle environnemental & protection ultime", desc: "Véritable mur anti-contamination, elle veille sur le labo comme une guitariste protège son ampli vintage. Rien ne passe, rien ne déborde, tout reste clean sous son regard laser. « Ici, la contamination ne monte jamais sur scène. »", icon: "leaf",  accent: "mustard" },
];

const PMP_LYRICS = [
  {
    track: 1,
    title: "POSOLOGIE MAXIMALE",
    body: [
      "[Couplet 1]",
      "Je suis l'ordonnance que tu n'as pas signée",
      "Le comprimé tombé sous l'autoclave",
      "Quatre grammes par jour — et puis cinq, et puis six",
      "Hépatotoxique mais romantique",
      "",
      "[Refrain]",
      "POSOLOGIE — MAXIMALE",
      "Ne dépasse pas la dose, sauf si c'est moi",
      "POSOLOGIE — MAXIMALE",
      "Le RCP n'a rien prévu pour ça",
      "",
      "[Pont — voix gutturale]",
      "AMM · AMM · AMM REFUSÉE",
      "QSP cent millilitres de toi",
    ]
  },
  {
    track: 9,
    title: "QSP 666",
    body: [
      "[Intro chuchotée]",
      "Quantité Suffisante Pour… l'au-delà",
      "",
      "[Couplet]",
      "Six cent soixante-six excipients à effet notoire",
      "Le lactose, le saccharose, et la nuit",
      "J'ai préparé ta gélule en hotte à flux sépulcral",
      "Conditionnement primaire : un cercueil de PVC",
      "",
      "[Refrain]",
      "Q · S · P — six six six",
      "Pour mille millilitres de toi je donnerais ma blouse",
      "Q · S · P — six six six",
      "Liste I — cadenas II — clé sous la croix",
    ]
  },
];

const PMP_GALLERY = [
  { caption: "Soundcheck · Salle de Préparation 3B",   tone: "ink",     img: "assets/gallery/soundcheck.svg"     },
  { caption: "Sœur Hotte · solo de batterie en EPI",   tone: "pink",    img: "assets/gallery/drum-solo.svg"       },
  { caption: "Dr. Riff Excipient · mediator-gélule",   tone: "orange",  img: "assets/gallery/mediator-gelule.svg" },
  { caption: "Backstage · réserve des stupéfiants",    tone: "mustard", img: "assets/gallery/backstage.svg"       },
  { caption: "Pit · première rangée en blouse",        tone: "ink",     img: "assets/gallery/pit-blouses.svg"     },
  { caption: "Encore · « QSP 666 » a cappella",        tone: "pink",    img: "assets/gallery/encore.svg"          },
];

const PMP_TIMELINE = [
  { year: "2023", title: "La Genèse", desc: "Erwin griffonne les premières rimes pharma entre deux préparations magistrales. Le nom PMP est trouvé en salle de pause." },
  { year: "2024", title: "Premières répétitions", desc: "Amandine, Amélie et Marie T. rejoignent. Premier riff joué dans la salle de prépa 3B, à 23h, en charlotte stérile." },
  { year: "MAI 2025", title: "Single « Panique en Pharmaco »", desc: "Sortie du premier single sur les internes. 1000 streams en une semaine. Le bouche-à-oreille hospitalier fait le reste." },
  { year: "DÉC 2025", title: "EP de Noël", desc: "« Noël en Pharmaco » et « La Riposte de Noël » sortent en édition limitée. Pat lance le concours de bottereau." },
  { year: "MAR 2026", title: "Premier live au labo", desc: "Captation brute « Premier Riff de Printemps ». Bassiste de Garde fait sauter le disjoncteur du service." },
  { year: "2026", title: "Tournée QSP 666", desc: "10 dates en milieu hospitalier fictif. Lancement du Pharmacobar mobile. Sombrero officiel disponible." },
  { year: "2027", title: "LP « Préparation Magistrale »", desc: "Album complet prévu. Sessions d'enregistrement en autoclave 121°C — stérilité garantie." },
];

const PMP_FANS = [
  { city: "Nantes",         x: 47, y: 36, count: 1240 },
  { city: "Paris",          x: 49, y: 33, count: 980 },
  { city: "Bordeaux",       x: 46, y: 42, count: 620 },
  { city: "Lyon",           x: 51, y: 40, count: 740 },
  { city: "Marseille",      x: 51, y: 46, count: 510 },
  { city: "Bruxelles",      x: 50, y: 30, count: 280 },
  { city: "Montréal",       x: 23, y: 32, count: 190 },
  { city: "Genève",         x: 51, y: 39, count: 130 },
  { city: "Berlin",         x: 54, y: 30, count: 95  },
  { city: "Tokyo",          x: 86, y: 38, count: 60  },
  { city: "Buenos Aires",   x: 30, y: 75, count: 42  },
  { city: "Sydney",         x: 88, y: 76, count: 33  },
  { city: "New York",       x: 28, y: 36, count: 410 },
  { city: "Madrid",         x: 47, y: 42, count: 220 },
  { city: "Reykjavík",      x: 44, y: 22, count: 18  },
];

window.PMP = { PMP_TRACKS, PMP_CONCERTS, PMP_MERCH, PMP_MEMBERS, PMP_LYRICS, PMP_GALLERY, PMP_COCKTAILS, PMP_TIMELINE, PMP_FANS };
