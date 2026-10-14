#!/usr/bin/env bash
# Configuração única do repositório (requer gh CLI autenticado e permissão de admin).
# Uso: ./scripts/setup-repo.sh dono/repositorio
set -euo pipefail
R=${1:?dono/repositorio}
gh label create alerta --color D93F0B --description "Alerta do monitoramento" -R "$R" 2>/dev/null || true

# Branch observabilidade (dados das sondas)
tmp=$(mktemp -d); git init -q -b observabilidade "$tmp"
mkdir -p "$tmp/status"; echo "data,alvo,codigo,tempo" > "$tmp/status/sondas.csv"
git -C "$tmp" add -A && git -C "$tmp" -c user.name=setup -c user.email=setup@local commit -qm "chore: inicia observabilidade"
git -C "$tmp" push -q "https://github.com/$R.git" observabilidade || echo "branch observabilidade já existe?"

# Proteção da main: PR com 1 revisão + CI verde
gh api -X PUT "repos/$R/branches/main/protection" --input - <<JSON
{ "required_status_checks": { "strict": true, "contexts": ["ci"] },
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 1 },
  "restrictions": null }
JSON
echo "Falta (manual): Settings > Pages (gh-pages), environments homologacao e producao (revisor), variável SITE_URL, Dependabot."
