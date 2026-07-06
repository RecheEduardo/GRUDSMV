import express from 'express';
import cors from 'cors';

import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

// Monta a aplicacao Express (separada do listen para facilitar testes).
const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

// 404 padrao para rotas nao encontradas.
app.use((req, res) => {
  res.status(404).json({ message: 'Rota nao encontrada' });
});

// Tratamento central de erros (sempre por ultimo).
app.use(errorHandler);

export default app;
