// Servidor estático mínimo (sem dependências) para testes locais e E2E.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const pasta = process.argv[2] || "dist";
const porta = Number(process.argv[3] || 4173);
const tipos = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

createServer(async (req, res) => {
  const caminho = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  const arquivo = join(pasta, caminho.endsWith("/") ? caminho + "index.html" : caminho);
  try {
    const dados = await readFile(arquivo);
    res.writeHead(200, { "Content-Type": tipos[extname(arquivo)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(dados);
  } catch {
    res.writeHead(404);
    res.end("não encontrado");
  }
}).listen(porta, "127.0.0.1", () => console.log(`servindo ${pasta} em http://127.0.0.1:${porta}/`));
