var database = require('./../database/DataBaseMySQL');

var dbController = function() {
	
	this.version = "1.1.0";
	// 正确性验证，暂时无用
	this.structureAnalysis = function(struc) {
		
	};
	// sql是语句，args是参数，callback回调函数
	this.generalOperation = function(sql, args, callback) {
		database.dataBaseControl(sql, args, callback);
	};
	// user是一个结构体，callback是回调函数
	/*
		{
			uid,
			uname,
			upassword,
			uphone,
			uemail,
			umoney
		}
	*/
	this.insertUser = function(user, callback) {
		let key = [];
		let value = [];
		for(var info in user){
			key.push(info);
			value.push(user[info]);
		}
		let sql = `insert into userInfo(${key.join(",")}) values(${key.fill('?').join(",")});`;
		console.log(sql);
		database.dataBaseControl(sql, value, callback);
	};
	
	this.insertDuty = function(duty) {
		
	};
	// user是一个结构体，callback是回调函数
	/*
	{
		"uid": ...,
		"uname": ...,
		...
	} 
	*/
	this.updateUser = function(user, callback) {
		let key = [];
		let value = [];
		if(user["uid"]){
			for(var info in user){
				if(info != "uid"){
					key.push([info,"?"].join(" = "))
					value.push(user[info]);
				}	
			}
			console.log(key, value);
			let sql = `update userInfo set ${key.join(",")} where uid = ?;`;
			console.log(sql);
			value.push(user["uid"]);
			database.dataBaseControl(sql, value, callback);
		}
		else{
			callback(null);
		}
	};
	// user是一个结构体，callback是回调函数
	/*
	{
		"uid": ...
	} 
	*/
	this.deleteUser = function(user, callback) {
		let value = [];
		if(user["uid"]){
			let sql = `delete from userInfo where uid = ?;`;
			console.log(sql);
			value.push(user["uid"]);
			database.dataBaseControl(sql, value, callback);
		}
		else{
			callback(null);
		}
	}
	
	// user是一个结构体，callback是回调函数
	/*
	{
		"uid": ...,
		"index" : ["uname", "umoney",...]
	} 
	*/
	this.searchUser = function(user, callback) {
		let value = [];
		if(user["uid"]){
			let key = user["index"];
			let sql = `select ${key.join(",")} from userInfo where uid = ?;`;
			console.log(sql);
			value.push(user["uid"]);
			database.dataBaseControl(sql, value, callback);
		}
		else{
			callback(null);
		}
	}
	
	// Duty部分
	/*
	{
		did,
		dsponsor,
		daccepter,
		dcontent,
		dstartTime,
		dendTime,
		dmoney,
		dtype,
		dstatus
	}
	*/
	// 同时添加duty和userDuty
	this.insertDutyForUser = function(uid, duty, callback){
		let temp_controller = new dbController();
		temp_controller.insertDuty(duty, (result) => {
			if(result == null){ callback(null); return; }
			temp_controller.insertUserDuty(
			{
				"uid": uid,
				"did": duty["did"],
				"status": duty["dstatus"],
				"type": uid == duty["dsponsor"]? 0 : 1 // 0代表发起者，1代表接收者
			},
			callback)
		});
	}
	// 同时更新duty和userDuty
	this.updateDutyForUser = function(uid, duty, callback){
		let temp_controller = new dbController();
		temp_controller.insertDuty(duty, (result) => {
			if(result == null){ callback(null); return; }
			temp_controller.insertUserDuty(
			{
				"uid": uid,
				"did": duty["did"],
				"status": duty["dstatus"],
				"type": uid == duty["dsponsor"]? 0 : 1 // 0代表发起者，1代表接收者
			},
			callback)
		});
	}
	this.insertDuty = function(duty, callback){
		let key = [];
		let value = [];
		for(var info in duty){
			key.push(info);
			value.push(duty[info]);
		}
		let sql = `insert into duty(${key.join(",")}) values(${key.fill('?').join(",")});`;
		console.log(sql);
		database.dataBaseControl(sql, value, callback);
	}
	
	this.updateDuty = function(duty, callback){
		let key = [];
		let value = [];
		if(duty["did"]){
			for(var info in duty){
				if(info != "did"){
					key.push([info,"?"].join(" = "))
					value.push(duty[info]);
				}	
			}
			console.log(key, value);
			let sql = `update duty set ${key.join(",")} where did = ?;`;
			console.log(sql);
			value.push(duty["did"]);
			database.dataBaseControl(sql, value, callback);
		}
		else{
			callback(null);
		}
	}
	
	this.searchDuty = function(duty, callback){
		let value = [];
		if(duty["did"]){
			let key = duty["index"];
			let sql = `select ${key.join(",")} from duty where did = ?;`;
			console.log(sql);
			value.push(duty["did"]);
			database.dataBaseControl(sql, value, callback);
		}
		else{
			callback(null);
		}
	}
	
	this.deleteDuty = function(duty, callback){
		let value = [];
		if(duty["did"]){
			let sql = `delete from duty where did = ?;`;
			console.log(sql);
			value.push(duty["did"]);
			database.dataBaseControl(sql, value, callback);
		}
		else{
			callback(null);
		}
	}
	
	// userDuty
	/*
	{
		uid,
		did,
		status,
		type
	}
	*/
	this.insertUserDuty = function(userDuty, callback){
		let key = [];
		let value = [];
		for(var info in userDuty){
			key.push(info);
			value.push(userDuty[info]);
		}
		let sql = `insert into userDuty(${key.join(",")}) values(${key.fill('?').join(",")});`;
		console.log(sql);
		database.dataBaseControl(sql, value, callback);
	}
	
	this.updateUserDuty = function(userDuty, callback){
		let key = [];
		let value = [];
		if(userDuty["did"] && userDuty["uid"]){
			for(var info in userDuty){
				if(info != "did" && info != "uid"){
					key.push([info,"?"].join(" = "))
					value.push(userDuty[info]);
				}	
			}
			console.log(key, value);
			let sql = `update userDuty set ${key.join(",")} where did = ? and uid = ?;`;
			console.log(sql);
			value.push(userDuty["did"], userDuty["uid"]);
			database.dataBaseControl(sql, value, callback);
		}
		else{
			callback(null);
		}
	}
	
	this.searchUserDuty = function(userDuty, callback){
		let value = [];
		if(userDuty["did"] && userDuty["uid"]){
			let key = userDuty["index"];
			let sql = `select ${key.join(",")} from userDuty where did = ? and uid = ?;`;
			console.log(sql);
			value.push(userDuty["did"], userDuty["uid"]);
			database.dataBaseControl(sql, value, callback);
		}
		else{
			callback(null);
		}
	}
	
	this.deleteUserDuty = function(userDuty, callback){
		let value = [];
		if(userDuty["did"] && userDuty["uid"]){
			let sql = `delete from userDuty where did = ? and uid = ?;`;
			console.log(sql);
			value.push(userDuty["did"], userDuty["uid"]);
			database.dataBaseControl(sql, value, callback);
		}
		else{
			callback(null);
		}
	}
	
	// tradeRecord
	this.insertTradeRecord = function(record, callback){
		
	}
	
	this.updateTradeRecord = function(record, callback){
		
	}
	
	this.searchTradeRecord = function(record, callback){
		
	}
	
	this.deleteTradeRecord = function(record, callback){
		
	}
};

module.exports = new dbController();