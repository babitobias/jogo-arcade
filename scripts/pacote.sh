#!/usr/bin/env bash
# Monta submissao/ a partir dos artefatos do build (INT-09).
set -euo pipefail
: "${SITE_URL:?defina SITE_URL}"
rm -rf submissao && mkdir -p submissao/dist
cp docs/GDD.pdf submissao/GDD.pdf
printf '%s\n' "${SITE_URL}/" > submissao/LINK_DO_JOGO.txt
unzip -q build.zip -d submissao/dist
cat > submissao/dist/LEIA-ME.txt <<'TXT'
Como jogar offline: descompacte o build.zip e abra o arquivo index.html no navegador.
Alternativa: npx serve . (dentro da pasta descompactada).
TXT
(cd submissao/dist && zip -qr ../build.zip .) && rm -rf submissao/dist
[ -f media/pitch.mp4 ] && cp media/pitch.mp4 submissao/pitch.mp4 || echo "AVISO: media/pitch.mp4 ausente"
echo "submissao/ montada"
