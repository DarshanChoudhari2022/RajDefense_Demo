export default function Heritage() {
  return (
    <section className="heritage" id="company" aria-labelledby="her-title">
      <header className="her__head">
        <p className="kicker" data-reveal><span>05</span> Company</p>
        <h2 id="her-title" className="h2" data-reveal>We come from gas engineering</h2>
        <p className="lede lede--wide" data-reveal>
          Our parent company, Raj Process Equipments and Systems, has spent years designing plants that compress, clean and store gas at industrial scale. A fuel-cell drone is basically a small, flying gas plant.
        </p>
      </header>
    
      <div className="p2p" id="p2p" data-reveal>
        <div className="p2p__art">
          <svg viewBox="0 0 900 300" role="img" aria-label="A gas plant pipeline running into the fuel system of a drone">
            <line x1="0" y1="250" x2="900" y2="250" className="p2p__ground"/>
            
            <g className="p2p__plant">
              <rect x="60" y="112" width="64" height="138" rx="32"/>
              <rect x="150" y="142" width="64" height="108" rx="32"/>
              <rect x="240" y="112" width="64" height="138" rx="32"/>
              <path d="M92 112V100M182 142V100M272 112V100"/>
            </g>
            
            <path className="p2p__pipe" d="M92 100H600V150H640"/>
            <path className="p2p__flow" d="M92 100H600V150H640"/>
            
            <g className="p2p__air">
              <rect x="640" y="139" width="190" height="22" rx="11"/>
              <path d="M700 52L742 52L738 150L742 248L700 248L704 150Z" className="p2p__wing"/>
              <path d="M648 150L630 120M648 150L630 180" className="p2p__tail"/>
              <path d="M672 100H800M672 200H800" className="p2p__boom"/>
              <circle cx="690" cy="100" r="18"/><circle cx="782" cy="100" r="18"/>
              <circle cx="690" cy="200" r="18"/><circle cx="782" cy="200" r="18"/>
              <circle cx="622" cy="150" r="14" className="p2p__prop"/>
            </g>
            
            <g className="spot-pt" data-i="0"><circle className="ring" cx="92" cy="176" r="10"/><circle className="core" cx="92" cy="176" r="5"/></g>
            <g className="spot-pt" data-i="1"><rect className="filter" x="352" y="88" width="44" height="24" rx="6"/><circle className="ring" cx="374" cy="100" r="16"/><circle className="core" cx="374" cy="100" r="5"/></g>
            <g className="spot-pt" data-i="2"><circle className="ring" cx="480" cy="100" r="14"/><circle className="core" cx="480" cy="100" r="5"/></g>
            <g className="spot-pt" data-i="3"><path className="valve" d="M590 126h20l-20 20h20z"/><circle className="ring" cx="600" cy="136" r="16"/><circle className="core" cx="600" cy="136" r="5"/></g>
            <text x="92" y="278" className="p2p__cap" textAnchor="middle">GAS PLANT</text>
            <text x="735" y="278" className="p2p__cap" textAnchor="middle">RJS-H1 · CONCEPT</text>
          </svg>
        </div>
    
        <div className="p2p__tabs" role="tablist" aria-label="What carries over from gas plants to aircraft">
          <button role="tab" aria-selected="true" data-i="0"><i>01</i>Pressure</button>
          <button role="tab" aria-selected="false" data-i="1"><i>02</i>Purity</button>
          <button role="tab" aria-selected="false" data-i="2"><i>03</i>Leak control</button>
          <button role="tab" aria-selected="false" data-i="3"><i>04</i>Safety interlocks</button>
        </div>
        <div className="p2p__panel" aria-live="polite">
          <p data-i="0">Compressed-gas plants hold gas at industrial scale. An aircraft needs the same discipline: a pressure vessel and a regulator.</p>
          <p data-i="1" hidden>Plants clean the gas they handle. A fuel cell has a purity requirement of its own.</p>
          <p data-i="2" hidden>Every fuel system is leak-tested before it leaves the factory.</p>
          <p data-i="3" hidden>A power system that must not fail. Most drone companies have to learn these four skills from scratch.</p>
        </div>
      </div>
    
      <div className="vm">
        <article data-reveal>
          <p className="vm__k">Our vision</p>
          <p className="vm__t">To be India’s reference supplier of hydrogen-powered unmanned systems.</p>
        </article>
        <article data-reveal>
          <p className="vm__k">Our mission</p>
          <p className="vm__t">To give Indian forces aircraft that stay up longer and make less noise, designed and built in India.</p>
        </article>
      </div>
    
      <div className="stand">
        <h3 className="stand__title" data-reveal>What we stand for</h3>
        <ul className="stand__list">
          <li data-reveal><span>01</span><h4>Claims we can prove</h4><p>Every figure we publish comes from our own testing. We invite users to verify it.</p></li>
          <li data-reveal><span>02</span><h4>Indian supply chain</h4><p>We source domestically wherever it does not compromise performance.</p></li>
          <li data-reveal><span>03</span><h4>Lawful supply only</h4><p>We supply governments and authorised entities, under Indian licensing and end-user rules.</p></li>
        </ul>
      </div>
    
      <div className="visit" data-reveal>
        <div>
          <p className="visit__k"><i className="dot dot--live"></i> Pune, India</p>
          <h3>Engineering you can visit</h3>
          <p>Our design and assembly work is done in Pune. We welcome evaluation teams to see it.</p>
        </div>
        <a className="btn btn--ink" href="#contact" data-magnetic><span>Request a visit</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </div>
    </section>
  );
}
