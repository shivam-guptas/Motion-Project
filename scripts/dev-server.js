import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { URL } from "node:url";

const port = Number(process.env.PORT || 5173);
const root = process.cwd();

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".wasm": "application/wasm",
};

function safeResolve(urlPath) {
  // Remove query/hash safely
  const cleaned = new URL(urlPath, `http://localhost:${port}`).pathname;

  // Default route
  let reqPath = cleaned === "/" ? "/index.html" : cleaned;

  // If someone requests a folder, try index.html inside it
  if (reqPath.endsWith("/")) reqPath += "index.html";

  // Normalize + prevent path traversal
  const resolved = path.resolve(root, "." + reqPath);
  if (!resolved.startsWith(root)) return null;

  return resolved;
}

const server = http.createServer((req, res) => {
  const filePath = safeResolve(req.url || "/");
  if (!filePath) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Dev server running on http://localhost:${port}`);
});