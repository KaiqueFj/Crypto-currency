const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

// Redirect root path to /overview
router.get('/', (req, res) => {
  res.redirect('/overview');
});
router.get('/overview', viewController.getOverview);
router.get('/coin/:coin/', viewController.getSpecificCoin);
router.get('/fearGreed', viewController.getFearGreedIndex);
router.get('/trending-crypto', viewController.getTrendingCoinsPage);

module.exports = router;
