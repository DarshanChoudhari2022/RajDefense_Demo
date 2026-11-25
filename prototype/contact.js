/* Section 07 · Contact — inline validation, quiet error states, simulated send */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const buzz = (ms = 8) => { try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(ms); } catch {} };

const form = $("#enquiry"), card = $("#cCard"), done = $("#done");
if (form) {
  const freeMail = /@(gmail|yahoo|outlook|hotmail|live|rediffmail|proton|icloud)\./i;
  const rules = {
    organisation: (v) => (v.trim() ? "" : "Please tell us your organisation."),
    name: (v) => (v.trim() ? "" : "Please add your name."),
    designation: (v) => (v.trim() ? "" : "Please add your designation."),
    email: (v) => {
      if (!v.trim()) return "Please add your official email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "That email doesn’t look right.";
      if (freeMail.test(v)) return "Please use a government or company email.";
      return "";
    },
    phone: (v) => (!v.trim() || /^[+()\d\s-]{7,20}$/.test(v) ? "" : "Please check the phone number."),
    interest: (v) => (v ? "" : "Please choose a product."),
    message: (v) => (v.trim().length >= 10 ? "" : "Please describe your requirement in a sentence or two."),
    authorised: (_, el) => (el.checked ? "" : "Please confirm to continue."),
  };

  const holderOf = (el) => el.closest(".f, .check");
  const check = (el, loud = true) => {
    const msg = rules[el.name]?.(el.value, el);
    if (msg === undefined) return true;
    const h = holderOf(el);
    h.classList.toggle("is-bad", !!msg && loud);
    h.classList.toggle("is-ok", !msg && (el.value || el.checked) && !h.classList.contains("check"));
    const m = $(".msg", h); if (m) m.textContent = msg;
    return !msg;
  };

  const fields = $$("input[name], select, textarea", form).filter((el) => rules[el.name]);
  fields.forEach((el) => {
    el.addEventListener("blur", () => check(el));
    el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input", () => {
      const h = holderOf(el);
      if (h.classList.contains("is-bad") || h.classList.contains("is-ok")) check(el);
      if (el.type === "checkbox") buzz(6);
    });
  });

  const area = form.elements.message, count = $(".count", form);
  area.addEventListener("input", () => { count.textContent = `${area.value.length} / 1800`; });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (form.elements.website.value) return;                 // honeypot
    const bad = fields.filter((el) => !check(el));
    if (bad.length) {
      const h = holderOf(bad[0]);
      h.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      bad[0].focus({ preventScroll: true });
      bad.forEach((el) => { const x = holderOf(el); x.classList.remove("shake"); void x.offsetWidth; x.classList.add("shake"); });
      buzz(20);
      return;
    }
    const btn = $(".btn--send", form);
    btn.classList.add("is-loading");
    setTimeout(() => {                                       // prototype: simulate the network
      btn.classList.remove("is-loading");
      form.hidden = true; done.hidden = false;
      buzz(12);
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 1100);
  });

  $("#again")?.addEventListener("click", () => {
    form.reset(); count.textContent = "0 / 1800";
    $$(".is-ok, .is-bad", form).forEach((n) => n.classList.remove("is-ok", "is-bad"));
    done.hidden = true; form.hidden = false;
    form.elements.organisation.focus();
  });

  // arriving from a "Request …" button can pre-select the interest
  addEventListener("hashchange", () => { if (location.hash === "#contact") form.elements.organisation?.focus({ preventScroll: true }); });
}
