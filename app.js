const dotenv = require('dotenv')

dotenv.config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const cors = require('cors')

const pelangganRouter = require('./app/pelanggan/router');
const tagihanRouter = require('./app/tagihan/router');
const pengaduanRouter = require('./app/pengaduan/router');
const akunRouter = require('./app/akun/router');
const dashboardRouter = require('./app/dashboard/router');
const ambangRouter = require('./app/ambang/router');
const authRouter = require('./app/auth/router');

var app = express();
const URL = `/api/v1`
app.use(cors())

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(flash())
app.use(methodOverride('_method'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/adminlte', express.static(path.join(__dirname, '/node_modules/admin-lte/')))

// app.use('/', authRouter);
app.use(`${URL}`, authRouter);

app.use(`${URL}`, pelangganRouter);
app.use(`${URL}`, tagihanRouter);
app.use(`${URL}`, pengaduanRouter);
app.use(`${URL}`, akunRouter);
app.use(`${URL}`, dashboardRouter);
app.use(`${URL}`, ambangRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
