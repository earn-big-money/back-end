var express = require('express');
var router = express.Router();

router.post('/create', function(req, res, next) {
	responseJson(res , 'create' );
});

router.post('/login', function(req, res, next) {
	responseJson(res , 'login' );
});

router.get('/logout', function(req, res, next) {
	responseJson(res , 'logout' );
});

module.exports = router;
