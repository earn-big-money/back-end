var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.send({title: 'earn big money'});
});

module.exports = router;
