var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var Artist = mongoose.model('Artist');
var passport = require('passport');


/* GET users listing. */
router.get('/', function(req, res, next) {
	Users.find(function(err, users){
		if(err){ return next(err); }
		res.json(users);
	});
});

router.post('/login',
	passport.authenticate('login', {
		successRedirect: '/api/auth',
		failureRedirect: '/api/auth?er=e',
		failureFlash: false })
);

router.post('/register', function(req, res, next) {
	createUser(req,res);
});

function createUser(req,res) {
	var p1;
	if(req.body.type=="user"){
		p1 = new Users();
	}
	else if(req.body.type=="artist"){
		p1 = new Artist();
	}
	else
		return res.json({msg:"Don't Fcuk around"});
	p1.username = req.body.username;
	p1.password = req.body.password;
	p1.email = req.body.email;
	p1.name = req.body.name;
	p1.type = req.body.type;
	p1.save(function (err, p1) {
		if (err){
		 return res.json({error:"Problem in Database. Try Again later.", err:err});
		}
		else{
			return res.json({msg:"suc"});
		}
	});
}

module.exports = router;
