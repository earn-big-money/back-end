var express = require('express');
var router = express.Router();
var userSystem = require('./../controller/userSystem_public');
var utils = require('./../controller/Utils_public');
var validator = require('./../controller/validator');

// 创建账户
router.post('/create', function(req, res, next){
    if(!validator.checkID(req.body.id)) {
        utils.sendError(res, 400, 'The id format is incorrect(6-8 letter or digit, begin with letter)');
        return;
    }
    if(!validator.checkPassword(req.body.password)) {
        utils.sendError(res, 400, "The password format is incorrect(6~12 digit number)");
        return;
    }
    if(!validator.checkPhone(req.body.phone)) {
        utils.sendError(res, 400, 'The phone format is incorrect(11 digit number, begin with ~0)');
        return;
    }
    if(!validator.checkEmail(req.body.email)) {
        utils.sendError(res, 400, 'The email format is incorrect(XXX@XXX.XXX)');
        return;
    }
    next();
},userSystem.createUser);

// 登录
router.post('/login', userSystem.loginUser);

// 登出
router.get('/logout', utils.loginCheck, userSystem.logoutUser);

// 获取个人信息
router.get('/user/:account', userSystem.queryUser);

// 修改个人信息
router.put('/user/:account', utils.loginCheck, userSystem.updateUser);

module.exports = router;
