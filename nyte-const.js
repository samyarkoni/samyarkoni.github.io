/* The Dream map constellation from Nyte Nyte, shared by the main site's Nyte section and the explainer page.
   One set of stars and links; each layout only says where they sit. Tap (or Enter on) a star to light up what it links to.
   Usage: <div class="nyte-const" data-layouts="v h"></div> — one svg per layout (class cg-<name>); the page's CSS picks which shows. */
(function () {
  const C = { person: "#f3d9a4", place: "#a9c8f0", thing: "#dcdcd4", action: "#b9e3c1", feeling: "#f2a9ab", theme: "#cbb8f0", worry: "#d9876a" };
  const NODES = {
    hr: ["hackathon relief", "feeling"],
    sd: ["submission deadline", "theme"],
    fp: ["failed presentation", "worry"],
    pd: ["pitch deck", "thing"],
    dc: ["debug code", "worry"],
    sj: ["static-covered judge", "person"]
  };
  const EDGES = [["hr", "sd", "solid"], ["sd", "fp", "echo"], ["fp", "pd", "solid"], ["fp", "dc", "solid"], ["dc", "sj", "echo"], ["pd", "sj", "faint"], ["hr", "fp", "faint"]];
  const KIND = { solid: "linked to", echo: "echoes", faint: "loosely tied to" };
  /* per layout: viewBox, scale, and for each star [x, y, label x, label y, anchor] */
  const LAYOUTS = {
    v: { vb: "0 0 170 420", s: 1, at: { hr: [58, 34, 67, 38, "start"], sd: [104, 112, 95, 116, "end"], fp: [66, 200, 75, 204, "start"], pd: [128, 246, 119, 250, "end"], dc: [50, 318, 59, 322, "start"], sj: [118, 392, 109, 396, "end"] } },
    h: { vb: "0 0 330 116", s: 1, at: { hr: [18, 24, 27, 28, "start"], sd: [84, 80, 84, 98, "middle"], fp: [150, 30, 150, 14, "middle"], dc: [196, 92, 196, 110, "middle"], pd: [252, 36, 252, 20, "middle"], sj: [314, 86, 326, 108, "end"] } },
    wide: { vb: "0 0 640 290", s: 1.5, at: { hr: [60, 70, 76, 75, "start"], sd: [190, 160, 190, 192, "middle"], fp: [330, 80, 330, 52, "middle"], dc: [430, 220, 430, 252, "middle"], pd: [480, 96, 480, 68, "middle"], sj: [590, 180, 630, 214, "end"] } }
  };
  const CSS = `
.nyte-const :where(svg[role=group]) { display: block; width: 100%; height: auto; overflow: visible; }
.nyte-const text { font-family: var(--display); font-style: italic; fill: #b9b2a6; transition: fill .3s, opacity .3s; }
.nyte-const .cn { cursor: pointer; outline: none; }
.nyte-const .cn:hover text, .nyte-const .cn:focus-visible text { fill: #fff; }
.nyte-const .cn:focus-visible .hit { stroke: rgba(239, 230, 214, .5); stroke-width: 1; }
.nyte-const .cn, .nyte-const .ce { transition: opacity .35s; }
.nyte-const svg.sel .cn:not(.on), .nyte-const svg.sel .ce:not(.on) { opacity: .18; }
.nyte-const svg.sel .cn.pick text { fill: #fff; }
.nyte-const .ce.on { stroke-opacity: 1; }
.nyte-const .cinfo { margin-top: 10px; font-size: .78rem; line-height: 1.45; color: #8e98b3; min-height: 3em; }
.nyte-const .cinfo b { color: #efe6d6; font-family: var(--display); font-style: italic; font-weight: 400; }
.nyte-const .glow { animation: ncGlow 6s ease-in-out infinite; }
.nyte-const .g1 { animation-delay: -2s; } .nyte-const .g2 { animation-delay: -4s; }
@keyframes ncGlow { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@media (prefers-reduced-motion: reduce) { .nyte-const .glow { animation: none; } }`;
  let uid = 0;
  function draw(name) {
    const L = LAYOUTS[name], s = L.s, id = "nc" + (++uid);
    const used = [...new Set(Object.values(NODES).map(n => n[1]).filter(k => k !== "worry"))];
    let o = `<svg class="cg-${name}" viewBox="${L.vb}" role="group" aria-label="A dream map: tap a star to see what it connects to"><defs>`;
    used.forEach(k => o += `<radialGradient id="${id}-${k}"><stop offset="0" stop-color="${C[k]}" stop-opacity=".55"/><stop offset="1" stop-color="${C[k]}" stop-opacity="0"/></radialGradient>`);
    o += "</defs>";
    EDGES.forEach(([a, b, kind]) => {
      const p = L.at[a], q = L.at[b];
      const look = kind === "echo" ? `stroke="${C.worry}" stroke-opacity=".75" stroke-dasharray="${3 * s} ${3 * s}"` : kind === "faint" ? `stroke="#8e97b0" stroke-opacity=".28" stroke-dasharray="${s} ${3 * s}"` : `stroke="#8e97b0" stroke-opacity=".45"`;
      o += `<line class="ce" data-a="${a}" data-b="${b}" data-kind="${kind}" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" ${look} stroke-width="${(kind === "faint" ? .7 : .8) * s}"/>`;
    });
    Object.entries(NODES).forEach(([k, [label, kind]], i) => {
      const [x, y, tx, ty, anchor] = L.at[k];
      const mark = kind === "worry"
        ? `<circle cx="${x}" cy="${y}" r="${5 * s}" fill="none" stroke="${C.worry}" stroke-width="${1.1 * s}"/><circle cx="${x}" cy="${y}" r="${1.2 * s}" fill="${C.worry}"/>`
        : `<circle class="glow g${i % 3}" cx="${x}" cy="${y}" r="${9 * s}" fill="url(#${id}-${kind})"/><circle cx="${x}" cy="${y}" r="${2.4 * s}" fill="${C[kind]}"/>`;
      o += `<g class="cn" data-id="${k}" tabindex="0" role="button" aria-label="${label}, ${kind}"><circle class="hit" cx="${x}" cy="${y}" r="${13 * s}" fill="transparent"/>${mark}<text x="${tx}" y="${ty}" text-anchor="${anchor}" font-size="${10.5 * s}">${label}</text></g>`;
    });
    return o + "</svg>";
  }
  function mount(box) {
    if (box.dataset.mounted) return; box.dataset.mounted = "1";
    box.insertAdjacentHTML("beforeend", (box.dataset.layouts || "v").split(/\s+/).map(draw).join("") + `<p class="cinfo" aria-live="polite">Tap a star to trace its links</p>`);
    const info = box.querySelector(".cinfo"), hint = info.textContent;
    box.querySelectorAll("svg[role=group]").forEach(svg => {
      let cur = null;
      const clear = () => { cur = null; svg.classList.remove("sel"); svg.querySelectorAll(".on, .pick").forEach(e => e.classList.remove("on", "pick")); info.textContent = hint; };
      const pick = g => {
        const id = g.dataset.id; if (cur === id) return clear(); clear(); cur = id;
        svg.classList.add("sel"); g.classList.add("on", "pick");
        const links = [];
        svg.querySelectorAll(".ce").forEach(l => {
          const o = l.dataset.a === id ? l.dataset.b : l.dataset.b === id ? l.dataset.a : null;
          if (o) { l.classList.add("on"); svg.querySelector(`.cn[data-id="${o}"]`).classList.add("on"); links.push(`${KIND[l.dataset.kind]} ${NODES[o][0]}`); }
        });
        info.innerHTML = `<b>${NODES[id][0]}</b> · ${NODES[id][1]}<br>${links.join(" · ")}`;
      };
      svg.addEventListener("click", e => { const g = e.target.closest(".cn"); g ? pick(g) : clear(); });
      svg.addEventListener("keydown", e => { const g = e.target.closest(".cn"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pick(g); } if (e.key === "Escape") clear(); });
    });
  }
  const start = () => {
    if (!document.getElementById("nyteConstCss")) { const st = document.createElement("style"); st.id = "nyteConstCss"; st.textContent = CSS; document.head.appendChild(st); }
    document.querySelectorAll(".nyte-const[data-layouts]").forEach(mount);
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
  window.NyteConst = { mount, NODES, EDGES, COLORS: C };
})();
