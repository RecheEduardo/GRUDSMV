import jwt from 'jsonwebtoken';

import config from '../config/index.js';

// Valida o token JWT do header Authorization e anexa req.auth = { id, role }.
export default function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token nao fornecido' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.auth = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalido ou expirado' });
  }
}
