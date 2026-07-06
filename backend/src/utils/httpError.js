// Cria um Error com status HTTP associado, tratado pelo middleware errorHandler.
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

module.exports = httpError;
