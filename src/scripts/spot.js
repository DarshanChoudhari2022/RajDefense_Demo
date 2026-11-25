/* Section 04 · RJS-H1 spotlight — scroll opens the aircraft into its parts */
import { makeEnv, makeMaterials, addLights, buildRJS } from "./models.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const pin = $("#spotPin"), stage = $("#spotStage"), canvas = $("#spotGl");
if (pin && canvas) mount();

async function mount() {
  let THREE;
  try {
    THREE = await import("three");
    const t = document.createElement("canvas");
    if (!(t.getContext("webgl2") || t.getContext("webgl"))) throw new Error("no webgl");
  } catch { return; }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.environment = makeEnv(THREE, renderer);
  addLights(THREE, scene);
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

  const built = buildRJS(THREE, makeMaterials(THREE), { parts: true });
  const P = built.parts, jet = built.group;
  const rig = new THREE.Group(), turn = new THREE.Group();
  turn.add(jet); rig.add(turn); scene.add(rig);
  jet.position.x = 0.4;

  // anchor points, in the assembled model's own coordinates; each rides along with its part
  const anchors = {
    rot: [P.rotL, new THREE.Vector3(0.47, 0.2, -1.02)],
    boom: [P.boomR, new THREE.Vector3(-1.35, 0.02, 1.02)],
    wing: [P.wing, new THREE.Vector3(0.0, 0.03, 2.3)],
    tail: [P.tail, new THREE.Vector3(-2.0, 0.55, 0.3)],
    push: [P.push, new THREE.Vector3(-2.2, -0.42, 0)],
    tank: [P.tank, new THREE.Vector3(-0.8, 0.04, 0)],
    cell: [P.cell, new THREE.Vector3(0.15, 0.07, 0)],
    bat: [P.bat, new THREE.Vector3(0.55, 0.05, 0)],
  };
  const lbls = $$(".lbl").map((el) => ({ el, base: el.classList.contains("lbl--l") ? "l" : "r", a: el.dataset.a, show: { rot: 0.5, boom: 0.5, wing: 0.55, tail: 0.6, push: 0.65, tank: 0.8, cell: 0.82, bat: 0.84 }[el.dataset.a] || 0.7 }));

  /* helpers */
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => t * t * (3 - 2 * t);
  const seg = (e, a, b) => ease(clamp((e - a) / (b - a)));

  function explode(e) {
    P.wing.position.y = 0.95 * seg(e, 0.05, 0.7);
    const r = seg(e, 0.0, 0.6), z = seg(e, 0.15, 0.75);
    P.rotL.position.set(0, 2.1 * r, -0.6 * z); P.rotR.position.set(0, 2.1 * r, 0.6 * z);
    P.boomL.position.set(0, -0.5 * z, -0.6 * z); P.boomR.position.set(0, -0.5 * z, 0.6 * z);
    const t = seg(e, 0.2, 0.8);
    P.tail.position.set(-1.0 * t, 0.35 * t, 0);
    P.push.position.x = -1.9 * seg(e, 0.25, 0.85);
    P.pod.position.y = -0.8 * seg(e, 0.2, 0.7);
    const p = seg(e, 0.45, 0.95);
    built.fuseMat.opacity = 1 - 0.95 * seg(e, 0.4, 0.8);
    built.fuseMat.depthWrite = built.fuseMat.opacity > 0.95;
    const internal = e > 0.3;
    [P.tank, P.cell, P.bat].forEach((g) => (g.visible = internal));
    P.tank.position.set(-0.65 * p, -1.6 * p, 0);
    P.cell.position.set(-0.15 * p, -1.0 * p, 0);
    P.bat.position.set(0.55 * p, -1.6 * p, 0);
  }

  /* framing */
  let W = 1, H = 1;
  const resize = () => {
    const r = stage.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const dist = Math.max(12.5, 6.1 / (2 * 0.249 * camera.aspect));
    camera.position.set(0, dist * 0.27, dist);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    dirty = true; kick();
  };
  new ResizeObserver(resize).observe(stage);

  /* scroll progress */
  let e = 0, target = 0, dirty = true, visible = true;
  const measure = () => {
    const r = pin.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
    target = clamp((p - 0.06) / 0.82);
    dirty = true; kick();
  };
  addEventListener("scroll", measure, { passive: true });
  addEventListener("resize", measure);

  /* drag to turn */
  let yawUser = 0, vel = 0, down = false, lx = 0, hoverX = 0;
  canvas.addEventListener("pointerdown", (ev) => { down = true; lx = ev.clientX; vel = 0; canvas.setPointerCapture(ev.pointerId); });
  canvas.addEventListener("pointermove", (ev) => {
    hoverX = (ev.clientX / W - 0.5) * 2;
    if (down) { const d = (ev.clientX - lx) * 0.008; yawUser += d; vel = d; lx = ev.clientX; }
    dirty = true; kick();
  });
  const up = () => { down = false; };
  canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);

  /* captions */
  const capN = $("#capN"), capT = $("#capT"), capS = $("#capS"), bar = $("#spotBar");
  const caps = [
    ["01", "Assembled", "Fixed wing, V-tail, four lift rotors on two booms."],
    ["02", "Opening up", "Everything the aircraft flies on, set apart."],
    ["03", "Power system", "PEM fuel cell, hydrogen cylinder and a Li-ion buffer battery."],
  ];
  let capIdx = -1;
  const setCap = (i) => {
    if (i === capIdx) return; capIdx = i;
    capT.style.opacity = 0;
    setTimeout(() => { capN.textContent = caps[i][0]; capT.textContent = caps[i][1]; capS.textContent = caps[i][2]; capT.style.opacity = 1; }, 140);
  };

  /* loop */
  const v = new THREE.Vector3();
  let raf = 0, last = performance.now(), time = 0;
  const kick = () => { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  function frame(now) {
    raf = 0;
    const dt = Math.min((now - last) / 1000, 0.05); last = now; time += dt;
    e += (target - e) * (reduce ? 1 : 0.1);
    if (Math.abs(target - e) < 0.0008) e = target;
    explode(e);

    if (!down) { yawUser += vel; vel *= 0.94; }
    const idle = reduce ? 0 : Math.sin(time * 0.25) * 0.12;
    turn.rotation.y = -0.85 + e * 0.55 + yawUser + idle + hoverX * 0.06;
    rig.position.y = -0.3 * e;
    rig.rotation.z = 0.0;
    const spin = reduce ? 0 : dt * 22 * (1 - e * 0.85);
    built.spinners.forEach(({ g }) => { g.rotation.y += spin * g.userData.dir; });
    if (built.pusher) built.pusher.rotation.x += reduce ? 0 : dt * 26 * (1 - e * 0.85);

    renderer.render(scene, camera);
    canvas.classList.add("is-ready");

    // labels follow their 3D anchors
    rig.updateMatrixWorld(true);
    lbls.forEach((lb) => {
      const { el, a, show, base } = lb;
      const [part, local] = anchors[a];
      v.copy(local); part.localToWorld(v); v.project(camera);
      const x = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * H;
      const w = (lb.w ||= el.offsetWidth || 150) + 34;
      const dir = base === "l" ? (x - w < 6 ? "r" : "l") : (x + w > W - 6 ? "l" : "r");   // keep chips on screen
      if (lb.dir !== dir) { lb.dir = dir; el.classList.toggle("lbl--l", dir === "l"); el.classList.toggle("lbl--r", dir === "r"); }
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.style.opacity = v.z < 1 ? clamp((e - show) / 0.12) : 0;
    });
    bar.style.width = e * 100 + "%";
    setCap(e < 0.18 ? 0 : e < 0.7 ? 1 : 2);

    const moving = !reduce || dirty || Math.abs(target - e) > 0.0008 || Math.abs(vel) > 0.0006;
    dirty = false;
    if (visible && moving) raf = requestAnimationFrame(frame);
  }
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) kick(); }, { rootMargin: "100px" }).observe(stage);
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible) kick(); });
  resize(); measure();
}
