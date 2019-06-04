var express = require('express');
var router = express.Router();
var tradeSystem = require('./../controller/tradeSystem_public');
var utils = require('./../controller/Utils_public');

// 获取登录用户余额
router.get('/', utils.loginCheck, async function(req, res, next) {
	try {
		let result = await tradeSystem.checkBalance(req.session.user.uid);
		res.send({balance : result[0]['umoney']});
	} 
	catch (error) {
		res.status(400);
		res.send({msg : 'Error: checkBalance'});
	}
});

// 登录用户充值
router.post('/topup', utils.loginCheck, async function(req, res, next) {
	try{
		req.body.amount = parseInt(req.body.amount);
		let balance = await tradeSystem.checkBalance(req.session.user.uid);
		await tradeSystem.updateMoney(req.session.user.uid, req.body.amount + balance[0]['umoney']);
		await tradeSystem.addTradeRecord(req.session.user.uid, 'admin', req.body.amount, null);
		await tradeSystem.addTradeRecord('admin', req.session.user.uid, req.body.amount, null);
		res.send({msg :'Success'});
	}
	catch (error) {
		utils.sendError(res, 400, "Error: topup. 0");
	}
});

// 登录用户转账
router.post('/transfer', utils.loginCheck, async function(req, res, next) {
	try{
		if(req.session.user.uid == req.body.receiver) {
			utils.sendError(res, 400, "You can't transfer money to yourself.");
			return;
		}
		req.body.amount = parseInt(req.body.amount);
		let giverBalance = await tradeSystem.checkBalance(req.session.user.uid);
		let receiverBalance = await tradeSystem.checkBalance(req.body.receiver);
		if(giverBalance[0]['umoney'] < req.body.amount) {
			utils.sendError(res, 400, "Your balance is not enough.");
			return;
		}
		await tradeSystem.updateMoney(req.session.user.uid, giverBalance[0]['umoney'] - req.body.amount);
		await tradeSystem.updateMoney(req.body.receiver, receiverBalance[0]['umoney'] + req.body.amount);
		await tradeSystem.addTradeRecord(req.session.user.uid, req.body.receiver, req.body.amount, null);
		res.send({msg :'Success'});
	}
	catch (error) {
		utils.sendError(res, 400, "Error: transfer. 0");
	}
});

module.exports = router;
