var database = require('./../database/DataBaseMySQL');
var utils = require('./Utils_public');

var dbController = function() {
	
	this.version = "2.0.0";
	
	this.updateLog = `
		1. 更新通用接口函数
		2. 设计通用数据库结构体
	`;
	
	// 返回数据库结构体
	this.getSQLObject = function(){
		return {
			// select/update/delete/insert
			"query": "select",
			// table name
			"tables": "",
			"data":{
				// for select, use ("key": anything)
				// for others, use ("key": value)
			},
			"where": {
				// and / or / not / ""
				"type": "and",
				"condition": []
			},
			// options
			"options": {
				"group by": "",
				"order by": ""
			}
		};
	};
	
	this.getSQLObject_sv = function(){
		return {
			"sql": "",
			"value": []
		};
	};
	
	// 解析数据库结构体
	this._structureAnalysis = function(sqlObj) {
		let dataKey = [], dataValue = [];
		let optionKey = [];
		let whereSql = "";
		let hasWhere = false;
		for(var key in sqlObj["data"]){
			if(sqlObj["query"] == 'update'){
				dataKey.push([key, "?"].join("="));
			}
			else{
				dataKey.push(key);
			}
			dataValue.push(sqlObj["data"][key]);
		}
		hasWhere = sqlObj["where"]["condition"].length == 0? false : true;
		whereSql = "where " + sqlObj["where"]["condition"].join(` ${sqlObj["where"]["type"]} `);
		for(var key in sqlObj["options"]){
			if(sqlObj["options"][key] && sqlObj["options"][key] != ""){
				optionKey.push([key, sqlObj["options"][key]].join(" "));
			}
		}
		
		//console.log(hasWhere);
		let sql = {
			"update" : `update ${sqlObj["tables"]} set ${dataKey.join(",")} ${hasWhere? whereSql : ""};`,
			"select" : `select ${dataKey.join(",")} from ${sqlObj["tables"]} ${hasWhere? whereSql : ""} ${optionKey.join(" ")};`,
			"delete" : `delete from ${sqlObj["tables"]} ${hasWhere? whereSql : ""};`,
			"insert" : `insert into ${sqlObj["tables"]} (${dataKey.join(",")}) values(${dataKey.fill('?').join(",")});`
		}
		
		let result = this.getSQLObject_sv();
		result["sql"] = sql[sqlObj["query"]];
		result["value"] = sqlObj["query"] == "select"? [] : dataValue;
		console.log(result);
		return result;
	};
	
	// sql是语句，args是参数，callback回调函数
	this._generalOperation = function(sql, args, callback) {
		database.dataBaseControl(sql, args, callback);
	};
	
	this.ControlAPI_str = function(data, callback){
		this._generalOperation(data["sql"], data["value"], callback);
	};

	this.ControlAPI_obj = function(data, callback){
		sqlObj = this._structureAnalysis(data);
		this._generalOperation(sqlObj["sql"], sqlObj["value"], callback);
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
					key.push([info,"?"].join(" = "));
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
		temp_controller.updateDuty(duty, (result) => {
			if(result == null){ callback(null); return; }
			temp_controller.updateUserDuty(
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
					key.push([info,"?"].join(" = "));
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
					key.push([info,"?"].join(" = "));
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
	/*
	{
		trID,
		did,
		seller,
		buyer,
		money,
		status
	}
	*/
	this.addTimestamp = function(obj, key){
		let date = new Date();
		let currentTime = utils.getLocalDate(date) + " " + utils.getLocalTime(date);
		obj[key] = currentTime;
	}
	
	this.insertTradeRecord = function(record, callback){
		let key = [];
		let value = [];
		this.addTimestamp(record, "modifyTime");
		for(var info in record){
			key.push(info);
			value.push(record[info]);
		}
		let sql = `insert into tradeRecord(${key.join(",")}) values(${key.fill('?').join(",")});`;
		console.log(sql);
		database.dataBaseControl(sql, value, callback);
	}
	
	this.updateTradeRecord = function(record, callback){
		let key = [];
		let value = [];
		if(record["trID"] && (record["money"] || record["status"])){
			this.addTimestamp(record, "modifyTime");
			for(var info in record){
				if(info != "trID"){
					key.push([info,"?"].join(" = "));
					value.push(record[info]);
				}	
			}
			console.log(key, value);
			let sql = `update tradeRecord set ${key.join(",")} where trID = ?;`;
			console.log(sql);
			value.push(record["trID"]);
			database.dataBaseControl(sql, value, callback);
		}
		else{
			callback(null);
		}
	}
	
	this.searchTradeRecord = function(record, callback){
		if(record["trID"] || (record["did"] && record["seller"] && record["buyer"])){
			let key = [];
			let value = [];
			if(!record["type"] || typeof(record["type"]) != "string"){
				record["type"] = "and";
			}
			for(var info in record){
				if(info != "type"){
					key.push([info, "?"].join(" = "));
					value.push(record[info]);
				}
			}
			let searchContent = key.join(" " + record["type"] + " ");
			let sql = `select * from tradeRecord where ${searchContent};`;
			console.log(sql);
			database.dataBaseControl(sql, value, callback);
		}
		else{
			callback(null);
		}
	}
	
	this.deleteTradeRecord = function(record, callback){
		let value = [];
		if(record["trID"]){
			let sql = `delete from tradeRecord where trID = ?;`;
			console.log(sql);
			value.push(record["trID"]);
			database.dataBaseControl(sql, value, callback);
		}
		else{
			callback(null);
		}
	}
};

module.exports = new dbController();