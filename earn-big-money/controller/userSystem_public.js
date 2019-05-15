var db = require('./DBController_Yukikaze');

var userSystem = function() {
	
	this.version = "1.0.0";
	
	this.updateLog = `
		1. 将位于routes中的函数调用合并到userSystem中
	`
	
	// 用户注册
	this.createUser = function(req, res, next) {
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
	};
	
	// 用户登录
	this.loginUser = function(req, res, next) {
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
				res.send({"msg" : "Incorrect username or password"});
			}
			else {
				req.session.regenerate((err) => {
					req.session.user = resultFromDatabase[0];
					res.send({"msg" : "Success"});
				});
			}
		});//回调函数，
	};
	
	// 用户登出
	this.logoutUser = function(req, res, next) {
		req.session.destroy((err) => {
			res.clearCookie("EBMcookie");
			res.send({"msg" : "Success"});
		});
	};
	
	// 用户查找
	this.queryUser = function(req, res, next) {
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
	};
};

module.exports = new userSystem();