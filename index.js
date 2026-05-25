import { unique, groupBy, sumBy } from './arrayUtils.js';

// ─── unique ───────────────────────────────────────────────────────────────────
// Remove duplicatas de um array de números
const numeros = [1, 2, 2, 3, 4, 4, 5];
console.log('unique – números:', unique(numeros));

// Remove duplicatas de um array de strings
const frutas = ['maçã', 'banana', 'maçã', 'laranja', 'banana'];
console.log('unique – frutas:', unique(frutas));

// ─── groupBy ─────────────────────────────────────────────────────────────────
// Agrupa produtos por categoria
const produtos = [
  { nome: 'Camiseta', categoria: 'Roupas' },
  { nome: 'Calça', categoria: 'Roupas' },
  { nome: 'Tênis', categoria: 'Calçados' },
  { nome: 'Sandália', categoria: 'Calçados' },
  { nome: 'Boné', categoria: 'Acessórios' },
];
console.log('groupBy – produtos por categoria:', groupBy(produtos, 'categoria'));

// Agrupa pessoas por cidade
const pessoas = [
  { nome: 'Ana', cidade: 'SP' },
  { nome: 'Bruno', cidade: 'RJ' },
  { nome: 'Carlos', cidade: 'SP' },
  { nome: 'Diana', cidade: 'RJ' },
];
console.log('groupBy – pessoas por cidade:', groupBy(pessoas, 'cidade'));

// ─── sumBy ───────────────────────────────────────────────────────────────────
// Soma os preços de um carrinho de compras
const carrinho = [
  { item: 'Livro', preco: 49.90 },
  { item: 'Caneta', preco: 3.50 },
  { item: 'Caderno', preco: 25.00 },
];
console.log('sumBy – total do carrinho:', sumBy(carrinho, 'preco'));
// → 78.4

// Soma as horas trabalhadas por funcionários
const funcionarios = [
  { nome: 'Felipe', horas: 40 },
  { nome: 'Gabriela', horas: 35 },
  { nome: 'Henrique', horas: 45 },
];
console.log('sumBy – total de horas:', sumBy(funcionarios, 'horas'));