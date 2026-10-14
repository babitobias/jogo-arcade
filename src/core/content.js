// Validação do conteúdo educativo (fases e desafios). JSON inválido quebra o build.
export function validarConteudo(conteudo) {
  const erros = [];
  if (!conteudo || typeof conteudo !== "object") return ["conteúdo ausente ou inválido"];
  if (!Array.isArray(conteudo.fases) || conteudo.fases.length === 0) {
    return ["fases deve ser uma lista não vazia"];
  }
  const ids = new Set();
  conteudo.fases.forEach((fase, i) => {
    const rotulo = `fase ${i + 1}`;
    if (typeof fase.titulo !== "string" || !fase.titulo.trim()) erros.push(`${rotulo}: título ausente`);
    if (!Array.isArray(fase.desafios) || fase.desafios.length === 0) {
      erros.push(`${rotulo}: desafios deve ser uma lista não vazia`);
      return;
    }
    fase.desafios.forEach((d, j) => {
      const r = `${rotulo}, desafio ${j + 1}`;
      if (typeof d.id !== "string" || !d.id) erros.push(`${r}: id ausente`);
      else if (ids.has(d.id)) erros.push(`${r}: id repetido (${d.id})`);
      else ids.add(d.id);
      if (typeof d.tema !== "string" || !d.tema) erros.push(`${r}: tema ausente`);
      if (!Array.isArray(d.codigo) || d.codigo.length < 2 || d.codigo.some((l) => typeof l !== "string")) {
        erros.push(`${r}: codigo deve ter ao menos 2 linhas de texto`);
      } else if (!Number.isInteger(d.bug) || d.bug < 0 || d.bug >= d.codigo.length) {
        erros.push(`${r}: bug fora do intervalo das linhas`);
      }
      if (typeof d.explicacao !== "string" || d.explicacao.trim().length < 10) {
        erros.push(`${r}: explicação ausente ou curta demais`);
      }
    });
  });
  return erros;
}

export function exigirConteudoValido(conteudo) {
  const erros = validarConteudo(conteudo);
  if (erros.length) throw new Error("Conteúdo inválido:\n- " + erros.join("\n- "));
  return conteudo;
}
