# Caça-Bug — Desafio Arcade (DevOps)

Jogo educativo em que o jogador acha a linha com defeito em trechos de código. Entregue por esteira CI/CD no GitHub (Actions + Pages).

## Rodar localmente

```bash
npm ci
npm run build && npm run serve   # http://127.0.0.1:4173/
npm test                         # unidade + integração
npm run test:e2e                 # Playwright (instale antes: npx playwright install chromium)
```

Offline: descompacte `build.zip` e abra `index.html`.

## Branching

GitHub Flow: `feature/*` curtas → pull request (1 revisão + CI verde) → `main`. Commits no padrão Conventional Commits.
Versões com tags anotadas `vX.Y.Z` (a tag deve bater com `package.json`).

## Esteira

| Workflow | Função |
|----------|--------|
| `esteira.yml` | CI, homologação (`/hml/`), produção canário (`/releases/<sha>/`), pacote de submissão, release por tag |
| `rollback.yml` | Rollback manual (workflow_dispatch) |
| `monitor.yml` | Sondas a cada 15 min, alertas como Issues, métricas DORA |

## Configuração inicial do repositório

1. Repositório **público**; Settings → Pages → Deploy from a branch → `gh-pages`.
2. `./scripts/setup-repo.sh dono/repo` (label `alerta`, branch `observabilidade`, proteção da `main`).
3. Environments `homologacao` e `producao` (este com revisor obrigatório).
4. Variável `SITE_URL` (ex.: `https://usuario.github.io/jogo-arcade`, sem barra final). Opcionais: `PRAZO`, `OBSERVACAO_SEGUNDOS`.
5. Ativar Dependabot e cada integrante "assistir" o repositório (notificações dos alertas).
6. Colocar o vídeo em `media/pitch.mp4` (até 90 s).

## Dados coletados (LGPD)

Nenhum. O jogo não coleta dado pessoal nem telemetria. O navegador guarda apenas qual versão da release a sessão recebeu (`localStorage`, chave `versao`).
