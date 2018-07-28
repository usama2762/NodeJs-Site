var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Artist = mongoose.model('Artist');

/* GET home page. */
router.get('/', function(req, res, next) {
  Artist.find({},function(err,p) {
  	if(err){
			return res.json({error:"Internal server error"});
		}
		if(p){
			return res.json(p);
		}
  }).limit(10).select({_id:0,song_type:0,band:0,contact:0,songs:0,products:0,password:0,email:0,__v:0})
});
router.get('/all', function(req, res, next) {
  Artist.find({},function(err,p) {
  	if(err){
			return res.json({error:"Internal server error"});
		}
		if(p){
			return res.json(p);
		}
  }).select({_id:0,songs:0,products:0,password:0,email:0,__v:0})
});

router.get('/moments', function(req, res, next) {
  Artist.find({},function(err,p) {
  	if(err){
			return res.json({error:"Internal server error"});
		}
		if(p){
			return res.json(p);
		}
  }).limit(3).select({_id:0,song_type:0,band:0,contact:0,products:0,password:0,email:0,__v:0})
});

module.exports = router;
