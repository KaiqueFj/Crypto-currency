const express = require('express');
const AuthController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signUp', AuthController.signUp);
router.post('/signIn', AuthController.signIn);

router.use(AuthController.protect);

router.patch('/updatePassword', AuthController.updatePassword);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.patch('/addToPortfolio', userController.addToPortfolio);

module.exports = router;
