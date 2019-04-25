var express = require('express');
var router = express.Router();
var db = require('./../controller/DBController_Yukikaze');

router.get('/', function(req, res, next) {
	if(req.session.user) {
		res.send(req.session.user);
	}
	else {
		res.send('no cookie');
	}
});

router.post('/create', function(req, res, next) {
	db.insertUser({
		"uid": req.body.id,
		"uname": req.body.username,
		"upassword": req.body.password,
		"uphone": req.body.phone,
		"uemail": req.body.email,
					}, //传入一个结构体
					(resultFromDatabase)=>{
						if (resultFromDatabase == null) {
							res.status(400);
							res.send({"msg" : "Invaild message"});
						}
						else {
							res.send({"msg" : "Success"});
						}
					});//回调函数，
});

router.post('/login', function(req, res, next) {
	console.log(req.body);
	db.searchUser({
		"uid": req.body.id,
		"index" : ["uid", "uname", "upassword", "uphone", "uemail", "umoney"]
					}, //传入一个结构体
					(resultFromDatabase)=>{
						console.log(resultFromDatabase[0]); // 取下标为0即可
						if (resultFromDatabase[0] == undefined || 
						req.body.password !== resultFromDatabase[0].upassword) {
							res.status(400);
							res.send("Incorrect username or password");
						}
						else {
							req.session.regenerate((err) => {
								req.session.user = resultFromDatabase[0];
								res.send("Success");
							});
						}
					});//回调函数，
});

router.get('/logout', function(req, res, next) {
	req.session.destroy((err) => {
		res.clearCookie("ebm");
		res.send("Success");
	});
});

router.post('/query', function(req, res, next) {
	console.log("query");
	db.searchUser({
		"uid": req.body.uid,
		"index" : ["uname", "uphone", "uemail", "umoney"]
					}, //传入一个结构体
					(resultFromDatabase)=>{
						console.log(resultFromDatabase[0]); // 取下标为0即可
						if (resultFromDatabase[0] == undefined) {
							res.send("用户不存在")
						}
						else {
							res.send({"info": resultFromDatabase[0]});
						}
					});//回调函数，
});

module.exports = router;
