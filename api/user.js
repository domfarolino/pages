const authenticationHelpers = require('./authenticationHelpers');
const crypto = require('crypto');
const GitHubStrategy = require('passport-github2');
const passport = require('passport');
const routes = require('express').Router();
const { User } = require('../models/user');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const user = await User.findOne({githubId: profile.id});
      if (user) {
        user.githubId = profile.id;
        user.displayName = profile.displayName;
        user.username = profile.username;
        user.email = profile.emails?.length ? profile.emails[0].value : '';
        await user.save();
        return done(null, user);
      }

      try {
        const savedUser = await new User({
          githubId: profile.id,
          displayName: profile.displayName,
          username: profile.username,
          email: profile.emails?.length ? profile.emails[0].value : '',
          accessToken,
        }).save();

        done(null, savedUser);
      } catch (e) {
        done(e);
      }
    } // async function
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

///////////////////////////////

// '/api/user/logout'
routes.get('/logout', authenticationHelpers.isAuthOrRedirect, async (request, response, next) => {
  request.logout(function(err) {
    if (err) { return next(err); }
    response.redirect('/');
  });
});

module.exports = routes;
