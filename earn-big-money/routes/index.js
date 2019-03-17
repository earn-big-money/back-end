var express = require('express');
var router = express.Router();


function responseJson(res, msg){
	res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	
	res.json({ msg: msg })
	console.log('responseJson ' + msg)
}



router.get('*', function(req, res, next) {
	console.log('get req')
	next()
});


router.get('/api/api1', function(req, res, next) {
	responseJson(res , 'test api1' )

});



module.exports = router;
