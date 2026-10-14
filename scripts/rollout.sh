#!/usr/bin/env bash
# Controla o rollout.json no branch gh-pages.
#   rollout.sh canario <sha> <percentual>   abre o canário (1ª publicação vira estável)
#   rollout.sh promover                     canário vira estável (100%)
#   rollout.sh rollback [motivo]            descarta o canário ou volta estável -> anterior
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/lib-pages.sh

acao=${1:?ação}
clonar_pages
atualizar_fixos
arq="$PAGES_DIR/rollout.json"
quem="${GITHUB_ACTOR:-manual}"
run="${GITHUB_RUN_ID:-manual}"
editar() { local tmp; tmp=$(mktemp); jq "$1" "$arq" > "$tmp" && mv "$tmp" "$arq"; }

case "$acao" in
  canario)
    sha=${2:?sha}; pct=${3:?percentual}
    if [ "$(jq -r '.estavel' "$arq")" = "null" ]; then
      editar ".estavel=\"$sha\" | .canario=null | .percentual=0"
      msg="rollout: primeira versão estável $sha por $quem (run $run)"
    else
      editar ".canario=\"$sha\" | .percentual=$pct"
      msg="rollout: canário $sha a ${pct}% por $quem (run $run)"
    fi ;;
  promover)
    canario=$(jq -r '.canario' "$arq")
    if [ "$canario" = "null" ]; then echo "sem canário para promover"; exit 0; fi
    editar '.anterior=.estavel | .estavel=.canario | .canario=null | .percentual=0'
    msg="rollout: promovido $canario a estável por $quem (run $run)" ;;
  rollback)
    motivo=${2:-sem motivo informado}
    if [ "$(jq -r '.canario' "$arq")" != "null" ]; then
      editar '.canario=null | .percentual=0'
      msg="rollout: rollback do canário por $quem (run $run): $motivo"
    elif [ "$(jq -r '.anterior' "$arq")" != "null" ]; then
      editar '. as $o | .estavel=$o.anterior | .anterior=$o.estavel | .percentual=0'
      msg="rollout: rollback estável -> anterior por $quem (run $run): $motivo"
    else
      echo "nada para reverter" >&2; exit 1
    fi ;;
  *) echo "ação inválida: $acao" >&2; exit 2 ;;
esac

cat "$arq"
commitar_e_enviar "$msg"
