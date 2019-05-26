var db = require('./DBController_public');

var userSystem = function() {
	
	this.version = "1.0.0";
	
	this.updateLog = `
		1. 将位于routes中的函数调用合并到userSystem中
	`
	
	// 用户注册
	this.createUser = function(req, res, next) {
		let strc = db.getSQLObject();
		console.log(req.body)
		strc["query"] = 'insert';
		strc["tables"] = "userInfo";
		strc["data"] = {
			"uid": req.body.id,
			"uname": req.body.username,
			"upassword": req.body.password,
			"uphone": req.body.phone,
			"uemail": req.body.email,
			"utype": req.body.status
		};//传入一个结构体
		db.ControlAPI_obj(strc, (resultFromDatabase)=>{
			console.log(resultFromDatabase); // 取下标为0即可
			if (resultFromDatabase == undefined) {
				res.status(400);
				res.send({"msg" : "Invaild message"});
			}
			else {
				res.send({"msg" : "Success"});
				console.log(resultFromDatabase)
			}
		});//回调函数，
	};
	
	// 用户登录
	this.loginUser = function(req, res, next) {
		let strc = db.getSQLObject();
		strc["query"] = 'select';
		strc["tables"] = "userInfo";
		strc["data"] = {
			"uid": req.body.id,
			"uname": req.body.username,
			"upassword": req.body.password
		};
		strc["where"]["condition"] = ["uid = "+req.body.id];
		// console.log("uid = "+req.body.id)
		db.ControlAPI_obj(strc, (resultFromDatabase)=>{
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
		let strc = db.getSQLObject();
		console.log(req.query.id)
		strc["query"] = 'select';
		strc["tables"] = "userInfo";
		strc["data"] = {
			"uid": req.query.id,
			"uname": req.body.username,
			"uphone": req.body.phone,
			"uemail": req.body.email,
			"utype": req.body.status,
			"umoney": 1,
			"ucreatetime": 2
		};
		strc["where"]["condition"] = ["uid = "+req.query.id];
		db.ControlAPI_obj(strc, (resultFromDatabase)=>{
			console.log(resultFromDatabase[0]); // 取下标为0即可
			if (resultFromDatabase[0] == undefined) {
				res.send({"msg":"用户不存在"})
			}
			else {
				res.send({"info": resultFromDatabase[0]});
			}
		});//回调函数，
	};

	// 用户更新
	this.updateUser = function(req, res, next) {
		let strc = db.getSQLObject();
		strc["query"] = 'update';
		strc["tables"] = "userInfo";
		if (req.body.username != null) {
			strc["data"]["uname"] = req.body.username;
		}
		if (req.body.phone != null) {
			strc["data"]["uphone"] = req.body.phone;
		}
		if (req.body.email != null) {
			strc["data"]["uemail"] = req.body.email;
		}
		if (req.body.status != null) {
			strc["data"]["utype"] = req.body.status;
		}
		if (req.body.money != null) {
			strc["data"]["umoney"] = req.body.money;
		}
		console.log(strc["data"])
		strc["where"]["condition"] = ["uid = "+req.body.id];
		db.ControlAPI_obj(strc, (resultFromDatabase)=>{
			console.log(resultFromDatabase)
			if (resultFromDatabase !== null && resultFromDatabase.message.charAt(15) !== '0') {
				res.send({"msg" : "Success"})
			}
			else {
				res.send({"msg": "Failed in modification."});
			}
		});//回调函数，
	};


};

module.exports = new userSystem();