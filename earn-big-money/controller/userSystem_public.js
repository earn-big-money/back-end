var db = require('./DBController_public');
var utils = require('./Utils_public')

var userSystem = function() {
	
	this.version = "1.0.0";
	
	this.updateLog = `
		1. 将位于routes中的函数调用合并到userSystem中
	`
	
	// 用户注册
	this.createUser = async function(req, res, next) {
		try {
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
			let resultFromDatabase = await db.ControlAPI_obj_async(strc);
			if (resultFromDatabase == null) {
				utils.sendError(res, 400, "Invaild message");
			}
			else {
				res.send({
					"msg" : "Success"
				});
			}
		}
		catch(err) {
			utils.sendError(res, 400, "Invaild message");
		}
	};
	
	// 用户登录
	this.loginUser = async function(req, res, next) {
		if (req.session.user) {
			utils.sendError(res, 400, "[" + req.session.user.uid + "] already log in");
		}
		else {
			try {
				let strc = db.getSQLObject();
				strc["query"] = 'select';
				strc["tables"] = "userInfo";
				strc["data"] = {
					"uid": 0
				};
				strc["where"]["condition"] = [
					`(uid = ${db.typeTransform(req.body.id)} or
					 uemail = ${db.typeTransform(req.body.id)} or
					 uphone = ${db.typeTransform(req.body.id)})`,
					"upassword = " + db.typeTransform(req.body.password)
				];
				let resultFromDatabase = await db.ControlAPI_obj_async(strc);
				if (resultFromDatabase == null || resultFromDatabase.length == 0) {
					utils.sendError(res, 400, "Incorrect username or password");
				}
				else {
					req.session.regenerate((err) => {
						req.session.user = resultFromDatabase[0];
						res.send({
							"msg" : "Success"
						});
					});
				}
			}
			catch(err) {
				utils.sendError(res, 400, "Incorrect username or password");
			}
		}
	};
	
	// 用户登出
	this.logoutUser = function(req, res, next) {
		req.session.destroy((err) => {
			res.clearCookie("EBMcookie");
			res.send({"msg" : "Success"});
		});
	};
	
	this.checkLogStatus = function(req, res, next) {
		res.send({"id" : req.session.user.uid});
	};
	
	// 用户查找，感觉查找的内容可以是任意一个用户，所以没必要做登陆检测
	this.queryUser = async function(req, res, next) {
		console.log(req.params)
		try {
			let strc = db.getSQLObject();
			strc["query"] = 'select';
			strc["tables"] = "userInfo";
			strc["data"] = {
				"uid": 0,
				"uname": 0,
				"uphone": 0,
				"uemail": 0,
				"utype": 0,
				"ucreatetime": 0
			};
			strc["where"]["condition"] = [
				"uid = " + db.typeTransform(req.params.account),
				"uemail = " + db.typeTransform(req.params.account),
				"uphone = " + db.typeTransform(req.params.account)
			];
			strc["where"]["type"] = "or";
			let resultFromDatabase = await db.ControlAPI_obj_async(strc);
			if (resultFromDatabase == null || resultFromDatabase.length == 0) {
				utils.sendError(res, 400,`User[${req.params.account}] does not exist`);
			}
			else {
				res.send({
					"id" : resultFromDatabase[0]["uid"],
					"username" : resultFromDatabase[0]["uname"],
					"phone" : resultFromDatabase[0]["uphone"],
					"email" : resultFromDatabase[0]["uemail"],
					"status" : resultFromDatabase[0]["utype"],
					"createTime" : resultFromDatabase[0]["ucreatetime"]
				});
			}
		}
		catch(err) {
			utils.sendError(res, 400, "Please login first.");
		}
	};

	// 用户更新个人信息
	this.updateUser = async function(req, res, next) {
		if (req.session.user.uid != req.params.account) {
			utils.sendError(res, 400, 'Unauthorized operations.');
			return;
		}
		try {
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
			strc["where"]["condition"] = [
				"uid  = " + db.typeTransform(req.session.user.uid)
			];
			let resultFromDatabase = await db.ControlAPI_obj_async(strc);
			console.log(resultFromDatabase);
			if (resultFromDatabase == null) {
				utils.sendError(res, 400, "Failed in modification.");
			}
			else {
				res.send({"msg" : "Success"})
			}
		}
		catch(err) {
			utils.sendError(res, 400, "Failed in modification.");
		}
		
	};
	
	// 用户群组查找
	// 用户加入兴趣组
	// 用户退出兴趣组
};

module.exports = new userSystem();