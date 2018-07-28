var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var Artist = mongoose.model('Artist');
var Products = mongoose.model('Products');

/* GET home page. */
router.get('/', function(req, res, next) {
  Artist.findOne({username:req.query.u},function(err,p) {
  	if(err){
			return res.json({error:"No Such User exist"})
		}
		if(p){
			if(req.query.song){
				return res.json(p.song);
			}
			res.json(p);
		}
  });
});

router.get('/products',function(req,res) {
    if(!req.query.username)
    	return res.json({error:"Wronge query"})
		Artist.findOne({username:req.query.username},function(err,p) {
			if(err) return res.json({error:"Internal Server error"});
			if(p){
				product(p,function(t) {
					res.send(t);
				});
			}
		});
});

router.get('/request',ensureAuthenticateduser,function(req,res) {
    if(!req.query.username)
    	return res.json({error:"Wronge query"})
    if(!req.query.id)
    	return res.json({error:"Wronge query"})
    Products.findOne({_id:req.query.id},function(err,p) {
    	if(err)
    		return res.json({error:"Internal Server error"})
    	if(p){
    		if(p.username!=req.user.username)
    			return res.json({error:"Don't fcuk around"})
    		Artist.findOne({username:req.query.username,'products.pid':req.query.id},function(errq,a) {
    			if(errq){
						return res.json({error:"Internal Server error"})
					}
    			if(a){
    				return res.json({error:"Duplicate Request"})
    			}
					else{
						addproduct(res,req.query.username,req.query.id);
					}
    		});
    	}
    });
});

function addproduct(res,username,id) {
	Artist.findOne({username:username},function(err,p) {
		if(err) return res.json({error:"Internal server error"})
		if(p){
			p.products.push({pid:id,accepted:false});
			p.save(function(err) {
				if(err) return res.json({error:"Internal server error"})
				return res.json({msg:"suc"})
			})
		}
	})
}

function product(t,cb) {
	var arr = [];
	var x = t.products.toObject();
	x.forEach(function(val,i) {
		Products.findOne({_id:val.pid},function(err,p) {
			if(err) console.log(err);
			if(p){
				var a = {};
				a = p.toObject();
				a.id = val._id;
				if(val.accepted)
					arr.push(a)
				if(i+1==x.length)
					cb(arr);
			}
		});
	});
}

function ensureAuthenticateduser(req, res, next) {
	if (req.isAuthenticated() && req.user.type=="user")
	return next();
	else{
	res.json({error:"please login"});
	}
}

module.exports = router;
