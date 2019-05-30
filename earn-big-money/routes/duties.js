var express = require('express');
var router = express.Router();
var dutySystem = require('./../controller/dutySystem_public');
var utils = require('./../controller/Utils_public');

// 登录用户创建一个任务
router.post('/create', utils.loginCheck, dutySystem.createDuty);

// 登录用户接受一个任务
router.post('/take', utils.loginCheck, dutySystem.acceptDuty);

// 通过任务ID获取一个任务信息
router.get('/duty/:did', dutySystem.queryDuty);

// 修改任务信息
router.put('/duty/:did', utils.loginCheck, dutySystem.updateDuty);

// 删除任务
router.delete('/duty/:did', utils.loginCheck, dutySystem.deleteDuty);

// 筛选任务
router.get('/screen', dutySystem.screenDuty);

module.exports = router;
