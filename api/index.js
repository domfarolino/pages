const authenticationHelpers = require('./authenticationHelpers');
const mongoose = require('mongoose');
const routes = require('express').Router();
const passport = require('passport');

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', _ => {console.log('Connected to mongoose in API index!')});

/**
 * CORS and cache-handling stuff
 */
routes.use('/*', (request, response, next) => {
  const origin = request.headers.origin;
  const allowedOrigins = [
    'http://localhost:8000',
    'https://localhost:443',
  ];

  if (allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    response.setHeader('Access-Control-Allow-Credentials', true);
  }

  // API responses should never be stored
  response.set({
    'Cache-Control': 'no-store',
  });

  response.removeHeader('X-Powered-By');
  next();
});

// API index handler
routes.get('/', (request, response) => {
  response.json({api: true, authenticated: request.isAuthenticated()});
});

// API index handler
routes.get('/github-callback', passport.authenticate('github'), (request, response) => {
  console.assert(request.isAuthenticated());
  response.redirect(`/?username=${request.user.username}`);
});

// '/api/user/logout'
routes.get('/logout', authenticationHelpers.isAuthOrRedirect, async (request, response, next) => {
  request.logout(function(err) {
    if (err) { return next(err); }
    response.redirect('/');
  });
});

// Registration endpoints
const userRoutes = require('./user');
routes.use('/user', userRoutes);

module.exports = routes;
