const express = require('express');
const router = express.Router();
const contenuController = require('../controllers/contenuController');

// Route GET pour récupérer les informations
router.get('/', contenuController.getContenus);
router.post('/', contenuController.create);

module.exports = router;