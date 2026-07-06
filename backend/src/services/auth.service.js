const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config');
const userRepository = require('../repositories/userRepository');
const { ROLES, toPublicUser } = require('../models/user.model');

// Erro de dominio com status HTTP associado (tratado pelo errorHandler).
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function register({ username, email, password }) {
  if (!username || !email || !password) {
    throw httpError(400, 'username, email e senha sao obrigatorios');
  }
  if (userRepository.findByEmail(email)) {
    throw httpError(409, 'Email ja cadastrado');
  }
  if (userRepository.findByUsername(username)) {
    throw httpError(409, 'Username ja em uso');
  }

  const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds);
  const user = userRepository.insert({
    username,
    email,
    passwordHash,
    role: ROLES.USER,
    createdAt: new Date().toISOString(),
  });

  return toPublicUser(user);
}

async function login({ email, password }) {
  const user = userRepository.findByEmail(email);
  // Mensagem generica para nao revelar se o email existe.
  if (!user) throw httpError(401, 'Credenciais invalidas');

  const passwordOk = await bcrypt.compare(password || '', user.passwordHash);
  if (!passwordOk) throw httpError(401, 'Credenciais invalidas');

  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );

  return { token, user: toPublicUser(user) };
}

function getProfile(id) {
  const user = userRepository.findById(id);
  if (!user) throw httpError(404, 'Usuario nao encontrado');
  return toPublicUser(user);
}

module.exports = { register, login, getProfile };
