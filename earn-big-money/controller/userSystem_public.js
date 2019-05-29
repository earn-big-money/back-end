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
			//console.log(resultFromDatabase); // 取下标为0即可
			if (resultFromDatabase == null) {
				res.status(400);
				res.send({"msg" : "Can not create a user"});
			}
			else {
				res.send({
					"msg" : "Success"
				});
			}
		});//回调函数，	
	};
	
	// 用户登录
	this.loginUser = function(req, res, next) {
		//已经登录就跳转到主页
		if (req.session.user) {
			res.status(400);
			res.send({
				"msg" : "[" + req.session.user.uid + "] already log in"
			});
		}
		else {
			let strc = db.getSQLObject();
			strc["query"] = 'select';
			strc["tables"] = "userInfo";
			strc["data"] = {
				"uname": 0,
				"uemail": 0,
				"uphone": 0,
				"uid": 0
			};
			strc["where"]["condition"] = [
				`(uid = ${db.typeTransform(req.body.id)} or
				 uemail = ${db.typeTransform(req.body.id)} or
				 uphone = ${db.typeTransform(req.body.id)})`,
				"upassword = " + db.typeTransform(req.body.password)
			];
			db.ControlAPI_obj(strc, (resultFromDatabase)=>{
				if (resultFromDatabase == null || resultFromDatabase.length == 0) {
					res.status(400);
					res.send({"msg" : "Incorrect id or password"});
				}
				else {
					//去除密码
					req.session.regenerate((err) => {
						req.session.user = resultFromDatabase[0];
						res.send({
							"msg" : "Success"
						});
					});
				}
			});//回调函数，
		}
	};
	
	// 用户登出
	this.logoutUser = function(req, res, next) {
		req.session.destroy((err) => {
			res.clearCookie("EBMcookie");
			res.send({"msg" : "Success"});
		});
	};
	
	// 用户查找，感觉查找的内容可以是任意一个用户，所以没必要做登陆检测
	this.queryUser = function(req, res, next) {
		let strc = db.getSQLObject();
		//console.log(req.query.id)
		strc["query"] = 'select';
		strc["tables"] = "userInfo";
		strc["data"] = {
			"uid": 0,
			"uname": 0,
			"uphone": 0,
			"uemail": 0,
			"utype": 0,
			"umoney": 0,
			"ucreatetime": 0
		};
		strc["where"]["condition"] = [
			"uid    = " + db.typeTransform(req.query.id),
			"uemail = " + db.typeTransform(req.query.id),
			"uphone = " + db.typeTransform(req.query.id)
		];
		strc["where"]["type"] = "or";
		db.ControlAPI_obj(strc, (resultFromDatabase)=>{
			if (resultFromDatabase == null) {
				res.send({"msg":"用户不存在"})
			}
			else {
				res.send({"info": resultFromDatabase[0]});
			}
		});//回调函数，
	};

	// 用户更新
	this.updateUser = function(req, res, next) {
		if (req.session.user) {
			let strc = db.getSQLObject();
			strc["query"] = 'update';
			strc["tables"] = "userInfo";
			if (req.body.id != null) {
				strc["data"]["uname"] = req.body.id;
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
			strc["where"]["condition"] = [
				"uid  = " + db.typeTransform(req.session.user.uid),
				"uemail = " + db.typeTransform(req.session.user.uemail),
				"uphone = " + db.typeTransform(req.session.user.uphone)
			];
			// strc["where"]["type"] = "or";
			db.ControlAPI_obj(strc, (resultFromDatabase)=>{
				console.log(resultFromDatabase)
				if (resultFromDatabase != null && resultFromDatabase.message.charAt(15) !== '0') {
					//更新一下session，防止用户名电话之类的改了
					if (req.body.id != null) {
						req.session.user.uid = req.body.id;
					}
					if (req.body.phone != null) {
						req.session.user.uphone = req.body.phone;
					}
					if (req.body.email != null) {
						req.session.user.uemail = req.body.email;
					}
					res.send({"msg" : "Success"})
				}
				else {
					res.send({"msg": "Failed in modification."});
				}
			});//回调函数，
		}
		else {
			res.send({
				"msg" : "Not log in", 
				"data": {
					"uid": req.session.user.uid
				}
			});
		}
	};
	
	// 用户群组查找
	// 用户加入兴趣组
	// 用户退出兴趣组
};

module.exports = new userSystem();