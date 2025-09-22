// Jeito novo e correto
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// POST /api/users
router.post('/', UserController.createUser);

// GET /api/users
router.get('/', UserController.getAllUsers);

// GET /api/users/123
router.get('/:id', UserController.getUserById);

// PUT /api/users/123
router.put('/:id', UserController.updateUser);

// DELETE /api/users/123
router.delete('/:id', UserController.deleteUser);

module.exports = router;