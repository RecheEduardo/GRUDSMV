import 'dotenv/config';

import app from './app.js';
import { ensureDb } from './db/store.js';

// Garante que o arquivo de store JSON exista antes de aceitar requisicoes.
ensureDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
