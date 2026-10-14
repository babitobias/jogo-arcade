# Caça-Bug — Game Design Document

**Versão:** ver `package.json` · **Repositório:** [PREENCHER link] · **Squad:** ver `SQUAD.md`

## 1. Premissa

Muita gente desiste de tecnologia antes de começar porque acha que precisa de instalação, internet rápida e vocabulário técnico.
**Caça-Bug** ensina a ler código jogando: o jogador vê um trecho curto com um defeito e precisa clicar na linha errada.
Cada erro vem com uma explicação em linguagem simples.

- **Problema atacado:** acesso inicial à educação em tecnologia (sem instalação, funciona no navegador do celular e roda offline).
- **Público-alvo:** iniciantes a partir de 14 anos, estudantes de cursos técnicos e de graduação em TI.

## 2. Gênero e plataforma

Puzzle educativo de leitura de código. Web desktop e web mobile (HTML5, sem instalação), com pacote offline (`build.zip`).

## 3. Mecânicas-core

- **Loop principal:** ler o trecho, escolher a linha com defeito, receber feedback e explicação, continuar.
- **Pontuação:** 100 pontos por acerto, mais 20 por acerto seguido (máximo de +100).
- **Vitória:** concluir as 3 fases. **Derrota:** perder as 3 vidas (cada erro custa uma).
- **Progressão:** 3 fases de 3 desafios, de lógica básica até o mundo DevOps.
- **Patentes:** Mestre dos Bugs, Caçador Sênior, Caçador Júnior, Estagiário de Plantão.

| Fase | O que o jogador aprende |
|------|-------------------------|
| 1 · Lógica básica | Comparação x atribuição, laços, índices de lista |
| 2 · Web e dados | Estrutura de HTML, sintaxe de JSON, constantes |
| 3 · Mundo DevOps | Fluxo de branches no Git, ordem dos passos no CI, segredos fora do código |

## 4. Referências

- Lightbot (Lightbot Inc.): programação por desafios curtos. Apenas inspiração de mecânica.
- Human Resource Machine (Tomorrow Corporation): puzzles de lógica com progressão. Apenas inspiração.
- MDN Web Docs (Mozilla), CC BY-SA: base para as explicações de HTML, JSON e JavaScript.
- Conventional Commits 1.0.0 e Versionamento Semântico: base do fluxo de Git descrito na fase 3.

Nenhum ativo (imagem, som, texto) dessas obras é reutilizado.

## 5. Telas

1. **Menu:** título, frase de proposta e botão Jogar.
2. **HUD / jogo:** fase, tema, pontos, vidas, sequência e as linhas de código clicáveis.
3. **Feedback:** linha correta destacada em verde, linha errada em vermelho e explicação.
4. **Fase concluída:** resumo e botão de próxima fase.
5. **Fim:** resultado, patente, pontos e botão Jogar de novo.

> [PREENCHER: incluir os wireframes do Stitch (Aula 04) das telas acima]

## 6. Esteira

Commit → Pull Request (revisão + CI) → `main` → GitHub Actions (lint, testes, gitleaks, npm audit, SBOM, build, GDD.pdf) →
homologação em `/hml/` (E2E) → aprovação manual → produção em `/releases/<sha>/` com canário de 10% → smoke → promoção.
Rollback troca o ponteiro `estavel` no `rollout.json`. Monitoramento a cada 15 minutos, com alertas como Issues e painel em `/status/`.

## 7. Privacidade (LGPD)

O jogo não coleta nem pede dado pessoal. Não há ranking nem telemetria.
