let cors = require('cors')

let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let dotenv = require('dotenv');
let session = require('express-session');

let indexRouter = require('./routes/index');
let apiRouter = require('./routes/api');
let joinRouter = require('./routes/join/join');
let subscribeRouter = require('./routes/bulletin/subscribe');
let unsubscribeRouter = require('./routes/bulletin/unsubscribe');
let singInRouter = require('./routes/account/signIn/');
let logOutRouter = require('./routes/account/logout/');
let deleteAccountRouter = require('./routes/account/deleteAccount/');
let logInRouter = require('./routes/account/login/');
let validateEmailRouter = require('./routes/account/validateEmail');
let addItemRouter = require('./routes/cart/addItem/');
let deleteItemRouter = require('./routes/cart/deleteItem/');
let updateItemRouter = require('./routes/cart/updateItem/');
let getCartRouter = require('./routes/cart/getItems/');
let addTransactionRouter = require('./routes/transaction/add/');
let getTransactionRouter = require('./routes/transaction/getTransaction/');
let getProductRouter = require('./routes/product/getProduct/');
let addProductRouter = require('./routes/product/addProduct/');
let updatedProductRouter = require('./routes/product/updateProduct/');
let getProductReviewsRouter = require('./routes/product/getProductReviews/');
let getSimilarProductsRouter = require('./routes/product/getSimilarProducts/');
let getUnitCRouter =require('./routes/products/getUnitC');
let getAllProductsRouter = require('./routes/products/getAllProducts/');
let getViverosAndProductsRouter = require('./routes/products/getViverosAndProducts/');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/api/join', joinRouter);
app.use('/api/bulletin', subscribeRouter);
app.use('/api/bulletin',unsubscribeRouter);
app.use('/api/account', singInRouter);
app.use('/api/account', logOutRouter);
app.use('/api/account', deleteAccountRouter);
app.use('/api/account', logInRouter);
app.use('/api/account',validateEmailRouter);
app.use('/api/cart', addItemRouter);
app.use('/api/cart', deleteItemRouter);
app.use('/api/cart', updateItemRouter);
app.use('/api/cart', getCartRouter);
app.use('/api/transaction', addTransactionRouter);
app.use('/api/transaction', getTransactionRouter);
app.use('/api/product', getProductRouter);
app.use('/api/product', getProductReviewsRouter);
app.use('/api/product', getSimilarProductsRouter);
app.use('/api/product', updatedProductRouter);
app.use('/api/product', addProductRouter);
app.use('/api/products',getUnitCRouter);
app.use('/api/products', getAllProductsRouter);
app.use('/api/products', getViverosAndProductsRouter);



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

