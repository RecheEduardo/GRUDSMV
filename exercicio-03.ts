interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

type UsuarioSemSenha = Omit<Usuario, "senha">;
type UsuarioAtualizacao = Partial<Usuario>;

function exibirPerfil(u: UsuarioSemSenha): void {
  console.log(`Perfil: ${u.nome} (ID: ${u.id})`);
  console.log(`Email: ${u.email}`);
}

function atualizarUsuario(id: number, dados: UsuarioAtualizacao): void {
  console.log(`Atualizando usuário ${id}...`);
  if (dados.nome) console.log(`  Nome: ${dados.nome}`);
  if (dados.email) console.log(`  Email: ${dados.email}`);
  if (dados.senha) console.log(`  Senha: atualizada`);
}

console.log("=== Exercício 3 ===");

const usuarioExibir: UsuarioSemSenha = {
  id: 1,
  nome: "João Silva",
  email: "joao@example.com",
};

exibirPerfil(usuarioExibir);

console.log();

const atualizacoes: UsuarioAtualizacao = {
  email: "joao.novo@example.com",
  nome: "João Santos",
};

atualizarUsuario(1, atualizacoes);
