# PMP · Pharmacotechnie POP Métal

Site officiel parodique du groupe **PMP Pharmacotechnie POP Métal**.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

> 👉 Pour activer le bouton « Deploy to Render » en un clic, remplacez le lien ci-dessus par :
> `https://render.com/deploy?repo=https://github.com/VOTRE-COMPTE/VOTRE-REPO`
> (une fois le repo poussé sur GitHub). Render lit automatiquement `render.yaml`.

Discographie · tournée · boutique · Pharmacobar · galerie · paroles · contact.

> ⚠️ Tous les noms d'hôpitaux, dates et morceaux sont fictifs.
> Site humoristique — aucune transaction réelle, aucune affiliation hospitalière.

---

## 🚀 Déploiement sur Render — en 1 clic

### Option A : Bouton « Deploy to Render »

1. Pousser ce dossier sur GitHub (voir plus bas).
2. Modifier le bouton ci-dessus avec votre URL de repo.
3. Cliquer le bouton → Render détecte `render.yaml`, configure tout, déploie.
4. Le site est live à `https://pmp-pharmacotechnie-pop-metal.onrender.com` (modifiable).

### Option B : Via le dashboard Render

1. Pousser le repo sur GitHub.
2. [render.com](https://render.com/) → **New** → **Blueprint** → choisir le repo.
3. Cliquer **Apply** — Render lit `render.yaml` automatiquement.

### Pousser sur GitHub depuis votre machine

```bash
git init
git add .
git commit -m "PMP Pop Métal — initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/VOTRE-REPO.git
git push -u origin main
```

---

## Le blueprint configure :

- `runtime: static` — pas de build, serveur statique
- `staticPublishPath: .` — la racine du dépôt est publiée telle quelle
- Cache long pour `/assets/*` (images, audios, logos)
- No-cache sur les fichiers HTML pour rollouts immédiats
- Pull request previews activées
- Auto-deploy activé sur chaque push

### Aperçu local

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

---

## 📁 Structure

```
.
├── index.html                  ← entrée du site
├── PMP Pop Metal.html          ← fichier de design source (identique)
├── styles.css                  ← styles + responsive
├── data.jsx                    ← contenu : tracks, concerts, merch, cocktails, membres
├── logo.jsx                    ← logo vinyle + icônes
├── audio.jsx                   ← lecteur Web Audio
├── sections.jsx                ← sections du site
├── app.jsx                     ← composant racine + panier + mode concert
├── tweaks-panel.jsx            ← panneau de tweaks
├── render.yaml                 ← blueprint Render (auto-détecté)
└── assets/
    ├── audio/                  ← 17 morceaux officiels (mp3)
    ├── gallery/                ← 6 visuels éditoriaux SVG
    ├── pmp-hero-logo.png       ← logo central du hero
    └── pharmacotechnie-logo.png ← logo pour les goodies
```

---

## 🎛️ Tweaks disponibles

Le toggle « Tweaks » en bas à droite permet de :

- changer la palette (Posologie · Stérile · Toxique · Crémation)
- basculer mode jour / nuit
- activer le stroboscope
- changer la typographie des titres (Gothique / Pop / Brutaliste)
- choisir la forme du curseur (Gélule / Seringue / Croix médicale / Goutte)

Le **Mode concert** (bouton dans le hero) bascule la page en fond noir
avec quatre spotlights colorés qui balayent l'écran.

---

© MMXXVI · PMP Pop Métal · Site parodique · aucune transaction réelle.
