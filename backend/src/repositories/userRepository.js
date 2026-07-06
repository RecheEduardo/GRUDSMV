import { createRepository } from './baseRepository.js';

// Repositorio de usuarios sobre a colecao "users" do store JSON.
const repo = createRepository('users');

function findByEmail(email) {
  if (!email) return null;
  const target = email.toLowerCase();
  return repo.findOne((u) => u.email.toLowerCase() === target);
}

function findByUsername(username) {
  if (!username) return null;
  const target = username.toLowerCase();
  return repo.findOne((u) => u.username.toLowerCase() === target);
}

export default { ...repo, findByEmail, findByUsername };
