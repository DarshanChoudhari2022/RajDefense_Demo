/* Section 02 · Why hydrogen — reveal, tilt, scroll-led flight profile */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* soft reveal, staggered within each parent */
const seen = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-seen");
    seen.unobserve(e.target);
  });
}, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
$$("[data-reveal]").forEach((el) => {
  const sibs = $$("[data-reveal]", el.parentElement).filter((n) => n.parentElement === el.parentElement);
  el.style.setProperty("--d", sibs.indexOf(el) * 0.09 + "s");
  seen.observe(el);
});

/* cards lean toward the pointer, with a soft light that follows it */
if (fine && !reduce) {
  $$("[data-tilt]").forEach((t) => {
    t.addEventListener("pointerenter", () => t.classList.add("is-live"));
    t.addEventListener("pointermove", (e) => {
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      t.style.setProperty("--ry", (x - 0.5) * 7 + "deg");
      t.style.setProperty("--rx", (0.5 - y) * 6 + "deg");
      t.style.setProperty("--gx", x * 100 + "%");
      t.style.setProperty("--gy", y * 100 + "%");
    });
    t.addEventListener("pointerleave", () => {
      t.classList.remove("is-live");
      t.style.setProperty("--rx", "0deg"); t.style.setProperty("--ry", "0deg");
    });
  });
}

/* ───── flight profile driven by scroll ───── */
const flow = $("#flow");
if (flow) {
  const steps = $$(".step", flow);
  const segs = $$(".route__live path", flow);
  const lens = segs.map((p) => p.getTotalLength());
  segs.forEach((p, i) => { p.style.strokeDasharray = lens[i]; p.style.strokeDashoffset = lens[i]; });
  const craft = $("#craft");
  const phaseName = $("#phaseName"), phaseDot = $("#phaseDot");
  const mBat = $("#mBat"), mFc = $("#mFc");

  // per segment: label, tone, battery %, fuel-cell %, active step
  const phases = [
    { n: "Vertical take-off", tone: "orange", bat: 90, fc: 32, step: 0 },
    { n: "Transition to the wing", tone: "ink", bat: 48, fc: 58, step: 1 },
    { n: "Cruise on the fuel cell", tone: "green", bat: 14, fc: 74, step: 2 },
    { n: "Descent", tone: "ink", bat: 46, fc: 56, step: 2 },
    { n: "Vertical landing", tone: "orange", bat: 88, fc: 30, step: 2 },
  ];
  const toneColor = { orange: "#ff7400", green: "#268c05", ink: "#14171a" };

  // scroll position 0..1 → which segment, and how far along it
  const place = (s) => {
    if (s < 1 / 3) return { i: 0, t: s * 3 };
    if (s < 2 / 3) return { i: 1, t: (s - 1 / 3) * 3 };
    const k = (s - 2 / 3) * 3;                         // 0..1 across cruise + descent + landing
    const tail = lens[2] + lens[3] + lens[4];
    let d = k * tail;
    for (const i of [2, 3, 4]) { if (d <= lens[i] || i === 4) return { i, t: Math.min(d / lens[i], 1) }; d -= lens[i]; }
  };

  let target = 0, cur = 0, raf = 0, lastPhase = -1, lastStep = -1;
  const measure = () => {
    const a = steps[0].getBoundingClientRect(), b = steps[steps.length - 1].getBoundingClientRect();
    const vh = innerHeight;
    const mid = innerWidth <= 860 ? vh * 0.72 : vh * 0.5;
    target = Math.min(Math.max((mid - a.top) / (b.bottom - a.top), 0), 0.9999);
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const draw = (s) => {
    const { i, t } = place(s);
    segs.forEach((p, k) => { p.style.strokeDashoffset = lens[k] * (k < i ? 0 : k === i ? 1 - t : 1); });
    const pt = segs[i].getPointAtLength(lens[i] * t);
    craft.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    if (i !== lastPhase) {
      lastPhase = i;
      const ph = phases[i];
      phaseName.textContent = ph.n;
      phaseDot.style.background = toneColor[ph.tone];
      craft.dataset.tone = ph.tone;
      mBat.style.width = ph.bat + "%";
      mFc.style.width = ph.fc + "%";
      if (ph.step !== lastStep) {
        lastStep = ph.step;
        steps.forEach((el, k) => el.classList.toggle("is-active", k === ph.step));
        try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(5); } catch {}
      }
    }
  };
  const tick = () => {
    raf = 0;
    cur += (target - cur) * (reduce ? 1 : 0.14);
    if (Math.abs(target - cur) < 0.0004) cur = target;
    draw(cur);
    if (cur !== target) raf = requestAnimationFrame(tick);
  };
  addEventListener("scroll", measure, { passive: true });
  addEventListener("resize", measure);
  measure();

  // steps are also clickable/tappable: jump the story to that step
  steps.forEach((el, k) => {
    el.addEventListener("click", () => {
      const r = el.getBoundingClientRect();
      const mid = innerWidth <= 860 ? innerHeight * 0.72 : innerHeight * 0.5;
      scrollBy({ top: r.top + r.height / 2 - mid, behavior: reduce ? "auto" : "smooth" });
    });
    el.style.cursor = "pointer";
  });
}
