const express = require('express');
const router = express.Router();
const { register, login, getUser, forgotPassword, verifyCode, resetPassword } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');


router.post('/register', register);


router.post('/login', login);


router.get('/profile', auth, getUser);

router.post('/forgotPassword', forgotPassword);

router.post('/verifyCode', verifyCode);

router.post('/resetPassword', resetPassword);


module.exports = router;