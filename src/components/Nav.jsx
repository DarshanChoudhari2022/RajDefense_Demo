export default function Nav() {
  return (
    
    <header className="nav" id="nav">
    <div className="nav__bar">
      <a className="brand" href="#top" aria-label="Raj Defence and Aerospace, home">
        <img src="/assets/emblem.svg" alt="" width="34" height="34" />
        <span className="brand__text"><b>Raj</b> Defence &amp; Aerospace</span>
      </a>
    
      <nav className="nav__links" aria-label="Primary">
        <span className="nav__pill" aria-hidden="true"></span>
        <a href="#technology">Technology</a>
        <a href="#systems">Systems</a>
        <a href="#company">Company</a>
        <a href="#quality">Quality</a>
        <a href="#contact">Contact</a>
      </nav>
    
      <a className="btn btn--ink btn--sm nav__cta" href="#contact">
        <span>Enquire</span>
      </a>
    
      <button className="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="sheet">
        <span></span><span></span>
      </button>
    </div>
    
    <div className="sheet" id="sheet" hidden>
      <a href="#technology">Technology</a>
      <a href="#systems">Systems</a>
      <a href="#company">Company</a>
      <a href="#quality">Quality</a>
      <a href="#contact">Contact</a>
    </div>
    </header>
  );
}
