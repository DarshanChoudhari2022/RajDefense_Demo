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

const background = $(".hero-video"),
  hero = $(".hero"),
  transport = $("#motion"),
  track = $(".film-track b");
const reduced = matchMedia("(prefers-reduced-motion:reduce)");
let allowMotion = !reduced.matches && !navigator.connection?.saveData,
  heroVisible = true,
  frameRequest = 0;
function progress() {
  track.style.transform =
    "scaleX(" +
    (background.duration ? background.currentTime / background.duration : 0) +
    ")";
  if (!background.paused) frameRequest = requestAnimationFrame(progress);
}
function syncTransport() {
  const playing = !background.paused;
  transport.setAttribute(
    "aria-label",
    playing ? "Pause background motion" : "Play background motion",
  );
  transport.firstElementChild.className =
    "icon " + (playing ? "pause" : "play");
  cancelAnimationFrame(frameRequest);
  progress();
}
function updateMotion() {
  if (
    allowMotion &&
    heroVisible &&
    !document.hidden &&
    !document.querySelector("dialog[open]")
  ) {
    if (!background.getAttribute("src"))
      background.src = background.dataset.src;
    background.play().catch(syncTransport);
  } else background.pause();
}
background.addEventListener("playing", () => {
  background.classList.add("ready");
  syncTransport();
});
background.addEventListener("pause", syncTransport);
transport.addEventListener("click", () => {
  allowMotion = background.paused;
  updateMotion();
});
reduced.addEventListener("change", () => {
  allowMotion = !reduced.matches;
  updateMotion();
});
document.addEventListener("visibilitychange", updateMotion);
new IntersectionObserver(
  (entries) => {
    heroVisible = entries[0].isIntersecting;
    updateMotion();
  },
  { threshold: 0.05 },
).observe(hero);

const views = [
  { src: "assets/view-2.webp", label: "Front three-quarter" },
  { src: "assets/view-1.webp", label: "Upper three-quarter" },
  { src: "assets/view-3.webp", label: "Rear three-quarter" },
];
const still = $("#aircraft-still"),
  host = $("#canvas-host"),
  modelButton = $("#view-3d"),
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
modelButton.addEventListener("click", async () => {
  if (mode3D) {
    restoreStill();
    hint.textContent = "";
    return;
  }
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
$("#watch").addEventListener("click", () => {
  openDialog(filmDialog);
  if (!film.getAttribute("src")) film.src = film.dataset.src;
  film.currentTime = 0;
  film.play().catch(() => {});
});
for (const trigger of [$(".mast-cta"), $("#brief"), $(".company .text-link")]) {
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    if (trigger.closest(".company")) {
      $("#enquiry").elements.interest.value = "Engineering visit";
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
const reveal = new IntersectionObserver(
  (entries) => {
    for (const e of entries)
      if (e.isIntersecting) {
        e.target.classList.remove("pending");
        reveal.unobserve(e.target);
      }
  },
  { threshold: 0.06 },
);
for (const el of document.querySelectorAll(
  ".family,.tech-chapters article,.company-grid>div,.contact-grid",
)) {
  el.classList.add("reveal", "pending");
  reveal.observe(el);
}
const sectionNav = new IntersectionObserver(
  (entries) => {
    for (const e of entries)
      if (e.isIntersecting) {
        for (const a of nav.querySelectorAll("a")) {
          if (a.hash === "#" + e.target.id)
            a.setAttribute("aria-current", "location");
          else a.removeAttribute("aria-current");
        }
      }
  },
  { rootMargin: "-12% 0px -50% 0px" },
);
for (const el of document.querySelectorAll("main>section"))
  sectionNav.observe(el);
