export default function Fleet() {
  return (
    <section className="fleet" id="systems" aria-labelledby="fleet-title">
      <header className="fleet__head">
        <p className="kicker" data-reveal><span>03</span> Unmanned systems</p>
        <h2 id="fleet-title" className="h2" data-reveal>One platform family</h2>
        <p className="lede lede--wide" data-reveal>
          ISR, loitering, interceptor, heavy-lift and maritime systems share the same hydrogen power system. Units train once and stock one set of spares.
        </p>
      </header>
    
      <div className="filters" role="group" aria-label="Filter systems by status" data-reveal>
        <button className="fchip" aria-pressed="true" data-filter="all">All <i>6</i></button>
        <button className="fchip" aria-pressed="false" data-filter="published"><i className="dot dot--live"></i>Specs published <i>1</i></button>
        <button className="fchip" aria-pressed="false" data-filter="dev"><i className="dot"></i>In development <i>2</i></button>
        <button className="fchip" aria-pressed="false" data-filter="request"><i className="dot dot--grey"></i>On request <i>3</i></button>
      </div>
    
      <div className="grid" id="fleetGrid">
        
        <article className="sys sys--lead" data-model="rjs" data-status="published" data-tilt data-reveal>
          <div className="sys__media"><canvas className="sys__gl" aria-hidden="true"></canvas><span className="sys__badge">Concept render</span></div>
          <div className="sys__body">
            <p className="sys__status"><i className="dot dot--live"></i> Specifications published</p>
            <h3>RAJAS RJS-H1</h3>
            <p className="sys__tag">Five hours in the air. No runway needed.</p>
            <p className="sys__desc">A hydrogen hybrid VTOL fixed-wing UAV. Launch it from a clearing, a road or a vessel deck, then keep it on station for a full patrol shift.</p>
            <dl className="sys__spec">
              <div><dt>Payload</dt><dd>5 kg</dd></div>
              <div><dt>Endurance</dt><dd>Up to 5 h</dd></div>
              <div><dt>Take-off</dt><dd>Vertical</dd></div>
            </dl>
            <ul className="sys__roles"><li>Border &amp; LoC</li><li>Coastal watch</li><li>Convoy overwatch</li><li>Artillery spotting</li><li>Disaster mapping</li></ul>
            <a className="sys__more" href="#rjs-h1">Explore RJS-H1 <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
        </article>
    
        
        <article className="sys sys--third" data-model="heavy" data-status="dev" data-tilt data-reveal>
          <div className="sys__media"><canvas className="sys__gl" aria-hidden="true"></canvas><span className="sys__badge">Design concept</span></div>
          <div className="sys__body">
            <p className="sys__status"><i className="dot"></i> In development · design targets</p>
            <h3>RAJAS Heavy-Lift</h3>
            <p className="sys__tag">A supply run that doesn’t need a helicopter.</p>
            <p className="sys__desc">Scales the RJS-H1 layout up to carry 100 kg for up to 5 hours, to forward posts, island units and ships.</p>
            <dl className="sys__spec">
              <div><dt>Payload</dt><dd>100 kg</dd></div>
              <div><dt>Endurance</dt><dd>Up to 5 h</dd></div>
            </dl>
            <a className="sys__more" href="#heavy">Learn more <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
        </article>
    
        
        <article className="sys sys--third" data-model="isr" data-status="request" data-tilt data-reveal>
          <div className="sys__media"><canvas className="sys__gl" aria-hidden="true"></canvas><span className="sys__badge">Concept render</span></div>
          <div className="sys__body">
            <p className="sys__status"><i className="dot dot--grey"></i> Specifications on request</p>
            <h3>Hydrogen ISR drone</h3>
            <p className="sys__tag">Watch for a whole shift, not a single sortie.</p>
            <p className="sys__desc">One aircraft over the area for hours, sending live day and night video to a ground station or command centre.</p>
            <ul className="sys__roles"><li>Border &amp; LoC watch</li><li>Coastal &amp; creek</li><li>Critical infrastructure</li></ul>
            <a className="sys__more" href="#isr">Learn more <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
        </article>
    
        
        <article className="sys sys--third" data-model="loiter" data-status="request" data-tilt data-reveal>
          <div className="sys__media"><canvas className="sys__gl" aria-hidden="true"></canvas><span className="sys__badge">Illustrative form</span></div>
          <div className="sys__body">
            <p className="sys__status"><i className="dot dot--grey"></i> Specifications on request</p>
            <h3>Hydrogen loitering munition</h3>
            <p className="sys__tag">Search longer. Strike only on confirmation.</p>
            <p className="sys__desc">Hydrogen fuel-cell power for extended loiter, with a low acoustic signature. The operator confirms every target.</p>
            <a className="sys__more" href="#loiter">Learn more <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
        </article>
    
        
        <article className="sys sys--third" data-model="interceptor" data-status="dev" data-tilt data-reveal>
          <div className="sys__media"><canvas className="sys__gl" aria-hidden="true"></canvas><span className="sys__badge">Illustrative form</span></div>
          <div className="sys__body">
            <p className="sys__status"><i className="dot"></i> In development</p>
            <h3>Interceptor drone</h3>
            <p className="sys__tag">Stop the threat before it reaches the fence.</p>
            <ol className="sys__steps"><li>Detect</li><li>Launch</li><li>Track</li><li>Defeat</li></ol>
            <p className="sys__desc">Vertical launch within seconds. The operator authorises the interception before it happens.</p>
            <a className="sys__more" href="#interceptor">Learn more <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
        </article>
    
        
        <article className="sys sys--wide" data-model="sea,uuv" data-status="request" data-tilt data-reveal>
          <div className="sys__media"><canvas className="sys__gl" aria-hidden="true"></canvas><span className="sys__badge" id="seaBadge">Concept render</span></div>
          <div className="sys__body">
            <p className="sys__status"><i className="dot dot--grey"></i> Specifications on request</p>
            <h3>Maritime &amp; underwater drones</h3>
            <p className="sys__tag">Eyes above and below the waterline.</p>
            <div className="seg" role="tablist" aria-label="Maritime vehicle" data-active="sea">
              <span className="seg__thumb" aria-hidden="true"></span>
              <button role="tab" aria-selected="true" data-swap="sea">Air</button>
              <button role="tab" aria-selected="false" data-swap="uuv">Underwater</button>
            </div>
            <p className="sys__desc" data-for="sea">Maritime UAV. A version of RJS-H1 designed for deck launch and recovery from patrol vessels, with no catapult or recovery net.</p>
            <p className="sys__desc" data-for="uuv" hidden>Unmanned underwater vehicle. Air-independent fuel-cell power can give it more time submerged than a battery vehicle of the same size. For harbour security, seabed survey and infrastructure inspection.</p>
            <a className="sys__more" href="#maritime">Learn more <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
        </article>
      </div>
    
      <p className="fleet__note" data-reveal>
        Renders are illustrative concepts, not final airframes. Detailed specifications are available to authorised users on request.
        <a className="btn btn--ink btn--sm" href="#contact"><span>Request specifications</span></a>
      </p>
    </section>
  );
}
