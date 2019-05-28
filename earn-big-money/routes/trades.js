var express = require('express');
var router = express.Router();
var dutySystem = require('./../controller/tradeSystem_public');
var utils = require('./../controller/Utils_public');

// 获取登录用户余额
router.get('/', utils.loginCheck, function(req, res, next) {
	res.send({
		"balance" : tradeSystem.checkBalanceTrade(req.session.user['uid'])
	});
});

// 登录用户充值
router.post('/topup', function(req, res, next) {
	res.send({msg: 'balance'});
});

// 登录用户转账
router.get('/transfer', function(req, res, next) {
	res.send({msg: 'balance'});
});

module.exports = router;
