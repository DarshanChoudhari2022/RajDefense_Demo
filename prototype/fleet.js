/* Section 03 · Fleet — six 3D cards through ONE shared WebGL context, filters, maritime toggle */
import { makeEnv, makeMaterials, addLights, shadowTexture, BUILDERS } from "./models.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const buzz = (ms = 6) => { try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(ms); } catch {} };

/* ───── filters: dim what does not match, keep the layout still ───── */
const cards = $$(".sys");
const chips = $$(".fchip");
chips.forEach((chip) => chip.addEventListener("click", () => {
  const f = chip.dataset.filter;
  chips.forEach((c) => c.setAttribute("aria-pressed", c === chip));
  cards.forEach((c) => c.classList.toggle("is-dim", f !== "all" && c.dataset.status !== f));
  buzz(6);
}));

/* ───── 3D ───── */
(async function mount() {
  let THREE;
  try {
    THREE = await import("./vendor/three.module.min.js");
    const t = document.createElement("canvas");
    if (!(t.getContext("webgl2") || t.getContext("webgl"))) throw new Error("no webgl");
  } catch {
    cards.forEach((c) => c.classList.add("no-gl"));
    return;
  }

  const RW = 960, RH = 640;                              // shared render size, 3:2
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(1);
  renderer.setSize(RW, RH, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const env = makeEnv(THREE, renderer);
  const mats = makeMaterials(THREE);
  const shadowTex = shadowTexture(THREE);

  const states = cards.map((el, idx) => {
    const canvas = $(".sys__gl", el);
    const ctx = canvas.getContext("2d");
    const scene = new THREE.Scene();
    scene.environment = env;
    addLights(THREE, scene);
    const camera = new THREE.PerspectiveCamera(28, RW / RH, 0.1, 200);

    const keys = el.dataset.model.split(",");
    const models = {};
    let R = 1;
    keys.forEach((k) => {
      const built = BUILDERS[k](THREE, mats);
      const holder = new THREE.Group();                  // yaw + pop
      const box = new THREE.Box3().setFromObject(built.group);
      const centre = box.getCenter(new THREE.Vector3());
      built.group.position.sub(centre);                 // centre the model on the origin
      holder.add(built.group);
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const size = box.getSize(new THREE.Vector3());
      holder.userData = { r: sphere.radius, floor: -size.y / 2, size };
      models[k] = { ...built, holder };
      scene.add(holder);
      holder.visible = k === keys[0];
    });
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    scene.add(shadow);

    const st = {
      el, canvas, ctx, scene, camera, models, shadow, current: keys[0], visible: false,
      yaw: -0.6, vel: 0, px: 0, py: 0, cx: 0, cy: 0, hover: false, spin: 1, pop: 1, phase: idx * 1.7, dirty: true,
    };
    frame(st);
    return st;
  });

  /* camera framing from the current model's size */
  function frame(st) {
    const m = st.models[st.current];
    const { r, floor, size } = m.holder.userData;
    const dist = Math.max(r * 2.35, size.x * 1.6);
    st.camera.position.set(0, dist * 0.4, dist * 0.92);
    st.camera.lookAt(0, -r * 0.04, 0);
    st.shadow.position.y = floor - r * 0.28;
    st.shadow.scale.set(r * 2.9, r * 1.45, 1);
  }

  /* canvas backing size follows layout */
  const ro = new ResizeObserver((entries) => entries.forEach((e) => {
    const st = states.find((s) => s.canvas === e.target);
    if (!st) return;
    const w = Math.min(RW, Math.round(e.contentRect.width * Math.min(devicePixelRatio, 2)));
    st.canvas.width = Math.max(2, w); st.canvas.height = Math.max(2, Math.round(w * (RH / RW)));
    st.dirty = true; kick();
  }));
  states.forEach((s) => ro.observe(s.canvas));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const st = states.find((s) => s.el === e.target);
      st.visible = e.isIntersecting;
      if (st.visible) { st.dirty = true; kick(); }
    });
  }, { rootMargin: "80px" });
  states.forEach((s) => io.observe(s.el));

  /* interaction */
  states.forEach((st) => {
    st.el.addEventListener("pointerenter", () => { st.hover = true; kick(); });
    st.el.addEventListener("pointerleave", () => { st.hover = false; st.px = 0; st.py = 0; kick(); });
    st.el.addEventListener("pointermove", (e) => {
      const r = $(".sys__media", st.el).getBoundingClientRect();
      st.px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      st.py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      st.dirty = true; kick();
    });
    // drag the model itself
    let down = false, lx = 0;
    const media = $(".sys__media", st.el);
    media.style.touchAction = "pan-y"; media.style.cursor = "grab";
    media.addEventListener("pointerdown", (e) => { down = st.down = true; lx = e.clientX; st.vel = 0; media.setPointerCapture(e.pointerId); media.style.cursor = "grabbing"; });
    media.addEventListener("pointermove", (e) => { if (!down) return; const d = (e.clientX - lx) * 0.009; st.yaw += d; st.vel = d; lx = e.clientX; });
    const up = () => { down = st.down = false; media.style.cursor = "grab"; };
    media.addEventListener("pointerup", up); media.addEventListener("pointercancel", up);
  });

  /* maritime toggle: air ↔ underwater */
  $$(".seg").forEach((seg) => {
    const el = seg.closest(".sys");
    const st = states.find((s) => s.el === el);
    $$("button", seg).forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.swap;
      if (k === st.current) return;
      seg.dataset.active = k;
      $$("button", seg).forEach((x) => x.setAttribute("aria-selected", x === b));
      Object.entries(st.models).forEach(([key, m]) => { m.holder.visible = key === k; });
      st.current = k; st.pop = 0; st.vel = 0.06; frame(st);
      $$("[data-for]", el).forEach((p) => { p.hidden = p.dataset.for !== k; });
      const badge = $("#seaBadge");
      if (badge) badge.textContent = k === "sea" ? "Concept render" : "Illustrative form";
      st.dirty = true; kick(); buzz(8);
    }));
  });

  /* loop */
  let raf = 0, last = performance.now(), time = 0, tick = 0;
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }
  function render(st, dt) {
    const m = st.models[st.current];
    const h = m.holder;
    st.cx += (st.px - st.cx) * 0.08; st.cy += (st.py - st.cy) * 0.08;
    if (!st.down) { st.yaw += st.vel; st.vel *= 0.93; }
    const idle = reduce ? -0.6 : -0.6 + Math.sin(time * 0.22 + st.phase) * 0.32;
    const base = Math.abs(st.vel) > 0.002 ? st.yaw : (st.yaw += (idle - st.yaw) * 0.02, st.yaw);
    h.rotation.y = base + st.cx * 0.45;
    h.rotation.x = st.cy * 0.08;
    h.rotation.z = -st.cx * 0.04;
    st.pop += (1 - st.pop) * 0.12;
    const s = 0.82 + 0.18 * st.pop;
    h.scale.setScalar(s);
    h.position.y = reduce ? 0 : Math.sin(time * 0.8 + st.phase) * h.userData.r * 0.018;
    st.spin += ((st.hover ? 3.2 : 1) - st.spin) * 0.06;
    const spin = reduce ? 0 : dt * 24 * st.spin;
    m.spinners.forEach(({ g }) => { g.rotation.y += spin * g.userData.dir; });
    if (m.pusher) m.pusher.rotation.x += reduce ? 0 : dt * 28 * st.spin;
    renderer.render(st.scene, st.camera);
    st.ctx.clearRect(0, 0, st.canvas.width, st.canvas.height);
    st.ctx.drawImage(renderer.domElement, 0, 0, RW, RH, 0, 0, st.canvas.width, st.canvas.height);
    st.canvas.classList.add("is-ready");
  }
  function loop(now) {
    raf = 0;
    const dt = Math.min((now - last) / 1000, 0.05); last = now; time += dt; tick++;
    let busy = false;
    for (const st of states) {
      if (!st.visible) continue;
      const moving = !reduce || st.dirty || st.hover || Math.abs(st.vel) > 0.002 || st.pop < 0.995;
      if (!moving) continue;
      busy = true;
      if (!reduce && !st.hover && (tick + states.indexOf(st)) % 2) continue;      // idle cards at ~30fps
      render(st, reduce ? 0 : dt * (st.hover ? 1 : 2));
      st.dirty = false;
    }
    if (busy && (!reduce || states.some((s) => s.hover || Math.abs(s.vel) > 0.002 || s.pop < 0.995))) raf = requestAnimationFrame(loop);
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) kick(); });
  kick();
})();
