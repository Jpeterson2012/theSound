const createError = require('http-errors');
//New stuff
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 8888;

const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('/home/jpeterson93/127.0.0.1+1-key.pem'),
  cert: fs.readFileSync('/home/jpeterson93/127.0.0.1+1.pem')
};
const express = require('express');
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//app.set('trust proxy', 1);

app.use(cookieParser());

//DB INIT
const {dbInit} = require('./database/dbinit');
(async () => {
  await dbInit();

  console.log('Database initialized.');
})();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const callbackRouter = require('./routes/callback');
const tracksRouter = require('./routes/tracks');
const tokenRouter = require('./routes/token')
const ptracksRouter = require('./routes/ptracks')
const artistsRouter = require('./routes/artists')
const artists2Router = require('./routes/artists2')
const discoverRouter = require('./routes/discover')
const searchRouter = require('./routes/search')
const categoriesRouter = require('./routes/categories')
const cplaylistsRouter = require('./routes/cplaylists')
const shuffleRouter = require('./routes/shuffle')
const updateRouter = require('./routes/update')
const homepage2Router = require('./routes/homepage2')
const playerRouter = require('./routes/player')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));


app.use('/', indexRouter);
app.use('/auth/users', usersRouter);
app.use('/auth/login', loginRouter);
app.use('/auth/callback', callbackRouter);  
app.use('/auth/tracks', tracksRouter);
app.use('/auth/token', tokenRouter);
app.use('/auth/ptracks', ptracksRouter);
app.use('/auth/artists', artistsRouter);
app.use('/auth/artists2', artists2Router)
app.use('/auth/discover', discoverRouter);
app.use('/auth/search', searchRouter);
app.use('/auth/categories', categoriesRouter)
app.use('/auth/cplaylists', cplaylistsRouter);
app.use('/auth/shuffle', shuffleRouter);
app.use('/auth/update', updateRouter)
app.use('/auth/homepage2', homepage2Router);
app.use('/auth/player', playerRouter);

//app.listen(PORT, "127.0.0.1", () => {
//  console.log(`server running at http://127.0.0.1:${PORT}`);
//});

https.createServer(options, app).listen(PORT, "127.0.0.1", () => {
  console.log(`HTTPS server running on https://localhost:${PORT}`);
}); 

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
  res.send("200")
  res.status(err.status || 500);
  res.render('error');
});

//process.on('SIGINT', () => {
//  server.close(() => {
//    console.log('Server closed');
//    process.exit(0);
//  });
//});

module.exports = app;
