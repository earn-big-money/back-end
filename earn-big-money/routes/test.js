var express = require('express');
var router = express.Router();

var db = require('./../controller/DBController_public');
var test_module = require('./../controller/groupSystem_public');

router.get('/', function(req, res, next) {
	res.send({title: 'test'});
});

router.post('/testDB_create', test_module.createGroup);

router.post('/testDB_update', test_module.joinGroup);

router.post('/testDB_update0', test_module.updateGroup);

router.get('/testDB_select', test_module.searchGroup);

router.post('/testDB_delete', test_module.quitGroup);

module.exports = router;
