

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware'); 


router.use(authMiddleware);

router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.getUserById);

router.put('/:id', UserController.updateUser);


router.delete('/:id', UserController.deleteUser);

module.exports = router;