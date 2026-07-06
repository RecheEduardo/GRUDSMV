// Middleware central de erros. Traduz err.status/err.message para a resposta;
// erros sem status viram 500 (e sao logados no servidor).
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = status === 500 ? 'Erro interno do servidor' : err.message;

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ message });
}
