const { randomUUID } = require('crypto');

const { readDb, writeDb } = require('../db/store');

// Fabrica de repositorios genericos sobre uma colecao do store JSON.
// Cada dominio (users, articles, comments) cria o seu a partir daqui,
// evitando repetir a logica de leitura/escrita.
function createRepository(collection) {
  function getAll() {
    const db = readDb();
    return db[collection] || [];
  }

  function findById(id) {
    return getAll().find((item) => item.id === id) || null;
  }

  function findBy(predicate) {
    return getAll().filter(predicate);
  }

  function findOne(predicate) {
    return getAll().find(predicate) || null;
  }

  function insert(data) {
    const db = readDb();
    if (!db[collection]) db[collection] = [];
    const item = { id: randomUUID(), ...data };
    db[collection].push(item);
    writeDb(db);
    return item;
  }

  function update(id, changes) {
    const db = readDb();
    const list = db[collection] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;
    // Preserva o id original mesmo que venha em changes.
    list[index] = { ...list[index], ...changes, id };
    writeDb(db);
    return list[index];
  }

  function remove(id) {
    const db = readDb();
    const list = db[collection] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return false;
    list.splice(index, 1);
    writeDb(db);
    return true;
  }

  return { getAll, findById, findBy, findOne, insert, update, remove };
}

module.exports = { createRepository };
