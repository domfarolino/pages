require('dotenv').config();

const authenticationHelpers = require('./api/authenticationHelpers');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const {User} = require('./models/user');

const kPort = 8000;
const app = express();

// Note: This must come before the subsequent `app.use()`s.
app.use(logger('dev'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'secret-here',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 hour
    secure: false,
    httpOnly: true,
  }
}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * API setup
 */
const server = http.createServer({}, app);

server.listen(kPort, () => {
  console.log(`Server starting on port ${kPort}`);
});

app.get('/', (request, response) => {
  response.render('index', {isAuthenticated: request.isAuthenticated(), accessToken: request.isAuthenticated() ? request.user.accessToken : undefined});
});
app.use('/', express.static('public'))

const api = require('./api');
app.use('/api', api);
