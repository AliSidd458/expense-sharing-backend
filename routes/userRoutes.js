const express = require('express');
const { createUser, getUser } = require('../controllers/userController');
const router = express.Router();

// new user
router.post('/', createUser);

// ID
router.get('/:id', getUser);

module.exports = router;
