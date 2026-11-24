{
  const form = document.querySelector("#enquiry");
  if (form) {
    const topic = new URLSearchParams(location.search).get("interest");
    const interests = form.elements.interest;
    if (Array.from(interests.options).some((option) => option.value === topic))
      interests.value = topic;
    const status = document.querySelector("#enquiry-status");
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = false;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (submit.disabled) return;
      const fields = Object.fromEntries(new FormData(form));
      fields.authorised = form.elements.authorised.checked;
      submit.disabled = true;
      status.textContent = "Sending your enquiry…";
      try {
        const response = await fetch("/api/enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
          signal: AbortSignal.timeout(16000),
        });
        const receipt = await response.json();
        if (response.ok && receipt.success === true) {
          location.assign("/thank-you");
          return;
        }
        status.textContent =
          receipt.message ||
          "Online delivery is unavailable. Please email sales@rajprocess.com.";
      } catch {
        status.textContent =
          "We could not confirm delivery. Please email sales@rajprocess.com.";
      }
      submit.disabled = false;
    });
  }

  const banner = document.querySelector("#cookie-settings");
  const id = document.body.dataset.ga;
  const key = "raj-analytics-consent-v1";
  let choice = null;
  let tag;
  let settingsButton;
  try {
    choice = localStorage.getItem(key);
  } catch {
    /* Session only. */
  }
  function startAnalytics() {
    if (!id || tag) return;
    window["ga-disable-" + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + location.pathname,
    });
    tag = document.createElement("script");
    tag.async = true;
    tag.src =
      "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.append(tag);
  }
  function revokeAnalytics() {
    if (!id) return;
    window["ga-disable-" + id] = true;
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (!/^_ga(?:_\w+)?$/.test(name)) continue;
      document.cookie = name + "=; Max-Age=0; Path=/";
      document.cookie =
        name + "=; Max-Age=0; Path=/; Domain=" + location.hostname;
    }
    tag?.remove();
  }
  function showSettings(button) {
    settingsButton = button;
    banner.hidden = false;
    const message = banner.querySelector("#cookie-description");
    if (!id)
      message.textContent = "Analytics is currently disabled on this site.";
    banner
      .querySelectorAll(
        '[data-cookie-choice="accept"], [data-cookie-choice="decline"]',
      )
      .forEach((option) => {
        option.hidden = !id;
      });
    banner.querySelector('[data-cookie-choice="close"]').hidden = !button;
    if (button)
      banner
        .querySelector(
          id
            ? '[data-cookie-choice="decline"]'
            : '[data-cookie-choice="close"]',
        )
        .focus();
  }
  for (const button of document.querySelectorAll("[data-cookie-settings]")) {
    button.addEventListener("click", () => showSettings(button));
  }
  function closeSettings() {
    banner.hidden = true;
    settingsButton?.focus();
  }
  if (id && choice === "accept") startAnalytics();
  if (id && !["accept", "decline"].includes(choice)) showSettings();
  banner.addEventListener("click", (event) => {
    const next = event.target.closest("[data-cookie-choice]")?.dataset
      .cookieChoice;
    if (!next) return;
    if (next === "close") {
      closeSettings();
      return;
    }
    const wasLoaded = !!tag;
    choice = next;
    let stored = false;
    try {
      localStorage.setItem(key, next);
      stored = true;
    } catch {
      /* Session only. */
    }
    if (next === "accept") startAnalytics();
    else {
      revokeAnalytics();
      if (wasLoaded && stored) {
        location.reload();
        return;
      }
    }
    closeSettings();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === key && event.newValue !== "accept" && tag) {
      revokeAnalytics();
      location.reload();
    }
  });
}
