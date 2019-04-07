var express = require('express');
var router = express.Router();

var db = require('./../controller/DBController_Yukikaze');

router.post('/create', function(req, res, next) {
	responseJson(res , 'create' );
});

router.post('/login', function(req, res, next) {
	responseJson(res , 'login' );
});

router.get('/logout', function(req, res, next) {
	// sample
	db.searchUser(  {
						"uid": "CCC",
						"index" : ["uname", "umoney"]
					}, //传入一个结构体
					
					(resultFromDatabase)=>{
						console.log(resultFromDatabase[0]); // 取下标为0即可
						res.send({"hello": "hello"});
					});//回调函数，
});

module.exports = router;
