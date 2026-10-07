/* Nyte Nyte "night falls": the page wipes to the app's night, the eye closes into the logo, stars and dream constellations draw in,
   and "what's still awake in you?" drifts through typefaces before settling. The main site plays it on the way into nyte.html;
   nyte.html replays it when it is reached with the back or forward button, so the full sequence shows every time. */
(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CSS = `
#nyteGo { position: fixed; inset: 0; z-index: 1000; background: #0b1326; color: #efe6d6; overflow: hidden; cursor: pointer;
  clip-path: circle(0px at var(--x, 50%) var(--y, 50%)); transition: clip-path 1.5s cubic-bezier(.45, 0, .2, 1); }
#nyteGo.on { clip-path: circle(160vmax at var(--x, 50%) var(--y, 50%)); }
#nyteGo.fade { clip-path: none; opacity: 0; transition: opacity .25s ease; }
#nyteGo.fade.on { opacity: 1; }
#nyteGo::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 50% 46%, rgba(40, 52, 104, .55), transparent 62vmin); opacity: 0; transition: opacity 2s ease .6s; }
#nyteGo.on::before { opacity: 1; }
#nyteGo .sky { position: absolute; inset: 0; width: 100%; height: 100%; }
#nyteGo .sky circle { opacity: 0; transition: opacity 1.4s ease var(--d); }
#nyteGo.on .sky circle { opacity: var(--o); }
#nyteGo .cst { position: absolute; overflow: visible; }
#nyteGo .c1 { left: 6%; top: 12%; width: min(30vw, 250px); }
#nyteGo .c2 { right: 6%; bottom: 12%; width: min(30vw, 250px); }
#nyteGo .c3 { right: 9%; top: 9%; width: min(22vw, 170px); }
#nyteGo .cst line, #nyteGo .cst path { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s cubic-bezier(.45, 0, .25, 1) var(--d); }
#nyteGo.on .cst line, #nyteGo.on .cst path { stroke-dashoffset: 0; }
#nyteGo .cst .dash { stroke-dasharray: .05 .05; stroke-dashoffset: 0; opacity: 0; transition: opacity 1.2s ease var(--d); }
#nyteGo.on .cst .dash { opacity: .9; }
#nyteGo .cst circle { opacity: 0; transform: scale(.2); transform-box: fill-box; transform-origin: center; transition: opacity .9s ease var(--d), transform .9s cubic-bezier(.3, 1.4, .5, 1) var(--d); }
#nyteGo.on .cst circle { opacity: 1; transform: none; }
#nyteGo .cst { transition: opacity .9s ease; }
#nyteGo.leave .cst, #nyteGo.leave .skip { opacity: 0; transition-delay: 0s; }
#nyteGo .mark { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center; width: 90%; }
#nyteGo .mark svg { width: 132px; height: 116px; display: block; margin: 0 auto; overflow: visible; opacity: 0; transform: scale(.88); transition: opacity 1.1s ease .9s, transform 2.2s cubic-bezier(.3, 0, .2, 1) .9s; filter: drop-shadow(0 0 22px rgba(239, 230, 214, .22)); }
#nyteGo.on .mark svg { opacity: 1; transform: none; }
#nyteGo .iris { transform-box: fill-box; transform-origin: center; transition: transform .8s cubic-bezier(.55, 0, .35, 1), opacity .8s ease-in; }
#nyteGo.close .iris { transform: scaleY(0); opacity: 0; }
#nyteGo .low { transition: opacity .35s ease .65s; }
#nyteGo.close .low { opacity: 0; }
#nyteGo .lash, #nyteGo .spk { opacity: 0; transform: translateY(-3px); transition: opacity .8s ease, transform .8s ease; }
#nyteGo .spk { transition-delay: .4s; }
#nyteGo.rest .lash, #nyteGo.rest .spk { opacity: 1; transform: none; }
#nyteGo .st { opacity: 0; transform: scale(0) rotate(-90deg); transform-box: fill-box; transform-origin: center; transition: opacity .9s ease .6s, transform 1.2s cubic-bezier(.3, 1.4, .5, 1) .6s; }
#nyteGo.rest .st { opacity: 1; transform: none; }
#nyteGo .word { font-family: var(--display); font-weight: 600; color: #efe6d6; font-size: 1.35rem; letter-spacing: .12em; margin-top: 10px; opacity: 0; transition: opacity 1.2s ease 1.1s, letter-spacing 2s cubic-bezier(.3, 0, .2, 1) 1.1s; }
#nyteGo.rest .word { opacity: 1; letter-spacing: .32em; }
#nyteGo .ngtag { height: 2.1em; margin-top: 2px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .6s ease; }
#nyteGo.tagon .ngtag { opacity: 1; }
#nyteGo .ngtag span { display: inline-block; font-family: var(--display); font-style: italic; color: #b9b2a6; white-space: nowrap; transition: opacity .16s ease, filter .16s ease, text-shadow 1.2s ease; }
#nyteGo .ngtag span.blur { opacity: .1; filter: blur(5px); }
#nyteGo .ngtag span.settled { text-shadow: 0 0 18px rgba(239, 230, 214, .35); }
#nyteGo .skip { position: absolute; bottom: 22px; left: 0; right: 0; text-align: center; font-size: .75rem; letter-spacing: .14em; text-transform: uppercase; color: #8e98b3; opacity: 0; transition: opacity .8s ease 1.8s; }
#nyteGo.on .skip { opacity: .7; }
#nyteGo.nowipe { clip-path: none; transition: none; }
`;
  const addCss = () => {
    if (document.getElementById("nyteNightCss")) return;
    const st = document.createElement("style"); st.id = "nyteNightCss"; st.textContent = CSS; document.head.appendChild(st);
  };
  const starSvg = () => {  /* same seeded sky as nyte.html, so the stars stay put across the page change */
    let s = 7, out = "";
    const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 170; i++) {
      const x = (r() * 1600).toFixed(0), y = (r() * 1000).toFixed(0), rad = (r() * 1.1 + .3).toFixed(2), o = (r() * .5 + .15).toFixed(2);
      if (i % 9 === 0) r();
      out += `<circle cx="${x}" cy="${y}" r="${rad}" fill="#fff" style="--o:${o};--d:${(.8 + ((i * 37) % 170) / 170 * 2.2).toFixed(2)}s"/>`;
    }
    return `<svg class="sky" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">${out}</svg>`;
  };
  const cst = (cls, w, h, pts, lines, dash, d0) => {
    let o = `<svg class="cst ${cls}" viewBox="0 0 ${w} ${h}">`;
    lines.forEach(([a, b], k) => o += `<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" pathLength="1" stroke="${pts[a][3] ? "#fff" : "#efe6d6"}" stroke-opacity="${pts[a][3] ? .45 : .4}" stroke-width="1.2" style="--d:${(d0 + .7 + k * .3).toFixed(2)}s"/>`);
    if (dash) o += `<line class="dash" x1="${pts[dash[0]][0]}" y1="${pts[dash[0]][1]}" x2="${pts[dash[1]][0]}" y2="${pts[dash[1]][1]}" pathLength="1" stroke="#d9876a" stroke-width="1.4" style="--d:${(d0 + 2).toFixed(2)}s"/>`;
    pts.forEach(([x, y, c], k) => o += c === "w"
      ? `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#d9876a" stroke-width="1.6" style="--d:${(d0 + k * .25).toFixed(2)}s"/>`
      : `<circle cx="${x}" cy="${y}" r="${pts[k][3] ? 2.6 : 4}" fill="${c}" style="--d:${(d0 + k * .25).toFixed(2)}s;filter:drop-shadow(0 0 6px ${c})"/>`);
    return o + "</svg>";
  };
  const logo = `<svg viewBox="0 0 64 56" aria-hidden="true">
    <path class="st" d="M32 1.5c.6 4.3 1.9 5.6 6.2 6.2-4.3.6-5.6 1.9-6.2 6.2-.6-4.3-1.9-5.6-6.2-6.2 4.3-.6 5.6-1.9 6.2-6.2z" fill="currentColor"/>
    <path class="low" d="M14 25Q32 39 50 25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle class="iris" cx="32" cy="26.5" r="5.2" fill="currentColor"/>
    <path class="lid" d="M14 25Q32 9 50 25" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><animate attributeName="d" begin="indefinite" dur=".9s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".5 0 .3 1" values="M14 25Q32 9 50 25;M14 25Q32 39 50 25"/></path>
    <path class="lash" d="M18.9 30.4L16.5 35.0M25.4 32.9L24.1 38.0M32.0 33.8L32.0 39.0M38.6 32.9L39.9 38.0M45.1 30.4L47.5 35.0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    <path class="spk" d="M14.9 36.4v3.2M13.3 38.0h3.2M23.2 39.7v3.2M21.6 41.3h3.2M32.0 40.4v4.2M29.9 42.5h4.2M40.8 39.7v3.2M39.2 41.3h3.2M49.1 36.4v3.2M47.5 38.0h3.2" fill="none" stroke="#d9876a" stroke-width=".9" stroke-linecap="round"/></svg>`;
  /* the tagline drifts through typefaces like a thought changing shape in a dream, in the Dream map key's colors, then settles in the app's cream serif */
  const TYPES = [
    { f: '"Space Mono", monospace', s: "normal", w: 400, z: ".92em", c: "#a9c8f0", t: "none", l: "-.01em" },
    { f: '"Caveat", cursive', s: "normal", w: 500, z: "1.4em", c: "#f3d9a4", t: "none", l: "0" },
    { f: '"Bebas Neue", sans-serif', s: "normal", w: 400, z: "1.3em", c: "#dcdcd4", t: "uppercase", l: ".14em" },
    { f: '"Playfair Display", serif', s: "italic", w: 400, z: "1.12em", c: "#cbb8f0", t: "none", l: "0" },
    { f: '"Josefin Sans", sans-serif', s: "normal", w: 200, z: "1.02em", c: "#b9e3c1", t: "none", l: ".22em" },
    { f: '"Dancing Script", cursive', s: "normal", w: 500, z: "1.32em", c: "#f2a9ab", t: "none", l: "0" },
    { f: '"Cormorant Garamond", serif', s: "italic", w: 300, z: "1.22em", c: "#efe6d6", t: "none", l: ".02em" },
    { f: "var(--display)", s: "italic", w: 400, z: "1em", c: "#b9b2a6", t: "none", l: "0" }
  ];
  let fontsAsked = false;
  const loadFonts = () => {
    if (fontsAsked) return; fontsAsked = true;
    const l = document.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Space+Mono&family=Caveat:wght@500&family=Bebas+Neue&family=Playfair+Display:ital@1&family=Josefin+Sans:wght@200&family=Dancing+Script:wght@500&family=Cormorant+Garamond:ital,wght@1,300&display=swap&text=" + encodeURIComponent("what’s still awake in you?WHAT’S STILL AWAKE IN YOU'");
    /* faces only download when first used, so warm them all up front; each beat is too short to wait on a download */
    l.onload = () => TYPES.slice(0, -1).forEach(T => { try { document.fonts.load(`${T.s} ${T.w} 24px ${T.f.split(",")[0]}`, "what’s still awake in you?WHAT’S"); } catch (e) {} });
    document.head.appendChild(l);
  };
  /* racing thoughts settling: quick, twitchy swaps that slow step by step until the line rests in the calm cream serif */
  const ORDER = [0, 1, 2, 3, 4, 5, 6, 2, 0, 4, 1, 5, 3, 6, 7];
  const PACE = [70, 70, 75, 80, 90, 100, 115, 135, 160, 195, 240, 300, 380, 480];
  const dreamType = el => {
    let t = 0;
    ORDER.forEach((k, i) => {
      const gap = PACE[i] || 0, swap = i < PACE.length ? Math.round(Math.min(160, Math.max(30, gap * .45))) : 260;
      setTimeout(() => {
        el.style.transitionDuration = `${swap}ms, ${swap}ms, 1.2s`;
        el.classList.add("blur");
        setTimeout(() => {
          const T = TYPES[k], a = Math.pow(1 - i / (ORDER.length - 1), 1.6), j = m => ((Math.random() * 2 - 1) * m * a).toFixed(2);
          Object.assign(el.style, { fontFamily: T.f, fontStyle: T.s, fontWeight: T.w, fontSize: T.z, color: T.c, textTransform: T.t, letterSpacing: T.l,
            transform: a > 0 ? `translate(${j(4)}px, ${j(2.5)}px) rotate(${j(2.5)}deg)` : "none" });
          el.classList.remove("blur");
          if (k === TYPES.length - 1) el.classList.add("settled");
        }, swap);
      }, t);
      t += gap;
    });
  };
  /* x, y: where the night spreads from; wipe: false starts fully dark (already on the explainer); onDone(overlay) runs at the end or on skip */
  function run({ x = innerWidth / 2, y = innerHeight / 2, wipe = true, onDone }) {
    if (document.getElementById("nyteGo")) return null;
    addCss(); loadFonts();
    let done = false;
    const ov = document.createElement("div");
    ov.id = "nyteGo"; ov.setAttribute("aria-hidden", "true");
    const finish = () => { if (done) return; done = true; removeEventListener("keydown", skip); onDone && onDone(ov); };
    const timers = [];
    function skip() { timers.forEach(clearTimeout); finish(); }
    if (reduced) {
      ov.className = "fade"; document.body.appendChild(ov);
      requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add("on")));
      timers.push(setTimeout(finish, 280)); return ov;
    }
    if (!wipe) ov.classList.add("nowipe");
    ov.style.setProperty("--x", x + "px"); ov.style.setProperty("--y", y + "px");
    ov.innerHTML = starSvg()
      + cst("c1", 250, 200, [[30, 40, "#f2a9ab"], [120, 70, "#cbb8f0"], [95, 150, "w"], [205, 130, "#dcdcd4"], [215, 185, "#a9c8f0"]], [[0, 1], [1, 3], [2, 3], [3, 4]], [1, 2], 1.5)
      + cst("c2", 250, 200, [[20, 150, "#a9c8f0"], [100, 90, "#b9e3c1"], [190, 40, "w"], [230, 130, "#f3d9a4"], [130, 180, "#f2a9ab"]], [[0, 1], [1, 3], [1, 4], [3, 4]], [1, 2], 2)
      + cst("c3", 170, 90, [[8, 12, "#fff", 1], [44, 25, "#fff", 1], [73, 30, "#fff", 1], [99, 41, "#fff", 1], [104, 74, "#fff", 1], [151, 80, "#fff", 1], [154, 41, "#fff", 1]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]], null, 2.4)
      + `<div class="mark">${logo}<div class="word">NYTE NYTE</div><div class="ngtag"><span>what’s still awake in you?</span></div></div><div class="skip">Tap to skip</div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add("on")));
    timers.push(
      setTimeout(() => { ov.querySelector(".lid animate").beginElement(); ov.classList.add("close"); }, 2100),
      setTimeout(() => ov.classList.add("rest"), 2900),
      setTimeout(() => { ov.classList.add("tagon"); dreamType(ov.querySelector(".ngtag span")); }, 4000),
      setTimeout(() => ov.classList.add("leave"), 7800),
      setTimeout(finish, 8400)
    );
    ov.addEventListener("click", skip);
    addEventListener("keydown", skip);
    return ov;
  }
  window.NyteNight = { run, loadFonts };
})();
