/* Shared procedural concept models. Nose points to +X, wing span along Z, up is +Y.
   Every builder returns { group, spinners, pusher? } where spinners = [{ g }] with g.userData.dir. */

export function makeMaterials(THREE) {
  return {
    paint: new THREE.MeshPhysicalMaterial({ color: 0xf3f2ee, roughness: 0.42, metalness: 0.02, clearcoat: 0.5, clearcoatRoughness: 0.35 }),
    graphite: new THREE.MeshStandardMaterial({ color: 0x23282c, roughness: 0.55, metalness: 0.35 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xaab2b7, roughness: 0.28, metalness: 0.85 }),
    carbon: new THREE.MeshStandardMaterial({ color: 0x15181b, roughness: 0.4, metalness: 0.2 }),
    signal: new THREE.MeshStandardMaterial({ color: 0xff7400, roughness: 0.45, metalness: 0.05 }),
    green: new THREE.MeshStandardMaterial({ color: 0x268c05, roughness: 0.5 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x9fb8c4, roughness: 0.05, transparent: true, opacity: 0.22, depthWrite: false }),
    disc: new THREE.MeshBasicMaterial({ color: 0x14171a, transparent: true, opacity: 0.04, side: THREE.DoubleSide, depthWrite: false }),
  };
}

/* image-based light from a tiny studio scene, so matte paint gets soft gradients */
export function makeEnv(THREE, renderer) {
  const studio = new THREE.Scene();
  studio.add(new THREE.Mesh(
    new THREE.SphereGeometry(20, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      vertexShader: "varying vec3 p; void main(){ p = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",
      fragmentShader: "varying vec3 p; void main(){ float h = normalize(p).y*.5+.5; vec3 lo = vec3(.55,.55,.54); vec3 hi = vec3(1.,1.,.99); gl_FragColor = vec4(mix(lo,hi,smoothstep(.1,.9,h)),1.); }",
    }),
  ));
  const panel = (w, h, x, y, z, i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(i, i, i), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); studio.add(m);
  };
  panel(10, 4, -8, 9, 6, 6);
  panel(4, 8, 10, 3, -4, 3.5);
  panel(8, 3, 0, -2, 11, 1.8);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(studio, 0.04).texture;
  pmrem.dispose();
  return tex;
}

export function addLights(THREE, scene) {
  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfcac0, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(-3, 6, 4);
  scene.add(key);
}

/* soft contact shadow texture, shared */
export function shadowTexture(THREE) {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(128, 128, 4, 128, 128, 126);
  g.addColorStop(0, "rgba(20,23,26,.34)"); g.addColorStop(0.55, "rgba(20,23,26,.09)"); g.addColorStop(1, "rgba(20,23,26,0)");
  x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/* ───── helpers ───── */

// lathe body along X. radius(t) with t 0 tail → 1 nose
function body(THREE, mat, len, r, power = 0.62, x = 0) {
  const prof = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const rr = r * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.8)), power) + 0.012;
    prof.push(new THREE.Vector2(Math.max(rr, 0.004), (t - 0.5) * len));
  }
  const m = new THREE.Mesh(new THREE.LatheGeometry(prof, 56), mat);
  m.rotation.z = -Math.PI / 2;
  m.position.x = x;
  return m;
}

// tapered, swept, thin wing lying in the X/Z plane (mirrored about the centreline)
function wing(THREE, mat, { half, root, tip, sweep = 0, thick = 0.035 }) {
  const s = new THREE.Shape();
  s.moveTo(root / 2, 0);
  s.lineTo(tip / 2 - sweep, half); s.lineTo(-tip / 2 - sweep, half);
  s.lineTo(-root / 2, 0);
  s.lineTo(-tip / 2 - sweep, -half); s.lineTo(tip / 2 - sweep, -half);
  s.lineTo(root / 2, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: true, bevelThickness: thick * 0.45, bevelSize: thick * 0.45, bevelSegments: 3 });
  g.translate(0, 0, -thick / 2);
  const m = new THREE.Mesh(g, mat);
  m.rotation.x = -Math.PI / 2;
  return m;
}

function rotor(THREE, m, group, spinners, x, y, z, dir, r = 0.37, blade = 0.74) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.08, r * 0.08, 0.03, 16), m.graphite));
  g.add(new THREE.Mesh(new THREE.BoxGeometry(blade, 0.008, 0.05), m.carbon));
  const d = new THREE.Mesh(new THREE.CircleGeometry(r, 48), m.disc);
  d.rotation.x = -Math.PI / 2; d.position.y = 0.004; g.add(d);
  g.userData.dir = dir >= 0 ? 1 : -1;
  spinners.push({ g });
  group.add(g);
}

function pusherProp(THREE, m, group, x, y = 0.02, r = 0.39) {
  const p = new THREE.Group();
  p.position.set(x, y, 0);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 20), m.signal);
  cone.rotation.z = Math.PI / 2; cone.position.x = -0.04; p.add(cone);
  p.add(new THREE.Mesh(new THREE.BoxGeometry(0.012, r * 2, 0.05), m.carbon));
  const d = new THREE.Mesh(new THREE.CircleGeometry(r, 48), m.disc);
  d.rotation.y = Math.PI / 2; p.add(d);
  group.add(p);
  return p;
}

/* ───── RAJAS RJS-H1 and variants: 'none' | 'cargo' | 'eo' | 'sea' ───── */
export function buildRJS(THREE, m, { variant = "none", parts = false } = {}) {
  const jet = new THREE.Group();
  const spinners = [];
  const mk = () => new THREE.Group();
  const P = { fuse: mk(), wing: mk(), boomL: mk(), boomR: mk(), rotL: mk(), rotR: mk(), tail: mk(), push: mk(), pod: mk() };
  Object.values(P).forEach((g) => jet.add(g));
  const fm = parts ? m.paint.clone() : m.paint;           // fuselage fades on its own when exploded
  if (parts) fm.transparent = true;

  P.fuse.add(body(THREE, fm, 3.0, 0.17, 0.62, 0.05));
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.172, 0.006, 12, 80), m.signal);
  band.rotation.y = Math.PI / 2; band.position.x = 0.05; P.fuse.add(band);
  const band2 = band.clone(); band2.position.x = 0.12; band2.material = m.green; band2.scale.setScalar(0.992); P.fuse.add(band2);
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 16), m.glass);
  canopy.scale.set(1.6, 0.55, 0.9); canopy.position.set(0.62, 0.1, 0); P.fuse.add(canopy);
  const eo = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 16), m.carbon);
  eo.position.set(0.82, -0.14, 0); P.fuse.add(eo);

  const span = 3.4, sweep = 0.14;
  const w = wing(THREE, m.paint, { half: span, root: 0.62, tip: 0.3, sweep, thick: 0.035 });
  w.position.set(0.12, 0.02, 0); P.wing.add(w);
  for (const s of [-1, 1]) {
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.045, 0.09), m.signal);
    tip.position.set(0.12 - sweep, 0.02, s * (span + 0.02)); P.wing.add(tip);
  }

  const boomZ = 1.02, boomLen = 2.5, boomX = -0.15;
  for (const s of [-1, 1]) {
    const bg = s < 0 ? P.boomL : P.boomR, rg = s < 0 ? P.rotL : P.rotR;
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, boomLen, 20), m.graphite);
    boom.rotation.z = Math.PI / 2; boom.position.set(boomX, 0.02, s * boomZ); bg.add(boom);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.036, 16, 12), m.graphite);
    cap.position.set(boomX + boomLen / 2, 0.02, s * boomZ); bg.add(cap);
    for (const dx of [0.62, -0.72]) {
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.09, 20), m.carbon);
      motor.position.set(boomX + dx, 0.115, s * boomZ); bg.add(motor);
      rotor(THREE, m, rg, spinners, boomX + dx, 0.17, s * boomZ, (dx > 0 ? 1 : -1) * s);
    }
  }

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.038, 0.9, 16), m.paint);
  tail.rotation.z = Math.PI / 2; tail.position.set(-1.7, 0.02, 0); P.tail.add(tail);
  const vs = new THREE.Shape();
  vs.moveTo(0.18, 0); vs.lineTo(-0.16, 0); vs.lineTo(-0.2, 0.62); vs.lineTo(-0.02, 0.62); vs.lineTo(0.18, 0);
  const vg = new THREE.ExtrudeGeometry(vs, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2 });
  vg.translate(0, 0, -0.01);
  for (const s of [-1, 1]) {
    const v = new THREE.Mesh(vg, m.paint);
    v.position.set(-1.88, 0.02, 0);
    v.rotation.x = s * (Math.PI / 2 - 0.62);
    P.tail.add(v);
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.012, 0.02), m.signal);
    const dir = new THREE.Vector3(0, 0.62, 0).applyEuler(new THREE.Euler(s * (Math.PI / 2 - 0.62), 0, 0));
    t.position.set(-1.98, 0.02 + dir.y, dir.z); t.rotation.x = s * (Math.PI / 2 - 0.62); P.tail.add(t);
  }

  const pusher = pusherProp(THREE, m, P.push, -2.18);
  const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.1, 20), m.graphite);
  mount.position.set(-2.14, 0.02, 0); mount.rotation.z = Math.PI / 2; P.push.add(mount);

  if (variant === "cargo") {
    const pod = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 1.1, 8, 24), m.graphite);
    pod.rotation.z = Math.PI / 2; pod.position.set(0.1, -0.34, 0); pod.scale.set(1, 1, 1.1); P.pod.add(pod);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.02, 0.26), m.signal);
    stripe.position.set(0.1, -0.15, 0); P.pod.add(stripe);
  }
  if (variant === "eo" || variant === "sea") {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.12, 28, 20), m.carbon);
    ball.position.set(0.7, -0.24, 0); P.pod.add(ball);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.008, 10, 48), m.signal);
    ring.position.copy(ball.position); ring.rotation.y = Math.PI / 2; P.pod.add(ring);
  }
  if (variant === "sea") {
    const hook = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.025, 0.05), m.graphite);
    hook.position.set(-1.35, -0.12, 0); P.pod.add(hook);
    for (const s of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.8, 10), m.graphite);
      rail.rotation.z = Math.PI / 2; rail.position.set(-0.1, -0.12, s * 0.22); P.pod.add(rail);
    }
  }

  if (parts) {                                          // concept internals, revealed when the shell fades
    P.tank = mk(); P.cell = mk(); P.bat = mk();
    const tank = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.6, 10, 24), m.steel);
    tank.rotation.z = Math.PI / 2; tank.position.set(-0.45, 0, 0); P.tank.add(tank);
    for (const dx of [-0.2, 0.2]) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.008, 10, 40), m.green);
      r.rotation.y = Math.PI / 2; r.position.set(-0.45 + dx, 0, 0); P.tank.add(r);
    }
    for (let i = 0; i < 11; i++) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.13, 0.15), i % 2 ? m.green : m.graphite);
      slab.position.set(0.0 + i * 0.03, 0, 0); P.cell.add(slab);
    }
    const bat = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.09, 0.14), m.signal);
    bat.position.set(0.55, -0.005, 0); P.bat.add(bat);
    [P.tank, P.cell, P.bat].forEach((g) => jet.add(g));
  }
  return { group: jet, spinners, pusher, parts: P, fuseMat: fm };
}

/* ───── loitering munition (illustrative form) ───── */
export function buildLoiter(THREE, m) {
  const g = new THREE.Group(), spinners = [];
  g.add(body(THREE, m.paint, 1.9, 0.11, 0.55));
  const seeker = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 16), m.carbon);
  seeker.position.set(0.93, 0, 0); g.add(seeker);
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.112, 0.006, 12, 60), m.signal);
  band.rotation.y = Math.PI / 2; band.position.x = 0.35; g.add(band);
  const w = wing(THREE, m.paint, { half: 0.95, root: 0.46, tip: 0.18, sweep: 0.22, thick: 0.03 });
  w.position.set(0.05, 0.0, 0); g.add(w);
  const t1 = wing(THREE, m.paint, { half: 0.36, root: 0.26, tip: 0.12, sweep: 0.08, thick: 0.022 });
  t1.position.set(-0.78, 0, 0); g.add(t1);
  const t2 = wing(THREE, m.paint, { half: 0.36, root: 0.26, tip: 0.12, sweep: 0.08, thick: 0.022 });
  t2.position.set(-0.78, 0, 0); t2.rotation.z = 0; t2.rotation.x = 0; t2.rotateX(Math.PI / 2); g.add(t2);
  const pusher = pusherProp(THREE, m, g, -1.02, 0, 0.3);
  return { group: g, spinners, pusher };
}

/* ───── interceptor (illustrative form) ───── */
export function buildInterceptor(THREE, m) {
  const g = new THREE.Group(), spinners = [];
  g.add(body(THREE, m.paint, 1.7, 0.1, 0.5));
  const cam = new THREE.Mesh(new THREE.SphereGeometry(0.065, 24, 16), m.carbon);
  cam.position.set(0.86, -0.02, 0); g.add(cam);
  const w = wing(THREE, m.paint, { half: 0.8, root: 0.95, tip: 0.14, sweep: 0.42, thick: 0.03 });
  w.position.set(-0.1, 0, 0); g.add(w);
  for (const s of [-1, 1]) {
    const fin = wing(THREE, m.paint, { half: 0.2, root: 0.3, tip: 0.1, sweep: 0.1, thick: 0.02 });
    fin.rotation.set(0, 0, 0); fin.rotateX(Math.PI / 2);
    fin.scale.set(1, 0.5, 1);
    fin.position.set(-0.7, 0.2, s * 0.42); g.add(fin);
    const stub = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 10), m.graphite);
    stub.rotation.z = Math.PI / 2; stub.position.set(-0.2, 0.0, s * 0.55); g.add(stub);
    for (const dx of [0.2, -0.6]) rotor(THREE, m, g, spinners, dx, 0.06, s * 0.55, dx > 0 ? s : -s, 0.2, 0.4);
  }
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.102, 0.006, 12, 60), m.signal);
  band.rotation.y = Math.PI / 2; band.position.x = 0.3; g.add(band);
  const pusher = pusherProp(THREE, m, g, -0.92, 0, 0.22);
  return { group: g, spinners, pusher };
}

/* ───── unmanned underwater vehicle (illustrative form) ───── */
export function buildUUV(THREE, m) {
  const g = new THREE.Group(), spinners = [];
  g.add(body(THREE, m.paint, 2.8, 0.23, 0.5));
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), m.carbon);
  nose.position.set(1.4, 0, 0); g.add(nose);
  for (const x of [0.2, 0.32]) {
    const b = new THREE.Mesh(new THREE.TorusGeometry(0.232, 0.007, 12, 80), x < 0.3 ? m.signal : m.green);
    b.rotation.y = Math.PI / 2; b.position.x = x; g.add(b);
  }
  for (const a of [0, Math.PI / 2]) {
    const f = wing(THREE, m.paint, { half: 0.34, root: 0.34, tip: 0.14, sweep: 0.12, thick: 0.025 });
    f.position.set(-1.05, 0, 0); f.rotateX(a); g.add(f);
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 14, 60), m.graphite);
  ring.rotation.y = Math.PI / 2; ring.position.x = -1.45; g.add(ring);
  const pusher = pusherProp(THREE, m, g, -1.4, 0, 0.18);
  return { group: g, spinners, pusher };
}

export const BUILDERS = {
  rjs: (T, m) => buildRJS(T, m),
  heavy: (T, m) => buildRJS(T, m, { variant: "cargo" }),
  isr: (T, m) => buildRJS(T, m, { variant: "eo" }),
  sea: (T, m) => buildRJS(T, m, { variant: "sea" }),
  loiter: buildLoiter,
  interceptor: buildInterceptor,
  uuv: buildUUV,
};
