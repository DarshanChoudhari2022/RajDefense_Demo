import { useEffect } from "react";
import Nav from "../components/Nav.jsx";
import Hero from "../components/Hero.jsx";
import Why from "../components/Why.jsx";
import Fleet from "../components/Fleet.jsx";
import Spot from "../components/Spot.jsx";
import Heritage from "../components/Heritage.jsx";
import Quality from "../components/Quality.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";

// Interaction layers (scroll scenes, 3D, form). Each module wires itself to the
// rendered DOM, so they load once after the first paint.
const layers = [
  () => import("../scripts/main.js"),
  () => import("../scripts/why.js"),
  () => import("../scripts/fleet.js"),
  () => import("../scripts/spot.js"),
  () => import("../scripts/heritage.js"),
  () => import("../scripts/quality.js"),
  () => import("../scripts/contact.js"),
];

export default function Home() {
  useEffect(() => {
    layers.forEach((load) => load());
  }, []);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Why />
        <Fleet />
        <Spot />
        <Heritage />
        <Quality />
        <Contact />
      </main>
      <Footer />
      <div className="toast" id="toast" role="status" aria-live="polite"></div>
    </>
  );
}
