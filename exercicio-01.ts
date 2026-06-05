interface Livro {
  titulo: string;
  autor: string;
  ano: number;
  disponivel: boolean;
}

const biblioteca: Livro[] = [
  {
    titulo: "Clean Code",
    autor: "Uncle Bob",
    ano: 2008,
    disponivel: true,
  },
  {
    titulo: "Design Patterns",
    autor: "Gang of Four",
    ano: 1994,
    disponivel: false,
  },
  {
    titulo: "The Pragmatic Programmer",
    autor: "David Thomas",
    ano: 1999,
    disponivel: true,
  },
  {
    titulo: "1984",
    autor: "George Orwell",
    ano: 1949,
    disponivel: true,
  },
];

function listarTitulosDisponiveis(livros: Livro[]): string[] {
  return livros.filter((livro) => livro.disponivel).map((livro) => livro.titulo);
}

console.log("=== Exercício 1 ===");
console.log("Títulos disponíveis:", listarTitulosDisponiveis(biblioteca));
