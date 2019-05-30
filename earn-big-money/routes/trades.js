var express = require('express');
var router = express.Router();
var tradeSystem = require('./../controller/tradeSystem_public');
var utils = require('./../controller/Utils_public');

// 获取登录用户余额
router.get('/', utils.loginCheck, function(req, res, next) {
	new Promise((resolved, rejected) => {
		tradeSystem.checkBalanceTrade(req.session.user.uid, (result) => {
			resolved(result);
		})
	}).then((result) => {
		res.send({
			"balance" : result["umoney"]
		});
	});
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
