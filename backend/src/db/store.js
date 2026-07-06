const fs = require('fs');
const path = require('path');

// Store JSON simples (padrao "lowdb manual") que serve de persistencia.
// O arquivo db.json fica fora do versionamento (ver .gitignore) e e recriado
// automaticamente a partir de DEFAULT_DATA quando nao existir.
const DB_PATH = path.join(__dirname, '..', '..', 'db.json');

const DEFAULT_DATA = {
  users: [],
  articles: [],
  comments: [],
};

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { DB_PATH, DEFAULT_DATA, ensureDb, readDb, writeDb };
