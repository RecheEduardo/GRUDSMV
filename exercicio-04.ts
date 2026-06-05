function obterPrimeiro<T>(lista: T[]): T {
  if (lista.length === 0) {
    throw new Error("Lista vazia");
  }
  return lista[0];
}

// Teste com string[]
const listasStrings = ["maçã", "banana", "laranja"];
const primeiraString = obterPrimeiro(listasStrings);
console.log("=== Exercício 4 ===");
console.log("Primeira string:", primeiraString);

// Teste com number[]
const listasNumeros = [42, 100, 7];
const primeiroNumero = obterPrimeiro(listasNumeros);
console.log("Primeiro número:", primeiroNumero);

// Teste com tipo personalizado
interface Produto {
  nome: string;
  preco: number;
}

const listaProdutos: Produto[] = [
  { nome: "Notebook", preco: 3500 },
  { nome: "Mouse", preco: 50 },
  { nome: "Teclado", preco: 150 },
];

const primeiroProduto = obterPrimeiro(listaProdutos);
console.log("Primeiro produto:", primeiroProduto.nome, "-", `R$ ${primeiroProduto.preco}`);
