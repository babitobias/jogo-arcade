// Build reprodutível: npm ci && npm run build -> dist/
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { exigirConteudoValido } from "../src/core/content.js";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const conteudo = JSON.parse(readFileSync("src/content/levels.json", "utf8"));
exigirConteudoValido(conteudo); // JSON inválido quebra o build

let sha = process.env.GITHUB_SHA?.slice(0, 7);
if (!sha) {
  try { sha = execSync("git rev-parse --short=7 HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); }
  catch { sha = "local"; }
}

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  minify: true,
  format: "iife", // roda com file:// (offline), sem módulos nem fetch
  target: "es2020",
  outfile: "dist/app.js",
  define: { __VERSAO__: JSON.stringify(pkg.version), __SHA__: JSON.stringify(sha) },
  legalComments: "none",
});

cpSync("src/index.html", "dist/index.html");
cpSync("src/estilo.css", "dist/estilo.css");
writeFileSync(
  "dist/version.json",
  JSON.stringify({ versao: pkg.version, sha, data: new Date().toISOString() }, null, 2) + "\n",
);
console.log(`build ok: v${pkg.version} (${sha})`);
