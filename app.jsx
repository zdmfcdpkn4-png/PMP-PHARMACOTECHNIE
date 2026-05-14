// app.jsx — main App: cart, custom cursor, concert mode, Tweaks
const { Hero, Marquee, Discographie, Concerts, Membres, Boutique, Pharmacobar, Galerie, Paroles, Contact } = window.PmpSections;

/* ───── Tweak defaults ──────────────────────────────────── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "posologie",
  "mode": "light",
  "display": "gothic",
  "cursor": "plectre",
  "strobe": false
}/*EDITMODE-END*/;

/* ───── Custom cursor ───────────────────────────────────── */
function PmpCursor({ kind }) {
  const ref = React.useRef();
  const [click, setClick] = React.useState(false);
  React.useEffect(() => {
    const onMove = (e) => {
      if (!ref.current) return;
      ref.current.style.left = e.clientX + "px";
      ref.current.style.top  = e.clientY + "px";
    };
    const onDown = () => setClick(true);
    const onUp   = () => setClick(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  let svg;
  if (kind === "syringe") {
    svg = (
      <svg viewBox="0 0 64 32" width="48" height="24">
        <g fill="#fff" stroke="#000" strokeWidth="1.5">
          <rect x="4" y="13" width="3" height="6" />
          <rect x="7" y="10" width="22" height="12" rx="1" />
          <rect x="29" y="13" width="10" height="6" />
          <polygon points="39,16 58,16 62,18 62,14" />
          <rect x="9" y="12" width="6" height="8" fill="#f0247a" stroke="none"/>
        </g>
      </svg>
    );
  } else if (kind === "cross") {
    svg = (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M12 3 H20 V12 H29 V20 H20 V29 H12 V20 H3 V12 H12 Z" fill="#f0247a" stroke="#fff" strokeWidth="1.2"/>
      </svg>
    );
  } else if (kind === "drop") {
    svg = (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M16 2 C16 2 5 16 5 22 a11 11 0 0 0 22 0 C27 16 16 2 16 2 Z" fill="#f0247a" stroke="#fff" strokeWidth="1.2"/>
      </svg>
    );
  } else {
    // GÉLULE — proper pharma capsule, two halves
    svg = (
      <svg viewBox="0 0 44 44" width="34" height="34" style={{ overflow: "visible" }}>
        <g transform="rotate(-35 22 22)">
          {/* shadow */}
          <rect x="6" y="20" width="32" height="9" rx="4.5" fill="rgba(0,0,0,.35)" filter="blur(.6px)"/>
          {/* bottom half (rose) */}
          <path d="M 22 14 H 36 a 7.5 7.5 0 0 1 0 15 H 22 Z" fill="#f0247a" stroke="#fff" strokeWidth="1.4"/>
          {/* top half (mustard/orange) */}
          <path d="M 22 14 H 8 a 7.5 7.5 0 0 0 0 15 H 22 Z" fill="#e6c54a" stroke="#fff" strokeWidth="1.4"/>
          {/* seam line */}
          <line x1="22" y1="14" x2="22" y2="29" stroke="#fff" strokeWidth="1.2"/>
          {/* highlight on top half */}
          <path d="M 10 17 Q 16 15 22 17" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M 24 17 Q 30 15 34 17" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.2" strokeLinecap="round"/>
        </g>
      </svg>
    );
  }
  return <div ref={ref} className={`pmp-cursor ${click ? "click" : ""}`}>{svg}</div>;
}

/* ───── Cart drawer ─────────────────────────────────────── */
function CartDrawer({ open, onClose, cart, removeOne }) {
  if (!open) return null;
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <aside className="cart-drawer">
        <header>
          <h3>Panier</h3>
          <button onClick={onClose} className="btn ghost" style={{ padding: "8px 12px" }}>Fermer ✕</button>
        </header>
        <div className="items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              Panier vide.<br/><br/>
              Aucun excipient à effet notoire.<br/>
              Retour à la boutique conseillé.
            </div>
          ) : (
            cart.map((c, i) => (
              <div className="cart-line" key={i}>
                <div style={{ width: 56, height: 56, background: "var(--bg-2)", border: "1px solid var(--line)", flexShrink: 0 }}>
                  <ProductPic product={c} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="ci-name">{c.name} {c.qty > 1 && <span style={{ color: "var(--accent)" }}>×{c.qty}</span>}</div>
                  <div className="ci-tag">{c.tag}</div>
                </div>
                <div className="ci-price">{(c.price * c.qty).toFixed(2)} €</div>
                <button className="ci-rm" onClick={() => removeOne(c.id)} aria-label="Retirer">✕</button>
              </div>
            ))
          )}
        </div>
        <footer>
          <div className="cart-total">
            <span>Total · TTC</span>
            <b>{total.toFixed(2)} €</b>
          </div>
          <button
            className="btn pink"
            style={{ width: "100%" }}
            disabled={cart.length === 0}
            onClick={() => alert("Bordereau de préparation envoyé sous hotte.\n(Démo — aucun paiement réel)")}
          >
            Préparer la commande
          </button>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--fg-soft)", textAlign: "center" }}>
            Site parodique · aucune transaction réelle
          </div>
        </footer>
      </aside>
    </>
  );
}

/* ───── Nav icons (thin-line, themed) ───────────────── */
function NavIcon({ kind }) {
  const p = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (kind) {
    case "disco": // vinyl
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="5"/>
          <circle cx="12" cy="12" r="1.2" fill="currentColor"/>
        </svg>
      );
    case "tour": // van / route marker
      return (
        <svg {...p}>
          <path d="M3 17h14M3 17V8h11l3 3v6"/>
          <circle cx="7" cy="17" r="1.8"/>
          <circle cx="17" cy="17" r="1.8"/>
          <path d="M14 8v3h6"/>
        </svg>
      );
    case "groupe": // three figures
      return (
        <svg {...p}>
          <circle cx="6" cy="8" r="2.4"/>
          <circle cx="12" cy="7" r="2.6"/>
          <circle cx="18" cy="8" r="2.4"/>
          <path d="M2 18c0-2.5 2-4 4-4s4 1.5 4 4"/>
          <path d="M8 18c0-2.7 2-4.5 4-4.5s4 1.8 4 4.5"/>
          <path d="M14 18c0-2.5 2-4 4-4s4 1.5 4 4"/>
        </svg>
      );
    case "boutique": // shopping bag with cross
      return (
        <svg {...p}>
          <path d="M5 8h14l-1 12H6L5 8z"/>
          <path d="M9 8V6a3 3 0 0 1 6 0v2"/>
          <path d="M11 13h2M12 12v2" stroke="var(--accent)"/>
        </svg>
      );
    case "bar": // cocktail glass
      return (
        <svg {...p}>
          <path d="M5 5h14L12 13 5 5z"/>
          <path d="M12 13v6M8 19h8"/>
          <circle cx="16" cy="6" r="1" fill="currentColor"/>
        </svg>
      );
    case "galerie": // picture frame with mountain
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="1"/>
          <path d="M3 16l5-5 4 4 3-3 6 6"/>
          <circle cx="8" cy="9" r="1.2"/>
        </svg>
      );
    case "paroles": // notice / Rx slip
      return (
        <svg {...p}>
          <path d="M6 3h9l3 3v15H6V3z"/>
          <path d="M14 3v4h4"/>
          <path d="M8 10h2M8 13h7M8 16h5"/>
          <path d="M11.4 10c0-.6.4-1 1-1h1c.6 0 1 .4 1 1s-.4 1-1 1h-1l1.6 2" stroke="var(--accent)" strokeWidth="1.4"/>
        </svg>
      );
    case "contact": // envelope
      return (
        <svg {...p}>
          <rect x="3" y="6" width="18" height="13" rx="1"/>
          <path d="M3 7l9 7 9-7"/>
        </svg>
      );
    case "cart": // pharma shopping basket: bag with handles + capsule inside
      return (
        <svg {...p}>
          {/* basket body */}
          <path d="M4 8 L20 8 L18.5 19 a1.5 1.5 0 0 1 -1.5 1.3 H7 a1.5 1.5 0 0 1 -1.5 -1.3 Z"/>
          {/* rim */}
          <line x1="3.5" y1="8" x2="20.5" y2="8"/>
          {/* arc handles */}
          <path d="M8 8 V6 a4 4 0 0 1 8 0 V8"/>
          {/* capsule inside basket */}
          <rect x="8" y="12" width="8" height="4.5" rx="2.25" transform="rotate(-22 12 14.2)" fill="var(--accent)" stroke="none"/>
        </svg>
      );
    default:
      return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

/* ───── Nav ─────────────────────────────────────────────── */
function Nav({ cartCount, onOpenCart }) {
  const links = [
    { id: "discographie", label: "Discographie", icon: "disco"    },
    { id: "concerts",     label: "Tournée",      icon: "tour"     },
    { id: "groupe",       label: "Groupe",       icon: "groupe"   },
    { id: "boutique",     label: "Boutique",     icon: "boutique" },
    { id: "pharmacobar",  label: "Pharmacobar",  icon: "bar"      },
    { id: "galerie",      label: "Galerie",      icon: "galerie"  },
    { id: "paroles",      label: "Paroles",      icon: "paroles"  },
    { id: "contact",      label: "Contact",      icon: "contact"  },
  ];
  return (
    <nav className="pmp-nav">
      <a href="#accueil" className="brand" onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}>
        <div className="brand-mark"><PmpMonogram size={32} /></div>
        <span>PMP · Pop Métal</span>
      </a>
      <ul className="nav-links">
        {links.map(l => (
          <li key={l.id}>
            <a
              href={`#${l.id}`}
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              title={l.label}
              aria-label={l.label}
            >
              <span className="nav-ico"><NavIcon kind={l.icon} /></span>
              <span className="nav-label">{l.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <button className="cart-btn" onClick={onOpenCart} aria-label="Panier">
        <NavIcon kind="cart" />
        <span className="cart-label">Panier</span>
        {cartCount > 0 && <span className="badge">{cartCount}</span>}
      </button>
    </nav>
  );
}

/* ───── App ─────────────────────────────────────────────── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [cart, setCart] = React.useState([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [concertMode, setConcertMode] = React.useState(false);
  const [playingN, setPlayingN] = React.useState(null);

  React.useEffect(() => {
    const unsub = PmpAudio.subscribe((n) => setPlayingN(n));
    return unsub;
  }, []);

  // Apply data attrs to document root
  React.useEffect(() => {
    document.documentElement.setAttribute("data-palette", t.palette);
    document.documentElement.setAttribute("data-mode", t.mode);
    document.documentElement.setAttribute("data-display", t.display);
    document.documentElement.setAttribute("data-strobe", t.strobe ? "on" : "off");
    if (t.strobe) document.body.classList.add("strobe-on");
    else document.body.classList.remove("strobe-on");
  }, [t.palette, t.mode, t.display, t.strobe]);

  // Concert mode toggles a body class — controls darken/spotlight CSS.
  React.useEffect(() => {
    if (concertMode) document.body.classList.add("concert-on");
    else document.body.classList.remove("concert-on");
  }, [concertMode]);

  // th3rdstream-style scroll reveal: fade + slide up sections as they enter view.
  React.useEffect(() => {
    const els = document.querySelectorAll("section.pmp, .marquee, .foot");
    els.forEach(el => el.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("revealed");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const addToCart = (p) => {
    setCart(prev => {
      const exist = prev.find(x => x.id === p.id);
      if (exist) return prev.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...p, qty: 1 }];
    });
  };
  const removeOne = (id) => {
    setCart(prev => {
      const exist = prev.find(x => x.id === id);
      if (!exist) return prev;
      if (exist.qty > 1) return prev.map(x => x.id === id ? { ...x, qty: x.qty - 1 } : x);
      return prev.filter(x => x.id !== id);
    });
  };
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const playFirst = () => {
    const first = window.PMP.PMP_TRACKS[0];
    PmpAudio.start(first);
    document.getElementById("discographie")?.scrollIntoView({ behavior: "smooth" });
  };
  const toggleVinyl = () => {
    const t = window.PMP.PMP_TRACKS[0];
    if (PmpAudio.isPlaying(t.n)) PmpAudio.stop();
    else PmpAudio.start(t);
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <PmpCursor kind={t.cursor} />
      {concertMode && (
        <div className="stage-lights" aria-hidden>
          <span className="beam-a"></span>
          <span className="beam-b"></span>
        </div>
      )}

      <Nav cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <Hero
        onPlay={playFirst}
        onScrollTo={scrollTo}
        concertMode={concertMode}
        setConcertMode={setConcertMode}
        vinylPlaying={playingN === window.PMP.PMP_TRACKS[0].n}
        onVinylClick={toggleVinyl}
      />

      <Marquee />

      <Discographie />
      <Concerts />
      <Membres />
      <Boutique onAdd={addToCart} cart={cart} />
      <Pharmacobar onAdd={addToCart} cart={cart} />
      <Galerie />
      <Paroles />
      <Contact />

      <div className="divider-spike" role="presentation"></div>

      <footer className="foot">
        <div className="top">
          <div>
            <div className="wordmark">PMP</div>
            <div style={{ fontSize: 14, fontFamily: "var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", marginTop: 12, lineHeight: 1.3 }}>
              Pharmacotechnie · POP Métal
            </div>
          </div>
          <div style={{ maxWidth: 320, fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--fg-soft)" }}>
            Préparé sous hotte à flux laminaire en Vendée. Conditionné sous atmosphère contrôlée. À conserver entre 15 et 25 °C, à l'abri de la lumière directe et des programmateurs frileux.
          </div>
        </div>
        <div className="legal">
          <span>© MMXXVI · PMP Pop Métal</span>
          <span>Site parodique · aucune transaction réelle</span>
          <span>Aucune affiliation hospitalière</span>
          <span>Lot 26-FAKE · à péremption immédiate</span>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} removeOne={removeOne} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette" />
        <TweakRadio
          label="Couleurs"
          value={t.palette}
          options={[
            { value: "posologie", label: "Posologie" },
            { value: "sterile",   label: "Stérile"   },
            { value: "toxique",   label: "Toxique"   },
            { value: "cremation", label: "Crémation" },
          ]}
          onChange={(v) => setTweak("palette", v)}
        />
        <TweakSection label="Mode" />
        <TweakRadio
          label="Ambiance"
          value={t.mode}
          options={["light", "dark"]}
          onChange={(v) => setTweak("mode", v)}
        />
        <TweakToggle
          label="Stroboscope concert"
          value={t.strobe}
          onChange={(v) => setTweak("strobe", v)}
        />
        <TweakSection label="Typographie titres" />
        <TweakRadio
          label="Style"
          value={t.display}
          options={[
            { value: "gothic",    label: "Gothique"   },
            { value: "pop",       label: "Pop"        },
            { value: "brutalist", label: "Brutaliste" },
          ]}
          onChange={(v) => setTweak("display", v)}
        />
        <TweakSection label="Curseur" />
        <TweakSelect
          label="Forme"
          value={t.cursor}
          options={[
            { value: "plectre", label: "Gélule"        },
            { value: "syringe", label: "Seringue"      },
            { value: "cross",   label: "Croix médicale"},
            { value: "drop",    label: "Goutte"        },
          ]}
          onChange={(v) => setTweak("cursor", v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
