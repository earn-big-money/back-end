var express = require('express');
var router = express.Router();
var photo = require('./../controller/imageSystem_public');
var utils = require('./../controller/Utils_public');

// 获取用户头像
router.get('/userPhoto/:id', photo.getUserPhoto);
// 上传用户头像
router.post('/uploadUserPhoto', utils.loginCheck, photo.uploadUserPhoto);
// 获取任务图片
router.get('/dutyPhoto/:id', photo.getDutyPhoto);
// 上传任务图片
router.post('/uploadDutyPhoto', utils.loginCheck, photo.uploadDutyPhoto);

module.exports = router;
