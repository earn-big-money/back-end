var database = require('./../database/DataBaseMySQL');

var dbController = function() {
	
	this.version = "1.0.0";
	
	this.structureAnalysis = function(struc) {
		
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
	// sql是语句，args是参数，callback回调函数
	this.generalOperation = function(sql, args, callback) {
		database.dataBaseControl(sql, args, callback);
	};
	
};

module.exports = new dbController();