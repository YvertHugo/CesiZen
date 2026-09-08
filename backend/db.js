const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'cesizen.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erreur de connexion SQLite :", err.message);
    return;
  }
  console.log("Connecté à la base SQLite :", dbPath);

  // Initialisation automatique du schéma si les tables n'existent pas
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema, (err) => {
    if (err) console.error("Erreur d'initialisation du schéma :", err.message);
    else console.log("Schéma vérifié / initialisé avec succès.");
  });
});

module.exports = db;