const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// define the models that will be using this file:
const User = require("../models/user");

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

module.exports = passport;