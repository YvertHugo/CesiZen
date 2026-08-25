const db = require('../db');

const Utilisateur = {
    create: (userData, callback) => {
        // On insère l'utilisateur en lui attribuant par défaut l'id_role 2 (Utilisateur connecté)
        const sql = "INSERT INTO UTILISATEUR (nom, prenom, email, mot_de_passe, id_role) VALUES (?, ?, ?, ?, 2)";
        
        db.run(sql, [userData.nom, userData.prenom, userData.email, userData.mot_de_passe], function(err) {
            // "this.lastID" permet de récupérer l'ID généré automatiquement par SQLite
            callback(err, this.lastID); 
        });
    },

    findByEmail: (email, callback) => {
        const sql = "SELECT * FROM UTILISATEUR WHERE email = ?";
        db.get(sql, [email], (err, row) => {
            callback(err, row);
        });
    },

    // Mettre à jour le mot de passe
    updatePassword: (id, newHashedPassword, callback) => {
        const sql = "UPDATE UTILISATEUR SET mot_de_passe = ? WHERE id_utilisateur = ?";
        db.run(sql, [newHashedPassword, id], function(err) {
            callback(err);
        });
    },

    // Supprimer définitivement le compte (Norme RGPD - Droit à l'oubli)
    delete: (id, callback) => {
        const sql = "DELETE FROM UTILISATEUR WHERE id_utilisateur = ?";
        db.run(sql, [id], function(err) {
            callback(err);
        });
    }
};

module.exports = Utilisateur;