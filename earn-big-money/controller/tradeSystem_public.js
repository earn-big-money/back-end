var db = require('./DBController_public');
var utils = require('./Utils_public')

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

	// 添加交易记录,payer为付款人,payee为收款人
	this.addTradeRecord = async function(payer, payee, money, did) {
		let strc = db.getSQLObject();
		strc["query"] = 'insert';
		strc["tables"] = "tradeRecord";
		strc["data"] = {
			"payer": payer,
			"payee" : payee,
			"money" : money,
			"did"   : did
		};
		return await db.ControlAPI_obj_async(strc);
	}

	// 修改用户余额
	this.updateMoney = async function(user, amount) {
		let strc = db.getSQLObject();
		strc["query"] = 'update';
		strc["tables"] = "userInfo";
		strc["data"] = {
			"umoney" : amount
		};
		strc["where"]["condition"] = [
			"uid  = " + db.typeTransform(user)
		];
		return await db.ControlAPI_obj_async(strc);
	}

	// 充值
	this.topupTrade = async function(buyer, amount) {
		try{
			await this.addTradeRecord('admin', buyer, amount);
			await this.updateMoney(buyer, money);
			res.send({msg :'Success'});
		}
		catch (error) {
			utils.sendError(res, 400, "Error: topup. 0");
		}
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
