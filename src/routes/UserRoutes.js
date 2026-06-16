// src/routes/UserRoutes.js

const express         = require('express');
const router          = express.Router();
const UserController  = require('../controllers/UserController');
const authMiddleware  = require('../middlewares/authMiddleware');
const validate        = require('../middlewares/validateMiddleware');
const { update }      = require('../validators/userValidator');

router.use(authMiddleware);

router.get('/',       UserController.getAllUsers);
router.get('/:id',    UserController.getUserById);
router.put('/:id',    validate(update), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;