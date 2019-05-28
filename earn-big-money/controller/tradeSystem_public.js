var db = require('./DBController_public');

var tradeSystem = function() {
	this.version = "1.0.0";

	// 用于查询余额
	this.getBalance = function(req, res, next) {
		if (req.session.user == null) {
			res.redirect('localhost:8080/users/login');
		}
		else {
			let strc = db.getSQLObject();
			console.log(req.query.id)
			strc["query"] = 'select';
			strc["tables"] = "userInfo";
			strc["data"] = {
				"umoney": 0
			};
			strc["where"]["condition"] = [
				"uname  = " + db.typeTransform(req.session.user.uname),
				"uemail = " + db.typeTransform(req.session.user.uemail),
				"uphone = " + db.typeTransform(req.session.user.uphone)
			];
			strc["where"]["type"] = "or";
			db.ControlAPI_obj(strc, (resultFromDatabase)=>{
				console.log(resultFromDatabase[0]); // 取下标为0即可
				if (resultFromDatabase[0] == undefined) {
					res.send({"msg":"fail to check the balance"})
				}
				else {
					res.send({"balance":resultFromDatabase[0].umoney})
				}
			});//回调函数，
		}
	}

	// 用于用户充值
	this.topup = function(req, res, next) {
		if (req.session.user == null) {
			res.redirect('localhost:8080/users/login');
		}
		else {
		}
	}

	// 用于转账
	this.createTrade = function(req, res, next) {
		if (req.session.user == null) {
			res.redirect('localhost:8080/users/login');
		}
		else {
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
