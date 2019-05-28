var express = require('express');
var router = express.Router();
var dutySystem = require('./../controller/dutySystem_public');
// 登录用户创建一个任务
router.post('/create', function(req, res, next) {
	dutySystem.createDuty(req, res, next);
});

// 登录用户接受一个任务
router.post('/take', function(req, res, next) {
	dutySystem.acceptDuty(req, res, next);
});

// 通过任务ID获取一个任务信息
router.get('/duty', function(req, res, next) {
	dutySystem.queryDuty(req, res, next);
});

// 修改任务信息
router.put('/duty', function(req, res, next) {
	dutySystem.updateDuty(req, res, next);
});

// 删除任务
router.delete('/duty', function(req, res, next) {
	dutySystem.deleteDuty(req, res, next);
});

// 筛选任务
router.get('/screen', function(req, res, next) {
	dutySystem.screenDuty(req, res, next);
});


module.exports = router;
