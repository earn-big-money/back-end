var express = require('express');
var router = express.Router();
var db = require('./../controller/DBController_Yukikaze');

router.get('/register', function(req, res, next) {
	res.render('register');
});

router.get('/login', function(req, res, next) {
	res.render('login');
});

router.get('/query', function(req, res, next) {
	res.render('query');
});

router.get('/', function(req, res, next) {
	if(req.session.user) {
		//res.redirect("/index");
		res.send(req.session.user);
	}
	else {
		res.redirect('/login');
	}
});

router.post('/register', function(req, res, next) {
	console.log(req.body);
	db.insertUser({
		"uid": req.body.uid,
		"uname": req.body.uname,
		"upassword": req.body.upassword,
		"uphone": req.body.uphone,
		"uemail": req.body.uemail,
					}, //传入一个结构体
					(resultFromDatabase)=>{
						if (resultFromDatabase == null) {
							res.send("id已存在！");
						}
						else {
							req.session.user = req.body;
							//res.redirect("/index");
							res.send(req.session.user);
						}
					});//回调函数，
});

router.post('/login', function(req, res, next) {
	db.searchUser({
		"uid": req.body.uid,
		"index" : ["uid", "uname", "upassword", "uphone", "uemail", "umoney"]
					}, //传入一个结构体
					(resultFromDatabase)=>{
						console.log(resultFromDatabase[0]); // 取下标为0即可
						if (resultFromDatabase[0] == undefined) {
							res.send("用户不存在")
						}
						else if (req.body.upassword !== resultFromDatabase[0].upassword) {
							//console.log(req.session.user);
							res.send("密码错误！");
						}
						else {
							req.session.user = resultFromDatabase[0];
							//res.redirect("/index");
							res.send(req.session.user);
						}
					});//回调函数，
});

router.get('/logout', function(req, res, next) {
	req.session.user = null;
	res.redirect("/login");
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
