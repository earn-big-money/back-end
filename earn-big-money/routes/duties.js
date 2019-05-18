var express = require('express');
var router = express.Router();

// 登录用户创建一个任务
router.post('/create', function(req, res, next) {
	res.send({msg: 'create'});
});

// 登录用户接受一个任务
router.post('/take', function(req, res, next) {
	res.send({msg: 'take'});
});

// 通过任务ID获取一个任务信息
router.get('/duty/:did', function(req, res, next) {
	res.send({msg : req.params.did});
});

// 修改任务信息
router.put('/duty/:did', function(req, res, next) {
	res.send({msg : req.params.did});
});

// 删除任务
router.delete('/duty/:did', function(req, res, next) {
	res.send({msg : req.params.did});
});

module.exports = router;
