import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const source = await readFile(new URL("src/home.html", root), "utf8");
const site = "https://rajdefense.vercel.app";
const brand = "Raj Defence & Aerospace";
const email = '<a href="mailto:sales@rajprocess.com">sales@rajprocess.com</a>';
const escape = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
const main = source.match(/<main id="main">([\s\S]*?)<\/main>/)[1];
const sections = new Map(
  Array.from(
    main.matchAll(/<section\b[^>]*\bid="([^"]+)"[^>]*>[\s\S]*?<\/section>/g),
    ([html, id]) => [id, html],
  ),
);
function select(...ids) {
  return ids
    .map((id) => {
      if (!sections.has(id)) throw new Error("Missing homepage section: " + id);
      return sections.get(id);
    })
    .join("\n");
}
const intro = (title, text) =>
  `<section class="page-intro"><h1>${title}</h1><p>${text}</p></section>`;
const link = (href, name) =>
  `<a class="text-link" href="${href}">${name} <i class="icon northeast" aria-hidden="true"></i></a>`;
const form = source
  .match(/<form id="enquiry">([\s\S]*?)<div id="draft" hidden>/)[1]
  .replace(
    "Prepare an email for the Raj corporate team.",
    'Send a message to the Raj team. Read how we handle enquiries in our <a href="/privacy">privacy notice</a>.',
  )
  .replace(
    "<option>Hydrogen technology</option>",
    "<option>Maritime systems</option><option>Hydrogen technology</option>",
  )
  .replace("Prepare email draft", "Send enquiry")
  .replace(
    '<button class="pill" type="submit">',
    '<div hidden><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><button class="pill" type="submit" disabled>',
  );
const faq = [
  [
    "What is the RAJAS RJS-H1?",
    'It is Raj’s hydrogen-hybrid fixed-wing unmanned aircraft designed for vertical take-off and landing. See the <a href="/products#aircraft">aircraft overview</a> and capability statement for the published platform figures.',
  ],
  [
    "How does the aircraft use hydrogen?",
    'A battery provides power for electric lift. A hydrogen fuel cell supplies electric power during forward flight. Read about <a href="/technology">the propulsion system</a>.',
  ],
  [
    "Can our evaluation team visit Raj in Pune?",
    'Evaluation teams can request a visit to discuss the aircraft and see where design and assembly take place. Choose Engineering visit in the <a href="/contact?interest=Engineering%20visit">enquiry form</a>.',
  ],
  [
    "Can we request quality documentation?",
    'Raj makes process records available for customer inspection. Certifications and approvals are available on request. Choose Quality documentation in the <a href="/contact?interest=Quality%20documentation">enquiry form</a>.',
  ],
  [
    "What programmes are still in development?",
    'The RAJAS Heavy-Lift programme is in development. The <a href="/products">product page</a> marks its performance figures as design targets.',
  ],
];
const pages = [
  [
    "/",
    "Hydrogen-powered unmanned systems",
    "Explore Raj Defence & Aerospace’s hydrogen-powered aircraft, maritime programmes and engineering services in Pune, India.",
    "Home",
    main,
  ],
  [
    "/products",
    "Aircraft & maritime programmes",
    "Explore the RAJAS RJS-H1 hydrogen VTOL, heavy-lift development and maritime programmes from Raj Defence & Aerospace.",
    "Products",
    intro(
      "Products &amp; programmes",
      "Explore Raj’s unmanned aircraft and maritime portfolio, from the RJS-H1 to programmes in development.",
    ) + select("products", "systems", "aircraft", "maritime"),
  ],
  [
    "/services",
    "Engineering & evaluation services",
    "Request an aircraft briefing, plan a facility visit in Pune or enquire about quality documentation.",
    "Services",
    intro(
      "Engineering &amp; evaluation services",
      "Work with the Pune team to understand the platform, plan an engineering visit or review quality documentation.",
    ) + select("services"),
  ],
  [
    "/technology",
    "Hydrogen propulsion technology",
    "Learn how electric vertical lift and hydrogen fuel-cell cruise work together on the RAJAS RJS-H1.",
    "Technology",
    intro(
      "Hydrogen-powered flight",
      "The RJS-H1 uses electric lift for take-off and hydrogen fuel-cell power for fixed-wing cruise.",
    ) + select("hydrogen", "propulsion"),
  ],
  [
    "/company",
    "Engineering in Pune",
    "Meet Raj Defence & Aerospace and learn about its industrial engineering roots and aircraft development in Pune.",
    "Company",
    intro(
      "About Raj Defence &amp; Aerospace",
      "Aircraft design and assembly in Pune, with roots in industrial gas engineering.",
    ) +
      select("company") +
      `<div class="page-body"><h2>Company film</h2><p>An 88-second showcase of the RJS-H1, engineering and maritime programmes.</p><video controls playsinline preload="none" poster="/assets/sahyadri-flight.webp" aria-label="Raj Defence and Aerospace company film" src="/assets/raj-india-showcase.mp4"></video><p>Aircraft and maritime scenes are illustrative visualisations.</p></div>`,
  ],
  [
    "/contact",
    "Contact & briefings",
    "Contact Raj Defence & Aerospace in Pune for aircraft enquiries, engineering visits and quality documentation.",
    "Contact",
    intro(
      "Contact the Raj team",
      "Request a briefing, facility visit or documentation for your organisation.",
    ) +
      `<div class="page-body contact-layout"><div><h2>Raj Defence &amp; Aerospace</h2><p>Pune, Maharashtra, India</p><p>${email}</p><p>${link("/faq", "Frequently asked questions")}</p></div><form id="enquiry" action="/api/enquiry" method="post">${form}<noscript><p>Send your enquiry by email at ${email}.</p></noscript><p id="enquiry-status" role="status"></p></form></div>`,
  ],
  [
    "/faq",
    "Frequently asked questions",
    "Find answers about Raj aircraft, hydrogen propulsion, programme status and arranging an engineering visit.",
    "FAQ",
    intro(
      "Frequently asked questions",
      "Aircraft, propulsion and engineering visits.",
    ) +
      `<div class="page-body faq-list">${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>`,
  ],
  [
    "/privacy",
    "Privacy & cookie choices",
    "Read how Raj Defence & Aerospace handles website enquiries and optional analytics, and manage your preferences.",
    "Privacy",
    intro(
      "Privacy &amp; cookie choices",
      "How Raj Defence &amp; Aerospace handles information from this website.",
    ) +
      `<div class="page-body prose"><h2>Website enquiries</h2><p>When you submit an enquiry, we use the contact details, organisation and message you provide to respond and coordinate your request. Avoid including sensitive information in your enquiry.</p><p>The site is hosted on Vercel. The online form uses Web3Forms to forward enquiries to the Raj team. The service limits submission attempts to prevent abuse. Messages sent directly to our email are handled by the Raj team.</p><h2>Optional analytics</h2><p>When enabled on this site, Google Analytics measures page visits and device and browser information after you accept. Your choice is stored in your browser. Use Cookie settings to change your choice at any time.</p><p><button type="button" class="pill" data-cookie-settings>Cookie settings</button></p><h2>Contact about privacy</h2><p>Raj Defence &amp; Aerospace, Pune, Maharashtra, India. For questions about your information or this notice, email ${email}.</p></div>`,
  ],
];
const utility = [
  [
    "/thank-you",
    "Enquiry confirmation",
    "Raj Defence & Aerospace enquiry confirmation.",
    "",
    intro(
      "Enquiry confirmation",
      "If you just submitted the form, it was accepted for delivery to the Raj team.",
    ) +
      `<div class="page-body">${link("/", "Return to homepage")}${link("/contact", "Contact the Raj team")}</div>`,
  ],
  [
    "/404",
    "Page not found",
    "This Raj Defence & Aerospace page could not be found.",
    "",
    intro(
      "Page not found",
      "The address may have changed. Use the links below to find what you need.",
    ) +
      `<div class="page-body">${link("/", "Homepage")}${link("/products", "Explore aircraft")}${link("/contact", "Contact Raj")}</div>`,
  ],
];
const footer = `<footer class="launch-footer"><a class="wordmark" href="/" aria-label="Raj Defence &amp; Aerospace home"><img src="/assets/raj-logo.webp" alt="" width="800" height="225"></a><nav aria-label="Footer">${pages.map(([url, , , label]) => `<a href="${url}">${label}</a>`).join("")}<a href="/company#film">Company film</a><a href="/Raj-brand-kit.zip" download>Brand kit</a><button type="button" data-cookie-settings>Cookie settings</button></nav></footer>`;
const consent = `<section id="cookie-settings" class="cookie-settings" aria-labelledby="cookie-title" hidden><h2 id="cookie-title">Cookie settings</h2><p id="cookie-description">Allow optional analytics to help us understand how visitors use the site. <a href="/privacy">Privacy notice</a></p><div><button class="pill" type="button" data-cookie-choice="decline">Decline</button><button class="pill" type="button" data-cookie-choice="accept">Accept</button><button class="pill" type="button" data-cookie-choice="close">Close</button></div></section>`;
const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";
const analytics =
  /^G-[A-Z0-9]{6,16}$/.test(id) && !/^G-(X+|0+)$/.test(id) ? id : "";
const verification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const header = source
  .match(/<header class="mast">[\s\S]*?<\/header>/)[0]
  .replace('href="#home"', 'href="/"')
  .replace('alt="Raj Defence & Aerospace"', 'alt=""')
  .replace('href="#contact"', 'href="/contact"');
function localize(html, path) {
  const destinations = {
    products: "/products",
    systems: "/products#systems",
    aircraft: "/products#aircraft",
    maritime: "/products#maritime",
    services: "/services",
    hydrogen: "/technology",
    propulsion: "/technology#propulsion",
    company: "/company",
    contact: "/contact",
  };
  html = html.replace(
    /(src|href|data-src)="((?:assets\/|chakan\.webp)[^"]*)"/g,
    '$1="/$2"',
  );
  return html
    .replace(/href="#([^"]+)"/g, (match, anchor) => {
      const dest = destinations[anchor];
      if (!dest) return match;
      if (
        path === "/" &&
        ["systems", "aircraft", "propulsion"].includes(anchor)
      )
        return match;
      return dest.startsWith(path + "#")
        ? `href="#${anchor}"`
        : `href="${dest}"`;
    })
    .replace(
      /<a href="\/contact" data-interest="([^"]+)"/g,
      (_, interest) =>
        `<a href="/contact?interest=${encodeURIComponent(interest)}"`,
    )
    .replace(
      '<button class="pill pale" id="brief">',
      '<a class="pill pale" href="/contact">',
    )
    .replace(
      '</i></button\n            ><a class="contact-email"',
      '</i></a\n            ><a class="contact-email"',
    )
    .replace("<h2>Company film</h2>", '<h2 id="film">Company film</h2>')
    .replace(
      '<h2 id="products-title">Products &amp; programmes</h2>',
      `<h2 id="products-title">${path === "/products" ? "Platform portfolio" : "Products &amp; programmes"}</h2>`,
    );
}
for (const [path, title, description, , content] of [...pages, ...utility]) {
  const url = site + path;
  const fullTitle = title + " | " + brand;
  const hidden = utility.some(([route]) => route === path);
  const image = site + "/assets/share.jpg";
  const pageHeader = header.replace(
    /<nav[\s\S]*?<\/nav>/,
    `<nav id="site-nav" aria-label="Main navigation">${pages
      .slice(1, 6)
      .map(
        ([url, , , label]) =>
          `<a href="${url}"${url === path ? ' aria-current="page"' : ""}>${label}</a>`,
      )
      .join("")}</nav>`,
  );
  const head = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(fullTitle)}</title>
<meta name="description" content="${escape(description)}"><meta name="theme-color" content="#193524">
${hidden ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
${path === "/" && verification ? `<meta name="google-site-verification" content="${escape(verification)}">` : ""}
<meta property="og:type" content="website"><meta property="og:site_name" content="${escape(brand)}"><meta property="og:title" content="${escape(fullTitle)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Raj Defence and Aerospace aircraft concept over the Sahyadri hills">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(fullTitle)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="Raj Defence and Aerospace aircraft concept over the Sahyadri hills">
<link rel="icon" href="/emblem.svg"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/launch.css">
${path === "/" ? '<link rel="preload" as="image" href="/assets/sahyadri-flight.webp" fetchpriority="high">' : ""}
${["/", "/products", "/services", "/technology", "/company"].includes(path) ? '<script defer src="/assets/gsap.min.js"></script><script defer src="/assets/ScrollTrigger.min.js"></script>' : ""}
<script defer src="/launch.js"></script><script defer src="/motion.js"></script>`;
  const filename = path === "/" ? "index" : path.slice(1);
  await writeFile(
    new URL("dist/" + filename + ".html", root),
    `<!doctype html>
<html lang="en-IN"><head>${head}</head><body data-ga="${analytics}">
<a class="skip" href="#main">Skip to content</a>${localize(pageHeader, path)}
<main id="main">${localize(content, path)}</main>
${footer}${consent}</body></html>\n`,
  );
}
await writeFile(
  new URL("dist/robots.txt", root),
  `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`,
);
await writeFile(
  new URL("dist/sitemap.xml", root),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    pages.map(([path]) => `  <url><loc>${site + path}</loc></url>`).join("\n") +
    "\n</urlset>\n",
);
