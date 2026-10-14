import conteudo from "./content/levels.json";
import { exigirConteudoValido } from "./core/content.js";
import { iniciar } from "./scenes/tela.js";

// __VERSAO__ e __SHA__ são substituídos no build (esbuild define).
const versao = `${__VERSAO__}+${__SHA__}`;
iniciar(document.getElementById("app"), exigirConteudoValido(conteudo), versao);
