const express = require('express');
const AuthController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signUp', AuthController.signUp);
router.post('/signIn', AuthController.signIn);
router.get('/logout', AuthController.logout);

router.use(AuthController.protect);

router.patch('/updatePassword', AuthController.updatePassword);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

module.exports = router;
