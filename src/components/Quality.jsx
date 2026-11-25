export default function Quality() {
  return (
    <section className="quality" id="quality" aria-labelledby="q-title">
      <div className="q__top">
        <header className="q__head">
          <p className="kicker" data-reveal><span>06</span> Quality &amp; compliance</p>
          <h2 id="q-title" className="h2" data-reveal>Built to be inspected</h2>
          <p className="lede lede--wide" data-reveal>Defence customers don’t take a supplier’s word for it, and they shouldn’t.</p>
        </header>
    
        <div className="insp" id="qSheet" data-reveal>
          <div className="insp__bar">
            <span className="insp__t">Inspection sheet</span>
            <span className="pill"><i className="dot dot--live"></i> Open to customer inspectors</span>
          </div>
          <ul className="checks">
            <li>
              <svg className="tick" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14"/><path d="M9.5 16.5l4.5 4.5 8.5-9.5"/></svg>
              <div><h3>Processes written down</h3><p>Our processes are documented, not assumed.</p></div>
            </li>
            <li>
              <svg className="tick" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14"/><path d="M9.5 16.5l4.5 4.5 8.5-9.5"/></svg>
              <div><h3>Records open to inspectors</h3><p>Our records are open to customer inspectors.</p></div>
            </li>
            <li>
              <svg className="tick" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14"/><path d="M9.5 16.5l4.5 4.5 8.5-9.5"/></svg>
              <div><h3>Tested to your standard</h3><p>Products are tested to the standard the user specifies.</p></div>
            </li>
          </ul>
          <p className="insp__foot"><b id="qCount">0</b> of 3 open to inspection</p>
        </div>
      </div>
    
      <div className="q__pair">
        <article className="gate" data-reveal data-tilt>
          <p className="gate__k">Export</p>
          <h3>Authorised for each export</h3>
          <p>Exports of Munitions List items require an authorisation from the Department of Defence Production, Ministry of Defence, which we obtain for each export.</p>
          <ol className="flow2" aria-label="Export steps">
            <li>Export order</li><li className="arrow" aria-hidden="true"></li><li>MoD authorisation</li>
          </ol>
        </article>
        <article className="gate" data-reveal data-tilt>
          <p className="gate__k">Responsible supply</p>
          <h3>Verified buyers only</h3>
          <p>We do not sell to individuals or unverified buyers. Every order is checked against end-user documentation.</p>
          <ol className="flow2" aria-label="Order steps">
            <li>Order</li><li className="arrow" aria-hidden="true"></li><li>End-user check</li><li className="arrow" aria-hidden="true"></li><li>Supply</li>
          </ol>
        </article>
      </div>
    
      <div className="q__cert" data-reveal>
        <div>
          <p className="gate__k">Certifications and approvals</p>
          <h3>Available on request</h3>
        </div>
        <a className="btn btn--ink" href="#contact" data-magnetic><span>Request documents</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </div>
    </section>
  );
}
