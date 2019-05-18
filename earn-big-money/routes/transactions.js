var express = require('express');
var router = express.Router();

// 获取登录用户余额
router.get('/', function(req, res, next) {
	res.send({msg: 'balance'});
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
