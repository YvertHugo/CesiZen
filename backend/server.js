const express = require('express');
const cors = require('cors');
const db = require('./db'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Indispensable pour autoriser ton app Angular à communiquer avec Node
app.use(express.json()); // Permet de traiter les données envoyées en JSON

// Route de test basique
app.get('/api/status', (req, res) => {
    res.json({ message: "L'API CESIZen est en ligne et fonctionnelle !" });
});

// Importation des routes
const contenuRoutes = require('./routes/contenuRoutes');
app.use('/api/contenus', contenuRoutes);

const utilisateurRoutes = require('./routes/utilisateurRoutes');
app.use('/api/utilisateurs', utilisateurRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});