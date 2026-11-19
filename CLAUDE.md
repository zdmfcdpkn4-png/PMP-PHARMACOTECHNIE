# CLAUDE.md — PMP · Pharmacotechnie POP Métal

Guide pour Claude Code sur ce dépôt. Site officiel **parodique** du groupe
PMP Pharmacotechnie POP Métal : discographie, tournée, boutique, Pharmacobar,
galerie, paroles, contact.

> ⚠️ Tout le contenu est fictif : noms d'hôpitaux, dates, morceaux, transactions.
> Site humoristique — aucune affiliation hospitalière réelle. Toute nouvelle
> donnée ajoutée à `data.jsx` doit rester dans ce registre parodique, et les
> établissements inventés portent la mention « (fictif) ».

---

## 🚫 Contrainte n°1 : zéro build

Le site est **100 % statique, sans bundler, sans npm, sans étape de build**.
React 18.3.1, ReactDOM et Babel Standalone sont chargés par CDN (unpkg, avec
hash d'intégrité) dans `index.html`. Les fichiers `.jsx` sont compilés **dans
le navigateur** via `<script type="text/babel">`.

Conséquences pratiques :

- **Pas de `import` / `export` ES modules** — tout passe par des globals
  (`window.PMP`, `window.PmpSections`, fonctions déclarées au niveau module).
- **Pas de JSX moderne exotique** — rester sur ce que Babel Standalone 7.29
  compile sans config.
- **Pas de `package.json`** à créer : si une dépendance semble nécessaire,
  c'est probablement la mauvaise approche.

## 📜 Ordre de chargement — NE PAS MODIFIER

`index.html` charge les scripts dans cet ordre, et chaque fichier dépend des
globals posés par les précédents :

```
1. tweaks-panel.jsx   → TweaksPanel, useTweaks, contrôles de formulaire
2. data.jsx           → window.PMP (toutes les données du site)
3. logo.jsx           → PmpLogo3D, PmpRoseLogo, icônes SVG
4. audio.jsx          → PmpAudio (moteur Web Audio)
5. sections.jsx       → window.PmpSections (toutes les sections)
6. app.jsx            → App racine + ReactDOM.createRoot(...)
```

Ajouter un fichier = l'insérer à la bonne place dans **`index.html` ET
`PMP Pop Metal.html`** (voir règle miroir ci-dessous).

## 🪞 Règle miroir : `PMP Pop Metal.html` ≡ `index.html`

`PMP Pop Metal.html` est le fichier de design source et doit rester
**octet pour octet identique** à `index.html`. Après toute modification de
`index.html`, recopier le contenu et vérifier :

```bash
diff "PMP Pop Metal.html" index.html   # doit être vide
```

## 📁 Structure réelle du dépôt

```
.
├── index.html               ← entrée du site (chargement CDN + scripts babel)
├── PMP Pop Metal.html       ← copie identique de index.html (design source)
├── styles.css               ← tous les styles + palettes + responsive (~2700 lignes)
├── data.jsx                 ← window.PMP : 9 collections de données
├── logo.jsx                 ← logo vinyle 3D + icônes (SVG original fait main)
├── audio.jsx                ← moteur Web Audio (mp3 réels + synthé de secours)
├── sections.jsx             ← les 12 sections du site (~1800 lignes)
├── app.jsx                  ← App racine : panier, curseur custom, mode concert, tweaks
├── tweaks-panel.jsx         ← shell Tweaks réutilisable (protocole edit-mode inclus)
├── render.yaml              ← blueprint Render (site statique, racine publiée)
├── assets/
│   ├── audio/               ← 18 mp3 servis par le site (noms kebab-case ascii)
│   ├── gallery/             ← 6 visuels éditoriaux SVG
│   ├── concert-bg.svg       ← fond du mode concert
│   ├── fanmap-monde.png     ← carte de la section FanMap
│   ├── pmp-hero-logo.png    ← label central du vinyle du hero
│   ├── pharmacotechnie-logo.png ← logo goodies (boutique)
│   └── ref-rose-logo.jpeg   ← référence visuelle du logo
├── uploads/                 ← fichiers sources bruts (mp3 originaux, captures) — PAS servis par le site
└── screenshots/             ← captures de vérification visuelle des itérations
```

**`uploads/` vs `assets/audio/`** : `uploads/` contient les mp3 d'origine
(noms avec espaces/accents) ; le site ne référence QUE les copies renommées
en kebab-case ASCII dans `assets/audio/`. Pour ajouter un morceau : déposer
l'original dans `uploads/`, copier vers `assets/audio/` avec un nom
kebab-case, puis référencer ce chemin dans `data.jsx`.

## 🗂️ Données : `data.jsx` → `window.PMP`

Neuf collections, toutes consommées par `sections.jsx` :
`PMP_TRACKS`, `PMP_CONCERTS`, `PMP_MERCH`, `PMP_MEMBERS`, `PMP_LYRICS`,
`PMP_GALLERY`, `PMP_COCKTAILS`, `PMP_TIMELINE`, `PMP_FANS`.

- **18 pistes** dans `PMP_TRACKS` : 16 avec un champ `audio` pointant vers un
  mp3 réel de `assets/audio/`, 2 démos sans audio (n° 17 « AMM Refusée » et
  n° 18 « QSP 666 ») pour lesquelles `audio.jsx` **synthétise** un riff seedé
  sur `track.n`. Une piste sans mp3 n'est donc pas un bug.
- Chaque piste porte des métadonnées parodiques (`bpm`, `dci`, `key`, `type`) —
  les conserver lors d'ajouts.

## 🎛️ Tweaks (état piloté par attributs `data-*` sur `<html>`)

Défauts dans `app.jsx` (`TWEAK_DEFAULTS`, bloc `/*EDITMODE-BEGIN*/ … /*EDITMODE-END*/`
— ne pas casser ces marqueurs, ils servent au protocole edit-mode de
`tweaks-panel.jsx`) :

- **Palette** : `posologie` (défaut, variables racine de `styles.css`),
  `sterile`, `toxique`, `cremation` — via `data-palette`.
- **Mode** : `light` / `dark` — via `data-mode`.
- **Typo des titres** (`data-display`) : `gothic` (Metal Mania, défaut),
  `pop` (Bowlby One SC), `brutalist` (Archivo Black).
- **Curseur** : ⚠️ la valeur interne `"plectre"` affiche le label « Gélule » ;
  les autres sont `syringe`/« Seringue », `cross`/« Croix médicale »,
  `drop`/« Goutte ». Ne pas « corriger » la valeur `plectre` sans migrer
  le CSS et les états sauvegardés.
- **Stroboscope** : `data-strobe` on/off.
- **Mode concert** (bouton du hero) : fond noir + 4 spotlights balayant l'écran.

## 🚀 Déploiement & aperçu

- **Render** lit `render.yaml` : `runtime: static`, `staticPublishPath: .`,
  auto-deploy sur push, previews de PR activées. Aucune variable d'env.
- ⚠️ **Cache** : `/assets/*` est servi en `immutable, max-age=1 an`. Si vous
  **modifiez** un fichier existant de `assets/`, renommez-le (et mettez à jour
  les références), sinon les visiteurs gardent l'ancien pendant un an.
  Les `.html` sont en no-cache, les `.css`/`.jsx` en cache 24 h.
- **Aperçu local** :

  ```bash
  python3 -m http.server 8080   # puis ouvrir http://localhost:8080
  ```

  Ouvrir `index.html` en `file://` ne marche pas (CDN + fetch des `.jsx`).

## ✅ Vérifications avant de committer

1. `diff "PMP Pop Metal.html" index.html` → vide.
2. Le site charge sans erreur console via `python3 -m http.server`.
3. Tout nouveau contenu est fictif, en français, dans le ton parodique
   pharma/métal du reste du site.
4. Les mp3 référencés dans `data.jsx` existent bien dans `assets/audio/`.
5. Capture d'écran de vérification dans `screenshots/` pour les changements
   visuels notables (convention existante du projet).

---

© MMXXVI · PMP Pop Métal · Site parodique · aucune transaction réelle.
