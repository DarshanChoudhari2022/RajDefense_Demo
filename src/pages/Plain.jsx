import { useEffect } from "react";

export function Plain({ title, noindex, children }) {
  useEffect(() => {
    document.title = `${title} | Raj Defence and Aerospace`;
    if (noindex) {
      const m = document.createElement("meta");
      m.name = "robots"; m.content = "noindex";
      document.head.appendChild(m);
    }
  }, [title, noindex]);
  return (
    <div className="pg">
      <div className="pg__bar">
        <a href="/"><img src="/assets/emblem.svg" alt="" width="32" height="32" /><span>Raj Defence and Aerospace</span></a>
      </div>
      <main className="pg__main" id="main">{children}</main>
    </div>
  );
}

export function Privacy() {
  return (
    <Plain title="Privacy">
      <h1>Privacy</h1>
      <p>How Raj Defence and Aerospace Pvt. Ltd. handles information from this website.</p>
      <h2>Enquiries</h2>
      <p>When you send an enquiry we use the organisation, name, designation, phone, email and message you provide to reply and coordinate your request. Please do not include sensitive or classified information in the form.</p>
      <h2>Delivery and hosting</h2>
      <p>The site is hosted on Vercel. The form passes your enquiry to Web3Forms, which forwards it to the Raj team by email. Submission attempts are rate limited to prevent abuse. Emails sent directly are handled by the Raj team.</p>
      <h2>Cookies and analytics</h2>
      <p>This site does not use analytics or advertising cookies.</p>
      <h2>Contact</h2>
      <p>Raj Defence and Aerospace Pvt. Ltd., Pune, Maharashtra, India. For questions about your information write to <a href="mailto:sales@rajprocess.com">sales@rajprocess.com</a>.</p>
    </Plain>
  );
}

export function NotFound() {
  return (
    <Plain title="Page not found" noindex>
      <h1>Page not found</h1>
      <p>The address may have changed.</p>
      <a className="btn btn--ink" href="/"><span>Back to home</span></a>
    </Plain>
  );
}
