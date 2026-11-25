import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { Readable } from "node:stream";

// Serves api/enquiry.js (a Vercel function) during `npm run dev` and `npm run preview`.
function enquiryApi() {
  const handler = async (req, res, next) => {
    if (!req.url?.startsWith("/api/enquiry")) return next();
    if (req.method !== "POST") return void res.writeHead(405, { Allow: "POST" }).end();
    const { POST } = await import("./api/enquiry.js");
    const origin = `http://${req.headers.host}`;
    const result = await POST(new Request(new URL(req.url, origin), {
      method: "POST", headers: req.headers, body: Readable.toWeb(req), duplex: "half",
    }));
    res.writeHead(result.status, Object.fromEntries(result.headers));
    res.end(await result.text());
  };
  return {
    name: "enquiry-api",
    configureServer(s) { s.middlewares.use(handler); },
    configurePreviewServer(s) { s.middlewares.use(handler); },
  };
}

// `/privacy` and unknown paths fall back to index.html; React picks the page.
export default defineConfig({
  plugins: [react(), enquiryApi()],
  server: { port: 4175, host: "127.0.0.1" },
  preview: { port: 4175, host: "127.0.0.1" },
  build: { chunkSizeWarningLimit: 800 },
});
