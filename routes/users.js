const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');


router.post('/register', register);


router.post('/login', login);


router.get('/profile', auth, getUser);

module.exports = router;