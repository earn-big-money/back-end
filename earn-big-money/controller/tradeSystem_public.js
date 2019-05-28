var db = require('./DBController_public');

var tradeSystem = function() {
	this.version = "1.0.0";

	// 余额查询
	this.checkBalanceTrade = function(args, callback) {
		
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
