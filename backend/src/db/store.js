import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Store JSON simples (padrao "lowdb manual") que serve de persistencia.
// O arquivo db.json fica fora do versionamento (ver .gitignore) e e recriado
// automaticamente a partir de DEFAULT_DATA quando nao existir.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DB_PATH = path.join(__dirname, '..', '..', 'db.json');

export const DEFAULT_DATA = {
  users: [],
  articles: [],
  comments: [],
};

export function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

export function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
