// Configuracoes centralizadas, lidas de variaveis de ambiente (.env).
// Os defaults servem apenas para desenvolvimento local.
module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-troque-em-producao',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptSaltRounds: 10,
};
