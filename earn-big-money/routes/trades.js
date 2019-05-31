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
router.post('/topup', utils.loginCheck, function(req, res, next) {
	res.send({msg: 'balance'});
});

// 登录用户转账
router.get('/transfer', utils.loginCheck, function(req, res, next) {
	res.send({msg: 'balance'});
});

module.exports = router;
