// sections.jsx — all main sections for PMP site
const { useState, useEffect, useRef } = React;
const { PMP_TRACKS, PMP_CONCERTS, PMP_MERCH, PMP_MEMBERS, PMP_LYRICS, PMP_GALLERY } = window.PMP;

/* ═══ HERO ═══════════════════════════════════════════════ */
function Hero({ onPlay, onScrollTo, concertMode, setConcertMode, vinylPlaying, onVinylClick }) {
  return (
    <section className="hero" id="accueil" data-screen-label="01 Hero">
      <div className="hero-3d">
        <PmpLogo3D size={480} />
      </div>
      <div className="hero-row">
        <div className="hero-col">
          <span className="kicker">Pop Métal · Pharmacotechnie · MMXXVI</span>
          <h1 className="hero-title">
            <span className="ht-pmp">PMP</span>
            <span className="ht-sub">Pharmaco · Pop · Métal</span>
          </h1>
          <div className="hero-sub" style={{ marginTop: 16 }}>
            <span className="stamp">Préparation magistrale sonore</span>
            <span className="dot"></span>
            <span>4 préparateurs</span>
            <span className="dot"></span>
            <span>1 hotte ISO 5</span>
            <span className="dot"></span>
            <span>666 BPM max</span>
          </div>
          <div className="hero-cta">
            <button className="btn pink" onClick={onPlay}>
              <CapsuleIcon size={14} color="currentColor" />
              Écouter « Panique en Pharmaco »
            </button>
            <button className="btn ghost" onClick={() => onScrollTo("concerts")}>
              Tournée 2026 →
            </button>
            <button
              className={`btn ghost concert-btn ${concertMode ? "is-live" : ""}`}
              onClick={() => setConcertMode(!concertMode)}
            >
              {concertMode ? "● Sortir du live" : "○ Mode concert"}
            </button>
          </div>
        </div>
        <div className="hero-meta-col">
          <div className="meta-block">
            <span className="m-lbl">EST.</span>
            <span className="m-val">2024 · Salle de pause #3B</span>
          </div>
          <div className="meta-block">
            <span className="m-lbl">DCI</span>
            <span className="m-val">Pop · Doom · Pharmaceutique</span>
          </div>
          <div className="meta-block">
            <span className="m-lbl">Sortie</span>
            <span className="m-val">2 singles dispos · LP fin 2026</span>
          </div>
          <div className="meta-block">
            <span className="m-lbl">Lot</span>
            <span className="m-val">26-PMP-666 · péremption MMXLII</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ MARQUEE ════════════════════════════════════════════ */
function Marquee() {
  const items = [
    "POSOLOGIE MAXIMALE", "QSP 666", "AMM REFUSÉE",
    "PRÉPARATION MAGISTRALE", "ZAC FUNÉRAIRE",
    "STÉRILE MAIS HOSTILE", "CHARLOTTE DE LA MORT",
    "DCI · DAMNATION COMPRIMÉE IATROGÈNE",
  ];
  const run = (
    <span>
      {items.map((x, i) => (
        <React.Fragment key={i}>
          {x}<span className="sep"> ✚ </span>
        </React.Fragment>
      ))}
    </span>
  );
  return (
    <div className="marquee" role="presentation">
      <div className="marquee-track">{run}{run}{run}</div>
    </div>
  );
}

/* ═══ DISCOGRAPHIE ═══════════════════════════════════════ */
function Discographie() {
  const [playing, setPlaying] = useState(null);
  const [vizBars, setVizBars] = useState(() => new Array(32).fill(8));
  const rafRef = useRef();

  useEffect(() => {
    if (playing === null) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const an = PmpAudio.getAnalyser();
    if (!an) return;
    const buf = new Uint8Array(an.frequencyBinCount);
    const tick = () => {
      an.getByteFrequencyData(buf);
      const bars = [];
      const N = 32;
      const step = Math.floor(buf.length / N);
      for (let i = 0; i < N; i++) {
        let m = 0;
        for (let j = 0; j < step; j++) m = Math.max(m, buf[i*step+j]);
        bars.push(4 + (m / 255) * 28);
      }
      setVizBars(bars);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const toggle = (t) => {
    if (playing === t.n) { PmpAudio.stop(); setPlaying(null); }
    else { PmpAudio.start(t); setPlaying(t.n); }
  };

  return (
    <section className="pmp" id="discographie" data-screen-label="02 Discographie">
      <span className="kicker">Notice · Discographie</span>
      <h2 className="section-title">Galénique<br/>sonore</h2>
      <p className="section-sub">
        Douze formes pharmaceutiques sonores · LP « QSP 666 » · pressage 33 tours, verre brun de protection
        UV · à conserver à l'abri de la lumière et des oreilles sensibles.
      </p>

      <div className="disco">
        {PMP_TRACKS.map(t => (
          <div className="track" key={t.n} data-playing={playing === t.n} data-featured={t.featured ? "true" : "false"}>
            <div className="n">{String(t.n).padStart(2, "0")}</div>
            <div className="title-row">
              <div className="t-title">
                {t.title}
                {t.featured && <span className="badge-live">▶ AUDIO OFFICIEL</span>}
              </div>
              <div className="t-sub">{t.sub} · {t.bpm} BPM · {t.key} · {t.type}</div>
              {playing === t.n && (
                <div className="viz" aria-hidden>
                  {vizBars.map((h, i) => (
                    <span key={i} style={{ height: `${h}px` }} />
                  ))}
                </div>
              )}
            </div>
            <div className="meta">
              <span><b>DCI</b> {t.dci}</span>
              <span><b>Durée</b> {t.dur}</span>
            </div>
            <button className="play" onClick={() => toggle(t)} aria-label={playing === t.n ? "Stop" : "Play"}>
              {playing === t.n ? (
                <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="3.5" height="10" fill="currentColor"/><rect x="8.5" y="2" width="3.5" height="10" fill="currentColor"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="3,2 12,7 3,12" fill="currentColor"/></svg>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="callout">
        ⚠ Posologie d'écoute · adulte : 1 morceau, 3 fois / jour, après les repas.
        Enfant : avis médical. Grossesse : éviter « QSP 666 ». Conduite : dangereuse.
      </div>
    </section>
  );
}

/* ═══ CONCERTS ═══════════════════════════════════════════ */
function Concerts() {
  return (
    <section className="pmp" id="concerts" data-screen-label="03 Concerts">
      <span className="kicker">Calendrier · Posologie de tournée</span>
      <h2 className="section-title">Tournée<br/>« QSP&nbsp;666 »</h2>
      <p className="section-sub">
        Dix dates en milieu hospitalier fictif. Toutes les salles citées sont imaginaires.
        Tenue exigée : EPI ou tenue de scène — au choix du public.
      </p>

      <div className="shows">
        {PMP_CONCERTS.map((s, i) => (
          <div className="show" key={i}>
            <div className="date mono">{s.date}</div>
            <div>
              <div className="city">{s.city}</div>
              <div className="venue">{s.venue} · {s.etab}</div>
            </div>
            <div className="status" data-s={s.status}>
              {s.status === "complet" ? "Complet"
                : s.status === "rare" ? "Rares billets"
                : s.status === "privé" ? "Date privée"
                : "Billets dispo"}
            </div>
            <a href="#" className="ticket" data-disabled={s.status === "complet" || s.status === "privé"}>
              {s.status === "complet" ? "Liste d'attente" : s.status === "privé" ? "—" : "Billetterie ↗"}
            </a>
          </div>
        ))}
      </div>

      <div className="callout">
        ⚕ Tarif réduit pour personnel soignant sur présentation de la carte pro.
        Réduction supplémentaire si vous arrivez en blouse.
      </div>
    </section>
  );
}

/* ═══ MEMBRES (entre concerts et boutique) ═══════════════ */
// Member-card icons (music + pharmacy). Single-color, currentColor-driven.
function MemberIcon({ kind }) {
  const s = { width: 18, height: 18, display: "block" };
  switch (kind) {
    case "mic":
      return <svg viewBox="0 0 24 24" style={s}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM6 11a6 6 0 0 0 12 0M12 17v4M8 21h8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case "guitar":
      return <svg viewBox="0 0 24 24" style={s}><path d="M3 21l4-4M7 17l3 3M14 4l6 6-2 2-2-2-4 4a4 4 0 1 1-4-4l4-4-2-2 2-2zM12 12l3 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
    case "bass":
      return <svg viewBox="0 0 24 24" style={s}><circle cx="9" cy="17" r="4" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M11 14L20 5M18 3l3 3M16 5l3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case "drums":
      return <svg viewBox="0 0 24 24" style={s}><ellipse cx="12" cy="8" rx="9" ry="3" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M3 8v6a9 3 0 0 0 18 0V8M5 18l-2 3M19 18l2 3" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "keys":
      return <svg viewBox="0 0 24 24" style={s}><rect x="2" y="6" width="20" height="12" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M7 6v8M12 6v8M17 6v8M5 14h2v4H5zM10 14h2v4h-2zM15 14h2v4h-2z" fill="currentColor"/></svg>;
    case "synth":
      return <svg viewBox="0 0 24 24" style={s}><rect x="2" y="8" width="20" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="6" cy="13" r="1.4" fill="currentColor"/><circle cx="11" cy="13" r="1.4" fill="currentColor"/><circle cx="16" cy="13" r="1.4" fill="currentColor"/><line x1="20" y1="11" x2="20" y2="15" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "violin":
      return <svg viewBox="0 0 24 24" style={s}><path d="M5 19l9-9M5 19l-2 2M14 10l5-5M14 10c2 0 4 2 4 4s2 4 2 4-2 0-4-2-4-4-4-4M9 14c-1-1-1-3 0-4s3-1 4 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
    case "cello":
      return <svg viewBox="0 0 24 24" style={s}><ellipse cx="12" cy="15" rx="6" ry="7" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8V2M10 4h4M9 13v4M15 13v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
    case "mixer":
      return <svg viewBox="0 0 24 24" style={s}><path d="M3 4h18M3 12h18M3 20h18" stroke="currentColor" strokeWidth="1.6"/><circle cx="8" cy="4" r="2" fill="var(--bg)" stroke="currentColor" strokeWidth="1.6"/><circle cx="16" cy="12" r="2" fill="var(--bg)" stroke="currentColor" strokeWidth="1.6"/><circle cx="11" cy="20" r="2" fill="var(--bg)" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "headphones":
      return <svg viewBox="0 0 24 24" style={s}><path d="M4 14a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="13" width="4" height="7" rx="1" fill="currentColor"/><rect x="17" y="13" width="4" height="7" rx="1" fill="currentColor"/></svg>;
    case "wave":
      return <svg viewBox="0 0 24 24" style={s}><path d="M2 12c2 0 2-6 4-6s2 12 4 12 2-9 4-9 2 6 4 6 2-3 4-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case "bulb":
      return <svg viewBox="0 0 24 24" style={s}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10c-1 1-1 2-1 3H9c0-1 0-2-1-3a6 6 0 0 1 4-10z" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "bolt":
      return <svg viewBox="0 0 24 24" style={s}><polygon points="13 2 4 14 11 14 9 22 20 10 13 10 15 2" fill="currentColor"/></svg>;
    case "clip":
      return <svg viewBox="0 0 24 24" style={s}><rect x="5" y="4" width="14" height="18" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6"/><rect x="9" y="2" width="6" height="4" rx="1" fill="currentColor"/><line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.6"/><line x1="8" y1="15" x2="14" y2="15" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "wrench":
      return <svg viewBox="0 0 24 24" style={s}><path d="M14 6a4 4 0 1 1 4 4l-9 9-4-4 9-9z" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "box":
      return <svg viewBox="0 0 24 24" style={s}><path d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
    case "phone":
      return <svg viewBox="0 0 24 24" style={s}><rect x="6" y="2" width="12" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="18" r="1.4" fill="currentColor"/></svg>;
    case "star":
      return <svg viewBox="0 0 24 24" style={s}><polygon points="12 2 15 9 22 10 17 15 18 22 12 19 6 22 7 15 2 10 9 9" fill="currentColor"/></svg>;
    case "spark":
      return <svg viewBox="0 0 24 24" style={s}><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
    case "leaf":
      return <svg viewBox="0 0 24 24" style={s}><path d="M3 21c0-9 6-15 18-18-1 11-7 17-18 18zM5 19c5-5 9-9 13-12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
    case "feather":
      return <svg viewBox="0 0 24 24" style={s}><path d="M20 4c0 8-8 16-16 16l4-8h6l-6 0 8-8z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
    case "lotus":
      return <svg viewBox="0 0 24 24" style={s}><path d="M12 4c-3 4-3 8 0 12 3-4 3-8 0-12zM4 14c2-2 6-2 8 2-2 4-6 4-8 2zM20 14c-2-2-6-2-8 2 2 4 6 4 8 2zM2 20h20" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "note":
      return <svg viewBox="0 0 24 24" style={s}><path d="M9 18V6l11-3v12" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="17" cy="15" r="3" fill="currentColor"/></svg>;
    case "key":
      return <svg viewBox="0 0 24 24" style={s}><circle cx="8" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M12 12h10M18 12v4M22 12v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case "skull":
      return <svg viewBox="0 0 24 24" style={s}><path d="M5 11a7 7 0 0 1 14 0v4l-2 2v3h-3v-2h-4v2H7v-3l-2-2z" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="9" cy="13" r="1.4" fill="currentColor"/><circle cx="15" cy="13" r="1.4" fill="currentColor"/></svg>;
    case "shape":
      return <svg viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="8" height="8" fill="currentColor"/><circle cx="17" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/><polygon points="12 22 3 22 7.5 14" fill="currentColor"/><rect x="13" y="13" width="9" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "heart":
      return <svg viewBox="0 0 24 24" style={s}><path d="M12 21s-8-5-8-12a5 5 0 0 1 8-3 5 5 0 0 1 8 3c0 7-8 12-8 12z" fill="currentColor"/></svg>;
    default:
      return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8"/></svg>;
  }
}

function Membres() {
  const initials = (s) =>
    s.replace(/[«»."']/g, "").split(/[\s\-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("");
  // Deterministic avatar gradients by name (so reloads keep the same look).
  const seedHue = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % 360;

  // Shuffle the member order on every mount so the line-up never looks
  // hierarchical. Fisher-Yates with Math.random for a fresh order each load.
  const shuffled = React.useMemo(() => {
    const arr = [...PMP_MEMBERS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  return (
    <section className="pmp" id="groupe" data-screen-label="04 Groupe">
      <span className="kicker">Composition · Excipients à effet notoire · {PMP_MEMBERS.length} membres</span>
      <h2 className="section-title">Le groupe</h2>
      <p className="section-sub">
        L'effectif PMP — trente-quatre membres titulaires. Ordre de passage tiré au sort à chaque
        chargement (comme une set-list de festival). Survolez une carte : l'instrument s'illumine.
      </p>
      <div className="members">
        {shuffled.map((m, i) => {
          const h = seedHue(m.stage);
          return (
            <article key={m.stage} className="member" data-accent={m.accent}>
              <div className="m-bg" aria-hidden></div>
              <div className="m-avatar"
                   style={{ background: `linear-gradient(135deg, hsl(${h} 70% 56%) 0%, hsl(${(h + 60) % 360} 70% 46%) 100%)` }}>
                <span className="m-initials">{initials(m.stage)}</span>
                <span className="m-icon"><MemberIcon kind={m.icon}/></span>
              </div>
              <div className="m-body">
                <h3 className="m-stage">{m.stage}</h3>
                <div className="m-role">{m.role}</div>
                <p className="m-desc">{m.desc}</p>
              </div>
              <span className="m-rx">℞</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ═══ BOUTIQUE ═══════════════════════════════════════════ */
// Each goodie is rendered as a more photo-realistic SVG: soft gradient
// substrate, drop shadow, folds/highlights, and the actual logo PNG
// printed at the right size. Pictures are intentionally clean studio
// shots on a coloured backdrop, not flat geometric icons.
function ProductPic({ product }) {
  const swatches = product.swatch;
  const c = (name) => `var(--c-${name})`;
  const bg = c(swatches[0]);
  const fg = c(swatches[1] || swatches[0]);
  const HERO = "assets/pmp-hero-logo.png";       // metallic main logo
  const PHARMA = "assets/pharmacotechnie-logo.png"; // colourful petal P

  // Common: studio backdrop with subtle vignette + light from top-left
  const studioDefs = (id) => (
    <defs>
      <radialGradient id={`bd-${id}`} cx="30%" cy="20%" r="100%">
        <stop offset="0%"  stopColor="rgba(255,255,255,.18)"/>
        <stop offset="60%" stopColor="rgba(255,255,255,0)"/>
        <stop offset="100%" stopColor="rgba(0,0,0,.32)"/>
      </radialGradient>
      <linearGradient id={`fab-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"  stopColor="rgba(255,255,255,.18)"/>
        <stop offset="40%" stopColor="rgba(255,255,255,0)"/>
        <stop offset="100%" stopColor="rgba(0,0,0,.28)"/>
      </linearGradient>
      <filter id={`sh-${id}`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3"/>
        <feOffset dy="6"/>
        <feComponentTransfer><feFuncA type="linear" slope=".35"/></feComponentTransfer>
        <feComposite in2="SourceGraphic" operator="out"/>
      </filter>
    </defs>
  );

  switch (product.id) {
    /* ─────────── T-SHIRT ─────────── */
    case "tshirt": {
      const shirt = fg;
      const print = HERO;
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("ts")}
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-ts)`}/>
          {/* drop shadow */}
          <ellipse cx="100" cy="178" rx="58" ry="6" fill="rgba(0,0,0,.32)"/>
          {/* shirt body */}
          <path d="M50 56 L70 38 Q78 50 100 53 Q122 50 130 38 L150 56 L162 70 L150 80 L140 76 L140 178 Q100 184 60 178 L60 76 L50 80 L38 70 Z"
                fill={shirt}/>
          {/* fabric folds (shading overlay) */}
          <path d="M50 56 L70 38 Q78 50 100 53 Q122 50 130 38 L150 56 L162 70 L150 80 L140 76 L140 178 Q100 184 60 178 L60 76 L50 80 L38 70 Z"
                fill={`url(#fab-ts)`}/>
          {/* collar */}
          <path d="M82 46 Q100 60 118 46 L114 52 Q100 60 86 52 Z" fill="rgba(0,0,0,.35)"/>
          {/* sleeve seam shading */}
          <path d="M60 76 Q56 80 50 80" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="1.5"/>
          <path d="M140 76 Q144 80 150 80" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="1.5"/>
          {/* printed logo */}
          <image href={print} x="64" y="78" width="72" height="72"
                 preserveAspectRatio="xMidYMid meet"
                 style={{ mixBlendMode: shirt === "var(--c-bone)" ? "multiply" : "screen", opacity: .92 }}/>
        </svg>
      );
    }

    /* ─────────── HOODIE ─────────── */
    case "hoodie": {
      const fabric = fg;
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("hd")}
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-hd)`}/>
          <ellipse cx="100" cy="180" rx="60" ry="6" fill="rgba(0,0,0,.32)"/>
          {/* hood */}
          <path d="M76 52 Q100 30 124 52 Q132 64 124 72 Q100 60 76 72 Q68 64 76 52 Z" fill={fabric}/>
          {/* body */}
          <path d="M44 70 L72 56 Q90 70 110 70 Q120 70 128 56 L156 70 L168 86 L150 100 L142 92 L142 178 Q100 184 58 178 L58 92 L50 100 L32 86 Z" fill={fabric}/>
          <path d="M44 70 L72 56 Q90 70 110 70 Q120 70 128 56 L156 70 L168 86 L150 100 L142 92 L142 178 Q100 184 58 178 L58 92 L50 100 L32 86 Z" fill={`url(#fab-hd)`}/>
          {/* kangaroo pocket */}
          <path d="M62 130 L74 116 L126 116 L138 130 L138 158 L62 158 Z" fill="rgba(0,0,0,.18)"/>
          {/* drawstrings */}
          <path d="M88 64 L86 96 M112 64 L114 96" stroke="rgba(255,255,255,.45)" strokeWidth="1.8"/>
          <circle cx="86" cy="98" r="2.4" fill="rgba(255,255,255,.7)"/>
          <circle cx="114" cy="98" r="2.4" fill="rgba(255,255,255,.7)"/>
          {/* printed logo */}
          <image href={HERO} x="68" y="106" width="64" height="64"
                 preserveAspectRatio="xMidYMid meet"
                 style={{ mixBlendMode: "screen", opacity: .9 }}/>
        </svg>
      );
    }

    /* ─────────── MUG ─────────── */
    case "mug": {
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("mu")}
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-mu)`}/>
          <ellipse cx="92" cy="172" rx="42" ry="6" fill="rgba(0,0,0,.32)"/>
          {/* mug body */}
          <defs>
            <linearGradient id="mu-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"  stopColor="rgba(0,0,0,.28)"/>
              <stop offset="20%" stopColor="rgba(255,255,255,.18)"/>
              <stop offset="50%" stopColor="rgba(255,255,255,0)"/>
              <stop offset="80%" stopColor="rgba(0,0,0,.16)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,.32)"/>
            </linearGradient>
          </defs>
          <rect x="44" y="58" width="100" height="110" rx="6" fill={fg}/>
          <rect x="44" y="58" width="100" height="110" rx="6" fill="url(#mu-grad)"/>
          {/* top rim oval */}
          <ellipse cx="94" cy="58" rx="50" ry="8" fill={fg}/>
          <ellipse cx="94" cy="58" rx="50" ry="8" fill="rgba(0,0,0,.25)"/>
          <ellipse cx="94" cy="56" rx="42" ry="5" fill="rgba(0,0,0,.6)"/>
          {/* coffee */}
          <ellipse cx="94" cy="54" rx="42" ry="5" fill="rgba(60,30,15,.85)"/>
          {/* bottom rim */}
          <ellipse cx="94" cy="168" rx="50" ry="6" fill="rgba(0,0,0,.32)"/>
          {/* handle */}
          <path d="M144 78 Q176 78 176 116 Q176 154 144 154" fill="none" stroke={fg} strokeWidth="10" strokeLinecap="round"/>
          <path d="M144 78 Q176 78 176 116 Q176 154 144 154" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="3"/>
          {/* logo print */}
          <image href={HERO} x="52" y="76" width="80" height="80"
                 preserveAspectRatio="xMidYMid meet"
                 style={{ mixBlendMode: "screen", opacity: .9 }}/>
        </svg>
      );
    }

    /* ─────────── PILULIER ─────────── */
    case "pilulier": {
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("pl")}
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-pl)`}/>
          <ellipse cx="100" cy="170" rx="76" ry="5" fill="rgba(0,0,0,.32)"/>
          <defs>
            <linearGradient id="pl-cell" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,.3)"/>
              <stop offset="50%" stopColor="rgba(255,255,255,0)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,.25)"/>
            </linearGradient>
          </defs>
          {/* base */}
          <rect x="14" y="62" width="172" height="104" rx="6" fill={fg}/>
          <rect x="14" y="62" width="172" height="6" fill="rgba(255,255,255,.25)"/>
          <rect x="14" y="160" width="172" height="6" fill="rgba(0,0,0,.2)"/>
          {/* 7 cells (translucent lids) */}
          {[...Array(7)].map((_, i) => {
            const x = 18 + i * 24;
            return (
              <g key={i}>
                <rect x={x} y="74" width="20" height="80" rx="3"
                      fill={c(swatches[i % swatches.length] || "pink")} opacity=".55"/>
                <rect x={x} y="74" width="20" height="80" rx="3" fill="url(#pl-cell)"/>
                {/* hinge */}
                <rect x={x+1} y="76" width="18" height="2" fill="rgba(255,255,255,.5)"/>
                {/* day label */}
                <text x={x + 10} y="88" textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace" fontSize="7" fill="rgba(0,0,0,.6)" fontWeight="700">
                  {["L","M","M","J","V","S","D"][i]}
                </text>
                {/* tiny pill inside */}
                <ellipse cx={x + 10} cy="128" rx="6" ry="3" fill="#fff" opacity=".9"/>
                <ellipse cx={x + 10} cy="127" rx="5" ry="1" fill="rgba(255,255,255,.6)"/>
              </g>
            );
          })}
          {/* embossed logo on lid */}
          <image href={HERO} x="76" y="20" width="48" height="48"
                 preserveAspectRatio="xMidYMid meet"
                 style={{ opacity: .8 }}/>
        </svg>
      );
    }

    /* ─────────── MEDIATORS / PLECTRES (réalistes) ─────────── */
    case "plectre": {
      // A pharma-themed display: a small clear case with embossed PMP logo,
      // 5 picks shaped like real guitar picks (with bevel/highlight/print).
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("pk")}
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-pk)`}/>
          <defs>
            <radialGradient id="pk-case" cx="50%" cy="38%" r="70%">
              <stop offset="0%"  stopColor="rgba(255,255,255,.35)"/>
              <stop offset="55%" stopColor="rgba(255,255,255,.08)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,.18)"/>
            </radialGradient>
          </defs>
          {/* drop shadow */}
          <ellipse cx="100" cy="178" rx="78" ry="6" fill="rgba(0,0,0,.32)"/>
          {/* transparent display case */}
          <rect x="22" y="28" width="156" height="146" rx="10"
                fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.35)" strokeWidth="1.2"/>
          <rect x="22" y="28" width="156" height="146" rx="10" fill="url(#pk-case)"/>
          {/* case label strip */}
          <rect x="22" y="148" width="156" height="26" rx="0"
                fill="rgba(0,0,0,.7)"/>
          <text x="100" y="163" textAnchor="middle"
                fontFamily="JetBrains Mono, monospace" fontSize="8"
                fill="#fff" letterSpacing="2" fontWeight="700">PMP · MEDIATOR PACK · 5 PCS · 0.71 mm</text>
          <text x="100" y="172" textAnchor="middle"
                fontFamily="JetBrains Mono, monospace" fontSize="6"
                fill="rgba(255,255,255,.6)" letterSpacing="2">LOT 26-MED-PMP · CELLULOID</text>

          {/* 5 realistic picks scattered */}
          {[
            { x: 60,  y: 70,  r: -18, col: "var(--c-pink)"    },
            { x: 138, y: 64,  r: 24,  col: "var(--c-orange)"  },
            { x: 50,  y: 122, r: -34, col: "var(--c-mustard)" },
            { x: 110, y: 118, r: 8,   col: "var(--c-lilac)"   },
            { x: 158, y: 116, r: 40,  col: "var(--c-pink-2)"  },
          ].map((p, i) => (
            <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}>
              {/* pick shadow */}
              <path d="M -2 4 Q 0 -22 22 -19 Q 24 -2 0 32 Q -22 -2 -22 -19 Q 0 -22 -2 4 Z"
                    fill="rgba(0,0,0,.35)" transform="translate(2 4)"/>
              {/* base pick body (classic 351 shape) */}
              <path d="M 0 -24 Q 22 -22 22 -8 Q 18 12 0 30 Q -18 12 -22 -8 Q -22 -22 0 -24 Z"
                    fill={p.col}/>
              {/* bevel — front-lit gradient */}
              <path d="M 0 -24 Q 22 -22 22 -8 Q 18 12 0 30 Q -18 12 -22 -8 Q -22 -22 0 -24 Z"
                    fill="url(#bd-pk)" opacity=".55"/>
              {/* glossy highlight (top crescent) */}
              <path d="M -16 -16 Q 0 -24 16 -16 Q 10 -8 0 -8 Q -10 -8 -16 -16 Z"
                    fill="rgba(255,255,255,.55)"/>
              {/* small lower-back darker reflection */}
              <path d="M -8 14 Q 0 22 8 14 Q 4 22 0 26 Q -4 22 -8 14 Z"
                    fill="rgba(0,0,0,.22)"/>
              {/* embossed PMP wordmark */}
              <text x="0" y="2" textAnchor="middle"
                    fontFamily="'Metal Mania', serif" fontSize="11"
                    fill="rgba(0,0,0,.55)" fontWeight="700">PMP</text>
              <text x="0" y="14" textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace" fontSize="3.5"
                    fill="rgba(0,0,0,.55)" letterSpacing="1">.71mm</text>
              {/* rim outline */}
              <path d="M 0 -24 Q 22 -22 22 -8 Q 18 12 0 30 Q -18 12 -22 -8 Q -22 -22 0 -24 Z"
                    fill="none" stroke="rgba(0,0,0,.45)" strokeWidth=".8"/>
            </g>
          ))}

          {/* top-right care tag */}
          <g transform="translate(150 36) rotate(8)">
            <rect x="-18" y="-9" width="36" height="18" fill="#fef3d8" stroke="rgba(0,0,0,.4)" strokeWidth=".6"/>
            <text x="0" y="-2" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="5" fill="rgba(0,0,0,.7)" fontWeight="700">℞ MEDIATOR</text>
            <text x="0" y="5" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="4" fill="rgba(0,0,0,.6)">×5 · 0.71mm</text>
          </g>
        </svg>
      );
    }

    /* ─────────── TOTE ─────────── */
    case "tote": {
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("to")}
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-to)`}/>
          <ellipse cx="100" cy="180" rx="58" ry="5" fill="rgba(0,0,0,.32)"/>
          {/* bag body */}
          <path d="M48 62 L52 178 L148 178 L152 62 Z" fill={fg}/>
          <path d="M48 62 L52 178 L148 178 L152 62 Z" fill={`url(#fab-to)`}/>
          {/* fabric weave hint */}
          <path d="M48 62 L52 178" stroke="rgba(0,0,0,.18)" strokeWidth="1"/>
          <path d="M148 62 L152 178" stroke="rgba(0,0,0,.18)" strokeWidth="1"/>
          {/* handles */}
          <path d="M70 62 Q70 30 100 30 Q130 30 130 62" fill="none" stroke={fg} strokeWidth="7" strokeLinecap="round"/>
          <path d="M70 62 Q70 30 100 30 Q130 30 130 62" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="2"/>
          {/* opening */}
          <path d="M52 64 Q100 70 148 64" fill="none" stroke="rgba(0,0,0,.45)" strokeWidth="1.5"/>
          {/* logo print */}
          <image href={HERO} x="60" y="92" width="80" height="80"
                 preserveAspectRatio="xMidYMid meet"
                 style={{ mixBlendMode: "screen", opacity: .9 }}/>
        </svg>
      );
    }

    /* ─────────── STICKERS ─────────── */
    case "stickers": {
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("st")}
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-st)`}/>
          {[0,1,2,3].map(i => {
            const x = 28 + (i % 2) * 76;
            const y = 28 + Math.floor(i / 2) * 76;
            const r = ((i * 17) % 12) - 6;
            const sw = swatches[i % swatches.length] || "pink";
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
                {/* sticker shadow (peeled corner feel) */}
                <rect x="3" y="3" width="72" height="72" rx="6" fill="rgba(0,0,0,.32)"/>
                {/* sticker body */}
                <rect x="0" y="0" width="72" height="72" rx="6" fill={c(sw)}/>
                {/* foil sheen */}
                <rect x="0" y="0" width="72" height="72" rx="6"
                      fill="url(#bd-st)" opacity=".7"/>
                {/* peel highlight */}
                <path d="M0 0 L 72 0 L 72 4 L 4 4 Z" fill="rgba(255,255,255,.45)"/>
                {/* logo */}
                <image href={HERO} x="6" y="6" width="60" height="60"
                       preserveAspectRatio="xMidYMid meet"/>
              </g>
            );
          })}
        </svg>
      );
    }

    /* ─────────── VINYLE ─────────── */
    case "vinyle": {
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("vy")}
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-vy)`}/>
          <ellipse cx="100" cy="178" rx="78" ry="5" fill="rgba(0,0,0,.32)"/>
          <defs>
            <radialGradient id="vy-disc" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#3a3a3a"/>
              <stop offset="40%" stopColor="#0c0c0e"/>
              <stop offset="100%" stopColor="#000"/>
            </radialGradient>
            <radialGradient id="vy-lbl" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fff"/>
              <stop offset="100%" stopColor="#e7dfcd"/>
            </radialGradient>
          </defs>
          {/* disc */}
          <circle cx="100" cy="98" r="82" fill="url(#vy-disc)"/>
          {/* grooves */}
          {[78,72,66,60,54,48,42,36,30].map((r,i) => (
            <circle key={i} cx="100" cy="98" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1"/>
          ))}
          {/* shine wedge */}
          <path d="M100 98 L 100 16 A 82 82 0 0 1 178 70 Z" fill="rgba(255,255,255,.06)"/>
          {/* label */}
          <circle cx="100" cy="98" r="32" fill="url(#vy-lbl)"/>
          <image href={PHARMA} x="72" y="70" width="56" height="56"
                 preserveAspectRatio="xMidYMid meet"
                 style={{ mixBlendMode: "multiply" }}/>
          <circle cx="100" cy="98" r="3" fill="#0a0a0a"/>
        </svg>
      );
    }

    /* ─────────── PATCH BRODÉ ─────────── */
    case "patch": {
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("pt")}
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-pt)`}/>
          <ellipse cx="100" cy="178" rx="62" ry="6" fill="rgba(0,0,0,.32)"/>
          <defs>
            <radialGradient id="pt-fab" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="rgba(255,255,255,.3)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,.18)"/>
            </radialGradient>
          </defs>
          {/* fabric circle */}
          <circle cx="100" cy="96" r="74" fill={fg}/>
          <circle cx="100" cy="96" r="74" fill="url(#pt-fab)"/>
          {/* zig-zag merrowed edge */}
          <circle cx="100" cy="96" r="74" fill="none"
                  stroke={c(swatches[1] || "pink")} strokeWidth="6"
                  strokeDasharray="3 2"/>
          {/* embroidery texture (radial threads) */}
          {[...Array(40)].map((_, i) => {
            const a = (i / 40) * Math.PI * 2;
            const r1 = 26, r2 = 64;
            return (
              <line key={i}
                    x1={100 + Math.cos(a) * r1} y1={96 + Math.sin(a) * r1}
                    x2={100 + Math.cos(a) * r2} y2={96 + Math.sin(a) * r2}
                    stroke="rgba(0,0,0,.06)" strokeWidth=".6"/>
            );
          })}
          {/* logo */}
          <image href={HERO} x="50" y="46" width="100" height="100"
                 preserveAspectRatio="xMidYMid meet"
                 style={{ mixBlendMode: "multiply", opacity: .98 }}/>
        </svg>
      );
    }

    /* ─────────── CHARLOTTE ─────────── */
    case "charlotte": {
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("ch")}
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-ch)`}/>
          <ellipse cx="100" cy="170" rx="64" ry="5" fill="rgba(0,0,0,.32)"/>
          <defs>
            <linearGradient id="ch-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,.45)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
            </linearGradient>
          </defs>
          {/* charlotte body */}
          <path d="M30 110 Q100 36 170 110 L170 148 Q100 156 30 148 Z" fill={fg}/>
          <path d="M30 110 Q100 36 170 110 L170 148 Q100 156 30 148 Z" fill="url(#ch-grad)"/>
          {/* gathered band (dashes) */}
          <path d="M30 146 Q100 156 170 146" fill="none" stroke="rgba(0,0,0,.32)" strokeWidth="2" strokeDasharray="2 3"/>
          {/* fabric pucker dots */}
          {[40,55,70,85,100,115,130,145,160].map((x, i) => (
            <circle key={i} cx={x} cy={94 - Math.abs(x - 100) * 0.16} r="1.6" fill="rgba(0,0,0,.18)"/>
          ))}
          {/* stamped logo */}
          <image href={HERO} x="62" y="62" width="76" height="76"
                 preserveAspectRatio="xMidYMid meet"
                 style={{ mixBlendMode: "screen", opacity: .85 }}/>
          {/* signature */}
          <text x="100" y="180" textAnchor="middle"
                fontFamily="'Caveat', cursive, var(--font-display)" fontSize="12"
                fill={fg} fontWeight="700">— Dr. Riff Excipient, 2026</text>
        </svg>
      );
    }

    /* ─────────── SOMBRERO ─────────── */
    case "sombrero": {
      const brim = fg;
      const band = c(swatches[1] || "pink");
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("sb")}
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-sb)`}/>
          <ellipse cx="100" cy="170" rx="80" ry="6" fill="rgba(0,0,0,.32)"/>
          {/* brim */}
          <ellipse cx="100" cy="140" rx="84" ry="18" fill={brim}/>
          <ellipse cx="100" cy="140" rx="84" ry="18" fill={`url(#bd-sb)`}/>
          {/* crown */}
          <path d="M64 130 Q70 70 100 60 Q130 70 136 130 Z" fill={brim}/>
          <path d="M64 130 Q70 70 100 60 Q130 70 136 130 Z" fill={`url(#fab-sb)`}/>
          {/* embroidered band */}
          <rect x="64" y="118" width="72" height="10" fill={band}/>
          <path d="M66 123 L72 118 L78 123 L84 118 L90 123 L96 118 L102 123 L108 118 L114 123 L120 118 L126 123 L132 118 L134 123"
                fill="none" stroke="rgba(0,0,0,.45)" strokeWidth="1.5"/>
          {/* pompoms hanging from the brim */}
          {[40, 80, 120, 160].map((x, i) => (
            <g key={i} transform={`translate(${x} 148)`}>
              <line x1="0" y1="0" x2="0" y2="14" stroke="rgba(0,0,0,.55)" strokeWidth="1"/>
              <circle cx="0" cy="18" r="4" fill={c(["pink","orange","mustard","lilac"][i % 4])}/>
            </g>
          ))}
          {/* logo stamped on crown */}
          <image href={HERO} x="76" y="76" width="48" height="48"
                 preserveAspectRatio="xMidYMid meet"
                 style={{ mixBlendMode: "screen", opacity: .9 }}/>
        </svg>
      );
    }

    default:
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("df")}
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-df)`}/>
          <image href={HERO} x="20" y="20" width="160" height="160"
                 preserveAspectRatio="xMidYMid meet"/>
        </svg>
      );
  }
}

function Boutique({ onAdd, cart }) {
  const [justAdded, setJustAdded] = useState(null);
  const inCart = (id) => cart.some(c => c.id === id);
  const add = (p) => {
    onAdd(p);
    setJustAdded(p.id);
    setTimeout(() => setJustAdded(prev => prev === p.id ? null : prev), 1200);
  };
  return (
    <section className="pmp" id="boutique" data-screen-label="05 Boutique">
      <span className="kicker">Boutique · Conditionnement primaire</span>
      <h2 className="section-title">Goodies<br/>en lot</h2>
      <p className="section-sub">
        Articles dérivés conditionnés sous hotte. Livraison en sachet kraft estampillé.
        Lot et péremption au dos de chaque pièce.
      </p>
      <div className="shop">
        {PMP_MERCH.map(p => (
          <div className="product" key={p.id}>
            <div className="pic"><ProductPic product={p} /></div>
            <div className="info">
              <span className="p-cat">{p.cat} · Lot 26-{(p.price * 7).toString(36).toUpperCase()}</span>
              <div className="p-name">{p.name}</div>
              <div className="p-tag">« {p.tag} »</div>
              <div className="p-bottom">
                <span className="price">{p.price.toFixed(2)} €</span>
                <button
                  className={`add ${justAdded === p.id ? "added" : ""}`}
                  onClick={() => add(p)}
                >
                  {justAdded === p.id ? "✓ Ajouté" : inCart(p.id) ? "+ Encore" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══ GALERIE ════════════════════════════════════════════ */
function Galerie() {
  return (
    <section className="pmp" id="galerie" data-screen-label="06 Galerie">
      <span className="kicker">Imagerie · Cliché médical</span>
      <h2 className="section-title">Galerie<br/>live</h2>
      <p className="section-sub">
        Captations photographiques des derniers passages en salle de pause. Aucune image
        réelle — les vignettes ci-dessous sont des placeholders en attendant le shooting
        officiel (prévu janvier 2027, en blouse).
      </p>
      <div className="gallery">
        {PMP_GALLERY.map((g, i) => (
          <figure key={i} className={`gal-cell tone-${g.tone}`}>
            {g.img && <img src={g.img} alt={g.caption} loading="lazy" className="gal-img"/>}
            <div className="gal-bg" aria-hidden></div>
            <figcaption className="cap">{String(i+1).padStart(2,"0")} · {g.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ═══ PAROLES ════════════════════════════════════════════ */
function Paroles() {
  return (
    <section className="pmp" id="paroles" data-screen-label="07 Paroles">
      <span className="kicker">RCP · Résumé des Caractéristiques du Produit (parolier)</span>
      <h2 className="section-title">Paroles<br/>magistrales</h2>
      <p className="section-sub">
        Notice complète au verso. Effets indésirables fréquents : larme à l'œil, headbang
        involontaire, envie soudaine de préparer une chimiothérapie sous hotte.
      </p>
      <div className="lyrics-wrap">
        {PMP_LYRICS.map((l, i) => (
          <div className="lyrics-card" key={i}>
            <div className="l-title">{l.title}</div>
            <div className="l-body">
              {l.body.map((line, j) => (
                <React.Fragment key={j}>
                  {line.startsWith("[")
                    ? <em>{line}</em>
                    : <span>{line}</span>}
                  {"\n"}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══ PHARMACOBAR ════════════════════════════════════════
   Carte de cocktails parodiques. Chaque cocktail =
   - une fiche "notice médicamenteuse" stylée
   - un verre dessiné (SVG) avec liquide coloré par cocktail
   - badge ABV / verre / posologie
   ─────────────────────────────────────────────────────── */
function GlassSvg({ kind, color }) {
  // returns just the glass SVG, with the liquid coloured by tween color.
  const fill = `var(--c-${color}, var(--c-pink))`;
  switch (kind) {
    case "tumbler":
      return (
        <svg viewBox="0 0 120 160" width="100%" height="100%">
          <rect x="22" y="20" width="76" height="120" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M26 60 L94 60 L94 132 Q60 142 26 132 Z" fill={fill} opacity=".85"/>
          <ellipse cx="40" cy="65" rx="10" ry="2.5" fill="rgba(255,255,255,.4)"/>
          {/* ice cube */}
          <rect x="56" y="78" width="18" height="18" rx="2" fill="rgba(255,255,255,.35)" stroke="rgba(255,255,255,.6)" strokeWidth="1"/>
        </svg>
      );
    case "highball":
      return (
        <svg viewBox="0 0 120 160" width="100%" height="100%">
          <rect x="30" y="14" width="60" height="132" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5"/>
          <rect x="33" y="50" width="54" height="93" fill={fill} opacity=".85"/>
          <ellipse cx="44" cy="55" rx="8" ry="2" fill="rgba(255,255,255,.4)"/>
          <circle cx="80" cy="32" r="6" fill="none" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M80 26 L80 14" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      );
    case "shooter":
      return (
        <svg viewBox="0 0 120 160" width="100%" height="100%">
          <path d="M40 50 L80 50 L74 130 L46 130 Z" fill="none" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M42 70 L78 70 L73 128 L47 128 Z" fill={fill} opacity=".9"/>
          <ellipse cx="50" cy="74" rx="5" ry="1.5" fill="rgba(255,255,255,.5)"/>
        </svg>
      );
    case "calice":
      return (
        <svg viewBox="0 0 120 160" width="100%" height="100%">
          <path d="M28 26 Q60 80 92 26" fill="none" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M40 56 Q60 90 80 56" fill={fill} opacity=".85"/>
          <line x1="60" y1="80" x2="60" y2="138" stroke="currentColor" strokeWidth="2.5"/>
          <ellipse cx="60" cy="142" rx="22" ry="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
        </svg>
      );
    case "flute":
      return (
        <svg viewBox="0 0 120 160" width="100%" height="100%">
          <path d="M44 14 L48 100 Q60 110 72 100 L76 14 Z" fill="none" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M50 50 L74 50 L71 98 Q60 106 49 98 Z" fill={fill} opacity=".85"/>
          {[60,80,72,90,55,95,68].map((y,i)=>(
            <circle key={i} cx={52 + (i % 3) * 8} cy={y} r="1.5" fill="rgba(255,255,255,.7)"/>
          ))}
          <line x1="60" y1="110" x2="60" y2="142" stroke="currentColor" strokeWidth="2"/>
          <ellipse cx="60" cy="144" rx="14" ry="3" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case "mug":
      return (
        <svg viewBox="0 0 120 160" width="100%" height="100%">
          <rect x="24" y="34" width="68" height="100" rx="6" fill="none" stroke="currentColor" strokeWidth="2.5"/>
          <rect x="28" y="50" width="60" height="80" fill={fill} opacity=".85"/>
          <path d="M92 56 Q108 56 108 76 Q108 96 92 96" fill="none" stroke="currentColor" strokeWidth="2.5"/>
          {/* steam */}
          <path d="M40 24 Q44 18 40 12" fill="none" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M56 24 Q60 18 56 12" fill="none" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M72 24 Q76 18 72 12" fill="none" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      );
    case "fume":
      return (
        <svg viewBox="0 0 120 160" width="100%" height="100%">
          <rect x="32" y="44" width="56" height="100" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
          <rect x="35" y="72" width="50" height="68" fill={fill} opacity=".85"/>
          {/* smoke */}
          <path d="M36 44 Q30 30 40 22 Q34 14 48 8" fill="none" stroke="currentColor" strokeWidth="1.4" opacity=".7"/>
          <path d="M60 44 Q56 30 66 22 Q60 14 74 8" fill="none" stroke="currentColor" strokeWidth="1.4" opacity=".7"/>
          <path d="M84 44 Q88 30 78 22 Q86 14 72 6"  fill="none" stroke="currentColor" strokeWidth="1.4" opacity=".7"/>
        </svg>
      );
    default:
      return null;
  }
}

/* Full studio scene for a cocktail: backdrop, glass, themed pharma garnish
   (syringe straw, pill on rim, Rx tag tied with twine, IV bag, fume, etc).
   Each cocktail gets a unique combo based on its id. */
function CocktailScene({ cocktail }) {
  const c = cocktail;
  const liquid = `var(--c-${c.color})`;
  const id = c.id;
  // Pharma garnish kit by cocktail id
  const garnish = {
    qsp666:      { syringe: true,  rxtag: "666 mg", pill: "ink"     },
    "perfu-spritz": { ivbag: true, pill: "orange"  },
    ammrefuse:   { rxtag: "AMM ✗", pill: "mustard" },
    panique:     { lightning: true, pill: "pink"   },
    noel:        { snow: true,    pill: "mustard"  },
    preparation: { swirl: true,   pill: "lilac"    },
    hotteflux:   { fume: true,    pill: "mustard"  },
    codeine:     { lock: true,    rxtag: "0,0%",   pill: "lilac"   },
    lyophilise:  { sparkles: true, pill: "lilac"   },
    stupef:      { lock: true,    rxtag: "LISTE I", pill: "ink"    },
  }[id] || { pill: c.color };

  // Glass shapes (simplified to fit composition)
  const GLASS = {
    tumbler:  <g><rect x="46" y="100" width="108" height="120" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5"/><rect x="50" y="148" width="100" height="68" fill={liquid} opacity=".88"/><rect x="62" y="158" width="22" height="22" rx="3" fill="rgba(255,255,255,.35)" stroke="rgba(255,255,255,.6)" strokeWidth="1"/></g>,
    highball: <g><rect x="62" y="80" width="76" height="148" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5"/><rect x="66" y="132" width="68" height="92" fill={liquid} opacity=".88"/></g>,
    shooter:  <g><path d="M70 110 L130 110 L124 224 L76 224 Z" fill="none" stroke="currentColor" strokeWidth="2.5"/><path d="M74 130 L126 130 L120 222 L80 222 Z" fill={liquid} opacity=".9"/></g>,
    calice:   <g><path d="M40 70 Q100 150 160 70" fill="none" stroke="currentColor" strokeWidth="2.5"/><path d="M52 90 Q100 158 148 90" fill={liquid} opacity=".88"/><line x1="100" y1="148" x2="100" y2="218" stroke="currentColor" strokeWidth="2.5"/><ellipse cx="100" cy="222" rx="32" ry="5" fill="none" stroke="currentColor" strokeWidth="2.5"/></g>,
    flute:    <g><path d="M82 60 L88 178 Q100 188 112 178 L118 60 Z" fill="none" stroke="currentColor" strokeWidth="2.5"/><path d="M86 110 L114 110 L110 176 Q100 184 90 176 Z" fill={liquid} opacity=".9"/>{[100,120,140,160].map((y,i)=><circle key={i} cx={92+(i%2)*16} cy={y} r="1.6" fill="rgba(255,255,255,.85)"/>)}<line x1="100" y1="188" x2="100" y2="220" stroke="currentColor" strokeWidth="2"/><ellipse cx="100" cy="222" rx="22" ry="3" fill="none" stroke="currentColor" strokeWidth="2"/></g>,
    mug:      <g><rect x="40" y="80" width="100" height="140" rx="6" fill="none" stroke="currentColor" strokeWidth="2.5"/><rect x="44" y="110" width="92" height="106" fill={liquid} opacity=".88"/><path d="M140 100 Q170 100 170 135 Q170 170 140 170" fill="none" stroke="currentColor" strokeWidth="2.5"/></g>,
    fume:     <g><rect x="56" y="100" width="88" height="120" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5"/><rect x="60" y="130" width="80" height="86" fill={liquid} opacity=".88"/></g>,
  }[c.glass] || null;

  // Composition: backdrop + glass + garnishes
  return (
    <svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
      <defs>
        <radialGradient id={`bg-${id}`} cx="30%" cy="20%" r="100%">
          <stop offset="0%"  stopColor={`color-mix(in oklab, var(--c-${c.color}), white 30%)`}/>
          <stop offset="60%" stopColor={`color-mix(in oklab, var(--c-${c.color}), transparent 30%)`}/>
          <stop offset="100%" stopColor="rgba(0,0,0,.4)"/>
        </radialGradient>
        <pattern id={`dots-${id}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,.18)"/>
        </pattern>
      </defs>

      {/* Backdrop */}
      <rect width="200" height="260" fill={`url(#bg-${id})`}/>
      <rect width="200" height="260" fill={`url(#dots-${id})`}/>

      {/* Shadow under glass */}
      <ellipse cx="100" cy="232" rx="56" ry="6" fill="rgba(0,0,0,.35)"/>

      {/* Glass + liquid */}
      <g style={{ color: "var(--fg)" }}>{GLASS}</g>

      {/* GARNISHES — themed per cocktail ── */}

      {garnish.syringe && (
        // Syringe straw sticking out of the glass
        <g transform="translate(118 50) rotate(20)">
          <rect x="0" y="6" width="3" height="6" fill="var(--fg)"/>
          <rect x="3" y="3" width="44" height="12" rx="1.5" fill="rgba(255,255,255,.85)" stroke="var(--fg)" strokeWidth="1.2"/>
          <rect x="47" y="6" width="14" height="6" fill="var(--fg)"/>
          <line x1="61" y1="9" x2="86" y2="9" stroke="var(--fg)" strokeWidth="1.5"/>
          <rect x="6" y="5" width={12 + (c.abv % 5) * 4} height="8" fill={liquid} opacity=".9"/>
          {/* graduation marks */}
          {[10, 16, 22, 28, 34, 40].map((x, i) => (
            <line key={i} x1={3 + x} y1="3" x2={3 + x} y2="6" stroke="var(--fg)" strokeWidth=".8"/>
          ))}
        </g>
      )}

      {garnish.ivbag && (
        // Mini IV bag hanging from upper-right with drip line into the glass
        <g>
          <line x1="170" y1="18" x2="170" y2="38" stroke="var(--fg)" strokeWidth="1.2"/>
          <rect x="156" y="38" width="28" height="40" rx="3" fill="rgba(255,255,255,.8)" stroke="var(--fg)" strokeWidth="1.4"/>
          <rect x="158" y="44" width="24" height="32" fill={liquid} opacity=".85"/>
          <text x="170" y="64" textAnchor="middle" fontFamily="JetBrains Mono, monospace"
                fontSize="6" fill="var(--fg)" fontWeight="700">RX</text>
          <line x1="170" y1="78" x2="170" y2="112" stroke="var(--fg)" strokeWidth="1" strokeDasharray="2 2"/>
          <circle cx="170" cy="114" r="1.6" fill={liquid}/>
        </g>
      )}

      {garnish.rxtag && (
        // Prescription paper tag tied with twine to the rim
        <g transform="translate(40 56) rotate(-10)">
          <line x1="20" y1="0" x2="40" y2="34" stroke="var(--fg)" strokeWidth=".6"/>
          <path d="M0 6 L34 6 L40 14 L34 22 L0 22 Z" fill="#fef3d8" stroke="var(--fg)" strokeWidth="1.2"/>
          <circle cx="34" cy="14" r="1.8" fill="var(--fg)"/>
          <text x="6" y="17" fontFamily="JetBrains Mono, monospace" fontSize="7"
                fontWeight="700" fill="var(--fg)" letterSpacing="1">℞ {garnish.rxtag}</text>
        </g>
      )}

      {garnish.pill && (
        // Big pill on the rim of the glass
        <g transform="translate(150 96) rotate(-20)">
          <ellipse cx="0" cy="0" rx="18" ry="9" fill={`var(--c-${garnish.pill})`} stroke="var(--fg)" strokeWidth="1.2"/>
          <path d="M -18 0 H 0 V -9 a 9 9 0 0 0 -18 0" fill="rgba(255,255,255,.45)"/>
          <line x1="0" y1="-9" x2="0" y2="9" stroke="var(--fg)" strokeWidth="1"/>
        </g>
      )}

      {garnish.fume && (
        // Carbo-glace smoke swirling out
        <g fill="none" stroke="var(--fg)" strokeWidth="1.4" strokeLinecap="round" opacity=".55">
          <path d="M70 96 Q60 80 72 64 Q60 50 78 36"/>
          <path d="M100 92 Q95 75 108 60 Q98 48 112 36"/>
          <path d="M130 94 Q138 80 128 64 Q140 50 124 36"/>
          {[68, 92, 116].map((x, i) => (
            <circle key={i} cx={x + (i * 4 - 4)} cy={20 + i * 6} r="3" fill="rgba(255,255,255,.4)" stroke="none"/>
          ))}
        </g>
      )}

      {garnish.snow && (
        // Snowflakes on the mug rim
        <g fill="white" opacity=".9">
          {[
            [60, 60], [80, 40], [100, 56], [124, 38], [148, 60], [70, 30], [134, 22]
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <line x1="-4" y1="0" x2="4" y2="0" stroke="white" strokeWidth="1.2"/>
              <line x1="0" y1="-4" x2="0" y2="4" stroke="white" strokeWidth="1.2"/>
              <line x1="-3" y1="-3" x2="3" y2="3" stroke="white" strokeWidth="1"/>
              <line x1="-3" y1="3" x2="3" y2="-3" stroke="white" strokeWidth="1"/>
            </g>
          ))}
        </g>
      )}

      {garnish.lightning && (
        // Lightning bolt above the glass
        <g transform="translate(96 28)">
          <polygon points="0,0 -10,28 -2,30 -8,56 14,22 4,20 12,0" fill="var(--c-mustard)" stroke="var(--fg)" strokeWidth="1.2"/>
        </g>
      )}

      {garnish.swirl && (
        // Magic swirl of dust above the glass
        <g fill="none" stroke="var(--fg)" strokeWidth="1.3" opacity=".7">
          <path d="M70 56 Q90 30 110 56 Q130 80 100 90 Q70 96 90 70"/>
          <circle cx="74" cy="50" r="1.8" fill="var(--c-pink)" stroke="none"/>
          <circle cx="118" cy="52" r="1.4" fill="var(--c-mustard)" stroke="none"/>
          <circle cx="100" cy="78" r="1.6" fill="var(--c-lilac)" stroke="none"/>
        </g>
      )}

      {garnish.sparkles && (
        // Crystal sparkles
        <g fill="white" stroke="var(--fg)" strokeWidth=".6" opacity=".95">
          {[[58, 40], [142, 56], [70, 70], [136, 90], [44, 100], [156, 130]].map(([x, y], i) => (
            <polygon key={i} points={`${x},${y-6} ${x+2},${y} ${x},${y+6} ${x-2},${y}`}/>
          ))}
        </g>
      )}

      {garnish.lock && (
        // Padlock badge over the glass — restricted substance
        <g transform="translate(98 30)">
          <rect x="-12" y="0" width="24" height="20" rx="2.5" fill="var(--c-mustard)" stroke="var(--fg)" strokeWidth="1.4"/>
          <path d="M -6 0 V -6 a 6 6 0 0 1 12 0 V 0" fill="none" stroke="var(--fg)" strokeWidth="1.6"/>
          <circle cx="0" cy="10" r="2.4" fill="var(--fg)"/>
          <rect x="-.8" y="10" width="1.6" height="4.5" fill="var(--fg)"/>
        </g>
      )}

      {/* Big floating cocktail emoji top-left */}
      <text x="20" y="40" fontSize="22">{c.emoji}</text>

      {/* Bottom banner — large cocktail name + meta */}
      <g>
        <rect x="0" y="200" width="200" height="60" fill="rgba(0,0,0,.78)"/>
        <rect x="0" y="200" width="200" height="2" fill={liquid}/>
        <text x="10" y="223" fontFamily="'Metal Mania', serif" fontSize="20"
              fill="#fff" letterSpacing="0">{c.name.toUpperCase()}</text>
        <text x="10" y="247" fontFamily="JetBrains Mono, monospace" fontSize="9"
              fill={liquid} letterSpacing="2" fontWeight="700">
          ℞ {c.abv}° · {c.glass.toUpperCase()} · LOT 26
        </text>
      </g>
    </svg>
  );
}

function Pharmacobar({ onAdd, cart }) {
  const cocktails = window.PMP.PMP_COCKTAILS;
  const [justAdded, setJustAdded] = useState(null);
  const inCart = (id) => cart.some(c => c.id === id);
  const add = (c) => {
    onAdd({ ...c, name: "Cocktail · " + c.name, tag: c.dci, cat: "Pharmacobar", swatch: [c.color, "ink"] });
    setJustAdded(c.id);
    setTimeout(() => setJustAdded(prev => prev === c.id ? null : prev), 1200);
  };
  return (
    <section className="pmp" id="pharmacobar" data-screen-label="07 Pharmacobar">
      <span className="kicker">Carte des Préparations · Pharmacobar</span>
      <h2 className="section-title">Pharmaco<br/>bar</h2>
      <p className="section-sub">
        Comptoir mobile du groupe. Des cocktails préparés en hotte à flux laminaire,
        servis sous notice médicamenteuse. Posologie indicative — le pharmacien d'astreinte
        est seul juge. Édition « tournée 2026 ».
      </p>

      <div className="bar-grid">
        {cocktails.map(c => (
          <article key={c.id} className={`bar-card tone-${c.color}`}>
            <div className="bar-art">
              <CocktailScene cocktail={c} />
            </div>
            <div className="bar-body">
              <div className="bar-head">
                <h3 className="bar-name">{c.name}</h3>
                <span className="bar-price">{c.price.toFixed(0)} €</span>
              </div>
              <div className="bar-base">{c.base}</div>
              <div className="bar-meta">
                <span><b>DCI</b> {c.dci}</span>
                <span className="dot"></span>
                <span><b>{c.abv}°</b> alcool</span>
              </div>
              <div className="bar-notice"><span className="rx">℞</span> {c.notice}</div>
              <button
                className={`bar-add ${justAdded === c.id ? "added" : ""}`}
                onClick={() => add(c)}
              >
                {justAdded === c.id ? "✓ Servi" : inCart("Cocktail · " + c.name) ? "+ Encore un" : "Commander"}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="callout">
        ⚠ Pharmacobar ouvert pendant les concerts uniquement. L'abus d'alcool est dangereux
        pour la santé · à consommer avec modération · présenter une pièce d'identité au comptoir.
      </div>
    </section>
  );
}

/* ═══ CONTACT ════════════════════════════════════════════ */
function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const submit = (e) => { e.preventDefault(); setSubmitted(true); };
  return (
    <section className="pmp" id="contact" data-screen-label="08 Contact">
      <span className="kicker">Booking · Newsletter · Pharmacovigilance</span>
      <h2 className="section-title">Contact</h2>
      <div className="contact">
        <div className="contact-card">
          <h3>Newsletter « Notice mensuelle »</h3>
          <div className="posology">
            <p>Une lettre par mois. Pas plus, pas moins.</p>
            <p>Posologie : <em>1 e-mail / 30 jours</em>, à lire à jeun.</p>
            <p>Contre-indication : allergie connue aux jeux de mots pharmaceutiques.</p>
          </div>
          {!submitted ? (
            <form onSubmit={submit} style={{ marginTop: 18 }}>
              <span className="lbl">DCI (votre nom)</span>
              <input type="text" placeholder="ex. Jean Pénicilline" required />
              <span className="lbl">E-mail</span>
              <input type="email" placeholder="vous@officine.fr" required />
              <button type="submit" className="btn pink submit">Recevoir la notice</button>
            </form>
          ) : (
            <div className="callout" style={{ marginTop: 18 }}>
              ✓ Inscription confirmée. Premier envoi sous 7 à 10 jours ouvrés post-mortem.
            </div>
          )}
        </div>

        <div className="contact-card">
          <h3>Booking · Tournée 2027</h3>
          <div className="posology">
            <p><em>booking@pmp-popmetal.fictif</em></p>
            <p>Backline minimum : 1 hotte à flux laminaire ISO 5, 4 prises 16A,
              1 charlotte stérile par technicien, café noir illimité.</p>
            <p>Cachet : <em>négociable contre stupéfiants en double commande</em> (humour).</p>
            <p>Aucune date dans un vrai hôpital. Festivals et salles classiques uniquement.</p>
          </div>
          <button className="btn" style={{ marginTop: 18 }}>Télécharger le rider PDF</button>
        </div>

        <div className="contact-card">
          <h3>Pharmacovigilance</h3>
          <div className="posology">
            <p>Vous avez constaté un effet indésirable suite à l'écoute de PMP ?</p>
            <p>Signalez-le. Effets attendus : <em>headbang, larmes, vocation pharmaceutique tardive</em>.</p>
            <p>Effets inattendus : nous écrire dans les 48 h.</p>
          </div>
          <button className="btn ghost" style={{ marginTop: 18 }}>Déclarer un effet</button>
        </div>
      </div>
    </section>
  );
}

window.PmpSections = { Hero, Marquee, Discographie, Concerts, Membres, Boutique, Pharmacobar, Galerie, Paroles, Contact };
