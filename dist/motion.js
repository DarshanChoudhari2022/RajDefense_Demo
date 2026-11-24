const $ = (selector) => document.querySelector(selector);
const nav = $("#site-nav"),
  menu = $(".menu");
function closeMenu() {
  nav.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Open navigation");
}
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
nav.addEventListener("click", closeMenu);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) {
    closeMenu();
    menu.focus();
  }
});
matchMedia("(min-width:641px)").addEventListener("change", closeMenu);

const mast = $(".mast");
function updateMast() {
  mast.classList.toggle("scrolled", window.scrollY > 32);
}
updateMast();
window.addEventListener("scroll", updateMast, { passive: true });

const reduced = matchMedia("(prefers-reduced-motion:reduce)");
const motionScenes = Array.from(
  document.querySelectorAll(".hero, .cinema"),
  (section) => {
    const video = section.querySelector("video");
    let visible = false;
    function update() {
      if (
        visible &&
        !reduced.matches &&
        !navigator.connection?.saveData &&
        !document.hidden
      ) {
        if (!video.hasAttribute("src")) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
    reduced.addEventListener("change", update);
    video.addEventListener("playing", () => video.classList.add("ready"));
    video.addEventListener("error", () => video.classList.remove("ready"));
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.18 },
    ).observe(section);
    return update;
  },
);
function updateMotion() {
  motionScenes.forEach((update) => update());
}
document.addEventListener("visibilitychange", updateMotion);

if ($("#aircraft-still")) {
  const views = [
    { src: "/assets/view-2.webp", label: "Front three-quarter" },
    { src: "/assets/view-1.webp", label: "Upper three-quarter" },
    { src: "/assets/view-3.webp", label: "Rear three-quarter" },
  ];
  const still = $("#aircraft-still"),
    host = $("#canvas-host"),
    modelButton = $("#view-3d"),
    explodeButton = $("#explode-toggle"),
    label = $("#view-label"),
    hint = $("#model-hint");
  let viewIndex = 0,
    viewer = null,
    mode3D = false;
  function displayView() {
    const view = views[viewIndex];
    still.src = view.src;
    still.alt = "RAJAS RJS-H1, " + view.label.toLowerCase() + " studio view";
    label.textContent = view.label;
  }
  function stepView(direction) {
    if (mode3D) {
      viewer.rotate(direction * 0.35);
      return;
    }
    viewIndex = (viewIndex + direction + views.length) % views.length;
    displayView();
  }
  $("#prev").addEventListener("click", () => stepView(-1));
  $("#next").addEventListener("click", () => stepView(1));
  function restoreStill() {
    mode3D = false;
    host.hidden = true;
    still.hidden = false;
    outlineControl.hidden = true;
    explodeControl.hidden = true;
    explodedParts.hidden = true;
    explodeButton.setAttribute("aria-pressed", "false");
    explodeButton.querySelector("span").textContent = "Exploded view";
    explodeControl.querySelector("input").value = "0";
    viewer?.setExplode(0);
    modelButton.setAttribute("aria-pressed", "false");
    modelButton.querySelector("span").textContent = "Explore in 3D";
    displayView();
  }
  const outlineControl = document.createElement("label");
  outlineControl.className = "outline-control";
  outlineControl.hidden = true;
  outlineControl.innerHTML =
    '<span>Outline reveal</span><input type="range" min="0" max="100" value="0" aria-label="Outline reveal"><output>0%</output>';
  hint.before(outlineControl);
  outlineControl.querySelector("input").addEventListener("input", (e) => {
    const value = Number(e.target.value);
    outlineControl.querySelector("output").value = value + "%";
    viewer?.setOutline(value / 100);
  });
  const explodeControl = document.createElement("label");
  explodeControl.className = "explode-control";
  explodeControl.hidden = true;
  explodeControl.innerHTML =
    '<span>Assembled</span><input type="range" min="0" max="100" value="0" aria-label="Explode aircraft components"><span>Exploded</span>';
  hint.before(explodeControl);
  const explodedParts = document.createElement("p");
  explodedParts.className = "exploded-parts";
  explodedParts.hidden = true;
  explodedParts.innerHTML =
    "<strong>Aircraft systems</strong> &nbsp; Wing · V-tail · 4 lift rotors · rear pusher · hydrogen cylinder · PEM fuel cell · buffer battery";
  hint.before(explodedParts);
  let explodeFrame = 0;
  function animateExplode(target) {
    cancelAnimationFrame(explodeFrame);
    const control = explodeControl.querySelector("input");
    const from = viewer?.explodeAmount ?? 0;
    const start = performance.now();
    function frame(now) {
      const progress = Math.min(1, (now - start) / 720);
      const eased = progress * progress * (3 - 2 * progress);
      const value = from + (target - from) * eased;
      viewer?.setExplode(value);
      control.value = String(Math.round(value * 100));
      if (progress < 1) explodeFrame = requestAnimationFrame(frame);
    }
    explodeFrame = requestAnimationFrame(frame);
  }
  explodeControl.querySelector("input").addEventListener("input", (event) => {
    const amount = Number(event.target.value) / 100;
    viewer?.setExplode(amount);
    explodeButton.setAttribute("aria-pressed", String(amount > 0));
    explodeButton.querySelector("span").textContent =
      amount > 0 ? "Assemble aircraft" : "Exploded view";
    explodedParts.hidden = amount < 0.05;
  });
  explodeButton.addEventListener("click", async () => {
    if (!mode3D) await enableViewer();
    if (!mode3D) return;
    const expand = viewer.explodeAmount < 0.5;
    explodeButton.setAttribute("aria-pressed", String(expand));
    explodeButton.querySelector("span").textContent = expand
      ? "Assemble aircraft"
      : "Exploded view";
    explodedParts.hidden = !expand;
    animateExplode(expand ? 1 : 0);
  });
  let viewerLoading = null;
  async function enableViewer() {
    if (mode3D) return;
    if (viewerLoading) return viewerLoading;
    viewerLoading = loadViewer();
    await viewerLoading;
    viewerLoading = null;
  }
  async function loadViewer() {
    modelButton.disabled = true;
    hint.textContent = "Loading exterior view…";
    try {
      const { createViewer } = await import("./aircraft-viewer.js");
      host.hidden = false;
      viewer ??= createViewer(host, () => {
        label.textContent = "Exterior concept";
      });
      viewer.render();
      mode3D = true;
      still.hidden = true;
      outlineControl.hidden = false;
      explodeControl.hidden = false;
      modelButton.setAttribute("aria-pressed", "true");
      modelButton.querySelector("span").textContent = "Studio views";
      label.textContent = "Exterior concept";
      hint.textContent =
        "Drag or use the arrow keys to rotate. Home resets the view.";
    } catch {
      restoreStill();
      hint.textContent =
        "The 3D viewer is unavailable here. Use the arrows for three studio views.";
    } finally {
      modelButton.disabled = false;
    }
  }
  modelButton.addEventListener("click", async () => {
    if (mode3D) {
      restoreStill();
      hint.textContent = "";
      return;
    }
    await enableViewer();
  });
}

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    for (const section of document.querySelectorAll(
      ".catalogue, .cinema, .services, .technology, .company",
    )) {
      const elements = section.querySelectorAll(
        ".family-rows details, .scene-copy, .service-list a, .tech-chapters article, .company-grid figure",
      );
      gsap.from(elements, {
        y: 22,
        opacity: 0.55,
        duration: 0.65,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: section, start: "top 87%", once: true },
      });
    }
  });
}
