/* Section 05 · Heritage — plant-to-plane tabs (auto-plays until the visitor takes over) */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const buzz = (ms = 6) => { try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(ms); } catch {} };

const root = $("#p2p");
if (root) {
  const tabs = $$("[role=tab]", root), pts = $$(".spot-pt", root), panels = $$(".p2p__panel p", root);
  let cur = 0, timer = 0, taken = false, visible = false;

  const set = (i, user = false) => {
    cur = i;
    tabs.forEach((t, k) => t.setAttribute("aria-selected", k === i));
    pts.forEach((p) => p.classList.toggle("is-on", +p.dataset.i === i));
    panels.forEach((p) => { p.hidden = +p.dataset.i !== i; });
    if (user) buzz(6);
  };
  const stop = () => { taken = true; clearInterval(timer); };
  const play = () => { if (taken || reduce || timer) return; timer = setInterval(() => { if (visible && !taken) set((cur + 1) % tabs.length); }, 4200); };

  tabs.forEach((t, i) => t.addEventListener("click", () => { stop(); set(i, true); }));
  tabs.forEach((t, i) => t.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    stop(); set(n, true); tabs[n].focus();
  }));
  pts.forEach((p) => p.addEventListener("click", () => { stop(); set(+p.dataset.i, true); }));

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) play(); }, { threshold: 0.4 }).observe(root);
  set(0);
}
