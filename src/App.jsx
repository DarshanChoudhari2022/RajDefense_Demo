import Home from "./pages/Home.jsx";
import { Privacy, NotFound } from "./pages/Plain.jsx";

// Pages are separate documents (plain links, full load), so each page's
// interaction scripts start fresh. No client router needed.
export default function App() {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return <Home />;
  if (path === "/privacy") return <Privacy />;
  return <NotFound />;
}
