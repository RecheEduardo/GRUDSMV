// Model User (documental) — formato de um usuario no store:
//   { id, username, email, passwordHash, role, createdAt }
// role: 'USER' (padrao) | 'ADMIN'
const ROLES = { USER: 'USER', ADMIN: 'ADMIN' };

// Remove o passwordHash antes de enviar o usuario para o cliente.
function toPublicUser(user) {
  if (!user) return null;
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

module.exports = { ROLES, toPublicUser };
