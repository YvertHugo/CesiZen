const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Utiliser un chemin absolu vers le dossier de travail
const dbPath = path.resolve(__dirname, 'cesizen.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Erreur de connexion SQLite :", err.message);
  else console.log("Connecté à la base SQLite :", dbPath);
});

module.exports = db;