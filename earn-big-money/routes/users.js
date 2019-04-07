var express = require('express');
var router = express.Router();

var db = require('./../database/DataBaseMySQL');

router.post('/create', function(req, res, next) {

});

router.post('/login', function(req, res, next) {

});

router.get('/logout', function(req, res, next) {
	db.dataBaseControl("INSERT INTO userInfo(uid) VALUES('AAA');", null, (r)=>{});
	res.send({"hello": "hello"});
});

module.exports = router;
