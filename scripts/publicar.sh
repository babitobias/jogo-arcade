#!/usr/bin/env bash
# Uso: publicar.sh hml <build.zip>
#      publicar.sh release <build.zip> <sha7>
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/lib-pages.sh

destino=${1:?destino: hml|release}
zip=$(realpath "${2:?build.zip}")
sha=${3:-}
run="${GITHUB_RUN_ID:-manual}"

clonar_pages
atualizar_fixos

case "$destino" in
  hml)
    rm -rf "$PAGES_DIR/hml"
    mkdir -p "$PAGES_DIR/hml"
    unzip -q "$zip" -d "$PAGES_DIR/hml"
    commitar_e_enviar "publish: hml ${GITHUB_SHA:-?} por ${GITHUB_ACTOR:-manual} (run $run)"
    ;;
  release)
    : "${sha:?sha da release}"
    if [ -d "$PAGES_DIR/releases/$sha" ]; then
      echo "releases/$sha já existe (releases são imutáveis); mantendo."
    else
      mkdir -p "$PAGES_DIR/releases/$sha"
      unzip -q "$zip" -d "$PAGES_DIR/releases/$sha"
    fi
    commitar_e_enviar "publish: release $sha por ${GITHUB_ACTOR:-manual} (run $run)"
    ;;
  *) echo "destino inválido: $destino" >&2; exit 2 ;;
esac
