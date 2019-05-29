var express = require('express');
var router = express.Router();
var userSystem = require('./../controller/userSystem_public');
var utils = require('./../controller/Utils_public');

// 创建账户
router.post('/create', function(req, res, next) {
	userSystem.createUser(req, res, next);
});

// 登录
router.post('/login', function(req, res, next) {
	userSystem.loginUser(req, res, next);
});

// 登出
router.get('/logout', utils.loginCheck, function(req, res, next) {
	userSystem.logoutUser(req, res, next);
});

// 获取个人信息
router.get('/user', function(req, res, next) {
	userSystem.queryUser(req, res, next);
});


// 修改个人信息
router.put('/user', utils.loginCheck, function(req, res, next) {
	userSystem.updateUser(req, res, next);
});

module.exports = router;
