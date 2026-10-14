#!/usr/bin/env bash
# Funções comuns para escrever no branch gh-pages (usado por publicar.sh e rollout.sh).
set -euo pipefail

PAGES_DIR=""

clonar_pages() {
  : "${GITHUB_REPOSITORY:?}" "${GITHUB_TOKEN:?}"
  PAGES_DIR=$(mktemp -d)
  local url="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
  if git ls-remote --exit-code --heads "$url" gh-pages >/dev/null 2>&1; then
    git clone --quiet --branch gh-pages --single-branch "$url" "$PAGES_DIR"
  else
    git init --quiet -b gh-pages "$PAGES_DIR"
    git -C "$PAGES_DIR" remote add origin "$url"
    echo '{ "estavel": null, "anterior": null, "canario": null, "percentual": 0 }' > "$PAGES_DIR/rollout.json"
  fi
  git -C "$PAGES_DIR" config user.name "${GITHUB_ACTOR:-esteira}"
  git -C "$PAGES_DIR" config user.email "${GITHUB_ACTOR:-esteira}@users.noreply.github.com"
}

# Mantém o carregador e o painel sempre na versão da main.
atualizar_fixos() {
  cp pages/index.html "$PAGES_DIR/index.html"
  mkdir -p "$PAGES_DIR/status"
  cp pages/status/index.html "$PAGES_DIR/status/index.html"
  touch "$PAGES_DIR/.nojekyll"
}

commitar_e_enviar() {
  local mensagem=$1
  git -C "$PAGES_DIR" add -A
  if git -C "$PAGES_DIR" diff --cached --quiet; then echo "nada a publicar"; return 0; fi
  git -C "$PAGES_DIR" commit --quiet -m "$mensagem"
  for tentativa in 1 2 3; do
    if git -C "$PAGES_DIR" push --quiet origin gh-pages; then echo "publicado: $mensagem"; return 0; fi
    git -C "$PAGES_DIR" pull --quiet --rebase origin gh-pages || true
    sleep $((tentativa * 3))
  done
  echo "falha ao enviar para gh-pages" >&2
  return 1
}
