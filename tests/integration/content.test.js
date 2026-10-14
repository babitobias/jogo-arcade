import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { exigirConteudoValido, validarConteudo } from "../../src/core/content.js";
import { criarJogo, continuar, responder, totalDesafios } from "../../src/core/game.js";

const real = JSON.parse(readFileSync("src/content/levels.json", "utf8"));

describe("conteúdo real do jogo (levels.json)", () => {
  it("passa na validação de esquema", () => {
    expect(validarConteudo(real)).toEqual([]);
  });

  it("é jogável de ponta a ponta com todas as respostas certas", () => {
    let e = criarJogo();
    while (e.status !== "vitoria") {
      if (e.status === "fase_concluida") { e = continuar(e, real); continue; }
      const d = real.fases[e.fase].desafios[e.desafio];
      e = continuar(responder(e, real, d.bug), real);
    }
    expect(e.acertos).toBe(totalDesafios(real));
    expect(e.vidas).toBe(3);
  });

  it("quebra o build quando o JSON é inválido", () => {
    const ruim = structuredClone(real);
    ruim.fases[0].desafios[0].bug = 99;
    ruim.fases[0].desafios[1].id = ruim.fases[0].desafios[0].id;
    expect(() => exigirConteudoValido(ruim)).toThrow(/Conteúdo inválido/);
    expect(validarConteudo(ruim).length).toBeGreaterThanOrEqual(2);
  });

  it("rejeita conteúdo ausente ou sem fases", () => {
    expect(validarConteudo(null)).toHaveLength(1);
    expect(validarConteudo({ fases: [] })).toHaveLength(1);
  });
});
