const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.post('/signUp', AuthController.signUp);
router.post('/signIn', AuthController.signIn);

module.exports = router;
