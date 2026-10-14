#!/usr/bin/env bash
# Reproduz a triagem técnica (item 7.1 do regulamento) antes da entrega.
set -uo pipefail
PASTA=${1:-submissao}
PRAZO=${PRAZO:-"2026-10-09T19:00:00-03:00"}   # ajuste: início da aula de entrega
falhas=0
ok(){ echo "  [OK]    $1"; }
nok(){ echo "  [FALHA] $1"; falhas=$((falhas+1)); }

echo "1. Prazo"
[ "$(date +%s)" -le "$(date -d "$PRAZO" +%s)" ] && ok "dentro do prazo" || nok "prazo vencido ($PRAZO)"

echo "2. Squad completo"
n=$(grep -cE '^\| *[^|[:space:]-]' SQUAD.md || true)   # linhas de tabela com conteúdo (cabeçalho + 4)
[ "$n" -eq 5 ] && ok "4 integrantes + cabeçalho" || nok "SQUAD.md com $n linhas de tabela (esperado 5)"

echo "3. GDD"
if pdfinfo "$PASTA/GDD.pdf" >/dev/null 2>&1; then
  ok "GDD.pdf abre"
  texto=$(pdftotext "$PASTA/GDD.pdf" - 2>/dev/null || true)
  for secao in "Premissa" "Gênero" "Mecânicas" "Referências"; do
    echo "$texto" | grep -qi "$secao" && ok "seção $secao" || nok "seção $secao ausente"
  done
else
  nok "GDD.pdf ausente ou corrompido"
fi

echo "4. Build pública"
URL=$(tr -d '[:space:]' < "$PASTA/LINK_DO_JOGO.txt")
[ "$(curl -s -L -o /dev/null -w '%{http_code}' "$URL")" = "200" ] && ok "$URL responde 200" || nok "$URL fora do ar"
BASE_URL="$URL" npx playwright test tests/e2e/smoke.spec.js >/dev/null 2>&1 && ok "smoke passou" || nok "smoke falhou"

echo "5. Build offline"
unzip -l "$PASTA/build.zip" 2>/dev/null | grep -q 'index.html' && ok "build.zip com index.html" || nok "build.zip inválido"

echo "6. Vídeo"
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$PASTA/pitch.mp4" 2>/dev/null | cut -d. -f1)
{ [ -n "${d:-}" ] && [ "$d" -le 90 ]; } && ok "pitch.mp4 com ${d}s" || nok "pitch.mp4 ausente ou com ${d:-?}s (máx. 90)"

echo "7. Manifesto"
if (cd "$PASTA" && sha256sum GDD.pdf LINK_DO_JOGO.txt build.zip pitch.mp4 > MANIFESTO.sha256 2>/dev/null); then
  ok "MANIFESTO.sha256 gerado"
else
  nok "manifesto não gerado (arquivo faltando)"
fi

[ "$falhas" -eq 0 ] && echo "TRIAGEM APROVADA" || { echo "TRIAGEM REPROVADA: $falhas falha(s)"; exit 1; }
