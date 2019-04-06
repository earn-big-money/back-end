var express = require('express');
var router = express.Router();

router.get('*', function(req, res, next) {
	responseJson(res , 'index' );
});

module.exports = router;
