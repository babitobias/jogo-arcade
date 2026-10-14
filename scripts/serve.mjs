// Servidor estático mínimo (sem dependências) para testes locais e E2E.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, posix } from "node:path";

const pasta = process.argv[2] || "dist";
const porta = Number(process.argv[3] || 4173);
const tipos = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8" };

createServer(async (req, res) => {
  let caminho = posix.normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (caminho.endsWith("/")) caminho += "index.html";
  try {
    const dados = await readFile(join(pasta, caminho));
    res.writeHead(200, { "Content-Type": tipos[extname(caminho)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(dados);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("não encontrado");
  }
}).listen(porta, "127.0.0.1", () => console.log(`servindo ${pasta} em http://127.0.0.1:${porta}/`));
