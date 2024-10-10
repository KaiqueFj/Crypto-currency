const Portfolio = require('../models/portfolioModel');
const catchAsync = require('../utils/catchAsync');

exports.createPortfolio = catchAsync(async (req, res, next) => {
  const coin = await Portfolio.create({
    coinName: req.body.coinName,
    user: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: coin,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  let query = Portfolio.findById(req.params.id);
  const document = await query;

  if (!document) {
    return next(new AppError('No Document found with that ID', 404));
  }

  res.status(200).json({
    status: `success`,
    data: {
      data: document,
    },
  });
});
