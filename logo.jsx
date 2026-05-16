// logo.jsx — PMP heavy-metal logo + vinyl spin wrapper
// All ORIGINAL. The P is a hand-built jagged blackletter glyph with
// drips, thorns and serifs; the ring carries "PHARMACO POP MÉTAL".

/* ── PMP HERO LOGO ──────────────────────────────────────
   Vinyl-disc presentation: black record with grooves +
   reflective shine, with the user's PMP-Pharmacotechnie logo
   centered as the label. The whole thing spins flat as one disc.
   ─────────────────────────────────────────────────────── */
function PmpRoseLogo({ size = 480 }) {
  return (
    <div className="pmp-vinyl-disc" style={{ width: size, height: size }}>
      <svg viewBox="0 0 400 400" width="100%" height="100%"
           style={{ display: "block", borderRadius: "50%" }}
           aria-label="PMP Pharmacotechnie POP Métal — vinyl">
        <defs>
          <radialGradient id="pmp-vinyl-base" cx="38%" cy="32%" r="78%">
            <stop offset="0%"  stopColor="#3a3338"/>
            <stop offset="35%" stopColor="#0c0a10"/>
            <stop offset="100%" stopColor="#000"/>
          </radialGradient>
          <radialGradient id="pmp-vinyl-shine" cx="50%" cy="50%" r="55%">
            <stop offset="0%"  stopColor="rgba(255,255,255,0)"/>
            <stop offset="92%" stopColor="rgba(255,255,255,0)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,.18)"/>
          </radialGradient>
          <clipPath id="pmp-vinyl-clip">
            <circle cx="200" cy="200" r="200"/>
          </clipPath>
        </defs>

        <g clipPath="url(#pmp-vinyl-clip)">
          {/* base vinyl */}
          <circle cx="200" cy="200" r="200" fill="url(#pmp-vinyl-base)"/>

          {/* grooves */}
          {[194,186,178,170,162,154,146,138,130,122].map((r, i) => (
            <circle key={i} cx="200" cy="200" r={r}
                    fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1"/>
          ))}
          {/* tighter inner grooves */}
          {[110,104,98,92,86].map((r, i) => (
            <circle key={`g2-${i}`} cx="200" cy="200" r={r}
                    fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
          ))}

          {/* light wedge */}
          <path d="M 200 200 L 200 4 A 196 196 0 0 1 374 124 Z"
                fill="rgba(255,255,255,.05)"/>
          <path d="M 200 200 L 56 60 A 196 196 0 0 1 200 4 Z"
                fill="rgba(255,255,255,.03)"/>

          {/* faint rim glow */}
          <circle cx="200" cy="200" r="200" fill="url(#pmp-vinyl-shine)"/>

          {/* label backing — circular */}
          <circle cx="200" cy="200" r="86" fill="#0f0a18"/>
          {/* circular clip for the logo image so it fits inside the round label */}
          <defs>
            <clipPath id="pmp-label-clip">
              <circle cx="200" cy="200" r="84"/>
            </clipPath>
          </defs>
          <g clipPath="url(#pmp-label-clip)">
            <image href="assets/pmp-hero-logo.png"
                   x="116" y="116" width="168" height="168"
                   preserveAspectRatio="xMidYMid slice"/>
          </g>
          {/* thin label ring on top */}
          <circle cx="200" cy="200" r="86" fill="none"
                  stroke="rgba(255,255,255,.12)" strokeWidth="1"/>
          <circle cx="200" cy="200" r="82" fill="none"
                  stroke="rgba(255,255,255,.06)" strokeWidth=".6"/>

          {/* spindle hole */}
          <circle cx="200" cy="200" r="4" fill="#000"/>
          <circle cx="200" cy="200" r="4" fill="none"
                  stroke="rgba(255,255,255,.25)" strokeWidth=".6"/>
        </g>

        {/* outer rim highlight */}
        <circle cx="200" cy="200" r="199.4" fill="none"
                stroke="rgba(255,255,255,.18)" strokeWidth="1.2"/>
      </svg>
    </div>
  );
}

/* ── DISC SPIN WRAPPER ───────────────────────────────────
   Flat rotation around Z (like a turntable). Includes a
   subtle drop shadow and a faint glow halo that pulses.
   ─────────────────────────────────────────────────────── */
function PmpLogo3D({ size = 480, spinning = true }) {
  return (
    <div className={`pmp-disc ${spinning ? "is-spinning" : ""}`} style={{ width: size, height: size }}>
      <div className="pmp-disc-halo" aria-hidden></div>
      <div className="pmp-disc-spin">
        <PmpRoseLogo size={size} />
      </div>
    </div>
  );
}

/* ── COMPACT MONOGRAM (for nav, footer) ─────────────── */
function PmpMonogram({ size = 32 }) {
  const INK = "var(--pmp-ink, #f7f3e8)";
  const BG  = "var(--pmp-bg, #160826)";
  const PALETTE = [
    "var(--c-pink, #f0247a)",
    "var(--c-orange, #f47a2e)",
    "var(--c-mustard, #e6c54a)",
    "var(--c-lilac, #f4b6c8)",
  ];
  // mini crown of 10 petals
  const petals = [];
  const N = 10;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    const tipR = 30, len = 18, w = 6;
    const cx = 50, cy = 50;
    const tipX = cx + Math.cos(a) * tipR;
    const tipY = cy + Math.sin(a) * tipR;
    const farX = cx + Math.cos(a) * (tipR + len);
    const farY = cy + Math.sin(a) * (tipR + len);
    const px = -Math.sin(a), py = Math.cos(a);
    petals.push(
      <ellipse key={i}
               cx={(tipX + farX) / 2} cy={(tipY + farY) / 2}
               rx={w} ry={len * .55}
               transform={`rotate(${(a * 180 / Math.PI) + 90} ${(tipX + farX) / 2} ${(tipY + farY) / 2})`}
               fill={PALETTE[i % PALETTE.length]} />
    );
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label="PMP" style={{ display: "block", overflow: "visible" }}>
      {petals}
      <circle cx="50" cy="50" r="28" fill={BG}/>
      <text x="50" y="66" textAnchor="middle"
            fontFamily="'Metal Mania', serif" fontSize="42"
            fill={INK}>P</text>
    </svg>
  );
}

/* ── SIDE VINYL ───────────────────────────────────────── */
function SideVinyl({ playing, onClick, label }) {
  return (
    <button className={`side-vinyl ${playing ? "spinning" : ""}`} onClick={onClick} aria-label="Play single">
      <svg viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <radialGradient id="vinyl-shine" cx="35%" cy="30%" r="80%">
            <stop offset="0%"  stopColor="#444"/>
            <stop offset="40%" stopColor="#0a0a0a"/>
            <stop offset="100%" stopColor="#000"/>
          </radialGradient>
          <radialGradient id="label-gloss" cx="30%" cy="30%" r="80%">
            <stop offset="0%"  stopColor="var(--c-pink, #f0247a)"/>
            <stop offset="100%" stopColor="var(--c-orange, #f47a2e)"/>
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="195" fill="url(#vinyl-shine)" />
        {[180, 168, 156, 144, 132, 120, 108, 96].map((r, i) => (
          <circle key={i} cx="200" cy="200" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1"/>
        ))}
        <path d="M 200 200 L 200 8 A 192 192 0 0 1 360 130 Z" fill="rgba(255,255,255,.04)"/>
        <circle cx="200" cy="200" r="80" fill="url(#label-gloss)" />
        <defs>
          <path id="vinyl-top" d="M 134 200 A 66 66 0 0 1 266 200" />
          <path id="vinyl-bot" d="M 266 200 A 66 66 0 0 1 134 200" />
        </defs>
        <text fill="#fff" fontFamily="'Metal Mania', serif" fontSize="22" letterSpacing="2">
          <textPath href="#vinyl-top" startOffset="50%" textAnchor="middle">PMP</textPath>
        </text>
        <text fill="#fff" fontFamily="'JetBrains Mono', monospace" fontSize="8" letterSpacing="3" fontWeight="700">
          <textPath href="#vinyl-bot" startOffset="50%" textAnchor="middle">{label || "FACE A"}</textPath>
        </text>
        <circle cx="200" cy="200" r="6" fill="#000" />
        <circle cx="200" cy="200" r="2.5" fill="#fff" opacity=".4" />
      </svg>
      <div className="side-vinyl-cta">
        <span className="sv-dot"></span>
        {playing ? "EN COURS" : "FACE A · CLIQUE"}
      </div>
    </button>
  );
}

/* ── Small icons ──────────────────────────────────────── */
function CapsuleIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size}>
      <g transform="rotate(-32 16 16)">
        <rect x="6" y="11" width="20" height="10" rx="5" fill={color} />
        <rect x="6" y="11" width="10" height="10" rx="5" fill="#fff" opacity="0.35" />
      </g>
    </svg>
  );
}
function CrossIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size}>
      <path d="M12 4 H20 V12 H28 V20 H20 V28 H12 V20 H4 V12 H12 Z" fill={color} />
    </svg>
  );
}
function DropIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size}>
      <path d="M16 3 C16 3 6 16 6 22 a10 10 0 0 0 20 0 C26 16 16 3 16 3 Z" fill={color} />
    </svg>
  );
}
function SyringeIcon({ size = 22, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 64 24" width={size} height={(size * 24) / 64}>
      <g fill={color}>
        <rect x="6" y="9" width="3" height="6" />
        <rect x="9" y="7" width="22" height="10" rx="1" />
        <rect x="31" y="9" width="10" height="6" />
        <polygon points="41,12 56,12 60,14 60,10" />
        <rect x="11" y="9" width="5" height="6" fill="rgba(0,0,0,0.18)" />
      </g>
    </svg>
  );
}

window.PmpRoseLogo = PmpRoseLogo;
window.PmpLogo3D = PmpLogo3D;
window.PmpMonogram = PmpMonogram;
window.SideVinyl = SideVinyl;
window.CapsuleIcon = CapsuleIcon;
window.CrossIcon = CrossIcon;
window.DropIcon = DropIcon;
window.SyringeIcon = SyringeIcon;
window.PmpWordmark = PmpRoseLogo;
