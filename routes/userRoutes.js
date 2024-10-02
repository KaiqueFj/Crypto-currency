const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.post('/signUp', AuthController.signUp);
router.post('/signIn', AuthController.signIn);

router.use(AuthController.protect);

router.patch('/updatePassword', AuthController.updatePassword);

module.exports = router;
