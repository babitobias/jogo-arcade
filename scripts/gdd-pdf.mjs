// docs/gdd.md -> docs/GDD.pdf (marked + Chromium do Playwright, sem Pandoc/LaTeX)
import { readFileSync, writeFileSync } from "node:fs";
import { marked } from "marked";
import { chromium } from "@playwright/test";

const md = readFileSync("docs/gdd.md", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>
body{font-family:system-ui,Arial,sans-serif;line-height:1.5;max-width:780px;margin:0 auto;color:#111}
h1,h2,h3{color:#0b3d91} table{border-collapse:collapse;width:100%} th,td{border:1px solid #999;padding:4px 8px;text-align:left}
code,pre{background:#f2f2f2;font-family:Consolas,monospace} pre{padding:8px;overflow:auto}
</style></head><body>${marked.parse(md)}
<hr><p><small>GDD v${pkg.version} · gerado pela esteira em ${new Date().toISOString().slice(0, 10)}</small></p></body></html>`;

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
await pagina.setContent(html);
const pdf = await pagina.pdf({ format: "A4", margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" } });
await navegador.close();
writeFileSync("docs/GDD.pdf", pdf);
console.log("docs/GDD.pdf gerado");
