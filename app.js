const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const viewRoutes = require('./routes/viewRoutes');
const userRoutes = require('./routes/userRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const app = express();

// App compression to improve performance
app.use(compression());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// Body parser from req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(express.static(path.join(`${__dirname}/public`)));

// Limit requests from the same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this Ip, please try again in an hour',
});

app.use('/', viewRoutes);
app.use('/api', limiter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can´t find ${req.originalUrl} on this server !`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
