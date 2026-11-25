/* Section 06 · Quality — checks tick themselves in, flows play once on view */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const buzz = (ms = 6) => { try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(ms); } catch {} };

const sheet = $("#qSheet");
if (sheet) {
  const items = $$(".checks li", sheet), count = $("#qCount");
  let done = false;
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting || done) return;
    done = true; io.disconnect();
    items.forEach((li, i) => setTimeout(() => {
      li.classList.add("is-on");
      count.textContent = i + 1;
      buzz(5);
    }, 500 + i * 650));
  }, { threshold: 0.45 }).observe(sheet);
}

/* step each flow's items so they appear one after another */
$$(".flow2").forEach((ol) => $$("li", ol).forEach((li, k) => li.style.setProperty("--k", k)));
const gates = $$(".gate");
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
}), { threshold: 0.5 });
gates.forEach((g) => io.observe(g));
