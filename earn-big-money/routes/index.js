var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	if (req.session.user) {
		res.send(req.session.user);
	}
	else {
		res.send({title: 'earn big money'});
	}
});

module.exports = router;
1