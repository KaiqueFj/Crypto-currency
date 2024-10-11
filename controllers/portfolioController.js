const Portfolio = require('../models/portfolioModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createPortfolio = catchAsync(async (req, res, next) => {
  const { coins } = req.body;

  // Check if the user already has a portfolio
  let portfolio = await Portfolio.findOne({ user: req.user.id });

  if (!portfolio) {
    // If the user doesn't have a portfolio, create a new one
    portfolio = await Portfolio.create({
      user: req.user.id,
      coins: coins.map((coin) => ({
        coinName: coin.coinName,
      })),
    });
  } else {
    // If the user already has a portfolio, add the new coins to the existing portfolio
    portfolio.coins.push(...coins);
    await portfolio.save();
  }

  res.status(201).json({
    status: 'success',
    data: {
      portfolio,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  let query = Portfolio.findOne({ user: userId });
  const document = await query;

  if (!document) {
    return next(new AppError('No Document found with that ID', 404));
  }

  res.status(302).json({
    status: `success`,
    coin: {
      coins: document,
    },
  });
});
