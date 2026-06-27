require('dotenv').config();

const cors = require('cors');
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const auth = require('./middleware/auth');
const con = require('./database/dbpool.js');
const {dbInit} = require('./database/dbinit');
const {initSocket} = require("./socket");

const PORT = process.env.PORT || 8888;

//DB INIT
dbInit()
  .then(() => console.log("Database initialized."))
  .catch(err => {
    console.error("DB init failed:", err);

    process.exit(1);
  });

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const callbackRouter = require('./routes/callback');
const tracksRouter = require('./routes/tracks');
const tokenRouter = require('./routes/token');
const ptracksRouter = require('./routes/ptracks');
const artistsRouter = require('./routes/artists');
const artists2Router = require('./routes/artists2');
const discoverRouter = require('./routes/discover');
const searchRouter = require('./routes/search');
const categoriesRouter = require('./routes/categories');
const cplaylistsRouter = require('./routes/cplaylists');
const shuffleRouter = require('./routes/shuffle');
const updateRouter = require('./routes/update');
const homepageRouter = require('./routes/homepage');
const playerRouter = require('./routes/player');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));

app.use('/', indexRouter);
app.use('/auth/login', loginRouter);
app.use('/auth/callback', callbackRouter);  
app.use('/auth/users', auth, usersRouter);
app.use('/auth/tracks', auth, tracksRouter);
app.use('/auth/token', auth, tokenRouter);
app.use('/auth/ptracks', auth, ptracksRouter);
app.use('/auth/artists', auth, artistsRouter);
app.use('/auth/artists2', auth, artists2Router)
app.use('/auth/discover', auth, discoverRouter);
app.use('/auth/search', auth, searchRouter);
app.use('/auth/categories', auth, categoriesRouter)
app.use('/auth/cplaylists', auth, cplaylistsRouter);
app.use('/auth/shuffle', auth, shuffleRouter);
app.use('/auth/update', auth, updateRouter)
app.use('/auth/homepage', auth, homepageRouter);
app.use('/auth/player', auth, playerRouter);

const options = {
  key: fs.readFileSync('/home/jpeterson93/127.0.0.1+1-key.pem'),
  cert: fs.readFileSync('/home/jpeterson93/127.0.0.1+1.pem')
};

const httpsServer = https.createServer(options, app);

initSocket(httpsServer, app);

httpsServer.listen(PORT, "127.0.0.1", () => {
  console.log(`HTTPS server running on https://localhost:${PORT}`);
}); 

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next({ status: 404, message: "Not found" });
});

// error handler
app.use((err, req, res, next) => {
  con.logError(err, req).catch(console.error);

  if (res.headersSent) {
    return next(err);
  }  

  res.status(err.status || 500).json({error: err.message});
});

module.exports = app;

//app.set('trust proxy', 1);

//app.listen(PORT, "127.0.0.1", () => {
//  console.log(`server running at http://127.0.0.1:${PORT}`);
//});