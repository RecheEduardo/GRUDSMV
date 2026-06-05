interface PropsBotao {
  titulo: string;
  ativo?: boolean;
}

function renderizarBotao({ titulo, ativo = true }: PropsBotao): string {
  return ativo ? `[ ${titulo} ]` : `( ${titulo} )`;
}

console.log("=== Exercício 5 ===");

const botao1 = renderizarBotao({ titulo: "Enviar" });
console.log("Botão 1 (ativo por padrão):", botao1);

const botao2 = renderizarBotao({ titulo: "Cancelar", ativo: false });
console.log("Botão 2 (inativo):", botao2);

const botao3 = renderizarBotao({ titulo: "Confirmar", ativo: true });
console.log("Botão 3 (ativo):", botao3);

const botao4 = renderizarBotao({ titulo: "Deletar" });
console.log("Botão 4 (ativo por padrão):", botao4);
