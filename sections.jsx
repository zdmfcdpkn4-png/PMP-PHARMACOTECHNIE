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
function formatTime(s) {
  if (!isFinite(s) || s < 0) return "—:—";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Discographie() {
  const [playing, setPlaying] = useState(null);
  const [vizBars, setVizBars] = useState(() => new Array(48).fill(8));
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    const unsub = PmpAudio.subscribe?.((n) => setPlaying(n));
    return unsub;
  }, []);

  useEffect(() => {
    if (playing === null) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setVizBars(new Array(48).fill(8));
      setProgress(0); setCurrentTime(0); setDuration(0);
      return;
    }
    const an = PmpAudio.getAnalyser();
    if (!an) return;
    const buf = new Uint8Array(an.frequencyBinCount);
    const tick = () => {
      an.getByteFrequencyData(buf);
      const bars = [];
      const N = 48;
      const step = Math.floor(buf.length / N);
      for (let i = 0; i < N; i++) {
        let m = 0;
        for (let j = 0; j < step; j++) m = Math.max(m, buf[i*step+j]);
        bars.push(4 + (m / 255) * 44);
      }
      setVizBars(bars);
      // pull progress from audio element if present
      const el = PmpAudio.getAudioElement?.();
      if (el && el.duration) {
        setDuration(el.duration);
        setCurrentTime(el.currentTime);
        setProgress((el.currentTime / el.duration) * 100);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const toggle = (t) => {
    if (playing === t.n) { PmpAudio.stop(); setPlaying(null); }
    else { PmpAudio.start(t); setPlaying(t.n); }
  };

  const currentTrack = PMP_TRACKS.find(t => t.n === playing);

  return (
    <section className="pmp" id="discographie" data-screen-label="02 Discographie">
      <span className="kicker">Notice · Discographie</span>
      <h2 className="section-title">Galénique<br/>sonore</h2>
      <p className="section-sub">
        Forme pharmaceutique sonore officielle · LP « QSP 666 » · pressage 33 tours, verre brun de protection
        UV · à conserver à l'abri de la lumière et des oreilles sensibles.
      </p>

      {/* Stylized player bar — shows currently playing track */}
      {currentTrack && (
        <div className="pmp-player" role="region" aria-label="Lecteur PMP">
          <div className="player-art">
            <img src="assets/pmp-hero-logo.png" alt="" className="player-art-img"/>
            <div className="player-art-ring"></div>
          </div>
          <div className="player-body">
            <div className="player-head">
              <div className="player-status">
                <span className="player-led"></span>
                <span>EN LECTURE · ℞ {currentTrack.bpm} BPM</span>
              </div>
              <div className="player-title">{currentTrack.title}</div>
              <div className="player-sub">{currentTrack.sub}</div>
            </div>
            <div className="player-viz">
              {vizBars.map((h, i) => (
                <span key={i} style={{ height: `${h}px` }}/>
              ))}
            </div>
            <div className="player-progress">
              <span className="ptime">{formatTime(currentTime)}</span>
              <div className="ptrack">
                <div className="pfill" style={{ width: progress + "%" }}></div>
              </div>
              <span className="ptime">{formatTime(duration)}</span>
            </div>
          </div>
          <button className="player-stop" onClick={() => { PmpAudio.stop(); setPlaying(null); }} aria-label="Stop">
            <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" fill="currentColor"/></svg>
          </button>
        </div>
      )}

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
  // Helpers: parse "12.09.26" → day / month abbreviation
  const MONTHS = ["JAN","FÉV","MAR","AVR","MAI","JUI","JUI","AOÛ","SEP","OCT","NOV","DÉC"];
  const parse = (s) => {
    const [d, m, y] = s.split(".");
    return { day: d, month: MONTHS[parseInt(m, 10) - 1], year: "20" + y };
  };
  const statusLabel = (s) => s === "complet" ? "COMPLET"
                          : s === "rare" ? "RARES BILLETS"
                          : s === "privé" ? "DATE PRIVÉE"
                          : "BILLETS DISPO";

  return (
    <section className="pmp shows-section" id="concerts" data-screen-label="03 Concerts">
      {/* Concert ambience backdrop (decorative) */}
      <div className="shows-backdrop" aria-hidden>
        <div className="sb-haze"></div>
        <div className="sb-beam sb-beam-1"></div>
        <div className="sb-beam sb-beam-2"></div>
        <div className="sb-beam sb-beam-3"></div>
        <div className="sb-truss"></div>
        <div className="sb-crowd"></div>
      </div>

      <span className="kicker">Calendrier · Posologie de tournée</span>
      <h2 className="section-title">Tournée<br/>« QSP&nbsp;666 »</h2>
      <p className="section-sub">
        Dix dates en milieu hospitalier fictif. Toutes les salles citées sont imaginaires.
        Tenue exigée : EPI ou tenue de scène — au choix du public.
      </p>

      <div className="tickets">
        {PMP_CONCERTS.map((s, i) => {
          const d = parse(s.date);
          const disabled = s.status === "complet" || s.status === "privé";
          return (
            <article key={i} className={`ticket-card s-${s.status}`}>
              {/* punched holes along the perforated seam */}
              <span className="tk-hole tk-hole-top"></span>
              <span className="tk-hole tk-hole-bot"></span>

              {/* LEFT STUB — logo + date */}
              <div className="tk-stub">
                <div className="tk-stub-logo">
                  <img src="assets/pmp-hero-logo.png" alt="" draggable="false"/>
                </div>
                <div className="tk-stub-date">
                  <span className="tk-day">{d.day}</span>
                  <span className="tk-month">{d.month}</span>
                  <span className="tk-year">{d.year}</span>
                </div>
                <div className="tk-stub-meta">
                  <span>℞ ADMIT ONE</span>
                  <span>N° {String(i + 1).padStart(3, "0")} / 010</span>
                </div>
              </div>

              {/* center perforation */}
              <div className="tk-perf" aria-hidden></div>

              {/* RIGHT BODY — venue + city + status + cta */}
              <div className="tk-body">
                <div className="tk-band">
                  <span>PMP · POP MÉTAL</span>
                  <span className="tk-band-dot"></span>
                  <span>TOURNÉE QSP 666 · MMXXVI</span>
                </div>

                <div className="tk-head">
                  <div className="tk-city">{s.city}</div>
                  <div className={`tk-status s-${s.status}`}>{statusLabel(s.status)}</div>
                </div>
                <div className="tk-venue">{s.venue}</div>
                <div className="tk-etab">{s.etab}</div>

                <div className="tk-foot">
                  <div className="tk-foot-meta">
                    <div>
                      <span className="tk-lbl">PORTES</span>
                      <span className="tk-val">19:30</span>
                    </div>
                    <div>
                      <span className="tk-lbl">SHOW</span>
                      <span className="tk-val">20:30</span>
                    </div>
                    <div>
                      <span className="tk-lbl">PLACEMENT</span>
                      <span className="tk-val">DEBOUT · FOSSE</span>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="tk-cta"
                    data-disabled={disabled}
                    onClick={(e) => e.preventDefault()}
                  >
                    {s.status === "complet"
                      ? "Liste d'attente"
                      : s.status === "privé"
                      ? "—"
                      : "Billetterie ↗"}
                  </a>
                </div>

                {/* faint barcode in the corner */}
                <div className="tk-barcode" aria-hidden>
                  {Array.from({ length: 26 }, (_, k) => (
                    <span key={k} style={{ width: (k % 3 === 0 ? 3 : k % 5 === 0 ? 2 : 1) + "px" }}></span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
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
    <section className="pmp members-section" id="groupe" data-screen-label="04 Groupe">
      {/* Backdrop métal — brick wall + chains + lightning + skulls */}
      <div className="members-backdrop" aria-hidden>
        <div className="mb-wall"></div>
        <div className="mb-spotlights"></div>
        <div className="mb-chains"></div>
        <div className="mb-bolts"></div>
        <div className="mb-haze"></div>
        <div className="mb-edge"></div>
      </div>
      <span className="kicker">Composition · Excipients à effet notoire · {PMP_MEMBERS.length} membres</span>
      <h2 className="section-title">Le groupe</h2>
      <p className="section-sub">
        L'effectif PMP au complet. Ordre de passage tiré au sort à chaque
        chargement (comme une set-list de festival). Survolez une carte : l'instrument s'illumine. 🤘
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
    /* ─────────── T-SHIRT (réaliste, logo brodé) ─────────── */
    case "tshirt": {
      const shirt = fg;
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("ts")}
          <defs>
            <radialGradient id="ts-light" cx="35%" cy="20%" r="80%">
              <stop offset="0%"  stopColor="rgba(255,255,255,.35)"/>
              <stop offset="55%" stopColor="rgba(255,255,255,0)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,.32)"/>
            </radialGradient>
            <linearGradient id="ts-vert" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"  stopColor="rgba(255,255,255,.12)"/>
              <stop offset="50%" stopColor="rgba(255,255,255,0)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,.18)"/>
            </linearGradient>
            {/* Embroidery: thread-like noise + offset shadow for raised effect */}
            <filter id="ts-embroidery" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation=".6"/>
              <feOffset dx=".6" dy=".8"/>
              <feComposite in2="SourceAlpha" operator="out" result="rim"/>
              <feFlood floodColor="rgba(0,0,0,.55)"/>
              <feComposite in2="rim" operator="in" result="shadow"/>
              <feMerge>
                <feMergeNode in="shadow"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <pattern id="ts-thread" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="2" stroke="rgba(0,0,0,.18)" strokeWidth=".4"/>
            </pattern>
          </defs>
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-ts)`}/>
          <ellipse cx="100" cy="184" rx="68" ry="6" fill="rgba(0,0,0,.32)"/>

          {/* shirt silhouette */}
          <path id="ts-body" d="M44 56
                   C 56 48, 68 42, 78 44
                   C 86 50, 90 56, 98 56
                   Q 100 57 102 56
                   C 110 56, 114 50, 122 44
                   C 132 42, 144 48, 156 56
                   L 168 76
                   Q 162 84, 156 84
                   L 144 80
                   L 144 182
                   Q 100 188, 56 182
                   L 56 80
                   L 44 84
                   Q 38 84, 32 76 Z" fill={shirt}/>
          {/* sleeve cuffs */}
          <path d="M32 76 Q38 84 44 84 L56 80 L56 90 Q44 90 32 86 Z" fill="rgba(0,0,0,.18)"/>
          <path d="M168 76 Q162 84 156 84 L144 80 L144 90 Q156 90 168 86 Z" fill="rgba(0,0,0,.18)"/>
          {/* fabric highlights */}
          <use href="#ts-body" fill="url(#ts-light)"/>
          <use href="#ts-body" fill="url(#ts-vert)"/>

          {/* crew neck collar */}
          <path d="M82 47 Q100 60 118 47 L115 56 Q100 65 85 56 Z" fill="rgba(0,0,0,.4)"/>
          <path d="M84 48 Q100 58 116 48" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1"/>
          <path d="M56 80 Q60 70 72 60" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="1.2"/>
          <path d="M144 80 Q140 70 128 60" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="1.2"/>
          <path d="M68 110 Q70 140 72 175" fill="none" stroke="rgba(0,0,0,.1)" strokeWidth="1.4"/>
          <path d="M132 110 Q130 140 128 175" fill="none" stroke="rgba(0,0,0,.1)" strokeWidth="1.4"/>
          <path d="M56 178 Q100 184 144 178" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="1.4"/>

          {/* EMBROIDERED CHEST PATCH */}
          <g transform="translate(100 112)" filter="url(#ts-embroidery)">
            {/* outer embroidered ring (thread satin stitch) */}
            <circle r="34" fill="none" stroke="var(--c-pink)" strokeWidth="3"
                    strokeDasharray="1.6 1.4"/>
            {/* inner area — image embroidered */}
            <circle r="32" fill={shirt}/>
            <image href={HERO} x="-30" y="-30" width="60" height="60"
                   preserveAspectRatio="xMidYMid meet"
                   style={{ mixBlendMode: "screen", opacity: .98 }}/>
            {/* satin-stitch border accent */}
            <circle r="32" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth=".6"/>
            <circle r="34" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".4"/>
            {/* thread texture overlay over the patch */}
            <circle r="32" fill="url(#ts-thread)"/>
          </g>

          {/* hangtag */}
          <g transform="translate(160 30) rotate(14)">
            <rect x="-12" y="-7" width="24" height="14" fill="#fef3d8" stroke="rgba(0,0,0,.4)" strokeWidth=".6"/>
            <circle cx="-10" cy="0" r="1.2" fill="rgba(0,0,0,.5)"/>
            <text x="2" y="3" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="5" fill="rgba(0,0,0,.7)" fontWeight="700">PMP · M</text>
          </g>
        </svg>
      );
    }

    /* ─────────── HOODIE (logo brodé, capuche) ─────────── */
    case "hoodie": {
      const fabric = fg;
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("hd")}
          <defs>
            <radialGradient id="hd-light" cx="35%" cy="22%" r="85%">
              <stop offset="0%"  stopColor="rgba(255,255,255,.3)"/>
              <stop offset="60%" stopColor="rgba(255,255,255,0)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,.3)"/>
            </radialGradient>
            <linearGradient id="hd-rib" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"  stopColor="rgba(0,0,0,.18)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,.4)"/>
            </linearGradient>
            <filter id="hd-embroidery" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation=".5"/>
              <feOffset dx=".5" dy=".7"/>
              <feComposite in2="SourceAlpha" operator="out" result="rim"/>
              <feFlood floodColor="rgba(0,0,0,.6)"/>
              <feComposite in2="rim" operator="in" result="shadow"/>
              <feMerge>
                <feMergeNode in="shadow"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <pattern id="hd-thread" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="2" stroke="rgba(0,0,0,.2)" strokeWidth=".4"/>
            </pattern>
          </defs>
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-hd)`}/>
          <ellipse cx="100" cy="186" rx="70" ry="6" fill="rgba(0,0,0,.32)"/>

          {/* hood */}
          <path d="M70 56 Q72 28 100 26 Q128 28 130 56 Q132 70 126 76 Q100 64 74 76 Q68 70 70 56 Z" fill={fabric}/>
          <path d="M70 56 Q72 28 100 26 Q128 28 130 56 Q132 70 126 76 Q100 64 74 76 Q68 70 70 56 Z" fill="url(#hd-light)"/>
          <path d="M82 62 Q100 56 118 62 Q116 74 100 74 Q84 74 82 62 Z" fill="rgba(0,0,0,.55)"/>

          {/* body */}
          <path id="hd-body" d="M38 78
                   C 50 74, 62 70, 74 70
                   L 80 78 Q 100 86 120 78 L 126 70
                   C 138 70, 150 74, 162 78
                   L 174 100
                   Q 168 110, 160 110
                   L 148 104
                   L 148 184
                   Q 100 190, 52 184
                   L 52 104
                   L 40 110
                   Q 32 110, 26 100 Z" fill={fabric}/>
          <use href="#hd-body" fill="url(#hd-light)"/>
          <path d="M26 100 Q32 110 40 110 L52 104 L52 116 Q40 116 26 110 Z" fill="url(#hd-rib)"/>
          <path d="M174 100 Q168 110 160 110 L148 104 L148 116 Q160 116 174 110 Z" fill="url(#hd-rib)"/>
          <rect x="52" y="172" width="96" height="12" fill="url(#hd-rib)"/>
          <path d="M54 174 Q100 180 146 174 M54 178 Q100 184 146 178" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".6"/>

          {/* kangaroo pocket */}
          <path d="M60 132 L74 120 L126 120 L140 132 L140 162 L60 162 Z" fill="rgba(0,0,0,.22)"/>
          <path d="M60 132 L74 120 L126 120 L140 132 L140 162 L60 162 Z" fill="none" stroke="rgba(0,0,0,.45)" strokeWidth="1"/>
          <path d="M74 120 L74 132 L126 132 L126 120" fill="none" stroke="rgba(0,0,0,.4)" strokeWidth="1"/>

          {/* drawstrings */}
          <path d="M88 70 L84 110" stroke="#f6f1e6" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M112 70 L116 110" stroke="#f6f1e6" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="84" cy="112" r="2.4" fill="#f6f1e6"/>
          <circle cx="116" cy="112" r="2.4" fill="#f6f1e6"/>

          <path d="M52 104 Q56 92 70 80" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="1"/>
          <path d="M148 104 Q144 92 130 80" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="1"/>

          {/* EMBROIDERED CHEST PATCH — au cœur, plus petit */}
          <g transform="translate(76 108)" filter="url(#hd-embroidery)">
            <circle r="18" fill="none" stroke="var(--c-mustard)" strokeWidth="1.8"
                    strokeDasharray="1 .8"/>
            <circle r="16" fill={fabric}/>
            <image href={HERO} x="-14" y="-14" width="28" height="28"
                   preserveAspectRatio="xMidYMid meet"
                   style={{ mixBlendMode: "screen", opacity: .98 }}/>
            <circle r="16" fill="none" stroke="rgba(0,0,0,.4)" strokeWidth=".5"/>
            <circle r="18" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".3"/>
            <circle r="16" fill="url(#hd-thread)"/>
          </g>

          <g transform="translate(40 50) rotate(-10)">
            <rect x="-10" y="-6" width="22" height="12" fill="#fef3d8" stroke="rgba(0,0,0,.4)" strokeWidth=".5"/>
            <text x="1" y="2" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="4.5" fill="rgba(0,0,0,.7)" fontWeight="700">℞ ZAC</text>
          </g>
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
          {/* base — pilulier hebdo */}
          <rect x="14" y="34" width="172" height="132" rx="6" fill={fg}/>
          <rect x="14" y="34" width="172" height="6" fill="rgba(255,255,255,.25)"/>
          <rect x="14" y="160" width="172" height="6" fill="rgba(0,0,0,.2)"/>
          {/* Titre frappé du pilulier */}
          <text x="100" y="28" textAnchor="middle"
                fontFamily="JetBrains Mono, monospace" fontSize="7"
                fill="rgba(0,0,0,.55)" letterSpacing="2" fontWeight="700">PMP · PILULIER TOUR · MMXXVI</text>
          {/* 7 compartiments avec logo */}
          {[...Array(7)].map((_, i) => {
            const x = 18 + i * 24;
            const col = c(swatches[i % swatches.length] || "pink");
            return (
              <g key={i}>
                {/* couvercle translucide coloré */}
                <rect x={x} y="46" width="20" height="108" rx="3"
                      fill={col} opacity=".55"/>
                <rect x={x} y="46" width="20" height="108" rx="3" fill="url(#pl-cell)"/>
                {/* hinge */}
                <rect x={x+1} y="48" width="18" height="2" fill="rgba(255,255,255,.5)"/>
                {/* day label */}
                <text x={x + 10} y="60" textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace" fontSize="7" fill="rgba(0,0,0,.6)" fontWeight="700">
                  {["L","M","M","J","V","S","D"][i]}
                </text>
                {/* logo Pharmacotechnie frappé sur chaque compartiment */}
                <image href={HERO} x={x - 2} y="98" width="24" height="24"
                       preserveAspectRatio="xMidYMid meet"
                       style={{ opacity: .85, mixBlendMode: "multiply" }}/>
                {/* mini pilule rose visible en bas */}
                <ellipse cx={x + 10} cy="138" rx="6" ry="3" fill="#fff" opacity=".9"/>
                <ellipse cx={x + 10} cy="137" rx="5" ry="1" fill="rgba(255,255,255,.6)"/>
              </g>
            );
          })}
          {/* bouton clip latéral */}
          <rect x="6" y="84" width="8" height="32" rx="2" fill={fg}/>
          <rect x="186" y="84" width="8" height="32" rx="2" fill={fg}/>
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

    /* ─────────── CHARLOTTE STÉRILE (réaliste · étiquette contenue) ─── */
    case "charlotte": {
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("ch")}
          <defs>
            <radialGradient id="ch-dome" cx="50%" cy="35%" r="65%">
              <stop offset="0%"  stopColor="rgba(255,255,255,.55)"/>
              <stop offset="60%" stopColor="rgba(255,255,255,.05)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,.32)"/>
            </radialGradient>
            <linearGradient id="ch-band" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"  stopColor="rgba(0,0,0,.05)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,.32)"/>
            </linearGradient>
            {/* Clip-path: tout ce qui dépasse du dôme est rogné — ainsi le logo et l'étiquette ne sortent jamais */}
            <clipPath id="ch-clip">
              <path d="M22 130 Q100 28 178 130 L178 156 Q100 168 22 156 Z"/>
            </clipPath>
          </defs>
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-ch)`}/>
          <ellipse cx="100" cy="172" rx="76" ry="6" fill="rgba(0,0,0,.32)"/>

          {/* charlotte dome (bouffant cap) */}
          <path d="M22 130 Q100 28 178 130 L178 148 Q100 152 22 148 Z" fill={fg}/>
          {/* pleats — alternating darker thin wedges */}
          {Array.from({ length: 22 }, (_, i) => {
            const t = i / 22;
            const x1 = 22 + t * 156;
            const x2 = x1 + 4;
            const peakY = 130 - Math.sin(Math.PI * (t + 0.02)) * 78;
            return (
              <path key={i}
                    d={`M ${x1} 130 Q ${(x1 + x2) / 2} ${peakY + 4} ${x2} 130`}
                    fill="none"
                    stroke="rgba(0,0,0,.08)"
                    strokeWidth="1.2"/>
            );
          })}
          {/* sheen overlay */}
          <path d="M22 130 Q100 28 178 130 L178 148 Q100 152 22 148 Z" fill="url(#ch-dome)"/>

          {/* Élastic band */}
          <path d="M22 130 Q100 144 178 130 L178 156 Q100 168 22 156 Z" fill="url(#ch-band)" opacity=".6"/>
          <path d="M28 144 Q100 154 172 144" fill="none" stroke="rgba(0,0,0,.4)" strokeWidth="1" strokeDasharray="1 3"/>
          <path d="M28 152 Q100 162 172 152" fill="none" stroke="rgba(0,0,0,.3)" strokeWidth="1" strokeDasharray="1 4"/>

          {/* pleat highlights */}
          {Array.from({ length: 22 }, (_, i) => {
            const t = i / 22;
            const x = 24 + t * 152;
            const peakY = 130 - Math.sin(Math.PI * (t + 0.02)) * 78;
            return <circle key={i} cx={x} cy={peakY + 1} r=".8" fill="rgba(255,255,255,.6)"/>;
          })}

          {/* Logo + étiquette CONTENUS dans le clip du dôme */}
          <g clipPath="url(#ch-clip)">
            {/* logo plus petit, bien centré sur le dôme */}
            <g transform="translate(100 96)">
              <ellipse cx="0" cy="3" rx="22" ry="7" fill="rgba(0,0,0,.14)"/>
              <image href={HERO} x="-20" y="-20" width="40" height="40"
                     preserveAspectRatio="xMidYMid meet"
                     style={{ mixBlendMode: "multiply", opacity: .9 }}/>
            </g>
            {/* étiquette tissu cousue sur la bande élastique, à l'intérieur du clip */}
            <g transform="translate(100 142)">
              <rect x="-26" y="-5" width="52" height="11" fill="#fef3d8" stroke="rgba(0,0,0,.45)" strokeWidth=".5"/>
              <text x="0" y="2.5" textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace" fontSize="6"
                    fill="rgba(0,0,0,.75)" fontWeight="700" letterSpacing="1">℞ PMP · STÉRILE</text>
            </g>
          </g>

          {/* Signature à l'extérieur du dôme, sur le fond (autorisée) */}
          <text x="100" y="180" textAnchor="middle"
                fontFamily="'Caveat', cursive, var(--font-display)" fontSize="11"
                fill={fg} fontWeight="700" opacity=".7">— Dr. Riff Excipient, 2026</text>
        </svg>
      );
    }

    /* ─────────── SOMBRERO (mariachi réaliste) ─────────── */
    case "sombrero": {
      const brim = fg;
      const band = c(swatches[1] || "pink");
      return (
        <svg viewBox="0 0 200 200">
          {studioDefs("sb")}
          <defs>
            <radialGradient id="sb-crown" cx="40%" cy="20%" r="80%">
              <stop offset="0%"  stopColor="rgba(255,255,255,.4)"/>
              <stop offset="50%" stopColor="rgba(255,255,255,.05)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,.4)"/>
            </radialGradient>
            <radialGradient id="sb-brim" cx="50%" cy="35%" r="70%">
              <stop offset="0%"  stopColor="rgba(255,255,255,.25)"/>
              <stop offset="55%" stopColor="rgba(255,255,255,0)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,.45)"/>
            </radialGradient>
          </defs>
          <rect width="200" height="200" fill={bg}/>
          <rect width="200" height="200" fill={`url(#bd-sb)`}/>
          <ellipse cx="100" cy="178" rx="90" ry="6" fill="rgba(0,0,0,.4)"/>

          {/* brim — wide, slightly curled upward on the sides (3/4 view) */}
          <path d="M8 140
                   Q 8 124, 24 122
                   Q 56 116, 100 116
                   Q 144 116, 176 122
                   Q 192 124, 192 140
                   Q 192 154, 174 158
                   Q 138 168, 100 168
                   Q 62 168, 26 158
                   Q 8 154, 8 140 Z" fill={brim}/>
          {/* brim sheen */}
          <path d="M8 140 Q 8 124, 24 122 Q 56 116, 100 116 Q 144 116, 176 122 Q 192 124, 192 140 Q 192 154, 174 158 Q 138 168, 100 168 Q 62 168, 26 158 Q 8 154, 8 140 Z" fill="url(#sb-brim)"/>
          {/* brim edge stitching */}
          <path d="M14 140 Q 8 128, 26 124 Q 60 119, 100 119 Q 140 119, 174 124 Q 192 128, 186 140"
                fill="none" stroke="rgba(0,0,0,.35)" strokeWidth=".8" strokeDasharray="2 2"/>
          {/* brim inner shadow at the crown base */}
          <ellipse cx="100" cy="128" rx="44" ry="8" fill="rgba(0,0,0,.4)"/>

          {/* crown (tall central cone with rounded peak) */}
          <path d="M60 128
                   Q 64 60, 100 48
                   Q 136 60, 140 128
                   Q 120 132, 100 132
                   Q 80 132, 60 128 Z" fill={brim}/>
          <path d="M60 128 Q 64 60, 100 48 Q 136 60, 140 128 Q 120 132, 100 132 Q 80 132, 60 128 Z" fill="url(#sb-crown)"/>
          {/* crown crease (vertical fold) */}
          <path d="M100 48 Q 102 80 100 132" fill="none" stroke="rgba(0,0,0,.3)" strokeWidth="1.2"/>
          <path d="M80 56 Q 82 90 80 130" fill="none" stroke="rgba(0,0,0,.15)" strokeWidth=".8"/>
          <path d="M120 56 Q 118 90 120 130" fill="none" stroke="rgba(0,0,0,.15)" strokeWidth=".8"/>

          {/* embroidered band wrapping the crown base */}
          <path d="M58 128 Q 100 134 142 128 L 140 116 Q 100 122 60 116 Z" fill={band}/>
          {/* embroidery zig-zag pattern on the band */}
          <path d="M62 122 L 66 118 L 70 122 L 74 118 L 78 122 L 82 118 L 86 122 L 90 118 L 94 122 L 98 118 L 102 122 L 106 118 L 110 122 L 114 118 L 118 122 L 122 118 L 126 122 L 130 118 L 134 122 L 138 118"
                fill="none" stroke="rgba(0,0,0,.55)" strokeWidth="1.2"/>
          {/* small embroidered dots between zig-zags */}
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={68 + i * 8} cy={124} r="1" fill="rgba(255,255,255,.7)"/>
          ))}

          {/* pompoms hanging from the brim — bigger, fluffier */}
          {[28, 60, 100, 140, 172].map((x, i) => (
            <g key={i} transform={`translate(${x} 158)`}>
              <line x1="0" y1="0" x2="0" y2="16" stroke="rgba(0,0,0,.65)" strokeWidth="1.2"/>
              {/* fluff: 5 small circles to suggest pompom texture */}
              <g>
                <circle cx="0" cy="22" r="6" fill={c(["pink","orange","mustard","lilac","pink"][i % 5])}/>
                <circle cx="-3" cy="20" r="3" fill={c(["mustard","pink","lilac","orange","mustard"][i % 5])} opacity=".85"/>
                <circle cx="3" cy="24" r="2.5" fill="rgba(255,255,255,.4)"/>
              </g>
            </g>
          ))}

          {/* logo embossed on crown front */}
          <image href={HERO} x="76" y="74" width="48" height="48"
                 preserveAspectRatio="xMidYMid meet"
                 style={{ mixBlendMode: "screen", opacity: .92 }}/>

          {/* tag with "Olé Pharmaco" */}
          <g transform="translate(30 36) rotate(-12)">
            <rect x="-14" y="-7" width="28" height="14" fill="#fef3d8" stroke="rgba(0,0,0,.4)" strokeWidth=".5"/>
            <text x="0" y="3" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="5" fill="rgba(0,0,0,.75)" fontWeight="700">¡OLÉ! ℞</text>
          </g>
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
    <section className="pmp shop-section" id="boutique" data-screen-label="05 Boutique">
      {/* Atelier underground industriel backdrop */}
      <div className="shop-backdrop" aria-hidden>
        <div className="sh-grid"></div>
        <div className="sh-pipes"></div>
        <div className="sh-isolator"></div>
        <div className="sh-haze"></div>
        <div className="sh-warning"></div>
        <div className="sh-rust"></div>
      </div>

      <span className="kicker">Boutique · Atelier sous hotte</span>
      <h2 className="section-title">Goodies<br/>en lot</h2>
      <p className="section-sub">
        Conditionnés en atelier post-apocalyptique, sous isolateur classe ISO 5.
        Livraison en sachet kraft estampillé. Lot et péremption au dos de chaque pièce.
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
    <section className="pmp pharmacobar" id="pharmacobar" data-screen-label="07 Pharmacobar">
      <div className="bar-backdrop" aria-hidden>
        <span className="bb-smoke bb-smoke-1"></span>
        <span className="bb-smoke bb-smoke-2"></span>
        <span className="bb-smoke bb-smoke-3"></span>
        <span className="bb-spot bb-spot-1"></span>
        <span className="bb-spot bb-spot-2"></span>
        <span className="bb-counter"></span>
      </div>
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

/* ═══ TIMELINE ═══════════════════════════════════════════ */
function Timeline() {
  const { PMP_TIMELINE } = window.PMP;
  return (
    <section className="pmp timeline-section" id="timeline" data-screen-label="09 Timeline">
      <span className="kicker">Histoire · Posologie chronologique · {PMP_TIMELINE.length} chapitres</span>
      <h2 className="section-title">Histoire<br/>du groupe</h2>
      <p className="section-sub">
        De la première rime griffonnée pendant le confinement de 2020 à la sortie du LP « QSP 666 ».
        Cliquez sur un jalon pour le mettre en surbrillance.
      </p>
      <div className="timeline">
        <div className="tl-line" aria-hidden></div>
        {PMP_TIMELINE.map((item, i) => (
          <article key={i} className={`tl-item ${i % 2 === 0 ? "tl-left" : "tl-right"}`}>
            <div className="tl-dot" aria-hidden>
              <span className="tl-dot-inner"></span>
            </div>
            <div className="tl-card">
              <div className="tl-year">{item.month ? `${item.month} ` : ""}{item.year}</div>
              <h3 className="tl-title">{item.title}</h3>
              <p className="tl-desc">{item.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ═══ WORLD MAP — FANS ═══════════════════════════════════ */
function FanMap() {
  const { PMP_FANS } = window.PMP;
  const [hover, setHover] = useState(null);

  // ── Visitor counter ────────────────────────────────────
  // Bumped once per browser via localStorage. Visitor IDs are pure parody.
  const [visitors, setVisitors] = useState(0);
  useEffect(() => {
    const KEY = "pmp_visitor_count";
    const ME  = "pmp_visited_at";
    try {
      let n = parseInt(localStorage.getItem(KEY) || "0", 10);
      if (Number.isNaN(n) || n < 6660) n = 6660 + Math.floor(Math.random() * 240);
      const visited = localStorage.getItem(ME);
      if (!visited) {
        n += 1;
        localStorage.setItem(KEY, String(n));
        localStorage.setItem(ME, new Date().toISOString());
      }
      setVisitors(n);
      // Live increment to feel "alive"
      const id = setInterval(() => {
        if (Math.random() < .25) {
          n += 1;
          try { localStorage.setItem(KEY, String(n)); } catch (e) {}
          setVisitors(n);
        }
      }, 4500);
      return () => clearInterval(id);
    } catch (e) {
      setVisitors(6892);
    }
  }, []);

  const total = PMP_FANS.reduce((s, f) => s + f.count, 0);
  const max = Math.max(...PMP_FANS.map(f => f.count));
  return (
    <section className="pmp fanmap-section" id="fanmap" data-screen-label="10 Fans">
      <span className="kicker">Pharmacovigilance · Répartition régionale</span>
      <h2 className="section-title">Carte<br/>des fans</h2>
      <p className="section-sub">
        Posologie de la fanbase, zoomée sur la Vendée et son bassin de garde.
        Total recensé : <b style={{ color: "var(--accent)" }}>{total.toLocaleString("fr-FR")}</b> fans · compteur live mis à jour à chaque écoute.
      </p>

      <div className="visitor-counter" aria-live="polite">
        <span className="vc-rx">℞ COMPTEUR DE VISITEURS</span>
        <strong className="vc-num">{visitors.toLocaleString("fr-FR")}</strong>
        <span className="vc-lbl">Pharmaco-streams cumulés depuis MMXX</span>
      </div>

      <div className="fanmap-wrap fanmap-world">
        <svg viewBox="0 0 100 60" className="fanmap-bg" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Étoiles d'arrière-plan */}
            <pattern id="fm-stars" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.2" r=".18" fill="rgba(255,255,255,.6)"/>
              <circle cx="5.4" cy="3.8" r=".12" fill="rgba(255,255,255,.4)"/>
              <circle cx="2.2" cy="6" r=".14" fill="rgba(255,255,255,.5)"/>
              <circle cx="6.8" cy="6.6" r=".2" fill="rgba(255,255,255,.7)"/>
            </pattern>
            {/* Dots des continents en pointillés métal */}
            <pattern id="fm-dots" width="1.4" height="1.4" patternUnits="userSpaceOnUse">
              <circle cx=".7" cy=".7" r=".32" fill="#f6f1e6" opacity=".75"/>
            </pattern>
            <pattern id="fm-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10 0 L0 0 L0 10" fill="none" stroke="rgba(246,241,230,.08)" strokeWidth=".18"/>
            </pattern>
            <radialGradient id="fm-bg" cx="50%" cy="50%" r="80%">
              <stop offset="0%"  stopColor="#1a0f24"/>
              <stop offset="60%" stopColor="#0a0612"/>
              <stop offset="100%" stopColor="#000"/>
            </radialGradient>
            <radialGradient id="fm-fr-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="rgba(240,36,122,.85)"/>
              <stop offset="40%" stopColor="rgba(240,36,122,.4)"/>
              <stop offset="100%" stopColor="rgba(240,36,122,0)"/>
            </radialGradient>
            <filter id="fm-glow">
              <feGaussianBlur stdDeviation=".6"/>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Univers sombre */}
          <rect width="100" height="60" fill="url(#fm-bg)"/>
          <rect width="100" height="60" fill="url(#fm-stars)"/>
          <rect width="100" height="60" fill="url(#fm-grid)"/>

          {/* === Continents — courbes plus organiques === */}
          {/* North America */}
          <path d="M 8 8 Q 14 6 22 7 Q 28 8 32 11 Q 34 17 30 22 Q 28 28 22 28 Q 16 26 12 22 Q 8 16 8 8 Z"
                fill="url(#fm-dots)" stroke="rgba(246,241,230,.45)" strokeWidth=".25"/>
          {/* Greenland */}
          <path d="M 36 5 Q 40 4 42 7 Q 41 10 38 11 Q 35 9 36 5 Z"
                fill="url(#fm-dots)" stroke="rgba(246,241,230,.4)" strokeWidth=".2"/>
          {/* Central America */}
          <path d="M 22 29 Q 26 30 27 33 Q 26 36 23 35 Q 21 32 22 29 Z"
                fill="url(#fm-dots)" stroke="rgba(246,241,230,.4)" strokeWidth=".2"/>
          {/* South America */}
          <path d="M 28 36 Q 33 35 36 39 Q 38 46 33 51 Q 29 52 27 47 Q 26 41 28 36 Z"
                fill="url(#fm-dots)" stroke="rgba(246,241,230,.45)" strokeWidth=".25"/>
          {/* Europe */}
          <path d="M 44 16 Q 48 14 52 15 Q 56 17 56 21 Q 54 24 50 25 Q 46 24 44 21 Q 42 18 44 16 Z"
                fill="url(#fm-dots)" stroke="rgba(246,241,230,.45)" strokeWidth=".25"/>
          {/* Africa */}
          <path d="M 46 27 Q 52 26 56 29 Q 58 36 55 42 Q 51 45 47 42 Q 44 36 46 27 Z"
                fill="url(#fm-dots)" stroke="rgba(246,241,230,.45)" strokeWidth=".25"/>
          {/* Russia + Asia (large) */}
          <path d="M 54 11 Q 64 9 76 10 Q 84 12 88 16 Q 90 22 85 26 Q 76 27 68 25 Q 60 22 56 18 Q 53 14 54 11 Z"
                fill="url(#fm-dots)" stroke="rgba(246,241,230,.45)" strokeWidth=".25"/>
          {/* India */}
          <path d="M 68 27 Q 72 27 73 30 Q 72 34 70 35 Q 67 33 68 27 Z"
                fill="url(#fm-dots)" stroke="rgba(246,241,230,.4)" strokeWidth=".2"/>
          {/* SE Asia */}
          <path d="M 78 28 Q 82 28 84 31 Q 82 34 79 33 Q 76 31 78 28 Z"
                fill="url(#fm-dots)" stroke="rgba(246,241,230,.4)" strokeWidth=".2"/>
          {/* Australia */}
          <path d="M 82 42 Q 88 41 92 44 Q 93 48 88 50 Q 83 49 82 46 Q 81 44 82 42 Z"
                fill="url(#fm-dots)" stroke="rgba(246,241,230,.45)" strokeWidth=".25"/>

          {/* === Halo de fans français — XXXL === */}
          <circle cx="48" cy="22" r="9" fill="url(#fm-fr-glow)"/>
          <circle cx="48" cy="22" r="6" fill="url(#fm-fr-glow)" opacity=".8"/>
          {/* Étoile en France */}
          <g transform="translate(48 22)" filter="url(#fm-glow)">
            <polygon points="0,-4 1.2,-1.2 4,0 1.2,1.2 0,4 -1.2,1.2 -4,0 -1.2,-1.2" fill="var(--c-mustard)"/>
          </g>
          {/* Annotation rock */}
          <g transform="translate(48 22)">
            <path d="M 0 0 Q -10 -8 -18 -10" fill="none" stroke="var(--c-mustard)" strokeWidth=".3" strokeDasharray=".6 .4"/>
            <g transform="translate(-26 -12)">
              <rect x="-15" y="-3" width="26" height="6" fill="#1a0d3a" stroke="var(--c-mustard)" strokeWidth=".3"/>
              <text x="-2" y="1" textAnchor="middle" fontFamily="Metal Mania, serif" fontSize="3" fill="var(--c-mustard)" letterSpacing=".2">⚡ BASE PMP ⚡</text>
            </g>
          </g>

          {/* Cartouche métal */}
          <g transform="translate(4 4)">
            <rect width="36" height="6" fill="#0a0612" stroke="var(--c-pink)" strokeWidth=".25"/>
            <rect x=".7" y=".7" width="34.6" height="4.6" fill="none" stroke="var(--c-pink)" strokeWidth=".1" strokeDasharray=".3 .3"/>
            <text x="18" y="3.1" textAnchor="middle" fontFamily="Metal Mania, serif" fontSize="2.6" fill="#f6f1e6">⚡ CARTE MONDIALE PMP ⚡</text>
            <text x="18" y="4.8" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="1.2" letterSpacing=".4" fill="rgba(246,241,230,.65)">PHARMACO-VIGILANCE INTERNATIONALE</text>
          </g>

          {/* Compass rose métal en bas-droite */}
          <g transform="translate(92 54)">
            <circle r="3.6" fill="#0a0612" stroke="var(--c-pink)" strokeWidth=".25"/>
            <circle r="3" fill="none" stroke="rgba(246,241,230,.3)" strokeWidth=".15" strokeDasharray=".3 .3"/>
            <polygon points="0,-3.2 .5,0 0,3.2 -.5,0" fill="#f6f1e6"/>
            <polygon points="0,-3.2 .4,0 0,0" fill="var(--c-pink)"/>
            <polygon points="-3.2,0 0,-.5 3.2,0 0,.5" fill="rgba(246,241,230,.45)"/>
            <text x="0" y="-4.3" textAnchor="middle" fontSize="1.8" fontWeight="700" fontFamily="Metal Mania, serif" fill="var(--c-pink)">N</text>
          </g>

          {/* Echelle */}
          <g transform="translate(4 56)">
            <rect width="3" height=".7" fill="#f6f1e6"/>
            <rect x="3" width="3" height=".7" fill="none" stroke="#f6f1e6" strokeWidth=".15"/>
            <rect x="6" width="3" height=".7" fill="#f6f1e6"/>
            <text x="0" y="-.4" fontSize="1.4" fontFamily="JetBrains Mono, monospace" fontWeight="700" fill="rgba(246,241,230,.85)">0</text>
            <text x="9" y="-.4" textAnchor="middle" fontSize="1.4" fontFamily="JetBrains Mono, monospace" fontWeight="700" fill="rgba(246,241,230,.85)">5 000 km</text>
          </g>

          {/* Mini guitare déco */}
          <g transform="translate(80 8) rotate(-25)" opacity=".5">
            <circle r="1.6" fill="none" stroke="var(--c-pink)" strokeWidth=".25"/>
            <rect x="-.4" y="-6" width=".8" height="5" fill="var(--c-pink)"/>
            <rect x="-.5" y="-6.3" width="1" height=".8" fill="var(--c-pink)"/>
          </g>
          {/* Mini éclair */}
          <g transform="translate(14 50)" opacity=".55">
            <polygon points="0,-3 -1.4,0 -.4,0 -1.4,3 1.4,-1 .4,-1 1.4,-3" fill="var(--c-mustard)"/>
          </g>
          {/* Crâne mini */}
          <g transform="translate(28 50)" opacity=".4">
            <circle r="1.6" fill="#f6f1e6"/>
            <circle cx="-.6" cy=".2" r=".3" fill="#000"/>
            <circle cx=".6" cy=".2" r=".3" fill="#000"/>
            <rect x="-.8" y="1.2" width=".4" height=".6" fill="#000"/>
            <rect x="0" y="1.2" width=".4" height=".6" fill="#000"/>
            <rect x=".8" y="1.2" width=".4" height=".6" fill="#000"/>
          </g>
          {/* Note de musique */}
          <g transform="translate(72 50)" opacity=".55">
            <ellipse cx="0" cy="1.5" rx="1" ry=".7" fill="var(--c-mustard)" transform="rotate(-20 0 1.5)"/>
            <line x1=".9" y1="1.2" x2="1.2" y2="-2" stroke="var(--c-mustard)" strokeWidth=".25"/>
            <path d="M 1.2 -2 Q 2.4 -2.4 2 -.8" fill="none" stroke="var(--c-mustard)" strokeWidth=".25"/>
          </g>
          {/* Légende */}
          <g transform="translate(72 54)" opacity=".85">
            <rect width="18" height="4.5" fill="#0a0612" stroke="rgba(246,241,230,.4)" strokeWidth=".1"/>
            <text x="1.5" y="2" fontFamily="JetBrains Mono, monospace" fontSize="1" fontWeight="700" fill="#f6f1e6">LÉGENDE</text>
            <circle cx="2" cy="3.4" r=".4" fill="var(--c-pink)"/>
            <text x="3.2" y="3.7" fontFamily="JetBrains Mono, monospace" fontSize="1" fill="rgba(246,241,230,.75)">Hub fans</text>
            <circle cx="11" cy="3.4" r=".25" fill="var(--c-mustard)"/>
            <text x="11.8" y="3.7" fontFamily="JetBrains Mono, monospace" fontSize="1" fill="rgba(246,241,230,.75)">Ville</text>
          </g>
        </svg>
        <div className="fanmap-pins">
          {PMP_FANS.map((f, i) => {
            const r = 8 + (f.count / max) * 20;
            return (
              <button
                key={i}
                className={`fanpin ${f.hub ? "fanpin-hub" : ""}`}
                style={{ left: f.x + "%", top: f.y + "%", width: r + "px", height: r + "px" }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                aria-label={`${f.city} · ${f.count} fans`}
              >
                <span className="fanpin-pulse" aria-hidden></span>
                <span className="fanpin-core" aria-hidden></span>
                {f.hub && <span className="fanpin-label">{f.city}</span>}
              </button>
            );
          })}
        </div>
        {hover !== null && (
          <div className="fanpin-tooltip"
               style={{ left: PMP_FANS[hover].x + "%", top: PMP_FANS[hover].y + "%" }}>
            <strong>{PMP_FANS[hover].city}</strong>
            <span>{PMP_FANS[hover].count.toLocaleString("fr-FR")} fans</span>
          </div>
        )}
      </div>

      <div className="fanmap-legend">
        <span><span className="fanleg" style={{ width: 10, height: 10 }}></span>&lt; 250 fans</span>
        <span><span className="fanleg" style={{ width: 18, height: 18 }}></span>250–1 000</span>
        <span><span className="fanleg" style={{ width: 28, height: 28 }}></span>&gt; 1 000 (hub)</span>
      </div>
    </section>
  );
}

window.PmpSections = { Hero, Marquee, Discographie, Concerts, Membres, Boutique, Pharmacobar, Galerie, Paroles, Timeline, FanMap, Contact };

