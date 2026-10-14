// Renderização (DOM). A lógica fica em src/core.
import { continuar, criarJogo, classificar, desafioAtual, responder, totalDesafios } from "../core/game.js";

export function iniciar(raiz, conteudo, versao) {
  let estado = null;

  function el(tag, atributos = {}, filhos = []) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(atributos)) {
      if (k === "texto") e.textContent = v;
      else if (k === "aoClicar") e.addEventListener("click", v);
      else e.setAttribute(k, v);
    }
    for (const f of [].concat(filhos)) e.append(f);
    return e;
  }

  function botao(texto, id, aoClicar, classe = "btn") {
    return el("button", { type: "button", "data-testid": id, class: classe, texto, aoClicar });
  }

  function mostrar(...filhos) {
    raiz.replaceChildren(...filhos);
  }

  function rodape() {
    return el("footer", { class: "rodape", "data-testid": "versao", texto: `versão ${versao}` });
  }

  function menu() {
    mostrar(
      el("main", { class: "cartao" }, [
        el("h1", { texto: "Caça-Bug" }),
        el("p", { class: "sub", texto: "Encontre a linha com defeito. Aprenda programação e DevOps sem precisar instalar nada." }),
        botao("Jogar", "iniciar", comecar, "btn grande"),
      ]),
      rodape(),
    );
  }

  function comecar() {
    estado = criarJogo();
    desenhar();
  }

  function placar() {
    return el("div", { class: "placar" }, [
      el("span", { "data-testid": "pontos", texto: `Pontos: ${estado.pontos}` }),
      el("span", { "data-testid": "vidas", texto: `Vidas: ${"♥".repeat(Math.max(estado.vidas, 0))}` }),
      el("span", { "data-testid": "sequencia", texto: `Sequência: ${estado.sequencia}` }),
    ]);
  }

  function tela() {
    const fase = conteudo.fases[estado.fase];
    const d = desafioAtual(estado, conteudo);
    const emFeedback = estado.status === "feedback";
    const linhas = d.codigo.map((texto, i) => {
      let classe = "linha";
      if (emFeedback && i === estado.ultimo.bug) classe += " bug";
      else if (emFeedback && i === estado.ultimo.linha) classe += " errada";
      const item = el("button", {
        type: "button",
        class: classe,
        "data-testid": `linha-${i}`,
        "aria-label": `Linha ${i + 1}: ${texto}`,
        aoClicar: () => {
          if (estado.status !== "jogando") return;
          estado = responder(estado, conteudo, i);
          desenhar();
        },
      }, [el("span", { class: "num", texto: String(i + 1) }), el("code", { texto })]);
      if (emFeedback) item.disabled = true;
      return item;
    });

    const filhos = [
      el("h2", { texto: fase.titulo }),
      el("p", { class: "sub", "data-testid": "tema", texto: `Tema: ${d.tema} · clique na linha com defeito` }),
      placar(),
      el("div", { class: "codigo", role: "group", "aria-label": "Código" }, linhas),
    ];
    if (emFeedback) {
      filhos.push(
        el("p", {
          class: estado.ultimo.correto ? "ok" : "erro",
          "data-testid": "feedback",
          texto: (estado.ultimo.correto ? `Acertou! +${estado.ultimo.ganho}. ` : "Não foi essa. ") + estado.ultimo.explicacao,
        }),
        botao("Continuar", "continuar", () => { estado = continuar(estado, conteudo); desenhar(); }),
      );
    }
    mostrar(el("main", { class: "cartao" }, filhos), rodape());
  }

  function faseConcluida() {
    mostrar(
      el("main", { class: "cartao" }, [
        el("h2", { "data-testid": "fase-concluida", texto: "Fase concluída!" }),
        placar(),
        botao("Próxima fase", "continuar", () => { estado = continuar(estado, conteudo); desenhar(); }),
      ]),
      rodape(),
    );
  }

  function fim() {
    const venceu = estado.status === "vitoria";
    mostrar(
      el("main", { class: "cartao", "data-testid": "tela-fim" }, [
        el("h2", { "data-testid": "resultado", texto: venceu ? "Você concluiu todas as fases!" : "Fim de jogo" }),
        el("p", { "data-testid": "patente", texto: `Patente: ${classificar(estado, conteudo)}` }),
        el("p", { texto: `Pontos: ${estado.pontos} · Acertos: ${estado.acertos}/${totalDesafios(conteudo)}` }),
        botao("Jogar de novo", "reiniciar", comecar),
      ]),
      rodape(),
    );
  }

  function desenhar() {
    if (estado.status === "fase_concluida") return faseConcluida();
    if (estado.status === "vitoria" || estado.status === "derrota") return fim();
    return tela();
  }

  menu();
}
