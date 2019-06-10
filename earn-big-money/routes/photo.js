var express = require('express');
var router = express.Router();
var photo = require('./../controller/imageSystem_public');
var utils = require('./../controller/Utils_public');

router.post('/uploadUserPhoto', utils.loginCheck, photo.uploadUserPhoto);

router.post('/uploadDutyPhoto', utils.loginCheck, photo.uploadDutyPhoto);

router.get('/userPhoto/:id', photo.getUserPhoto);

router.get('/dutyPhoto/:id', photo.getDutyPhoto);

module.exports = router;
