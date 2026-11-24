import * as THREE from "./assets/three.module.min.js";

// An exterior illustration in arbitrary display units, matched to the supplied studio views.
function airframe() {
  const group = new THREE.Group();
  const finish = new THREE.MeshStandardMaterial({
    color: 0x879486,
    metalness: 0.29,
    roughness: 0.42,
  });
  const graphite = new THREE.MeshStandardMaterial({
    color: 0x29372e,
    roughness: 0.56,
  });
  const detail = new THREE.MeshStandardMaterial({
    color: 0x535f53,
    metalness: 0.42,
    roughness: 0.36,
  });
  function shape(geometry, material, parent = group) {
    const mesh = new THREE.Mesh(geometry, material);
    parent.add(mesh);
    return mesh;
  }
  function ellipsoid(x, y, z, sx, sy, sz, material, parent = group) {
    const mesh = shape(new THREE.SphereGeometry(1, 40, 24), material, parent);
    mesh.scale.set(sx, sy, sz);
    mesh.position.set(x, y, z);
    return mesh;
  }
  const outline = [
    [0, -2.3],
    [0.14, -2.19],
    [0.22, -1.63],
    [0.3, -0.69],
    [0.38, 0.28],
    [0.4, 0.84],
    [0.35, 1.43],
    [0.22, 1.78],
    [0.07, 1.98],
    [0, 2.01],
  ];
  const curve = new THREE.SplineCurve(
    outline.map(([r, h]) => new THREE.Vector2(r, h)),
  );
  const body = shape(new THREE.LatheGeometry(curve.getPoints(72), 48), finish);
  body.rotation.x = Math.PI / 2;
  body.scale.z = 0.83;
  // Closed, gently rounded external surfaces keep the silhouette legible at all orbit angles.
  function panel(sections, parent = group) {
    const verts = [],
      idx = [],
      steps = 24;
    for (const [x, y, z, length, height] of sections) {
      for (let j = 0; j < steps; j++) {
        const a = (j * 2 * Math.PI) / steps;
        verts.push(x, y + height * Math.sin(a), z + length * Math.cos(a));
      }
    }
    for (let k = 0; k < sections.length - 1; k++)
      for (let j = 0; j < steps; j++) {
        const a = k * steps + j,
          b = k * steps + ((j + 1) % steps);
        idx.push(a, b, a + steps, b, b + steps, a + steps);
      }
    for (const k of [0, sections.length - 1])
      for (let j = 1; j < steps - 1; j++)
        idx.push(k * steps, k * steps + j, k * steps + j + 1);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const mat = finish.clone();
    mat.side = THREE.DoubleSide;
    return shape(g, mat, parent);
  }
  for (const side of [-1, 1]) {
    panel([
      [0, 0.12, 0.05, 0.58, 0.094],
      [side * 1.7, 0.12, 0.06, 0.52, 0.075],
      [side * 3.7, 0.16, -0.04, 0.36, 0.053],
      [side * 4.06, 0.18, -0.07, 0.3, 0.038],
      [side * 4.1, 0.18, -0.07, 0.26, 0.018],
    ]);
    const tail = new THREE.Group();
    group.add(tail);
    tail.position.set(0, 0.02, -1.75);
    tail.rotation.z = side * 0.82;
    panel(
      [
        [0, 0, 0, 0.37, 0.047],
        [side * 0.78, 0, -0.32, 0.27, 0.033],
        [side * 1.11, 0, -0.45, 0.2, 0.018],
      ],
      tail,
    );
    const boom = ellipsoid(side * 1.32, 0.09, 0.04, 0.072, 0.076, 1.48, detail);
    for (const z of [-1.17, 1.24]) {
      const hub = shape(
        new THREE.CylinderGeometry(0.101, 0.11, 0.14, 22),
        graphite,
      );
      hub.position.set(boom.position.x, 0.17, z);
      const rotor = ellipsoid(
        boom.position.x,
        0.26,
        z,
        0.48,
        0.018,
        0.045,
        graphite,
      );
      rotor.rotation.y = (z > 0 ? 0.52 : -0.72) * side;
    }
    const strut = ellipsoid(
      side * 0.28,
      -0.42,
      0.63,
      0.033,
      0.25,
      0.055,
      detail,
    );
    strut.rotation.z = side * 0.22;
    ellipsoid(side * 0.3, -0.64, 0.61, 0.066, 0.04, 0.24, graphite);
  }
  const aft = ellipsoid(0, 0.01, -2.3, 0.052, 0.67, 0.03, graphite);
  aft.rotation.z = 0.47;
  return group;
}
export function createViewer(host, onMove) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(31, 1, 0.1, 70);
  scene.add(new THREE.HemisphereLight(0xf2f9ef, 0x59705d, 2.2));
  const key = new THREE.DirectionalLight(0xfffaea, 3.5);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const edge = new THREE.DirectionalLight(0xe5f6ff, 2.2);
  edge.position.set(3, 2, -5);
  scene.add(edge);
  const model = airframe();
  scene.add(model);
  const lineScene = new THREE.Scene();
  lineScene.background = new THREE.Color(0x193c2d);
  model.updateMatrixWorld(true);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xc7ddb4 });
  model.traverse((mesh) => {
    if (!mesh.isMesh) return;
    const lines = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry, 12),
      lineMaterial,
    );
    lines.applyMatrix4(mesh.matrixWorld);
    lineScene.add(lines);
  });
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    "Interactive RJS-H1 exterior concept. Drag horizontally or use arrow keys to rotate. Home resets the view.",
  );
  host.replaceChildren(canvas);
  let azimuth = 0.62,
    elevation = 0.49,
    start = null,
    outline = 0;
  function render() {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const distance = Math.max(9.5, 16 / camera.aspect);
    camera.position.set(
      Math.sin(azimuth) * Math.cos(elevation) * distance,
      Math.sin(elevation) * distance,
      Math.cos(azimuth) * Math.cos(elevation) * distance,
    );
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    renderer.setScissorTest(false);
    renderer.render(scene, camera);
    if (outline > 0) {
      renderer.setScissor(0, 0, Math.round(w * outline), h);
      renderer.setScissorTest(true);
      renderer.render(lineScene, camera);
      renderer.setScissorTest(false);
    }
  }
  function rotate(horizontal, vertical = 0) {
    azimuth += horizontal;
    elevation = THREE.MathUtils.clamp(elevation + vertical, -0.2, 1.28);
    render();
    onMove();
  }
  canvas.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    start = { id: e.pointerId, x: e.clientX, y: e.clientY };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!start || start.id !== e.pointerId) return;
    rotate(
      (start.x - e.clientX) * 0.011,
      e.pointerType === "touch" ? 0 : (e.clientY - start.y) * 0.006,
    );
    start.x = e.clientX;
    start.y = e.clientY;
  });
  canvas.addEventListener("lostpointercapture", () => {
    start = null;
  });
  canvas.addEventListener("keydown", (e) => {
    const d = {
      ArrowLeft: [-0.16, 0],
      ArrowRight: [0.16, 0],
      ArrowUp: [0, 0.1],
      ArrowDown: [0, -0.1],
    };
    if (d[e.key]) {
      e.preventDefault();
      rotate(...d[e.key]);
    }
    if (e.key === "Home") {
      e.preventDefault();
      azimuth = 0.62;
      elevation = 0.49;
      render();
      onMove();
    }
  });
  const observer = new ResizeObserver(render);
  observer.observe(host);
  render();
  return {
    render,
    rotate,
    setOutline(value) {
      outline = value;
      render();
    },
  };
}
