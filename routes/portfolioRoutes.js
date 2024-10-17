const express = require('express');
const AuthController = require('../controllers/authController');
const PortfolioController = require('../controllers/portfolioController');

const router = express.Router();

// middleware used to pass the logged in user through all the pages
router.use(AuthController.protect);

router.post('/addToPortfolio', PortfolioController.createPortfolio);
router.get('/getPortfolio/:id', PortfolioController.getOne);
router.patch('/deleteCoinFromPortfolio/:coinId', PortfolioController.deleteOne);

module.exports = router;
