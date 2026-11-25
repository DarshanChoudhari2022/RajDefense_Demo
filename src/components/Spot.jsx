export default function Spot() {
  return (
    <section className="spot" id="rjs-h1" aria-labelledby="spot-title">
      <header className="spot__head">
        <p className="kicker kicker--dark" data-reveal><span>04</span> Flagship</p>
        <h2 id="spot-title" className="h2" data-reveal>RAJAS RJS-H1</h2>
        <p className="spot__tag" data-reveal>Five hours in the air. No runway needed.</p>
        <p className="lede lede--wide lede--dark" data-reveal>
          It takes off and lands vertically on four lift rotors, then switches to a rear pusher propeller and flies on its high-aspect-ratio wing, steered by a V-tail. A hydrogen fuel cell powers it through the mission.
        </p>
      </header>
    
      <div className="spot__pin" id="spotPin">
        <div className="spot__stage" id="spotStage">
          <canvas id="spotGl" aria-label="Exploded view of the RJS-H1 concept: rotors, booms, wing, tail, pusher and the hydrogen power system" role="img"></canvas>
    
          <div className="lbls" id="lbls" aria-hidden="true">
            <span className="lbl lbl--r" data-a="rot"><i></i><b>Four lift rotors</b></span>
            <span className="lbl lbl--l" data-a="boom" data-minor><i></i><b>Twin wing booms</b></span>
            <span className="lbl lbl--r" data-a="wing" data-minor><i></i><b>High-aspect wing</b></span>
            <span className="lbl lbl--r" data-a="tail" data-minor><i></i><b>V-tail</b></span>
            <span className="lbl lbl--l" data-a="push"><i></i><b>Pusher propeller</b></span>
            <span className="lbl lbl--l" data-a="tank"><i></i><b>Hydrogen cylinder</b></span>
            <span className="lbl lbl--r" data-a="cell"><i></i><b>PEM fuel cell</b></span>
            <span className="lbl lbl--l" data-a="bat" data-minor><i></i><b>Li-ion buffer battery</b></span>
          </div>
    
          <div className="spot__hud">
            <div className="spot__cap" aria-live="polite">
              <span className="spot__n" id="capN">01</span>
              <span><b id="capT">Assembled</b><em id="capS">Fixed wing, V-tail, four lift rotors on two booms.</em></span>
            </div>
            <div className="spot__bar" aria-hidden="true"><i id="spotBar"></i></div>
            <p className="spot__hint"><span className="hint-d">Scroll to open it up · drag to turn</span></p>
          </div>
        </div>
      </div>
    
      <div className="spot__sheet">
        <h3 className="sheet__title" data-reveal>At a glance</h3>
        <dl className="specs" data-reveal>
          <div><dt>Configuration</dt><dd>Fixed wing with V-tail; 4 VTOL lift rotors on two booms; rear pusher propeller</dd></div>
          <div><dt>Power</dt><dd>PEM hydrogen fuel cell + Li-ion buffer battery</dd></div>
          <div><dt>Payload</dt><dd>5 kg</dd></div>
          <div><dt>Endurance</dt><dd>Up to 5 hours</dd></div>
          <div><dt>Take-off and landing</dt><dd>Vertical, no runway required</dd></div>
        </dl>
        <ul className="roles" data-reveal>
          <li>Border &amp; LoC surveillance</li><li>Coastal watch</li><li>Convoy overwatch</li><li>Artillery spotting</li><li>Disaster mapping</li>
        </ul>
        <div className="sheet__actions" data-reveal>
          <a className="btn btn--light" href="#contact" data-magnetic><span>Request a briefing</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          <a className="btn btn--ghost-dark" href="/assets/Raj-RJS-H1-overview.pdf" download data-magnetic>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg><span>Download overview (PDF)</span></a>
        </div>
      </div>
    </section>
  );
}
