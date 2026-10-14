// Métricas DORA a partir da API do GitHub. Uso: GITHUB_TOKEN=... GITHUB_REPOSITORY=dono/repo node scripts/dora.mjs [saida.json]
import { writeFileSync } from "node:fs";

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
if (!repo || !token) { console.error("defina GITHUB_REPOSITORY e GITHUB_TOKEN"); process.exit(1); }
const BASELINE_LEAD_TIME_DIAS = 11; // linha de base da Carparts

async function api(caminho) {
  const r = await fetch(`https://api.github.com/repos/${repo}${caminho}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  if (!r.ok) throw new Error(`${caminho}: HTTP ${r.status}`);
  return r.json();
}

const horas = (ms) => ms / 36e5;
const media = (v) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : null);
const arred = (n) => (n === null ? null : Math.round(n * 100) / 100);

const { workflow_runs: runs } = await api("/actions/workflows/esteira.yml/runs?branch=main&event=push&per_page=100");
const concluidas = runs.filter((r) => r.status === "completed");
const sucessos = concluidas.filter((r) => r.conclusion === "success");

// 1) Frequência de deploy: execuções da esteira que chegaram à produção, por semana.
const datas = sucessos.map((r) => new Date(r.updated_at).getTime());
const semanas = datas.length ? Math.max(1, (Math.max(...datas) - Math.min(...datas)) / (7 * 864e5)) : 1;
const frequenciaPorSemana = sucessos.length / semanas;

// 2) Lead time: do commit até a produção.
const leadTimes = sucessos.map((r) => horas(new Date(r.updated_at) - new Date(r.head_commit.timestamp)));

// 3) Taxa de falha: deploys seguidos de rollback (commits "rollout: rollback" no gh-pages).
let rollbacks = 0;
try {
  const commits = await api("/commits?sha=gh-pages&per_page=100");
  rollbacks = commits.filter((c) => c.commit.message.startsWith("rollout: rollback")).length;
} catch { /* gh-pages ainda não existe */ }
const totalDeploys = sucessos.length + rollbacks;
const taxaFalha = totalDeploys ? rollbacks / totalDeploys : 0;

// 4) Tempo de recuperação: abertura até fechamento das Issues de alerta.
const issues = await api("/issues?labels=alerta&state=closed&per_page=100");
const recuperacoes = issues.filter((i) => i.closed_at).map((i) => horas(new Date(i.closed_at) - new Date(i.created_at)));

const resultado = {
  gerado_em: new Date().toISOString(),
  frequencia_deploy_por_semana: arred(frequenciaPorSemana),
  lead_time_horas: arred(media(leadTimes)),
  lead_time_baseline_carparts_horas: BASELINE_LEAD_TIME_DIAS * 24,
  taxa_falha_mudanca: arred(taxaFalha),
  tempo_recuperacao_horas: arred(media(recuperacoes)),
  amostra: { deploys: sucessos.length, rollbacks, alertas_fechados: recuperacoes.length },
};
console.log(JSON.stringify(resultado, null, 2));
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(resultado, null, 2) + "\n");
