var createError = require('http-errors');
//New stuff
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 8888;

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var callbackRouter = require('./routes/callback');
var homepageRouter = require('./routes/homepage');
var tracksRouter = require('./routes/tracks');
var playbackRouter = require('./routes/playback')
var tokenRouter = require('./routes/token')
var ptracksRouter = require('./routes/ptracks')
var artistsRouter = require('./routes/artists')
var discoverRouter = require('./routes/discover')
var searchRouter = require('./routes/search')
var categoriesRouter = require('./routes/categories')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({origin: 'http://localhost:5173'}));


app.use('/', indexRouter);
app.use('/auth/users', usersRouter);
app.use('/auth/login', loginRouter);
app.use('/auth/callback', callbackRouter);  
app.use('/auth/homepage', homepageRouter);
app.use('/auth/tracks', tracksRouter);
app.use('/auth/playback', playbackRouter);
app.use('/auth/token', tokenRouter);
app.use('/auth/ptracks', ptracksRouter);
app.use('/auth/artists', artistsRouter);
app.use('/auth/discover', discoverRouter);
app.use('/auth/search', searchRouter);
app.use('/auth/categories', categoriesRouter)
// const AuthRoutes = require('./routes/AuthRoutes');
// app.use('/api', cors(), AuthRoutes);
// app.listen(PORT, () => {
//   console.log('Server started on port ${PORT}');
// });

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
