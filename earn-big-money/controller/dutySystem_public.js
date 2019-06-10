var db = require('./DBController_public');
var utils = require('./Utils_public');
var tradeSystem = require('./tradeSystem_public');

var dutySystem = function() {
	this.version = "1.0.0";
	// 用于创建任务
	this.createDuty = async function(req, res, next) {
		// 首先判断用户是否存在，余额够不够，然后再更新事务表和用户表，事务用户表
		var userMoney = 0;
		// 查看账户余额
		try {
			userMoney = await tradeSystem.checkBalance(req.session.user.uid);
			if(userMoney[0].umoney < req.body.money * req.body.accepters){
				utils.sendError(res, 400, "Not enough money");
				return;
			}
		}
		catch(error) {
			utils.sendError(res, 400, "Fail");
		}
		tdid = (req.session.user.uid).toString() + "_" + utils.getMilliseconds().toString()
		try {
			let strc = db.getSQLObject();
			//更新事务信息
			strc["query"] = 'insert';
			strc["tables"] = "duty";
			strc["data"] = {
				"did": tdid,
				"dtitle": req.body.title,
				"dsponsor": req.session.user.uid,
				"daccepters": req.body.accepters,
				"dintroduction": req.body.introduction,
				"dcontent": req.body.content,
				"dstartTime": req.body.starttime,
				"dendTime": req.body.endtime,
				"dmoney": req.body.money,
				"dtype": req.body.type
			};//传入一个结构体
			let resultFromDatabase = await db.ControlAPI_obj_async(strc);
			if (resultFromDatabase == null) {
				utils.sendError(res, 400, "ID duplication");
				return;
			}
		}
		catch(err) {
			utils.sendError(res, 400, "Failed in creating a duty. 0");
			return;
		}
		// 更新账户余额
		try {
			let systemMoney = await tradeSystem.checkBalance("admin");
			let result = await tradeSystem.updateMoney(req.session.user.uid, userMoney[0].umoney-req.body.money * req.body.accepters);
			result = await tradeSystem.updateMoney("admin", systemMoney[0].umoney+req.body.money * req.body.accepters);
			result = await tradeSystem.addTradeRecord(req.session.user.uid, "admin", req.body.money * req.body.accepters);
		}
		catch(error) {
			utils.sendError(res, 400, "Can not update money");
		}

		try {
			//更新用户-事务表
			let strc = db.getSQLObject();
			strc["query"] = 'insert';
			strc["tables"] = "userDuty";
			strc["data"] = {
				"uid": req.session.user.uid,
				"did": tdid,
				"status": 'published'
			};//传入一个结构体
			let resultFromDatabase = await db.ControlAPI_obj_async(strc);
			if (resultFromDatabase == null) {
				utils.sendError(res, 400, "Failed in creating a duty.");
			}
			else {
				res.send({"did": tdid});
			}				
		}
		catch(err) {
			utils.sendError(res, 400, "Failed in creating a duty. 1");
			return;
		}
	}
	
	// 用于领取任务
	this.acceptDuty = async function(req, res, next){
		// 查询事务id即可，以及当前是否到达了人数上限，以及用户是否参加过同类活动，然后更新事务表和用户事务表
		curaccepters = 0;
		accepters = 0;
		try {
			let strc = db.getSQLObject();
			strc["query"] = 'select';
			strc["tables"] = "duty";
			strc["data"] = {
				"curaccepters": 0,
				"daccepters": 0
			};//传入一个结构体
			strc["where"]["condition"] = ["did = " + db.typeTransform(req.body.did)];
			let resultFromDatabase = await db.ControlAPI_obj_async(strc);
			if (resultFromDatabase == null || resultFromDatabase.length == 0) {
				utils.sendError(res, 400, `Duty[${req.body.did}] does not exist`);
				return;
			}
			else {
				curaccepters = resultFromDatabase[0].curaccepters;
				accepters = resultFromDatabase[0].accepters;
				if (curaccepters >= accepters) {
					utils.sendError(res, 400, "The number of accepters is full");
					return;
				}
			}
		}
		catch(error) {
			utils.sendError(res, 400, "Failed in taking a duty. 0");
			return;
		}
		try {
			let strc = db.getSQLObject();
			strc["query"] = 'insert';
			strc["tables"] = "userDuty";
			strc["data"] = {
				"uid": req.session.user.uid,
				"did": req.body.did,
				"status": "accepted"
			};//传入一个结构体
			let resultFromDatabase = await db.ControlAPI_obj_async(strc);
			if (resultFromDatabase == null) {
				//任务不可重复认领
				utils.sendError(res, 400, "Duty cannot be re-requested");
				return;
			}
		}
		catch(err) {
			utils.sendError(res, 400, "Failed in taking a duty. 1");
			return;
		}
		try {
			let strc = db.getSQLObject();
			strc["query"] = 'update';
			strc["tables"] = "duty";
			strc["data"] = {
				"curaccepters": curaccepters+1
			};//传入一个结构体
			strc["where"]["condition"] = ["did = "+ db.typeTransform(req.body.did)];
			let resultFromDatabase = await db.ControlAPI_obj_async(strc);
			if (resultFromDatabase == null) {
				utils.sendError(res, 400, "Failed in taking a duty.");
			}
			else {
				res.send({"msg": "success."});
			}
		}
		catch(err) {
			utils.sendError(res, 400, "Failed in taking a duty. 2");
			return;
		}
	}

	// 用于查询任务
	this.queryDuty = async function(req, res, next){
		try{
			let strc = db.getSQLObject();
			strc["query"] = 'select';
			strc["tables"] = "duty";
			strc["data"] = {
				"*" : 0
			};
			strc["where"]["condition"] = ["did = " + db.typeTransform(req.params.did)];
			var duty = await db.ControlAPI_obj_async(strc);
			if(duty.length == 0) {
				utils.sendError(res, 400, `Duty[${req.params.did}] does not exist`);
			}
		}
		catch (error) {
			utils.sendError(res, 400, 'Error in queryDuty 0.');
			return;
		}
		try {
			let strc = db.getSQLObject();
			strc["query"] = 'select';
			strc["tables"] = "userDuty";
			strc["data"] = {
				"uid": 0,
				"status": 0
			};
			strc["where"]["condition"] = ["did = " + db.typeTransform(req.params.did), "status != 'published'"];
			let accepters = await db.ControlAPI_obj_async(strc);
			res.send({ 
				"id": duty[0].did,
				"sponsor": duty[0].dsponsor,
				"title": duty[0].dtitle,
				"maxAccepters": duty[0].daccepters,
				"accepters": accepters,
				"curAccepters": duty[0].curaccepters,
				"introduction" : duty[0].dintroduction,
				"content": duty[0].dcontent,
				"money": duty[0].dmoney,
				"startTime": duty[0].dstartTime,
				"endTime": duty[0].dendTime,
				"type": duty[0].dtype
			});
		} 
		catch(err) {
			utils.sendError(res, 400, 'Error in queryDuty 1.');
			return;
		}
	}
	
	// 用于更新任务
	this.updateDuty = async function(req, res, next) {
		//如果对money或uaccepter进行更新的话，首先看是否已经有人接受，如果有人接受的话就不能改，如果想提高价格的话，要看余额够不够
		try{
			let strc = db.getSQLObject();
			strc["query"] = 'select';
			strc["tables"] = "userInfo";
			strc["data"] = {
				"umoney": 0
			};//传入一个结构体
			strc["where"]["condition"] = ["uid = " + db.typeTransform(req.session.user.uid)];
			var person = await db.ControlAPI_obj_async(strc);
			if (person == null || person.length == 0) {
				utils.sendError(res, 400, "User[${req.session.user.uid}] does not exist");
				return;
			}
		}
		catch (error) {
			utils.sendError(res, 400, 'Failed in modification 0.');
			return;
		}
		try{
			let strc = db.getSQLObject();
			strc["query"] = 'select';
			strc["tables"] = "duty";
			strc["data"] = {
				"dsponsor": 0,
				"dmoney": 0,
				"daccepters": 0,
				"curaccepters": 0
			};//传入一个结构体
			strc["where"]["condition"] = ["did = " + db.typeTransform(req.params.did)];
			let resultFromDatabase = await db.ControlAPI_obj_async(strc);
			if (resultFromDatabase == null || resultFromDatabase.length == 0) {
				//事务id不存在
				utils.sendError(res, 400, 'Duty[${req.params.did}] does not exist');
				return;
			}
			else if (resultFromDatabase[0].dsponsor != req.session.user.uid) {
				//你不是事务的发起者，无更改权限
				utils.sendError(res, 400, 'you have no permission to change it');
				return;
			}
			else if (resultFromDatabase[0].curaccepters > 0) {
				//任务已经有人认领，不可更改
				console.log(resultFromDatabase[0].curaccepters);
				utils.sendError(res, 400, 'The duty has been claimed and cannot be changed.');
				return;
			}
			else if (req.body.money * req.body.accepters > resultFromDatabase[0].umoney) {
				//余额不足
				utils.sendError(res, 400, 'The money is not enough');
				return;
			}
			else {
				;
			}
		}
		catch (error) {
			utils.sendError(res, 400, 'Failed in modification.1');
			return;
		}
		try{
			let strc = db.getSQLObject();
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
			if (req.body.introduction != null) {
				strc["data"]["dintroduction"] = req.body.introduction;
			}
			strc["where"]["condition"] = ["did = "+db.typeTransform(req.params.did)];
			let resultFromDatabase = await db.ControlAPI_obj_async(strc);
			if (resultFromDatabase !== null) {
				res.send({"msg": "Success."});
			}
			else {
				utils.sendError(res, 400, 'Failed in modification.');
			}
		}
		catch (error) {
			utils.sendError(res, 400, 'Failed in modification.2');
			return;
		}
	}
	
	
	// 用于删除任务
	this.deleteDuty = async function(req, res, next) {
		//首先看是否已经有人接受，如果有人接受的话就不能删，然后还要更新回去价格，从userduty里面删对应的表
		try {
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
			let resultFromDatabase = await db.ControlAPI_obj_async(strc);
			if (resultFromDatabase == null || resultFromDatabase.length == 0) {
				//事务id不存在
				utils.sendError(res, 400, `Duty[${req.params.did}] does not exist`);
				return;
			}
			else if (resultFromDatabase[0].dsponsor != req.session.user.uid) {
				//你不是事务的发起者，无更改权限
				utils.sendError(res, 400, 'you have no permission to delete it');
				return;
			}
			else if (resultFromDatabase[0].curaccepters > 0) {
				//任务已经有人认领，不可更改
				utils.sendError(res, 400, 'The duty has been claimed and cannot be changed.');
				return;
			}
			else {
				;
			}
		}
		catch(err) {
			utils.sendError(res, 400, "Failed in deleting a duty. 0");
			return;
		}
		try {
			let strc = db.getSQLObject();
			strc["query"] = 'delete';
			strc["tables"] = "duty";
			strc["where"]["condition"] = ["did = "+db.typeTransform(req.params.did)];
			let resultFromDatabase = await db.ControlAPI_obj_async(strc);
			if (resultFromDatabase !== null) {
				res.send({"msg": "Success"});
			}
			else {
				utils.sendError(res, 400, "Failed in deleting a duty. 0");
			}
		}
		catch(err) {
			utils.sendError(res, 400, "Failed in deleting a duty. 0");
			return;
		}		
	}

	this.screenDuty = async function(req, res, next) {
		let strc = db.getSQLObject();
		let tableStr = "duty";
		let dataObj = {
			"duty.*":0
		};
		let conditions = [];

		if(req.query.selectByAccepter){
			dataObj["userDuty.uid as accepter"] = 0;
			dataObj["userDuty.status"] = 0;
			tableStr = "userDuty," + tableStr;
			conditions.push('userDuty.did = duty.did');
			conditions.push('userDuty.uid = ' + db.typeTransform(req.query.selectByAccepter));
		}
		if(req.query.selectBySponsor) {
			conditions.push('duty.dsponsor = ' + db.typeTransform(req.query.selectBySponsor));
		}
		if(req.query.selectByType) {
			conditions.push('duty.dtype = ' + db.typeTransform(req.query.selectByType));
		}

		strc["query"] = 'select';
		strc["tables"] = tableStr;
		strc["data"] = dataObj;
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
		try{
			let result = await db.ControlAPI_obj_async(strc);
			res.send({"count": result.length, "content": result});
		}
		catch(error){
			res.send({ "msg": "Failed in screening."})
			return;
		}
	};

	this.commitDuty = async function(req, res, next) {
		let stru = db.getSQLObject();
		stru["query"] = "update";
		stru["tables"] = "userDuty";
		stru["data"] = {
			"status" : "done"
		};
		stru["where"]["condition"] = [
			"did = " + db.typeTransform(req.body.did),
			"uid = " + db.typeTransform(req.session.user.uid)
		];
		try {
			let result = await db.ControlAPI_obj_async(stru);
			res.send({ "msg": "Success."})
			return;
		}
		catch(error) {
			res.send({ "msg": "Failed to commit the duty."})
			return;
		}
	};

	this.confirmDuty = async function(req, res, next){
		let temp_s = new dutySystem();
		if(req.body.accepter.constructor == Array){
			temp_s.confirmDutyForGroup(req, res, next);
		}
		else{
			temp_s.confirmDutyForPerson(req, res, next);
		}
	}

	this.confirmDutyForPerson = async function(req, res, next) {
		let stru = db.getSQLObject(),
			stru1 = db.getSQLObject();
		stru["query"] = "update";
		stru["tables"] = "userDuty";
		stru["data"] = {
			"status" : "finish"
		};
		stru["where"]["condition"] = [
			"did = " + db.typeTransform(req.body.did),
			"uid = " + db.typeTransform(req.body.accepter)
		];

		try {
			stru1["query"] = "select";
			stru1["tables"] = "duty";
			stru1["data"] = {
				"dmoney" : 0
			}
			stru1["where"]["condition"] = [
				"did = " + db.typeTransform(req.body.did),
				"dsponsor = " + db.typeTransform(req.session.user.uid)
			];
		}
		catch(error){
			utils.sendError(res, 400, "Log in first");
		}
		
		// 更新账户余额
		try {
			let dutyMoney = await db.ControlAPI_obj_async(stru1);
			if(dutyMoney.length == 0) {
				throw "No duty"
			}
			let userMoney = await tradeSystem.checkBalance(req.body.accepter);
			let systemMoney = await tradeSystem.checkBalance("admin");
			await tradeSystem.updateMoney(req.body.accepter, userMoney[0].umoney+dutyMoney[0].dmoney);
			await tradeSystem.updateMoney("admin", systemMoney[0].umoney-dutyMoney[0].dmoney);
			await tradeSystem.addTradeRecord("admin", req.body.accepter, dutyMoney[0].dmoney);
		}
		catch(error) {
			utils.sendError(res, 400, "Can not update the trade record : " + error);
		}
		try {
			let result = await db.ControlAPI_obj_async(stru);
			res.send({ "msg": "Success."});
			return;
		}
		catch(error) {
			res.send({ "msg": "Failed to commit the duty."});
			return;
		}
	};

	this.confirmDutyForGroup = async function(req, res, next){
		let stru = db.getSQLObject(),
			stru1 = db.getSQLObject();
		let accepters = []
		for(var i = 0; i < req.body.accepter.length; i++){
			accepters.push(db.typeTransform(req.body.accepter[i]));
		}
		stru["query"] = "update";
		stru["tables"] = "userDuty";
		stru["data"] = {
			"status" : "finish"
		};
		stru["where"]["condition"] = [
			"did = " + db.typeTransform(req.body.did),
			"uid in ( " + accepters.join(",") + ")"
		];
		try {
			stru1["query"] = "select";
			stru1["tables"] = "duty";
			stru1["data"] = {
				"dmoney" : 0
			}
			stru1["where"]["condition"] = [
				"did = " + db.typeTransform(req.body.did),
				"dsponsor = " + db.typeTransform(req.session.user.uid)
			];
		}
		catch(error){
			utils.sendError(res, 400, "Log in first");
		}
		// 更新账户余额
		try {
			let dutyMoney = await db.ControlAPI_obj_async(stru1);
			if(dutyMoney.length == 0) {
				throw "No duty"
			}
			accepters = req.body.accepter;
			for(let i = 0; i < accepters.length; i++){
				let userMoney = await tradeSystem.checkBalance(accepters[i]);
				let systemMoney = await tradeSystem.checkBalance("admin");
				await tradeSystem.updateMoney(accepters[i], userMoney[0].umoney+dutyMoney[0].dmoney);
				await tradeSystem.updateMoney("admin", systemMoney[0].umoney-dutyMoney[0].dmoney);
				await tradeSystem.addTradeRecord("admin", accepters[i], dutyMoney[0].dmoney);
			}
		}
		catch(error) {
			utils.sendError(res, 400, "Can not update the trade record : " + error);
		}
		try {
			let result = await db.ControlAPI_obj_async(stru);
			res.send({ "msg": "Success."});
			return;
		}
		catch(error) {
			res.send({ "msg": "Failed to commit the duty."});
			return;
		}
	}

	this.getDutyAccepters = async function(req, res, next) {
		let strc_duty = db.getSQLObject(),
			strc_user = db.getSQLObject();

		strc_duty["query"] = "select";
		strc_duty["tables"] = "duty";
		strc_duty["data"] = {
			"*": 0
		};
		strc_duty["where"]["condition"] = [
			"did = " + db.typeTransform(req.query.did)
		];

		strc_user["query"] = "select";
		strc_user["tables"] = "userDuty";
		strc_user["data"] = {
			"uid" : 0,
			"status" : 0
		};

		try {
			let dutyInfo = await db.ControlAPI_obj_async(strc_duty);
			var userInfo;
			if(dutyInfo.length != 0) {
				strc_user["where"]["condition"] = ["did = " + db.typeTransform(req.query.did)];
				userInfo = await db.ControlAPI_obj_async(strc_user);
				res.send({"duty" : dutyInfo[0], "accepters" : userInfo});
				return;
			}
			else {
				utils.sendError(res, 400, "Not Sponsor");
				return;
			}
		}
		catch(error) {
			utils.sendError(res, 400, "Error");
		}
	};
}

module.exports = new dutySystem();
