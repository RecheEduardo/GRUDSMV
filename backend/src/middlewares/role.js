// Fabrica de middleware de autorizacao por papel.
// Uso: router.get('/rota', auth, role('ADMIN'), handler)
// Deve rodar sempre depois do middleware auth (que define req.auth).
export default function role(...allowedRoles) {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({ message: 'Nao autenticado' });
    }
    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    return next();
  };
}
