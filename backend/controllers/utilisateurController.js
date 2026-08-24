const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateurModel');

const utilisateurController = {
    register: async (req, res) => {
        try {
            const { nom, prenom, email, mot_de_passe } = req.body;

            // 1. Générer un "sel" (salt) et hacher le mot de passe
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

            const userData = {
                nom,
                prenom,
                email,
                mot_de_passe: hashedPassword
            };

            // 2. Sauvegarder dans la base de données
            Utilisateur.create(userData, (err, userId) => {
                if (err) {
                    // Gestion de l'erreur si l'email existe déjà (contrainte UNIQUE)
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: "Cet email est déjà utilisé." });
                    }
                    console.error("Erreur DB:", err.message);
                    return res.status(500).json({ error: "Erreur lors de la création du compte." });
                }
                res.status(201).json({ message: "Compte créé avec succès !", userId });
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

    login: (req, res) => {
    const { email, mot_de_passe } = req.body;

    // 1. Chercher l'utilisateur par son email
    const sql = "SELECT * FROM UTILISATEUR WHERE email = ?";
    const db = require('../db');

    db.get(sql, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: "Erreur serveur lors de la connexion." });
        if (!user) return res.status(400).json({ error: "Email ou mot de passe incorrect." });

        // 2. Vérifier le mot de passe
        const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isMatch) return res.status(400).json({ error: "Email ou mot de passe incorrect." });

        // 3. Générer le token JWT
        const token = jwt.sign(
            { id: user.id_utilisateur }, 
            'TON_SECRET_JWT', 
            { expiresIn: '24h' }
        );

        // ⚠️ LA CORRECTION EST ICI : 
        // Il faut explicitement renvoyer l'id_utilisateur (ou id) pour qu'Angular le reçoive !
        res.json({
            token: token,
            user: {
                id: user.id_utilisateur,           // <-- TRÈS IMPORTANT
                id_utilisateur: user.id_utilisateur, // <-- On met les deux versions par sécurité
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.id_role,
                id_role: user.id_role
            }
        });
    });
},

    changePassword: async (req, res) => {
        try {
            const { id_utilisateur, ancien_mdp, nouveau_mdp } = req.body;

            // 1. Récupérer l'utilisateur pour vérifier son ancien mot de passe
            const sql = "SELECT * FROM UTILISATEUR WHERE id_utilisateur = ?";
            const db = require('../db');
            db.get(sql, [id_utilisateur], async (err, user) => {
                if (err || !user) return res.status(404).json({ error: "Utilisateur introuvable." });

                // 2. Vérifier si l'ancien mot de passe est correct
                const isMatch = await bcrypt.compare(ancien_mdp, user.mot_de_passe);
                if (!isMatch) return res.status(400).json({ error: "L'ancien mot de passe est incorrect." });

                // 3. Hacher le nouveau mot de passe et sauvegarder
                const salt = await bcrypt.genSalt(10);
                const hashedNewPassword = await bcrypt.hash(nouveau_mdp, salt);

                Utilisateur.updatePassword(id_utilisateur, hashedNewPassword, (err) => {
                    if (err) return res.status(500).json({ error: "Erreur lors de la modification." });
                    res.json({ message: "Mot de passe modifié avec succès !" });
                });
            });
        } catch (error) {
            res.status(500).json({ error: "Erreur serveur." });
        }
    },

    deleteAccount: (req, res) => {
        const { id_utilisateur } = req.body;
        
        if (!id_utilisateur) {
            return res.status(400).json({ error: "ID utilisateur manquant." });
        }

        Utilisateur.delete(id_utilisateur, function(err) {
            if (err) return res.status(500).json({ error: "Erreur lors de la suppression." });
            
            // 'this.changes' contient le nombre de lignes modifiées/effacées par SQLite
            // Si c'est égal à 0, c'est que l'ID n'existait pas en BDD
            if (this && this.changes === 0) {
                return res.status(404).json({ error: "Utilisateur introuvable en base de données." });
            }

            res.json({ message: "Compte supprimé définitivement conformément au RGPD." });
        });
    },

    getAllUsers: (req, res) => {
        const sql = "SELECT id_utilisateur, nom, prenom, email, id_role FROM UTILISATEUR";
        const db = require('../db');
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            res.json(rows);
        });
    },

    // Pour que l'admin supprime n'importe quel compte
    adminDeleteUser: (req, res) => {
        const { id } = req.params;
        const sql = "DELETE FROM UTILISATEUR WHERE id_utilisateur = ?";
        const db = require('../db');
        db.run(sql, [id], function(err) {
            if (err) return res.status(500).json({ error: "Erreur lors de la suppression" });
            res.json({ message: "Utilisateur supprimé par l'administrateur." });
        });
    },

    adminUpdateUser: (req, res) => {
        const { id } = req.params;
        const { nom, prenom, email, id_role } = req.body;

        if (!nom || !prenom || !email || !id_role) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        const sql = "UPDATE UTILISATEUR SET nom = ?, prenom = ?, email = ?, id_role = ? WHERE id_utilisateur = ?";
        const db = require('../db');

        db.run(sql, [nom, prenom, email, id_role, id], function(err) {
            if (err) return res.status(500).json({ error: "Erreur lors de la mise à jour." });
            res.json({ message: "Utilisateur mis à jour avec succès !" });
        });
    }
};

module.exports = utilisateurController;