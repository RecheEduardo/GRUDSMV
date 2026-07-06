require('dotenv').config();

const app = require('./app');
const { ensureDb } = require('./db/store');

// Garante que o arquivo de store JSON exista antes de aceitar requisicoes.
ensureDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
