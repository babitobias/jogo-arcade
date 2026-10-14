#!/usr/bin/env bash
# Espera uma URL responder 200 (propagação do GitHub Pages). Uso: aguardar.sh <url> [timeout_s]
set -euo pipefail
url=${1:?url}; limite=${2:-300}; inicio=$(date +%s)
until [ "$(curl -s -L -o /dev/null -w '%{http_code}' "$url")" = "200" ]; do
  [ $(( $(date +%s) - inicio )) -ge "$limite" ] && { echo "timeout esperando $url" >&2; exit 1; }
  sleep 10
done
echo "$url respondeu 200"
