// Regras puras do jogo "Caça-Bug". Nenhuma dependência de DOM: tudo testável.
export const VIDAS_INICIAIS = 3;
export const PONTOS_BASE = 100;
export const BONUS_POR_SEQUENCIA = 20;
export const BONUS_MAXIMO_SEQUENCIA = 5;

/** Pontos de um acerto, dada a sequência de acertos anteriores. */
export function calcularPontos(sequencia) {
  const s = Math.max(0, Math.min(sequencia, BONUS_MAXIMO_SEQUENCIA));
  return PONTOS_BASE + BONUS_POR_SEQUENCIA * s;
}

export function totalDesafios(conteudo) {
  return conteudo.fases.reduce((soma, fase) => soma + fase.desafios.length, 0);
}

export function criarJogo() {
  return {
    status: "jogando", // jogando | feedback | fase_concluida | vitoria | derrota
    fase: 0,
    desafio: 0,
    pontos: 0,
    vidas: VIDAS_INICIAIS,
    sequencia: 0,
    acertos: 0,
    erros: 0,
    ultimo: null,
  };
}

export function desafioAtual(estado, conteudo) {
  return conteudo.fases[estado.fase].desafios[estado.desafio];
}

/** Registra a resposta (índice da linha escolhida). Não avança de desafio. */
export function responder(estado, conteudo, linha) {
  if (estado.status !== "jogando") return estado;
  const desafio = desafioAtual(estado, conteudo);
  const correto = linha === desafio.bug;
  const ganho = correto ? calcularPontos(estado.sequencia) : 0;
  return {
    ...estado,
    status: "feedback",
    pontos: estado.pontos + ganho,
    vidas: correto ? estado.vidas : estado.vidas - 1,
    sequencia: correto ? estado.sequencia + 1 : 0,
    acertos: estado.acertos + (correto ? 1 : 0),
    erros: estado.erros + (correto ? 0 : 1),
    ultimo: { linha, correto, ganho, explicacao: desafio.explicacao, bug: desafio.bug },
  };
}

/** Avança depois do feedback ou da tela de fase concluída. */
export function continuar(estado, conteudo) {
  if (estado.status === "fase_concluida") {
    return { ...estado, status: "jogando", fase: estado.fase + 1, desafio: 0, ultimo: null };
  }
  if (estado.status !== "feedback") return estado;
  if (estado.vidas <= 0) return { ...estado, status: "derrota" };

  const fase = conteudo.fases[estado.fase];
  const proximo = estado.desafio + 1;
  if (proximo < fase.desafios.length) {
    return { ...estado, status: "jogando", desafio: proximo, ultimo: null };
  }
  const ultimaFase = estado.fase === conteudo.fases.length - 1;
  return { ...estado, status: ultimaFase ? "vitoria" : "fase_concluida", ultimo: null };
}

/** Patente final, pela proporção de acertos. */
export function classificar(estado, conteudo) {
  const total = totalDesafios(conteudo);
  const taxa = total === 0 ? 0 : estado.acertos / total;
  if (taxa === 1) return "Mestre dos Bugs";
  if (taxa >= 0.7) return "Caçador Sênior";
  if (taxa >= 0.4) return "Caçador Júnior";
  return "Estagiário de Plantão";
}
