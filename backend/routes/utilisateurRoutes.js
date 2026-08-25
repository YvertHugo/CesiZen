const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');

// Route POST pour l'inscription
router.post('/register', utilisateurController.register);
router.post('/login', utilisateurController.login);
router.post('/change-password', utilisateurController.changePassword);
router.post('/delete-account', utilisateurController.deleteAccount);
router.get('/', utilisateurController.getAllUsers);
router.delete('/:id', utilisateurController.adminDeleteUser);
router.put('/:id', utilisateurController.adminUpdateUser);

module.exports = router;