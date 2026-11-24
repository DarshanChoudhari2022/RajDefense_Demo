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
    const button = section.querySelector("#motion, .scene-toggle");
    const track = section.querySelector(".film-track b");
    const subject = section.classList.contains("hero")
      ? "background"
      : section.querySelector(".scene-label").textContent;
    let visible = false;
    let enabled = !reduced.matches && !navigator.connection?.saveData;

    function syncButton() {
      if (!button) return;
      button.setAttribute(
        "aria-label",
        (video.paused ? "Play " : "Pause ") + subject + " motion",
      );
      button.firstElementChild.className =
        "icon " + (video.paused ? "play" : "pause");
    }
    function update() {
      if (
        visible &&
        enabled &&
        !document.hidden &&
        !document.querySelector("dialog[open]")
      ) {
        if (!video.hasAttribute("src")) video.src = video.dataset.src;
        video.play().catch(syncButton);
      } else {
        video.pause();
      }
    }
    button?.addEventListener("click", () => {
      enabled = video.paused;
      update();
    });
    reduced.addEventListener("change", () => {
      enabled = !reduced.matches && !navigator.connection?.saveData;
      update();
    });
    video.addEventListener("playing", () => {
      video.classList.add("ready");
      syncButton();
    });
    video.addEventListener("pause", syncButton);
    video.addEventListener("error", () => {
      video.classList.remove("ready");
      if (button) button.hidden = true;
    });
    if (track)
      video.addEventListener("timeupdate", () => {
        track.style.transform =
          "scaleX(" +
          (video.duration ? video.currentTime / video.duration : 0) +
          ")";
      });
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

const views = [
  { src: "assets/view-2.webp", label: "Front three-quarter" },
  { src: "assets/view-1.webp", label: "Upper three-quarter" },
  { src: "assets/view-3.webp", label: "Rear three-quarter" },
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

const filmDialog = $("#film-dialog"),
  briefDialog = $("#brief-dialog"),
  film = $("#film");
function openDialog(dialog) {
  closeMenu();
  dialog.showModal();
  document.body.classList.add("modal-open");
  updateMotion();
}
for (const dialog of document.querySelectorAll("dialog")) {
  dialog
    .querySelector(".close-dialog")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target !== dialog) return;
    const b = dialog.getBoundingClientRect();
    if (
      e.clientX < b.left ||
      e.clientX > b.right ||
      e.clientY < b.top ||
      e.clientY > b.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (dialog === filmDialog) film.pause();
    updateMotion();
  });
}
const watchButton = $("#watch");
watchButton?.addEventListener("click", () => {
  openDialog(filmDialog);
  if (!film.getAttribute("src")) film.src = film.dataset.src;
  film.currentTime = 0;
  film.play().catch(() => {});
});
for (const trigger of document.querySelectorAll(
  ".mast-cta, #brief, [data-interest]",
)) {
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    if (trigger.dataset.interest) {
      $("#enquiry").elements.interest.value = trigger.dataset.interest;
      $("#draft").hidden = true;
    }
    openDialog(briefDialog);
  });
}
const form = $("#enquiry"),
  draft = $("#draft");
let emailBody = "";
form.addEventListener("input", () => {
  draft.hidden = true;
  $("#copy-status").textContent = "";
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form),
    interest = data.get("interest");
  emailBody = [
    "Hello Raj team,",
    "",
    data.get("message"),
    "",
    "Area of interest: " + interest,
    "Organisation: " + data.get("organisation"),
    "Name: " + data.get("name"),
    "Designation: " + (data.get("designation") || "—"),
    "Official email: " + data.get("email"),
    "Phone: " + (data.get("phone") || "—"),
    "",
    "I confirm this enquiry is on behalf of a government or authorised entity.",
  ].join("\r\n");
  $("#mail-draft").href =
    "mailto:sales@rajprocess.com?subject=" +
    encodeURIComponent("Raj Defence enquiry — " + interest) +
    "&body=" +
    encodeURIComponent(emailBody);
  draft.hidden = false;
  $("#mail-draft").focus();
});
$("#copy-draft").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(emailBody);
    $("#copy-status").textContent = "Message copied.";
  } catch {
    $("#copy-status").textContent = "Use Open email app to continue.";
  }
});
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
const sectionNav = new IntersectionObserver(
  (entries) => {
    for (const e of entries)
      if (e.isIntersecting) {
        for (const a of nav.querySelectorAll("a")) {
          if (
            a.hash ===
            "#" +
              ({
                aircraft: "products",
                systems: "products",
                maritime: "products",
                propulsion: "hydrogen",
              }[e.target.id] || e.target.id)
          )
            a.setAttribute("aria-current", "location");
          else a.removeAttribute("aria-current");
        }
      }
  },
  { rootMargin: "-12% 0px -50% 0px" },
);
for (const el of document.querySelectorAll("main>section"))
  sectionNav.observe(el);
