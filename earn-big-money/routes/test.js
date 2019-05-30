var express = require('express');
var router = express.Router();

var db = require('./../controller/DBController_public');
var test_module = require('./../controller/groupSystem_public');

router.get('/', async function(req, res, next) {
	let strc = db.getSQLObject();
	strc["query"] = "select";
	strc["tables"] = "userInfo";
	strc["data"] = {
		"*":0
	};
	let value = await db.ControlAPI_obj_async(strc);
	res.send({title: value});
});

router.get('/many', async function(req, res, next) {
	let strc = db.getSQLObject(),
	strc1 = db.getSQLObject(),
	strc2 = db.getSQLObject();
	
	strc["query"] = "select";
	strc["tables"] = "userInfo";
	strc["data"] = {
		"*":0
	};
	
	strc1["query"] = "select";
	strc1["tables"] = "userDuty";
	strc1["data"] = {
		"*":0
	};
	
	strc2["query"] = "select";
	strc2["tables"] = "duty";
	strc2["data"] = {
		"*":0
	};
	let value = await db.ControlAPI_objs_async(strc, strc1, strc2);
	res.send({title: value});
});

var obj = {};

router.post('/testDB_create', test_module.createGroup);

router.post('/testDB_update', test_module.joinGroup);

router.post('/testDB_update0', test_module.updateGroup);

router.get('/testDB_select', test_module.searchGroup);

router.post('/testDB_delete', test_module.quitGroup);

router.post('/createSurvey', function(req, res, next){
	obj = req.body;
	console.log(req.body);
	res.send(req.body);
});

router.get('/showSurvey', function(req, res, next){
	res.json(obj);
});

router.post('/submitSurvey', function(req, res, next){
	console.log(req.body);
	res.send(req.body);
});

module.exports = router;
