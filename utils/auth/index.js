const passport = require('passport-local');

const LocalStrategy = require('./strategies/local.strategy');


passport.use(LocalStrategy);

