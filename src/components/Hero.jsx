export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true"></div>
      <div className="hero__grain" aria-hidden="true"></div>
    
      <div className="hero__stage" id="stage" aria-label="Interactive 3D concept of a hydrogen VTOL fixed-wing aircraft">
        <canvas id="gl" tabIndex="0" aria-describedby="stage-note"></canvas>
        <div className="stage__fallback" id="fallback" hidden>
          <img src="/assets/emblem.svg" alt="" width="120" height="120" />
        </div>
        <p className="stage__hint" id="hint" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16M7 9l-3 3 3 3M17 9l3 3-3 3"/></svg>
          Drag to turn
        </p>
        <p className="stage__tag" id="stage-note">
          <i className="dot" aria-hidden="true"></i> RAJAS RJS-H1 <span>· concept render</span>
        </p>
      </div>
    
      <div className="hero__copy">
        <p className="eyebrow reveal"><i className="dot dot--live" aria-hidden="true"></i> Pune, India · Hydrogen fuel-cell UAVs</p>
        <h1 id="hero-title" className="headline">
          <span className="line"><span className="w">Hydrogen-powered</span></span>
          <span className="line"><span className="w">unmanned</span> <span className="w">systems.</span></span>
          <span className="line line--soft"><span className="w">Built</span> <span className="w">in</span> <span className="w">India.</span></span>
        </h1>
        <p className="lede reveal">
          Long-endurance fuel-cell drones for the armed forces, central armed police forces and homeland security agencies.
        </p>
        <div className="actions reveal">
          <a className="btn btn--ink" href="#contact" data-magnetic>
            <span>Request a briefing</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a className="btn btn--ghost" href="/assets/Raj-RJS-H1-overview.pdf" download data-magnetic>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>
            <span>Capability statement</span>
          </a>
        </div>
      </div>
    
      
      <dl className="facts" aria-label="Key figures">
        <div className="fact">
          <dt>Endurance</dt>
          <dd><span className="num" data-count="5" data-prefix="Up to ">0</span><small>hours</small></dd>
        </div>
        <div className="fact">
          <dt>Payload</dt>
          <dd><span className="num" data-count="5">0</span><small>kg</small></dd>
        </div>
        <div className="fact">
          <dt>Take-off</dt>
          <dd><span className="num num--word">Vertical</span><small>no runway</small></dd>
        </div>
        <div className="fact">
          <dt>Made</dt>
          <dd><span className="num num--word">In India</span><small>Pune</small></dd>
        </div>
      </dl>
    
      <a className="scroll" href="#technology" aria-label="Scroll to next section">
        <span className="scroll__line"></span>
      </a>
    </section>
  );
}
