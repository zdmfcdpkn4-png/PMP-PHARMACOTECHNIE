// build.mjs : construit la version de production du site dans dist/.
//
// Le dépôt reste éditable comme avant (index.html + fichiers .jsx, lisibles
// en local avec Babel dans le navigateur). Ce script, lancé par Render à
// chaque déploiement, produit une copie optimisée :
//   1. précompile chaque .jsx avec la même version et les mêmes options de
//      Babel que celles appliquées dans le navigateur (le code exécuté est
//      donc le même, sans les 3 Mo de Babel à télécharger) ;
//   2. remplace React « development » par React « production » ;
//   3. ajoute une empreinte ?v=<hash> à chaque JS, CSS et fichier assets/
//      référencé, pour pouvoir les mettre en cache longtemps sans jamais
//      servir une version périmée après une mise à jour ;
//   4. ne publie que les fichiers du site (pas README, render.yaml, etc.).
//
// Usage : npm ci && npm run build   (aperçu : python3 -m http.server 8080 -d dist)

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const Babel = require("@babel/standalone");

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "dist");

// Fichiers publiés tels quels. Tout ce qui n'est pas listé ici n'est pas en ligne.
const COPY = [
  "assets",
  "favicon.ico", "favicon-16x16.png", "favicon-32x32.png",
  "apple-touch-icon.png", "apple-touch-icon-precomposed.png",
  "apple-touch-icon-v2.png", "apple-touch-icon-v3.png",
  "icon-192.png", "icon-512.png", "site.webmanifest",
];

// Options reprises de @babel/standalone (transformScriptTags) pour un
// <script type="text/babel"> sans data-presets ni data-plugins.
const BABEL_OPTIONS = {
  presets: ["react", "env"],
  plugins: ["transform-class-properties", "transform-object-rest-spread", "transform-flow-strip-types"],
  targets: { browsers: undefined },
};

// Balises remplacées dans index.html (React production, même version 18.3.1).
const SWAPS = [
  [
    /<script src="https:\/\/unpkg\.com\/react@18\.3\.1\/umd\/react\.development\.js"[^>]*><\/script>/,
    '<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" integrity="sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z" crossorigin="anonymous"></script>',
  ],
  [
    /<script src="https:\/\/unpkg\.com\/react-dom@18\.3\.1\/umd\/react-dom\.development\.js"[^>]*><\/script>/,
    '<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" integrity="sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1" crossorigin="anonymous"></script>',
  ],
  [/<script src="https:\/\/unpkg\.com\/@babel\/standalone@[^"]+"[^>]*><\/script>\n?/, ""],
];

const hashOf = (content) => createHash("sha256").update(content).digest("hex").slice(0, 10);

// Ajoute ?v=<empreinte du fichier> à chaque chemin "assets/..." cité.
const assetHashes = new Map();
function versionAssets(code, from) {
  return code.replace(/(["'(])(assets\/[^"'()?#\s]+)/g, (match, quote, rel) => {
    const file = path.join(ROOT, rel);
    if (!existsSync(file)) {
      console.warn(`! ${from} cite ${rel}, fichier introuvable : laissé tel quel`);
      return match;
    }
    if (!assetHashes.has(rel)) assetHashes.set(rel, hashOf(readFileSync(file)));
    return `${quote}${rel}?v=${assetHashes.get(rel)}`;
  });
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
for (const f of COPY) cpSync(path.join(ROOT, f), path.join(OUT, f), { recursive: true });

let html = readFileSync(path.join(ROOT, "index.html"), "utf8");

for (const [pattern, replacement] of SWAPS) {
  if (!pattern.test(html)) throw new Error(`index.html : balise attendue introuvable (${pattern})`);
  html = html.replace(pattern, replacement);
}

// .jsx → .js précompilé, dans l'ordre de index.html.
html = html.replace(/<script type="text\/babel" src="([^"]+)\.jsx"><\/script>/g, (_, name) => {
  const source = readFileSync(path.join(ROOT, `${name}.jsx`), "utf8");
  const { code } = Babel.transform(source, { ...BABEL_OPTIONS, filename: `${name}.jsx` });
  const output = versionAssets(code, `${name}.jsx`);
  writeFileSync(path.join(OUT, `${name}.js`), output);
  console.log(`  ${name}.jsx → ${name}.js (${Math.round(output.length / 1024)} Ko)`);
  return `<script src="${name}.js?v=${hashOf(output)}"></script>`;
});
if (/text\/babel/.test(html)) throw new Error("index.html : un script text/babel n'a pas été précompilé");

const css = versionAssets(readFileSync(path.join(ROOT, "styles.css"), "utf8"), "styles.css");
writeFileSync(path.join(OUT, "styles.css"), css);
if (!html.includes('href="styles.css"')) throw new Error('index.html : lien vers styles.css introuvable');
html = html.replace('href="styles.css"', `href="styles.css?v=${hashOf(css)}"`);

writeFileSync(path.join(OUT, "index.html"), html);
console.log(`dist/ prêt : ${assetHashes.size} fichiers assets versionnés.`);
