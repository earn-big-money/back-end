var db = require('./DBController_public');

var tradeSystem = function() {
	this.version = "1.0.0";

	// 余额查询
	this.checkBalance = async function(uid) {
		let strc = db.getSQLObject();
		strc["query"] = 'select';
		strc["tables"] = "userInfo";
		strc["data"] = {
			"umoney": 0
		};
		strc["where"]["condition"] = [
			"uid  = " + db.typeTransform(uid)
		];
		return await db.ControlAPI_obj_async(strc);
	}

	// 用于创建交易
	this.createTrade = function(args, callback) {
		
	}
	
	// 用于取消交易
	this.cancelTrade = function(){
		
	}
	
	// 用于更新交易
	this.updateTrade = function(){
		
	}
	
	// 用于接受交易
	this.acceptTrade = function(){
		
	}
	
	// 用于完成交易
	this.finishTrade = function(trID, callback) {
		
	}
	
	// 超时交易自动完成
	this.autoFinishTrade = function() {
		
	}
}

module.exports = new tradeSystem();
