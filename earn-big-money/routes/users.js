var express = require('express');
var router = express.Router();
var userSystem = require('./../controller/userSystem_public');
var utils = require('./../controller/Utils_public');

// 创建账户
router.post('/create', userSystem.createUser);

// 登录
router.post('/login', userSystem.loginUser);

// 登出
router.get('/logout', utils.loginCheck, userSystem.logoutUser);

// 获取个人信息
router.get('/user/:account', userSystem.queryUser);

// 修改个人信息
router.put('/user/:account', utils.loginCheck, userSystem.updateUser);

module.exports = router;
