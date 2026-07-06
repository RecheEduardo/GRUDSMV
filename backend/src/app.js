const express = require('express');
const cors = require('cors');

const routes = require('./routes');

// Monta a aplicacao Express (separada do listen para facilitar testes).
const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

// 404 padrao para rotas nao encontradas.
app.use((req, res) => {
  res.status(404).json({ message: 'Rota nao encontrada' });
});

module.exports = app;
