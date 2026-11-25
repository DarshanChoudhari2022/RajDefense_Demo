/* Raj Defence and Aerospace — prototype · Section 1 */
import { makeEnv, makeMaterials, addLights, buildRJS, shadowTexture } from "./models.js";
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const buzz = (ms = 8) => { try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(ms); } catch {} };

/* ───────── entry choreography ───────── */
const hero = $(".hero");
$$(".headline .w").forEach((w, i) => w.style.setProperty("--i", i));
$$(".fact").forEach((f, i) => f.style.setProperty("--i", i));
requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("is-in")));

/* count-up for the numbers strip */
$$("[data-count]").forEach((el, k) => {
  const to = +el.dataset.count;
  if (reduce) { el.textContent = to; return; }
  const t0 = 1100 + k * 90, dur = 1400;
  let start;
  const tick = (now) => {
    start ??= now + t0;
    const p = Math.min(Math.max((now - start) / dur, 0), 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

/* ───────── nav ───────── */
const nav = $("#nav");
const links = $(".nav__links");
const pill = $(".nav__pill");
const movePill = (a) => {
  if (!a) return pill.classList.remove("is-on");
  pill.style.width = a.offsetWidth + "px";
  pill.style.transform = `translate3d(${a.offsetLeft}px,-50%,0)`;
  pill.classList.add("is-on");
};
$$("a", links).forEach((a) => {
  a.addEventListener("pointerenter", () => movePill(a));
  a.addEventListener("focus", () => movePill(a));
});
links.addEventListener("pointerleave", () => movePill(null));
links.addEventListener("focusout", () => movePill(null));

let lastY = scrollY;
addEventListener("scroll", () => {
  const y = scrollY;
  nav.classList.toggle("is-solid", y > 24);
  nav.classList.toggle("is-hidden", y > lastY && y > 240 && !$("#burger[aria-expanded=true]"));
  lastY = y;
}, { passive: true });

const burger = $("#burger"), sheet = $("#sheet");
const setMenu = (open) => {
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  sheet.hidden = !open;
  buzz(6);
};
burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* sections that do not exist yet answer with a quiet note instead of a dead click */
const toast = $("#toast");
let toastT;
$$("[data-soon]").forEach((a) =>
  a.addEventListener("click", (e) => {
    if (document.getElementById(a.getAttribute("href").slice(1))) return;
    e.preventDefault();
    setMenu(false);
    toast.textContent = `${a.textContent.trim() || "This section"} is next in the design queue`;
    toast.classList.add("is-on");
    buzz(10);
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("is-on"), 2200);
  }),
);

/* ───────── buttons: magnetic pull, press ripple, haptic tick ───────── */
$$(".btn").forEach((b) => {
  b.addEventListener("pointerdown", (e) => {
    const r = b.getBoundingClientRect();
    const s = Math.max(r.width, r.height) * 2.4;
    const d = document.createElement("span");
    d.className = "ripple";
    Object.assign(d.style, { width: s + "px", height: s + "px", left: e.clientX - r.left + "px", top: e.clientY - r.top + "px" });
    b.append(d);
    d.addEventListener("animationend", () => d.remove());
    buzz(8);
  });
  if (fine && !reduce && b.hasAttribute("data-magnetic")) {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty("--mx", (e.clientX - (r.left + r.width / 2)) * 0.14 + "px");
      b.style.setProperty("--my", (e.clientY - (r.top + r.height / 2)) * 0.22 + "px");
    });
    b.addEventListener("pointerleave", () => { b.style.setProperty("--mx", "0px"); b.style.setProperty("--my", "0px"); });
  }
});

/* soft light that follows the pointer */
if (fine && !reduce) {
  hero.addEventListener("pointermove", (e) => {
    hero.style.setProperty("--gx", e.clientX + "px");
    hero.style.setProperty("--gy", e.clientY + "px");
  }, { passive: true });
}

/* ───────── 3D concept: RAJAS RJS-H1 ───────── */
const canvas = $("#gl");
const stage = $("#stage");
const hint = $("#hint");

(async function mountAircraft() {
  let THREE;
  try {
    THREE = await import("./vendor/three.module.min.js");
    const test = document.createElement("canvas");
    if (!(test.getContext("webgl2") || test.getContext("webgl"))) throw new Error("no webgl");
  } catch {
    $("#fallback").hidden = false;
    canvas.hidden = true;
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  scene.environment = makeEnv(THREE, renderer);
  addLights(THREE, scene);
  const built = buildRJS(THREE, makeMaterials(THREE));
  const jet = built.group, spinners = built.spinners, pusher = built.pusher;

  const rig = new THREE.Group();         // pointer tilt + bob
  const turn = new THREE.Group();        // user yaw
  turn.add(jet); rig.add(turn); scene.add(rig);
  jet.position.set(0.15, 0, 0);

  // soft contact shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: shadowTexture(THREE), transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2; shadow.scale.set(5.2, 2.6, 1); shadow.position.y = -1.45;
  scene.add(shadow);

  /* framing: aircraft sits right-of-centre on wide screens, centred on small ones */
  let W = 1, H = 1, offsetX = 0;
  const resize = () => {
    const r = stage.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const wide = W > 820;
    const dist = wide ? 11.4 : 6.7 / (2 * 0.268 * camera.aspect);
    camera.position.set(0, wide ? 3.0 : dist * 0.2, dist);
    camera.lookAt(0, 0, 0);
    offsetX = wide ? 0.2 : 0;                              // fraction of the frame
    camera.setViewOffset(W, H, -W * offsetX, wide ? H * 0.02 : 0, W, H);
    camera.updateProjectionMatrix();
    renderOnce();
  };
  new ResizeObserver(resize).observe(stage);

  /* interaction: pointer parallax + drag with inertia */
  let tx = 0, ty = 0, cx = 0, cy = 0;       // parallax target / current
  let yaw = -0.62, vel = 0, dragging = false, lastX = 0, touched = false;
  const baseYaw = -0.62;
  canvas.addEventListener("pointerdown", (e) => {
    dragging = true; lastX = e.clientX; vel = 0; canvas.setPointerCapture(e.pointerId);
    if (!touched) { touched = true; hint.classList.add("is-gone"); }
    buzz(6);
  });
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (dragging) { const d = (e.clientX - lastX) * 0.0075; yaw += d; vel = d; lastX = e.clientX; }
  });
  const end = () => { dragging = false; };
  canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
  canvas.addEventListener("pointerleave", () => { tx = 0; ty = 0; });
  canvas.addEventListener("keydown", (e) => {          // keyboard: arrows turn the aircraft
    if (e.key === "ArrowLeft") { vel = -0.05; touched = true; hint.classList.add("is-gone"); }
    if (e.key === "ArrowRight") { vel = 0.05; touched = true; hint.classList.add("is-gone"); }
  });

  /* loop — only runs while the hero is on screen */
  let visible = true, raf = 0, last = performance.now(), time = 0;
  const frame = (now) => {
    raf = 0;
    const dt = Math.min((now - last) / 1000, 0.05); last = now; time += dt;
    if (!dragging) {
      yaw += vel; vel *= 0.94;
      if (!touched && !reduce) yaw = baseYaw + Math.sin(time * 0.22) * 0.28;       // slow idle sweep
      if (touched && Math.abs(vel) < 0.0006 && !reduce) yaw += (Math.sin(time * 0.22) * 0.0006);
    }
    cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
    turn.rotation.y = yaw;
    rig.rotation.x = cy * 0.07 + Math.sin(time * 0.9) * 0.012;
    rig.rotation.z = -cx * 0.05 + Math.sin(time * 0.7) * 0.01;
    rig.position.y = reduce ? 0 : Math.sin(time * 0.8) * 0.06;
    shadow.material.opacity = 1 - Math.abs(rig.position.y) * 1.2;
    shadow.scale.x = 5.2 - rig.position.y * 3;
    const spin = reduce ? 0 : dt * 26;
    spinners.forEach(({ g }, i) => { g.rotation.y += spin * g.userData.dir * (0.55 + (i % 2) * 0.05); });
    pusher.rotation.x += reduce ? 0 : dt * 30;
    renderer.render(scene, camera);
    if (visible && !reduce) raf = requestAnimationFrame(frame);
    else if (visible && (Math.abs(vel) > 0.0006 || dragging)) raf = requestAnimationFrame(frame);
  };
  function renderOnce() { if (!raf) raf = requestAnimationFrame(frame); }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); renderOnce(); } }).observe(stage);
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible) { last = performance.now(); renderOnce(); } });
  if (reduce) { canvas.addEventListener("pointermove", renderOnce); canvas.addEventListener("pointerdown", renderOnce); }

  resize();
  canvas.classList.add("is-ready");
})();
