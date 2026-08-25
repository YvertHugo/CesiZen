const Contenu = require('../models/contenuModel');

const contenuController = {
    getContenus: (req, res) => {
        Contenu.getAll((err, rows) => {
            if (err) {
                console.error("Erreur lors de la récupération des contenus :", err.message);
                return res.status(500).json({ error: "Erreur serveur" });
            }
            res.json(rows);
        });
    },

    create: (req, res) => {
        const { titre, description, contenu } = req.body;
        
        // On utilise la date et l'heure actuelle au format standard YYYY-MM-DD HH:MM:SS
        const date_publication = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const sql = "INSERT INTO CONTENU (titre, description, contenu, date_publication) VALUES (?, ?, ?, ?)";
        
        const db = require('../db'); // On s'assure que la connexion DB est bien appelée
        
        db.run(sql, [titre, description, contenu, date_publication], function(err) {
            if (err) {
                console.error("Erreur SQLite lors de l'insertion :", err.message); // Ce log va s'afficher dans ton terminal Node
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: "Article ajouté avec succès !", id: this.lastID });
        });
    }
};

module.exports = contenuController;