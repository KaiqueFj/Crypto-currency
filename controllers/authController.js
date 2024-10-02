const { promisify } = require('util');

const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV.trim() === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  //Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1 - check if email and password exist
  if (!email || !password) {
    return next(new AppError('please, provide email and password'), 400);
  }

  //2 - check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  //3 - if everything is ok, send token to client
  createSendToken(user, 200, res);
});

// Only for rendered pages, no errors !
exports.isLoggedIn = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      ).catch(() => false);

      if (!decoded) return next();

      const currentUser = await User.findById(decoded.id).catch(() => false);
      if (!currentUser) return next();

      if (currentUser.changedPasswordAfter(decoded.iat)) return next();
      res.locals.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1- Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // Ensure the user and the password fields are present
  if (!user || !user.password) {
    return next(new AppError('User not found or password not provided!', 401));
  }

  //2- Check if posted current password is correct
  const { currentPassword, password, passwordConfirm } = req.body;

  if (!currentPassword || !password || !passwordConfirm) {
    return next(
      new AppError('Please provide all required password fields!', 400)
    );
  }

  const isCurrentPasswordCorrect = await user.correctPassword(
    currentPassword,
    user.password
  );
  if (!isCurrentPasswordCorrect) {
    return next(new AppError('Incorrect current password!', 401));
  }

  //3- If so, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  createSendToken(user, 201, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};
