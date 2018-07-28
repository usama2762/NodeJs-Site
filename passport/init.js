var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
require('./../models/users');
require('./../models/artist');
var Users = mongoose.model('Users');
var Artist = mongoose.model('Artist');
console.log("init")
/*
For loggin stratagy of user
 */
passport.use('login',new LocalStrategy({
    passReqToCallback : true
    },
    function(req,username, password, done) {
      var p = Users;
      if(!req.body.type)
        return done(null, false);
      if(req.body.type=="user")
        p = Users;
      else if(req.body.type=="artist")
        p = Artist; 
      else
        return done(null, false);
      p.findOne({ username: username }, function (err, user) {
      if (err) { return done(err,false); }
      if (!user) {
        return done(null, false);
      }
      if (user.password!=password) {
         return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, {user:user,type:req.body.type});
    });
  }
));


/**
 * @param  {object}
 * @param  {funtiocn}
 * @return {function}
 */
passport.serializeUser(function(user, done) {
  done(null, user);
});

/**
 * @param  {object}
 * @param  {function}
 * @return {function}
 */
passport.deserializeUser(function(user, done) {
  var p;
  if(user.type=="artist")
    p = Artist;
  if(user.type=="user")
    p = Users;
  p.findById(user.user._id, function(err, data) {
    data.type = user.type;
    done(err, data);
  });
});