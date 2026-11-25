export default function Footer() {
  return (
    <footer className="foot">
    <div className="foot__in">
      <div className="foot__brand">
        <img src="/assets/emblem.svg" alt="" width="40" height="40" />
        <div><b>Raj Defence and Aerospace Pvt. Ltd.</b><span>The defence company of the Raj group, Pune, India.</span></div>
      </div>
      <nav className="foot__nav" aria-label="Footer">
        <a href="#technology">Technology</a><a href="#systems">Systems</a><a href="#rjs-h1">RJS-H1</a><a href="#company">Company</a><a href="#quality">Quality</a><a href="#contact">Contact</a>
      </nav>
      <p className="foot__mail"><a href="mailto:sales@rajprocess.com">sales@rajprocess.com</a> · <a href="/privacy">Privacy</a></p>
    </div>
    <p className="foot__fine">© 2026 Raj Defence and Aerospace Pvt. Ltd. We supply governments and authorised entities, under Indian licensing and end-user rules.</p>
    </footer>
  );
}
