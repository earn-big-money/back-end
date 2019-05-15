var express = require('express');
var router = express.Router();
var userSystem = require('./../controller/userSystem_public');

router.post('/create', function(req, res, next) {
	userSystem.createUser(req, res, next);
});

router.post('/login', function(req, res, next) {
	userSystem.loginUser(req, res, next);
});

router.get('/logout', function(req, res, next) {
	userSystem.logoutUser(req, res, next);
});

router.post('/query', function(req, res, next) {
	userSystem.queryUser(req, res, next);
});

module.exports = router;
