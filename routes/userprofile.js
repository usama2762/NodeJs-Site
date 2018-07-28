var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Artist = mongoose.model('Artist');
var Products = mongoose.model('Products');

/* GET home page. */
router.get('/personal',ensureAuthenticated, function(req, res, next) {
		User.findOne({username:req.user.username},function(err,p) {
	if(err) { return res.json({error:"database error"});}
	if(p){
		res.json(p);
	}
	}).select({_id:0,__v:0,password:0});
});

router.post('/personal', function(req, res, next) {
	User.findOne({username:req.user.username},function(err,p) {
	if(err) { return res.json({error:"database error"});}
	if(p){
		p.name = req.body.name;
		p.email  = req.body.email;
		p.contact = req.body.contact;
		p.save(function(err) {
		if(err)
			return res.json({error:"intrnal server error"});
		else
			return res.json({msg:"suc"});
		});
	}
	});
});

router.post('/pass',ensureAuthenticated, function(req, res, next) {
	if(req.body.pass!=req.user.password){
		return res.json({error:"wrong current password"})
	}
	User.findOne({username:req.user.username},function(err,p) {
		if(err) { return res.json({error:"database error"});}
		if(p){
			p.password = req.body.newpass;
			p.save(function(err) {
			if(err)
				return res.json({error:"intrnal server error"});
			else
				return res.json({msg:"suc"});
			});
		}
	});
});


router.get('/product',ensureAuthenticated, function(req, res, next) {
	Products.find({username:req.user.username},function(err,p) {
		if(err)
			return res.json({error:"Internal server error"})
		else
			return res.json(p);
	})
});

router.post('/productadd',ensureAuthenticated, function(req, res, next) {
	var p = new Products();
	p.username = req.user.username;
	p.name = req.body.name;
	p.cost = req.body.cost;
	p.img = req.body.img;
	p.url = req.body.link;
	p.save(function(err) {
		if(err){console.log(err)
			return res.json({error:"intrnal server error"});
		}
		else
			return res.json({msg:"suc"});
	});
});

router.get('/productremove',ensureAuthenticated,function(req,res) {
    if(!req.query.id)
    	return res.json({error:"Send id"})
    var id = req.query.id;
    Products.remove({_id:id},function(err,p) {
    	if(err)
				return res.json({error:"intrnal server error"});
			else
				return res.json({msg:"suc"});
    });
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated() && req.user.type=="user")
	return next();
	else{
	res.json({error:"please login"});
	}
}


module.exports = router;
