var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Passport = require('./passport/init');

require('./models/users');
require('./models/artist');
require('./models/products');


try {
  mongoose.connect('mongodb://localhost/musicx');
}
catch(e){
  console.log("error connecting database: "+e);
}

var index = require('./routes/index');
var users = require('./routes/users');
var artistprofile = require('./routes/artistprofile');
var userprofile = require('./routes/userprofile');
var artist = require('./routes/artist');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/index', index);
app.use('/api/users', users);
app.use('/api/artistprofile', artistprofile);
app.use('/api/userprofile', userprofile);
app.use('/api/artist', artist);

app.get('/api/auth',function(req,res){
  if(req.user){
    res.json({logged:true,name:req.user.name,type:req.user.type,username:req.user.username,email:req.user.email});
  }
  else{
    res.json({logged:false,status:"offline"});
  }

});
app.get('/api/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('*', function(req, res) {
    res.sendFile(__dirname+'/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
