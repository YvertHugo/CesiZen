const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données (située à la racine du monorepo)
const dbPath = path.resolve(__dirname, '../cesizen.db');

// Initialisation de la connexion
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à SQLite :', err.message);
    } else {
        console.log('Connexion réussie à la base de données CESIZen.');
    }
});

module.exports = db;