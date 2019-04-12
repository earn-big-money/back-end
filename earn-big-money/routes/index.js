var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', {title: 'earn big money'});
	// res.render('register');
});

module.exports = router;
