export default function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="c-title">
      <div className="c__grid">
        <header className="c__head">
          <p className="kicker" data-reveal><span>07</span> Contact</p>
          <h2 id="c-title" className="h2" data-reveal>Talk to our team</h2>
          <p className="lede lede--wide" data-reveal>
            We work with the armed forces, central armed police forces, state police, defence PSUs and authorised integrators. Tell us about your requirement and our team will get back to you.
          </p>
          <ul className="aud" data-reveal aria-label="Who we work with">
            <li>Armed forces</li><li>CAPFs</li><li>State police</li><li>Defence PSUs</li><li>Authorised integrators</li>
          </ul>
          <p className="c__note" data-reveal>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>
            Enquiries are for governments and authorised entities. Please use an official government or company email.
          </p>
        </header>
    
        <div className="c__card" id="cCard" data-reveal>
          <form id="enquiry" noValidate autoComplete="on">
            <div className="row">
              <label className="f"><input name="organisation" type="text" placeholder=" " required maxLength="120" autoComplete="organization" /><span>Organisation</span><em className="msg"></em></label>
              <label className="f"><input name="name" type="text" placeholder=" " required maxLength="100" autoComplete="name" /><span>Name</span><em className="msg"></em></label>
            </div>
            <div className="row">
              <label className="f"><input name="designation" type="text" placeholder=" " required maxLength="100" autoComplete="organization-title" /><span>Designation</span><em className="msg"></em></label>
              <label className="f"><input name="phone" type="tel" placeholder=" " maxLength="40" autoComplete="tel" /><span>Phone <small>(optional)</small></span><em className="msg"></em></label>
            </div>
            <label className="f"><input name="email" type="email" placeholder=" " required maxLength="200" autoComplete="email" /><span>Official email <small>(government / company domain)</small></span><em className="msg"></em></label>
    
            <label className="f f--select">
              <select name="interest" required defaultValue="">
                <option value="" disabled hidden></option>
                <option>RAJAS RJS-H1</option>
                <option>RAJAS Heavy-Lift (in development)</option>
                <option>Hydrogen loitering munition</option>
                <option>Hydrogen ISR drone</option>
                <option>Maritime &amp; underwater drones</option>
                <option>Interceptor drone (in development)</option>
                <option>Engineering visit</option>
                <option>Quality documentation</option>
                <option>Something else</option>
              </select>
              <span>Product of interest</span>
              <svg className="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
              <em className="msg"></em>
            </label>
    
            <label className="f f--area"><textarea name="message" placeholder=" " required rows="5" maxLength="1800"></textarea><span>Requirement</span><b className="count" aria-hidden="true">0 / 1800</b><em className="msg"></em></label>
    
            <div hidden><label>Website<input name="website" tabIndex="-1" autoComplete="off" /></label></div>
    
            <label className="check">
              <input type="checkbox" name="authorised" required />
              <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i>
              <span>I confirm this enquiry is on behalf of a government or authorised entity.</span>
              <em className="msg"></em>
            </label>
    
            <button className="btn btn--ink btn--send" type="submit"><span className="btn__t">Send enquiry</span><span className="btn__spin" aria-hidden="true"></span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
            <p className="c__fine">We use your details only to reply to this enquiry. <a href="/privacy">Privacy notice</a></p><p className="c__err" id="sendErr" role="alert" hidden></p>
          </form>
    
          <div className="done" id="done" hidden role="status">
            <svg className="done__tick" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28"/><path d="M20 33l8 8 16-18"/></svg>
            <h3>Thank you</h3>
            <p>Our team will get back to you.</p>
            <button className="btn btn--ghost" type="button" id="again"><span>Send another enquiry</span></button>
          </div>
        </div>
      </div>
    </section>
  );
}
