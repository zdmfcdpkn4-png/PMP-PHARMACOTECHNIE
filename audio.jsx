// audio.jsx — Web Audio engine
// Two modes:
//   • track.audio present → play the real MP3 via <audio> element through analyser
//   • otherwise           → synthesize a riff/drums loop seeded from track.n

const PmpAudio = (() => {
  let ctx = null;
  let masterGain = null;
  let analyser = null;
  let currentTrackN = null;
  let listeners = new Set();

  // Synth state
  let synthNodes = [];
  let synthTimer = null;

  // File state
  let audioEl = null;
  let audioSource = null;

  function ensure() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.55;
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      masterGain.connect(analyser);
      analyser.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xffffffff;
    };
  }

  function emit() {
    listeners.forEach(fn => { try { fn(currentTrackN); } catch(e){} });
  }
  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  /* ── synth helpers ─────────────────────────────────── */
  function playRiffNote(t, freq, dur, type = "sawtooth", gain = 0.3) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(800, t);
    f.frequency.linearRampToValueAtTime(2400, t + 0.04);
    f.frequency.linearRampToValueAtTime(900, t + dur);
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(f); f.connect(g); g.connect(masterGain);
    o.start(t); o.stop(t + dur + 0.05);
    synthNodes.push(o, g, f);
  }
  function playKick(t) {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(0.7, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    o.connect(g); g.connect(masterGain);
    o.start(t); o.stop(t + 0.16);
    synthNodes.push(o, g);
  }
  function playSnare(t) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5);
    const s = ctx.createBufferSource(); s.buffer = buf;
    const g = ctx.createGain(); g.gain.value = 0.35;
    const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 1200;
    s.connect(f); f.connect(g); g.connect(masterGain);
    s.start(t);
    synthNodes.push(s, g, f);
  }
  function playHat(t) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = ctx.createBufferSource(); s.buffer = buf;
    const g = ctx.createGain(); g.gain.value = 0.12;
    const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 6000;
    s.connect(f); f.connect(g); g.connect(masterGain);
    s.start(t);
    synthNodes.push(s, g, f);
  }

  /* ── stop ────────────────────────────────────────── */
  function stop() {
    // Synth
    if (synthTimer) { clearInterval(synthTimer); synthTimer = null; }
    synthNodes.forEach(n => { try { n.stop && n.stop(); } catch(e){} try { n.disconnect(); } catch(e){} });
    synthNodes = [];
    // File
    if (audioEl) {
      try { audioEl.pause(); audioEl.currentTime = 0; } catch(e){}
    }
    if (audioSource) {
      try { audioSource.disconnect(); } catch(e){}
      audioSource = null;
    }
    if (audioEl) {
      audioEl.onended = null;
      audioEl = null;
    }
    currentTrackN = null;
    emit();
  }

  /* ── start ───────────────────────────────────────── */
  function start(track) {
    ensure();
    stop();
    currentTrackN = track.n;

    if (track.audio) {
      audioEl = new Audio(track.audio);
      audioEl.crossOrigin = "anonymous";
      audioEl.loop = false;
      audioEl.preload = "auto";
      audioEl.onended = () => { stop(); };
      try {
        audioSource = ctx.createMediaElementSource(audioEl);
        audioSource.connect(masterGain);
      } catch (e) {
        // fallback: route directly to destination if source creation fails
        console.warn("[PMP] media source failed, falling back", e);
      }
      audioEl.play().catch(err => {
        console.warn("[PMP] play() rejected:", err);
        stop();
      });
      emit();
      return;
    }

    // Synth path
    const seed = track.n * 1009 + 31;
    const rnd  = rng(seed);
    const bpm  = track.bpm || 130;
    const beat = 60 / bpm;
    const stepDur = beat / 2;
    const rootMidi = 40 + (track.n % 5);
    const scale = (track.type === "ballade" || track.type === "power-ballade")
      ? [0, 3, 5, 7, 10, 12]
      : [0, 2, 3, 5, 7, 8, 10, 12];

    const pattern = [];
    for (let i = 0; i < 16; i++) {
      const r = rnd();
      pattern.push(r < 0.15 ? null : scale[Math.floor(rnd() * scale.length)]);
    }
    const kickP  = [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,1,0,0];
    const snareP = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1];

    let step = 0;
    let nextStepTime = ctx.currentTime + 0.05;
    const sched = () => {
      const now = ctx.currentTime;
      const ahead = 0.2;
      while (nextStepTime < now + ahead) {
        const t = nextStepTime;
        const note = pattern[step % 16];
        if (note !== null) {
          const f = midi(rootMidi + note);
          playRiffNote(t, f, stepDur * 1.6, track.type === "ballade" ? "triangle" : "sawtooth", 0.18);
          if (step % 4 === 0) playRiffNote(t, f / 2, stepDur * 1.8, "square", 0.08);
        }
        if (kickP[step % 16])  playKick(t);
        if (snareP[step % 16]) playSnare(t);
        playHat(t);
        nextStepTime += stepDur;
        step++;
      }
    };
    synthTimer = setInterval(sched, 60);
    sched();
    emit();
  }

  function isPlaying(n) { return currentTrackN === n; }
  function getAnalyser() { return analyser; }
  function getCurrent()  { return currentTrackN; }

  return { start, stop, isPlaying, getAnalyser, getCurrent, subscribe };
})();

window.PmpAudio = PmpAudio;
