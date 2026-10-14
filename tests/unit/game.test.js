import { describe, expect, it } from "vitest";
import {
  BONUS_MAXIMO_SEQUENCIA, VIDAS_INICIAIS, calcularPontos, classificar, continuar,
  criarJogo, desafioAtual, responder, totalDesafios,
} from "../../src/core/game.js";

const conteudo = {
  fases: [
    { titulo: "F1", desafios: [
      { id: "a", tema: "t", codigo: ["x", "y", "z"], bug: 1, explicacao: "explicação a" },
      { id: "b", tema: "t", codigo: ["x", "y"], bug: 0, explicacao: "explicação b" },
    ] },
    { titulo: "F2", desafios: [
      { id: "c", tema: "t", codigo: ["x", "y"], bug: 1, explicacao: "explicação c" },
    ] },
  ],
};

describe("calcularPontos", () => {
  it("dá 100 pontos sem sequência", () => expect(calcularPontos(0)).toBe(100));
  it("soma 20 por acerto seguido", () => expect(calcularPontos(3)).toBe(160));
  it("limita o bônus de sequência", () => expect(calcularPontos(99)).toBe(100 + 20 * BONUS_MAXIMO_SEQUENCIA));
  it("ignora sequência negativa", () => expect(calcularPontos(-4)).toBe(100));
});

describe("criarJogo e consultas", () => {
  it("começa com vidas cheias e zerado", () => {
    const e = criarJogo();
    expect(e.vidas).toBe(VIDAS_INICIAIS);
    expect(e.pontos).toBe(0);
    expect(e.status).toBe("jogando");
  });
  it("conta o total de desafios", () => expect(totalDesafios(conteudo)).toBe(3));
  it("devolve o desafio atual", () => expect(desafioAtual(criarJogo(), conteudo).id).toBe("a"));
});

describe("responder", () => {
  it("acerto soma pontos e sequência", () => {
    const e = responder(criarJogo(), conteudo, 1);
    expect(e.pontos).toBe(100);
    expect(e.sequencia).toBe(1);
    expect(e.acertos).toBe(1);
    expect(e.ultimo.correto).toBe(true);
  });
  it("erro tira uma vida e zera a sequência", () => {
    const e = responder({ ...criarJogo(), sequencia: 4 }, conteudo, 0);
    expect(e.vidas).toBe(VIDAS_INICIAIS - 1);
    expect(e.sequencia).toBe(0);
    expect(e.erros).toBe(1);
    expect(e.pontos).toBe(0);
  });
  it("entra em feedback depois de responder", () => {
    expect(responder(criarJogo(), conteudo, 1).status).toBe("feedback");
  });
  it("ignora resposta fora do estado jogando", () => {
    const e = responder(criarJogo(), conteudo, 1);
    expect(responder(e, conteudo, 0)).toBe(e);
  });
  it("não altera o estado original", () => {
    const inicial = criarJogo();
    responder(inicial, conteudo, 0);
    expect(inicial.vidas).toBe(VIDAS_INICIAIS);
  });
  it("acertos seguidos aumentam o ganho", () => {
    let e = responder(criarJogo(), conteudo, 1);
    e = continuar(e, conteudo);
    e = responder(e, conteudo, 0);
    expect(e.ultimo.ganho).toBe(120);
    expect(e.pontos).toBe(220);
  });
});

describe("continuar", () => {
  it("avança para o próximo desafio da fase", () => {
    const e = continuar(responder(criarJogo(), conteudo, 1), conteudo);
    expect(e.status).toBe("jogando");
    expect(e.desafio).toBe(1);
  });
  it("ao fim da fase mostra a tela de fase concluída", () => {
    let e = continuar(responder(criarJogo(), conteudo, 1), conteudo);
    e = continuar(responder(e, conteudo, 0), conteudo);
    expect(e.status).toBe("fase_concluida");
  });
  it("da fase concluída vai para a fase seguinte", () => {
    const e = continuar({ ...criarJogo(), status: "fase_concluida" }, conteudo);
    expect(e.fase).toBe(1);
    expect(e.desafio).toBe(0);
    expect(e.status).toBe("jogando");
  });
  it("vence ao terminar a última fase", () => {
    const e = continuar(responder({ ...criarJogo(), fase: 1 }, conteudo, 1), conteudo);
    expect(e.status).toBe("vitoria");
  });
  it("perde quando as vidas acabam", () => {
    const e = continuar(responder({ ...criarJogo(), vidas: 1 }, conteudo, 0), conteudo);
    expect(e.status).toBe("derrota");
  });
  it("não faz nada em estado jogando", () => {
    const e = criarJogo();
    expect(continuar(e, conteudo)).toBe(e);
  });
});

describe("classificar", () => {
  it("dá a patente máxima a quem acerta tudo", () => {
    expect(classificar({ acertos: 3 }, conteudo)).toBe("Mestre dos Bugs");
  });
  it("classifica por faixas de acerto", () => {
    expect(classificar({ acertos: 2 }, conteudo)).toBe("Caçador Júnior");
    expect(classificar({ acertos: 0 }, conteudo)).toBe("Estagiário de Plantão");
  });
  it("lida com conteúdo vazio", () => {
    expect(classificar({ acertos: 0 }, { fases: [] })).toBe("Estagiário de Plantão");
  });
});
