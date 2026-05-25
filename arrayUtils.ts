// Retorna um novo array sem valores duplicados
export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

// Interface que representa um objeto com chaves string e valores de qualquer tipo
interface Groupable {
  [key: string]: unknown;
}

// Tipo de retorno: um objeto onde cada chave mapeia para um array de T
type GroupedResult<T> = Record<string, T[]>;

// Agrupa os objetos do array por uma chave específica
export const groupBy = <T extends Groupable>(arr: T[], key: string): GroupedResult<T> => {
  return arr.reduce<GroupedResult<T>>((acc, obj) => {

    const groupKey = String(obj[key]);

    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(obj);
    return acc;
  }, {});
}

// Interface para objetos que possuem propriedades numéricas
interface Summable {
  [key: string]: unknown;
}

// Soma os valores de uma propriedade numérica em todos os objetos do array
export const sumBy = <T extends Summable>(arr: T[], key: string): number => {
  return arr.reduce((total, obj) => {
    const val = obj[key];
    return total + (typeof val === 'number' ? val : 0);
  }, 0);
}