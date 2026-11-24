import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { POST } from "../api/enquiry.js";
import "./build.mjs";

const root = fileURLToPath(new URL("../dist/", import.meta.url)).replace(
  /[\\/]$/,
  "",
);
const port = Number(process.env.PORT || 4175);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
};
const origin = "http://127.0.0.1:" + port;
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, origin);
    if (url.pathname === "/api/enquiry") {
      if (request.method !== "POST") {
        response.writeHead(405, { Allow: "POST" }).end();
        return;
      }
      const result = await POST(
        new Request(url, {
          method: request.method,
          headers: request.headers,
          body: Readable.toWeb(request),
          duplex: "half",
        }),
      );
      response.writeHead(result.status, Object.fromEntries(result.headers));
      response.end(await result.text());
      return;
    }
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    const path = decodeURIComponent(url.pathname).replace(/\/$/, "");
    let file = resolve(
      root,
      "." + (path || "/index") + (extname(path) ? "" : ".html"),
    );
    let info = file.startsWith(root + sep)
      ? await stat(file).catch(() => null)
      : null;
    let status = 200;
    if (!info?.isFile() || path === "/404") {
      file = resolve(root, "404.html");
      info = await stat(file);
      status = 404;
    }
    const headers = {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Content-Length": info.size,
    };
    if (path === "/thank-you") headers["X-Robots-Tag"] = "noindex";
    let options;
    if (status === 200 && extname(file) === ".mp4") {
      headers["Accept-Ranges"] = "bytes";
      const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range || "");
      if (range) {
        const start = Number(range[1]);
        const end = range[2]
          ? Math.min(info.size - 1, Number(range[2]))
          : info.size - 1;
        if (start > end) {
          response
            .writeHead(416, { "Content-Range": "bytes */" + info.size })
            .end();
          return;
        }
        status = 206;
        options = { start, end };
        headers["Content-Range"] =
          "bytes " + start + "-" + end + "/" + info.size;
        headers["Content-Length"] = end - start + 1;
      }
    }
    response.writeHead(status, headers);
    if (request.method === "HEAD") response.end();
    else createReadStream(file, options).pipe(response);
  } catch {
    if (!response.headersSent) response.writeHead(400);
    response.end();
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log("Raj Defence preview at " + origin),
);
