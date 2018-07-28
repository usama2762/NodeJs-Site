var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var Artist = mongoose.model('Artist');
var Products = mongoose.model('Products');
var fs = require('fs');
var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
	callback(null, './public/uploads/songs');
  },
  filename: function (req, file, callback) {
	var name = req.user.username || "blah"
	callback(null, name + '-' + req.saveid);
  }
});
var storage2 =   multer.diskStorage({
  destination: function (req, file, callback) {
	callback(null, './public/uploads/pics');
  },
  filename: function (req, file, callback) {
	var name = req.user.username || "blah"
	callback(null, name);
  }
});
var limits = {fileSize: 1024*5}
var upload = multer({ storage : storage}).single('song');
function songupload(req,res,next) {
	if(!req.user)
		return res.json({error:"Don't fcuk around my server"})
	var id = parseInt(req.query.id);
	req.saveid = id;
	if(id>=9)
		return res.json({error:"Don't fcuk around my server"})
	if(id<=0)
		return res.json({error:"Don't fcuk around my server"})
	if(req.user.type=="artist"){
		upload(req,res,function(err) {
			if(err) {
				console.log(err)
				return res.json({error:"Error uploading file."});
			}
			else{
				console.log("files ",	req.files);
			}
			next();
		});
	}
	else{
		return res.end({error:"Don't fcuk around my server"})
	}
}

var upload_pic = multer({ storage : storage2}).single('pic');
function picupload(req,res,next) {
	if(!req.user)
		return res.json({error:"Don't fcuk around my server"})
	if(req.user.type=="artist"){
		upload_pic(req,res,function(err) {
			if(err) {
				console.log(err)
				return res.json({error:"Error uploading file."});
			}
			else{
			}
			next();
		});
	}
	else{
		return res.end({error:"Don't fcuk around my server"})
	}
}

/* GET home page. */
router.get('/personal',ensureAuthenticated,function(req, res, next) {
  Artist.findOne({username:req.user.username},function(err,p) {
	if(err) { return res.json({error:"database error"});}
	if(p){
	  res.json(p);
	}
}).select({_id:0,__v:0,password:0,songs:0,products:0});
});

router.post('/personal',ensureAuthenticated,function(req, res, next) {
  Artist.findOne({username:req.user.username},function(err,p) {
	if(err) { return res.json({error:"database error"});}
	if(p){
	  p.name = req.body.name;
	  p.email  = req.body.email;
	  p.song_type = req.body.song_type;
	  p.band = req.body.band;
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
	Artist.findOne({username:req.user.username},function(err,p) {
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

router.post('/pic',picupload,function(req,res) {
	res.redirect('/artist');
});

router.get('/picrm',ensureAuthenticated,function(req,res) {
	fs.unlink('./public/uploads/pics/'+req.user.username,function(err) {
		if(err){
			res.redirect('/artist');
		}
		else {
			res.redirect('/artist');
		}
	});
});
router.get('/song',ensureAuthenticated, function(req, res) {
		return res.json(req.user.songs)
});

router.post('/song',songupload, function(req, res, next) {
   Artist.findOne({username:req.user.username},function(err,p) {
		if(err) { return res.json({error:"Internal server Error"});}
		if(p){
		  p.songs[req.saveid] = req.body.name;
		  p.save(function(err) {
			if(err)
				return res.json({error:"intrnal server error"});
			else{
				return res.redirect('/artist')
			}
		  });
		}
	});
   //res.json({msg:"suc"})
});

router.get('/songrm',ensureAuthenticated,function(req,res) {
	Artist.findOne({username:req.user.username},function(err,p) {
		if(err) { return res.json({error:"Internal server Error"});}
		if(p){
		  p.songs[req.query.id] = "";
		  p.save(function(err) {
				if(err)
					return res.json({error:"intrnal server error"});
				else{
					fs.unlink('./public/uploads/songs/'+req.user.username+'-'+req.query.id,function(err) {
						if(err) console.log(err);
					});
					return res.redirect('/artist')
				}
			})
		}
	});
});

router.get('/products',ensureAuthenticated, function(req, res, next) {
  var vals = [];
	var t = req.user.products;
	product(t,function(p) {
		res.send(p);
	});
});

router.get('/accept',ensureAuthenticated, function(req, res, next) {
	if(!req.query.id)
		return res.json({error:"Wrong query"})
	Artist.findOne({username:req.user.username},function(err,p) {
		if(err) return res.json({error:"Internal server error"})
		if(p){
			var product = p.products.id(req.query.id);
			product.accepted = true;
			p.save(function(err) {
				if(err) return res.json({error:"Internal server error"})
				return res.json({msg:"suc"})
			})
		}
	});
});

router.get('/remove',ensureAuthenticated, function(req, res, next) {
	if(!req.query.id)
		return res.json({error:"Wrong query"})
	Artist.findOne({username:req.user.username},function(err,p) {
		if(err) return res.json({error:"Internal server error"})
		if(p){
			p.products.id(req.query.id).remove();
			p.save(function(err) {
				if(err) return res.json({error:"Internal server error"})
				return res.json({msg:"suc"})
			})
		}
	});
});

function product(t,cb) {
	var arr = [];
	t.forEach(function(val,i) {
		Products.findOne({_id:val.pid},function(err,p) {
			if(err) console.log(err);
			if(p){
				var a = {};
				a = p.toObject();
				a['accepted'] = val.accepted;
				a.id = val._id;
				arr.push(a)
				if(i+1==t.length)
					cb(arr);
			}
		});

	});
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.type=="artist")
	return next();
  else{
	res.json({error:"please login"});
  }
}

module.exports = router;
