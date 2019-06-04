var express = require('express');
var router = express.Router();

var photo = require('./../controller/imageSystem_public');

router.post('/uploadUserPhoto', photo.uploadUserPhoto);

router.post('/uploadDutyPhoto', photo.uploadDutyPhoto);

router.get('/userPhoto/:id', photo.getUserPhoto);

router.get('/dutyPhoto/:id', photo.getDutyPhoto);

module.exports = router;
