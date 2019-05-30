var db = require('./DBController_public');
var utils = require('./Utils_public')

var dutySystem = function() {
	this.version = "1.0.0";

	// 用于创建任务
	this.createDuty = function(req, res, next) {
		// 首先判断用户是否存在，余额够不够，然后再更新事务表和用户表，事务用户表
		tdid = ""
		let strc = db.getSQLObject();
		//更新事务信息
		strc["query"] = 'insert';
		strc["tables"] = "duty";
		tdid = (req.session.user.uid).toString() + "_" + utils.getMilliseconds().toString()
		strc["data"] = {
			"did": tdid,
			"dtitle": req.body.title,
			"dsponsor": req.session.user.uid,
			"daccepters": req.body.accepters,
			"dcontent": req.body.content,
			"dstartTime": req.body.starttime,
			"dendTime": req.body.endtime,
			"dmoney": req.body.money,
			"dtype": req.body.type
		};//传入一个结构体
		db.ControlAPI_obj(strc, (resultFromDatabase)=>{
			//console.log(resultFromDatabase1); // 取下标为0即可
			if (resultFromDatabase == null) {
				res.status(400);
				res.send({"msg" : "任务ID重复"});
			}
			else {
				//更新用户-事务表
				strc["query"] = 'insert';
				strc["tables"] = "userDuty";
				strc["data"] = {
					"uid": req.session.user.uid,
					"did": tdid,
					"status": 'published',
					"type": 'sponsor'
				};//传入一个结构体
				db.ControlAPI_obj(strc, (resultFromDatabase1)=>{
					if (resultFromDatabase1 == null) {
						res.send({"msg": "Failed in creating a duty."});
					}
					else {
						res.send({"did": tdid});
					}
				});					
			}
		});//回调函数
	}
	
	// 用于领取任务
	this.acceptDuty = function(req, res, next){
		// 查询事务id即可，以及当前是否到达了人数上限，以及用户是否参加过同类活动，然后更新事务表和用户事务表
		let strc = db.getSQLObject();
		strc["tables"] = "duty";
		strc["data"] = {
			"curaccepters": 0,
			"daccepters": 0
		};//传入一个结构体
		strc["where"]["condition"] = ["did = " + db.typeTransform(req.body.did)];
		db.ControlAPI_obj(strc, (resultFromDatabase)=>{
			//console.log(resultFromDatabase1); // 取下标为0即可
			if (resultFromDatabase == null || resultFromDatabase.length == 0) {
				res.send({"msg" : "任务ID不存在"});
			}
			else {
				if (resultFromDatabase[0].curaccepters >= resultFromDatabase[0].accepters) {
					res.send({"msg" : "任务人数已满"});
				}
				else {
					strc["query"] = 'insert';
					strc["tables"] = "userDuty";
					strc["data"] = {
						"uid": req.session.user.uid,
						"did": req.body.did,
						"status": "accepted",
						"type": "accepter"
					};//传入一个结构体
					db.ControlAPI_obj(strc, (resultFromDatabase1)=>{
						if (resultFromDatabase1 == null) {
							res.send({"msg" : "任务不可重复认领"});
						}
						else {
							strc["query"] = 'update';
							strc["tables"] = "duty";
							strc["data"] = {
								"curaccepters": resultFromDatabase[0].curaccepters+1
							};//传入一个结构体
							strc["where"]["condition"] = ["did = "+ db.typeTransform(req.body.did)];
							db.ControlAPI_obj(strc, (resultFromDatabase2)=>{
								if (resultFromDatabase2 == null) {
									res.send({"msg": "Failed in taking a duty."});
								}
								else {
									res.send({"msg": "success."});
								}
							});
						}
					});//回调函数，
				}
			}
		});//回调函数，	
	}

	// 用于查询任务
	this.queryDuty = function(req, res, next){
		let strc = db.getSQLObject();
		strc["query"] = 'select';
		strc["tables"] = "duty";
		strc["data"] = {
			"did": 0,
			"dtitle": 0,
			"dsponsor": 0,
			"daccepters": 0,
			"curaccepters": 0,
			"dmodifyTime": 0,
			"dcontent": 0,
			"dstartTime": 0,
			"dendTime": 0,
			"dmoney": 0,
			"dtype": 0
		};
		strc["where"]["condition"] = ["did = " + db.typeTransform(req.params.did)];
		db.ControlAPI_obj(strc, (resultFromDatabase)=>{
			if (resultFromDatabase == null || resultFromDatabase.length == 0) {
				res.send({ "msg": "Failed in finding this duty."})
			}
			else {
				res.send({ 
					"id": resultFromDatabase[0].did,
					"sponsor": resultFromDatabase[0].dsponsor,
					"title": resultFromDatabase[0].dtitle,
					"accepters": resultFromDatabase[0].daccepters,
					"curAccepters": resultFromDatabase[0].curaccepters,
					"content": resultFromDatabase[0].dcontent,
					"money": resultFromDatabase[0].dmoney,
					"startTime": resultFromDatabase[0].dstartTime,
					"endTime": resultFromDatabase[0].dendTime,
					"type": resultFromDatabase[0].dtype
				});
			}
		});
	}
	
	// 用于更新任务
	this.updateDuty = function(req, res, next) {
		//如果对money或uaccepter进行更新的话，首先看是否已经有人接受，如果有人接受的话就不能改，如果想提高价格的话，要看余额够不够
		let strc = db.getSQLObject();
		strc["query"] = 'select';
		strc["tables"] = "userInfo";
		strc["data"] = {
			"umoney": 0
		};//传入一个结构体
		strc["where"]["condition"] = ["uid = " + db.typeTransform(req.session.user.uid)];
		db.ControlAPI_obj(strc, (resultFromDatabase) => {
			if (resultFromDatabase == null || resultFromDatabase.length == 0) {
				res.status(400);
				res.send({"msg": "用户不存在"})
			}
			else {
				strc["query"] = 'select';
				strc["tables"] = "duty";
				strc["data"] = {
					"dsponsor": 0,
					"dmoney": 0,
					"daccepters": 0,
					"curaccepters": 0
				};//传入一个结构体
				strc["where"]["condition"] = ["did = " + db.typeTransform(req.params.did)];
				db.ControlAPI_obj(strc, (resultFromDatabase1)=>{					
					console.log(resultFromDatabase1)
					if (resultFromDatabase1 == null || resultFromDatabase1.length == 0) {
						res.status(400);
						res.send({"msg": "事务id不存在"});
					}
					else if (resultFromDatabase1[0].dsponsor != req.session.user.uid) {
						res.status(400);
						res.send({"msg": "你不是事务的发起者，无更改权限"});
					}
					else if (resultFromDatabase1[0].curaccepters > 0) {
						res.status(400);
						res.send({"msg": "任务已经有人认领，不可更改"});
					}
					else if (req.body.money * req.body.accepters > resultFromDatabase[0].umoney) {
						res.status(400);
						res.send({"msg": "余额不足"});
					}
					else {
						strc["query"] = 'update';
						strc["tables"] = "duty";
						strc["data"] = {};
						if (req.body.title != null) {
							strc["data"]["dtitle"] = req.body.title;
						}
						if (req.body.accepters != null) {
							strc["data"]["daccepters"] = req.body.accepters;
						}
						if (req.body.content != null) {
							strc["data"]["dcontent"] = req.body.content;
						}
						if (req.body.startTime != null) {
							strc["data"]["dstartTime"] = req.body.startTime;
						}
						if (req.body.endTime != null) {
							strc["data"]["dendTime"] = req.body.endTime;
						}
						if (req.body.money != null) {
							strc["data"]["dmoney"] = req.body.money;
						}
						strc["where"]["condition"] = ["did = "+db.typeTransform(req.params.did)];
						db.ControlAPI_obj(strc, (resultFromDatabase2)=>{
							if (resultFromDatabase2 !== null) {
								res.send({"msg": "Success."});
							}
							else {
								res.status(400);
								res.send({"msg": "Failed in modification."});
							}
						});//回调函数，
					}
				});
			}
		});
	}
	
	
	// 用于删除任务
	this.deleteDuty = function(req, res, next) {
		//首先看是否已经有人接受，如果有人接受的话就不能删，然后还要更新回去价格，从userduty里面删对应的表
		let strc = db.getSQLObject();
		strc["query"] = 'select';
		strc["tables"] = "duty";
		strc["data"] = {
			"dsponsor": 0,
			"dmoney": 0,
			"daccepters": 0,
			"curaccepters": 0
		};//传入一个结构体
		strc["where"]["condition"] = ["did = "+db.typeTransform(req.params.did)];
		db.ControlAPI_obj(strc, (resultFromDatabase)=>{
			if (resultFromDatabase[0] == null) {
				res.status(400);
				res.send({"msg": "事务id不存在"});
			}
			else if (resultFromDatabase[0].dsponsor != req.session.user.uid) {
				res.status(400);
				res.send({"msg": "你不是事务的发起者，无删除权限"});
			}
			else if (resultFromDatabase[0].curaccepters > 0) {
				res.status(400);
				res.send({"msg": "任务已经有人认领，不可删除"});
			}
			else {
				strc["query"] = 'delete';
				strc["tables"] = "duty";
				strc["where"]["condition"] = ["did = "+db.typeTransform(req.params.did)];
				db.ControlAPI_obj(strc, (resultFromDatabase1)=>{
					if (resultFromDatabase1 !== null) {
						res.send({"msg": "Success"});
					}
					else {
						res.send({"msg": "Failed in deleting a duty."});
					}
				});//回调函数，
			}
		});
			
	}

	this.screenDuty = function(req, res, next) {
		let strc = db.getSQLObject();
		strc["query"] = 'select';
		strc["tables"] = "duty";
		strc["data"] = {
			"did": 0,
			"dtitle": 0,
			"dsponsor": 0,
			"daccepters": 0,
			"curaccepters": 0,
			"dmodifyTime": 0,
			"dcontent": 0,
			"dstartTime": 0,
			"dendTime": 0,
			"dmoney": 0,
			"dtype": 0
		};
		conditions = []
		if(req.query.selectBySponsor) {
			conditions.push('dsponsor = ' + db.typeTransform(req.query.selectBySponsor));
		}
		if(req.query.selectByType) {
			conditions.push('dtype = ' + db.typeTransform(req.query.selectByType));
		}
		strc["where"]["condition"] = conditions;
		strc["options"]["limit"] = (req.query.pageNumber-1)*req.query.countPerPage+","+req.query.countPerPage;
		orderStr = "";
		if(req.query.sortType) {
			orderStr += req.query.sortType == "time" ? "dmodifyTime " : "";
			orderStr += req.query.sortType == "money" ? "dmoney " : "";
		}
		if(req.query.sortOrder) {
			orderStr += req.query.sortOrder == "ascend" ? "ASC" : "";
			orderStr += req.query.sortOrder == "descend" ? "DESC" : "";
		}
		strc["options"]["order by"] = orderStr;
		db.ControlAPI_obj(strc, (resultFromDatabase)=>{
			if (resultFromDatabase == null) {
				res.send({ "msg": "Failed in screening.."})
			}
			else {
				res.send({"count": resultFromDatabase.length, "content": resultFromDatabase});
			}
		});//回调函数，
	}
}

module.exports = new dutySystem();
