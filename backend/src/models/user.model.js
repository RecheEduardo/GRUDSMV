// Model User (documental) — formato de um usuario no store:
//   { id, username, email, passwordHash, role, createdAt }
// role: 'USER' (padrao) | 'ADMIN'
export const ROLES = { USER: 'USER', ADMIN: 'ADMIN' };

// Remove o passwordHash antes de enviar o usuario para o cliente.
export function toPublicUser(user) {
  if (!user) return null;
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}
