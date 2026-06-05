type Sucesso = {
  tipo: "sucesso";
  dados: string[];
};

type Erro = {
  tipo: "erro";
  mensagem: string;
};

type Resultado = Sucesso | Erro;

function exibirResultado(r: Resultado): void {
  if (r.tipo === "sucesso") {
    console.log("✓ Sucesso! Dados:", r.dados);
  } else if (r.tipo === "erro") {
    console.log("✗ Erro:", r.mensagem);
  }
}

// Testes
console.log("=== Exercício 2 ===");

const resultado1: Sucesso = {
  tipo: "sucesso",
  dados: ["item1", "item2", "item3"],
};

const resultado2: Erro = {
  tipo: "erro",
  mensagem: "Falha ao conectar ao servidor",
};

exibirResultado(resultado1);
exibirResultado(resultado2);
