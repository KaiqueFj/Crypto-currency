const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  coinName: {
    type: 'string',
    required: [true, 'Coin must have a name'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Portfolio must belong to a user'],
  },
});

portfolioSchema.index({ user: 1 });

portfolioSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name _id  ',
  });
  next();
});

const portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = portfolio;
