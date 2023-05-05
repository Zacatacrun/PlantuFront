var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var session = require('express-session');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var joinRouter = require('./routes/join/join');
var subscribeRouter = require('./routes/bulletin/subscribe');
var unsubscribeRouter = require('./routes/bulletin/unsubscribe');
var singInRouter = require('./routes/account/signIn/');
var logOutRouter = require('./routes/account/logout/');
var deleteAccountRouter = require('./routes/account/deleteAccount/');
var logInRouter = require('./routes/account/login/');
var addItemRouter = require('./routes/cart/addItem/');
var deleteItemRouter = require('./routes/cart/deleteItem/');
var updateItemRouter = require('./routes/cart/updateItem/');
var getCartRouter = require('./routes/cart/getItems/');
var addTransactionRouter = require('./routes/transaction/add/');
var getProductRouter = require('./routes/product/getProduct/');
var updatedProductRouter = require('./routes/product/updateProduct/');
var getProductReviewsRouter = require('./routes/product/getProductReviews/');
var getSimilarProductsRouter = require('./routes/product/getSimilarProducts/');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/api/join', joinRouter);
app.use('/api/bulletin', subscribeRouter);
app.use('/api/bulletin',unsubscribeRouter);
app.use('/api/account', singInRouter);
app.use('/api/account', logOutRouter);
app.use('/api/account', deleteAccountRouter);
app.use('/api/account', logInRouter);
app.use('/api/cart', addItemRouter);
app.use('/api/cart', deleteItemRouter);
app.use('/api/cart', updateItemRouter);
app.use('/api/cart', getCartRouter);
app.use('/api/transaction', addTransactionRouter);
app.use('/api/product', getProductRouter);
app.use('/api/product', getProductReviewsRouter);
app.use('/api/product', getSimilarProductsRouter);
app.use('/api/product', updatedProductRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {//Q: 
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.listen(2000, function () {
  console.log('Example app listening on port 2000!');
});
dotenv.config({path:'./.env'});

module.exports = app;

