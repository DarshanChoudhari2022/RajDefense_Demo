export default function Why() {
  return (
    <section className="why" id="technology" aria-labelledby="why-title">
      <header className="why__head">
        <p className="kicker" data-reveal><span>02</span> Technology</p>
        <h2 id="why-title" className="h2" data-reveal>Why our drones run on hydrogen</h2>
        <p className="lede lede--wide" data-reveal>
          A hydrogen fuel cell sits between a battery and a petrol engine. It is electric and quiet like the first, and it lasts several times longer.
        </p>
      </header>
    
      
      <div className="flow" id="flow">
        <ol className="flow__steps">
          <li className="step is-active" data-step="0">
            <span className="step__n">01</span>
            <h3>Battery buffer for lift</h3>
            <p>Vertical take-off needs a short burst of high power. A small battery supplies it, then recharges from the fuel cell in flight.</p>
          </li>
          <li className="step" data-step="1">
            <span className="step__n">02</span>
            <h3>Fixed wing for range</h3>
            <p>After take-off the aircraft flies on its wing like a plane. That uses far less energy than hovering.</p>
          </li>
          <li className="step" data-step="2">
            <span className="step__n">03</span>
            <h3>Fuel cell for cruise</h3>
            <p>Hydrogen from an onboard cylinder meets oxygen from the air in a PEM fuel cell. It makes steady electric power for long forward flight.</p>
          </li>
        </ol>
    
        <div className="flow__stage" aria-hidden="true">
          <div className="card card--stage">
            <div className="stage__top">
              <span className="chip"><i className="dot" id="phaseDot"></i><b id="phaseName">Vertical take-off</b></span>
              <span className="chip chip--quiet">Illustrative</span>
            </div>
    
            <svg className="route" viewBox="0 0 600 340" role="presentation">
              <defs>
                <linearGradient id="ground" x1="0" x2="1"><stop offset="0" stopColor="#14171a" stopOpacity="0"/><stop offset=".2" stopColor="#14171a" stopOpacity=".18"/><stop offset=".8" stopColor="#14171a" stopOpacity=".18"/><stop offset="1" stopColor="#14171a" stopOpacity="0"/></linearGradient>
              </defs>
              <line x1="0" y1="300" x2="600" y2="300" stroke="url(#ground)" strokeWidth="1.5"/>
              <g className="route__base">
                <path d="M60 300 V176"/>
                <path d="M60 176 C60 132 100 112 176 112"/>
                <path d="M176 112 H424"/>
                <path d="M424 112 C500 112 540 132 540 176"/>
                <path d="M540 176 V300"/>
              </g>
              <g className="route__live" fill="none" strokeLinecap="round" strokeWidth="3">
                <path d="M60 300 V176" stroke="#ff7400"/>
                <path d="M60 176 C60 132 100 112 176 112" stroke="#14171a"/>
                <path d="M176 112 H424" stroke="#268c05"/>
                <path d="M424 112 C500 112 540 132 540 176" stroke="#14171a"/>
                <path d="M540 176 V300" stroke="#ff7400"/>
              </g>
              <g className="route__ticks" fontSize="11" fill="#5f6460" letterSpacing=".06em">
                <text x="60" y="324" textAnchor="middle">LAUNCH</text>
                <text x="300" y="92" textAnchor="middle">CRUISE · FUEL CELL</text>
                <text x="540" y="324" textAnchor="middle">LAND</text>
              </g>
              <g id="craft" className="craft">
                <circle r="16" className="craft__halo"/>
                <circle r="6" className="craft__core"/>
              </g>
            </svg>
    
            <div className="meters">
              <div className="meter">
                <span className="meter__label">Battery</span>
                <span className="meter__track"><i id="mBat"></i></span>
              </div>
              <div className="meter">
                <span className="meter__label">Fuel cell</span>
                <span className="meter__track meter__track--green"><i id="mFc"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      
      <div className="trio">
        <article className="tile" data-tilt data-reveal>
          <p className="tile__tag">Battery</p>
          <h3>Simple, but short</h3>
          <p>A battery carries limited energy for its weight. With a useful sensor on board, most battery drones fly for an hour or less.</p>
        </article>
        <article className="tile" data-tilt data-reveal>
          <p className="tile__tag">Petrol engine</p>
          <h3>Longer, but loud</h3>
          <p>Petrol drones fly longer. They are also noisy, run hot and need regular engine maintenance.</p>
        </article>
        <article className="tile tile--hero" data-tilt data-reveal>
          <p className="tile__tag"><i className="dot dot--live"></i> Hydrogen fuel cell</p>
          <h3>Electric, and lasting</h3>
          <p>No combustion and no moving engine. The fuel cell makes electricity, water vapour and a little heat, and electric motors do the flying.</p>
          <p className="tile__big">Up to 5 hours</p>
        </article>
      </div>
    
      
      <div className="field">
        <h3 className="field__title" data-reveal>What this means in the field</h3>
        <ul className="field__grid">
          <li data-reveal>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>
            <h4>Endurance</h4>
            <p>Up to 5 hours with a 5 kg payload on the RAJAS RJS-H1.</p>
          </li>
          <li data-reveal>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 10v4"/></svg>
            <h4>Low signature</h4>
            <p>Electric motors and no exhaust flame make it quieter and cooler than an engine-driven drone.</p>
          </li>
          <li data-reveal>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h13l-3-3M20 15H7l3 3"/></svg>
            <h4>Fast turnaround</h4>
            <p>A hydrogen cylinder is swapped in minutes. Recharging a large battery pack takes hours.</p>
          </li>
          <li data-reveal>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/></svg>
            <h4>Simple maintenance</h4>
            <p>No pistons, carburettor or spark plugs to service.</p>
          </li>
        </ul>
        <p className="safety" data-reveal>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>
          Every fuel system is leak-tested before it leaves the factory. Ground handling follows the gas-plant safety practice of our parent company.
        </p>
      </div>
    </section>
  );
}
