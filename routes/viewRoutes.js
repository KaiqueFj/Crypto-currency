const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

// signUp page
router.get('/signUp', viewController.getSignUpPageUser);

// signIn page
router.get('/signIn', viewController.getSignInPageUser);

// middleware used to pass the logged in user through all the pages
router.use(authController.isLoggedIn);

// Profile page
router.get(
  '/profile',
  authController.protect,
  viewController.getProfilePageUser
);

// Portfolio page
router.get(
  '/portfolio/:id',
  authController.protect,
  viewController.getPortfolioPageUser
);

// Redirect root path to /overview
router.get('/', (req, res) => {
  res.redirect('/overview');
});
router.get('/overview', viewController.getOverview);
router.get('/coin/:coin/', viewController.getSpecificCoin);
router.get('/fearGreed', viewController.getFearGreedIndex);
router.get('/trending-crypto', viewController.getTrendingCoinsPage);

module.exports = router;
