# Materiais de terceiros

O jogo não usa imagens, sons, músicas nem fontes externas (apenas fontes do sistema e CSS próprio).

| Item | Tipo | Autor | Link | Licença |
|------|------|-------|------|---------|
| esbuild | biblioteca (build) | Evan Wallace | https://github.com/evanw/esbuild | MIT |
| Vitest + @vitest/coverage-v8 | biblioteca (teste) | Vitest team | https://github.com/vitest-dev/vitest | MIT |
| Playwright (@playwright/test) | biblioteca (E2E) | Microsoft | https://github.com/microsoft/playwright | Apache-2.0 |
| ESLint, @eslint/js | biblioteca (lint) | OpenJS Foundation | https://github.com/eslint/eslint | MIT |
| globals | biblioteca (lint) | Sindre Sorhus | https://github.com/sindresorhus/globals | MIT |
| marked | biblioteca (GDD → HTML) | Christopher Jeffrey e colaboradores | https://github.com/markedjs/marked | MIT |

O SBOM completo (CycloneDX) é gerado a cada release em `reports/sbom.json`.
Jogos citados no GDD (Lightbot, Human Resource Machine) são apenas referências de inspiração; nenhum ativo deles é usado.
