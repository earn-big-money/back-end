var express = require('express');
var router = express.Router();
var tradeSystem = require('./../controller/tradeSystem_public');
// 获取登录用户余额
router.get('/', function(req, res, next) {
	tradeSystem.getBalance(req, res, next);
});

// 登录用户充值
router.post('/topup', function(req, res, next) {
	tradeSystem.topup(req, res, next);
});

// 登录用户转账
router.get('/transfer', function(req, res, next) {
	tradeSystem.transfer(req, res, next);
});

module.exports = router;
