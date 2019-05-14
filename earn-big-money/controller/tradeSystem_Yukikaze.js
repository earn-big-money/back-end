var db = require('./DBController_Yukikaze');

var tradeSystem = function() {
	this.version = "1.0.0";
	
	// 一对一交易
	// 用于创建任务
	// 1. 判断用户余额
	// 2. 创建任务
	// 3. 从用户账户中扣取相应金额
	// 4. 更新任务的剩余赏金金额
	this.createTrade = function(seller, duty, money, callback) {
		db.searchUser({
			"index": "money",
			"uid": seller
		}, ( result0 )=>{ 
			// 1. 判断用户余额
			if(result0 == null || result0[0]["money"] < money){
				callback({"status": 0, "error": "not enough money"});
			} 
			else {
				// 2. 创建任务
				db.insertDutyForUser(seller, duty, ( result1 )=>{
					if(result1 == null) {
						callback({"status": 0, "error": "cannot create a duty"});
					}
					else {
						// 3. 从用户账户中扣取相应金额
						db.updateUser({
							"uid" : user,
							"money": result0[0]["money"] - money
						}, ( result2 )=>{
							if(result2 == null) {
								callback({"status": 0, "error": "cannot deposite money"});
							}
							else {
								// 4. 更新任务的剩余赏金金额
								
							}
						});
					}
				})
			}
		});
	}
	
	// 用于取消任务
	// 1. 判断任务是否存在
	// 2. 将剩余任务赏金退还发起者
	// 3. 删除任务
	this.cancelTrade = function(){
		
	}
	
	this.updateTrade = function(){
		
	}
	
	// 用于领取任务
	// 1. 判断任务是否存在
	// 2. 确认接受，添加交易记录
	// 3. 更新任务状态
	// 4. 更新个人任务列表
	this.acceptTrade = function(){
		
	}
	
	// 用于完成任务（针对个人）
	// 1. 判断任务是否存在
	// 2. 更新任务状态
	// 3. 领取赏金
	// 4. 更新任务余额
	// 5. 更新个人任务列表
	this.finishTrade = function(trID, callback) {
		
	}
	
	this.updateTradeMoney = function(trID, money, callback) {
		db.updateTradeRecord({
			"trID": trID,
			"money": money
		}, callback);
	}
	
	this.updateTradeStatus = function(trID, status, callback) {
		db.updateTradeRecord({
			"trID": trID,
			"status": status
		}, callback);
	}
	
	// 超时任务自动完成
	this.autoFinishTrade = function() {
		
	}
}

module.exports = new tradeSystem();
