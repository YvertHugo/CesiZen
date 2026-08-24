const db = require('../db');

const Contenu = {
    // Récupérer tous les contenus
    getAll: (callback) => {
        const sql = "SELECT * FROM CONTENU ORDER BY date_publication DESC";
        db.all(sql, [], (err, rows) => {
            callback(err, rows);
        });
    }
};

module.exports = Contenu;