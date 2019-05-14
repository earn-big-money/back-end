var express = require('express');
var router = express.Router();

var db = require('./../controller/DBController_Yukikaze');

router.get('/', function(req, res, next) {
	res.send({title: 'test'});
});

router.get('/testDB_TR_insert', function(req, res, next) {
	new Promise((resolved, rejected) => {
		db.insertTradeRecord({
			"did" : "aaa",
			"seller": "ccc",
			"buyer": "vvv",
			"money" : 123,
			"status" : 0
		}, (result)=>{ resolved(result); })
	}).then((result)=>{
		res.send({title: 'test'});
	});
});

router.get('/testDB_TR_update', function(req, res, next) {
	new Promise((resolved, rejected) => {
		db.updateTradeRecord({
			"trID" : 0000000001,
			"money" : 124,
			"status" : 2
		}, (result)=>{ resolved(result); });
	}).then((result)=>{
		res.send({title: 'test'});
	});
});

router.get('/testDB_TR_select', function(req, res, next) {
	new Promise((resolved, rejected) => {
		db.searchTradeRecord({
			"did" : "aaa",
			"seller": "ccc",
			"buyer": "vvv",
			"type" : "and"
		}, (result)=>{ resolved(result);});
	}).then((result)=>{
		res.send(result);
	});
});

router.get('/testDB_TR_delete', function(req, res, next) {
	db.deleteTradeRecord({
		"trID" : 0000000003
	}, (result)=>{ res.send({title: result}); })
});

module.exports = router;
