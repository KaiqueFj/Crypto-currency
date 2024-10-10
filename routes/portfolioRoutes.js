const express = require('express');
const AuthController = require('../controllers/authController');
const PortfolioController = require('../controllers/portfolioController');

const router = express.Router();

router.use(AuthController.protect);

router.post('/addToPortfolio', PortfolioController.createPortfolio);
router.get('/getPortfolio/:id', PortfolioController.getOne);

module.exports = router;
