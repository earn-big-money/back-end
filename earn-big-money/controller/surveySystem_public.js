var db = require('./DBController_public');

var surveySystem = function() {
	this.version = "1.0.0";

	// 保存问卷
	this.saveSurvey_url = async function(res, req, next){
		try {
			let stru = db.getSQLObject();
			stru["query"] = "insert";
			stru["tables"] = "surveyData";
			stru["data"] = {
				"did" : req.body.did,
				"sdata": req.body.survey
			};
			let result = await db.ControlAPI_obj_async(stru);
			res.send({"msg":"success"});
		}
		catch(error) {
			console.log(error);
			res.send({"msg":"fail"});
		}
	};

	// 保存问卷
	this.saveSurvey = async function(did, survey){
		try {
			let stru = db.getSQLObject();
			stru["query"] = "insert";
			stru["tables"] = "surveyData";
			stru["data"] = {
				"did" : did,
				"sdata": survey
			};
			let result = await db.ControlAPI_obj_async(stru);
			return true;
		}
		catch(error) {
			console.log(error);
			return false;
		}
	};

	this.submitSurvey = async function(req, res, next) {
		try {
			let stru = db.getSQLObject();
			stru["query"] = "insert";
			stru["tables"] = "surveyCollection";
			stru["data"] = {
				"did" : req.body.did,
				"uid" : req.body.id,
				"sdata": req.body.answer
			};
			let result = await db.ControlAPI_obj_async(stru);
			res.send({"msg":"submit success"});
		}
		catch(error) {
			console.log(error);
			res.send({"msg":"submit fail"});
		}
	};
	
	// 用于完成交易
	this.getSurvey = async function(req, res, next) {
		try {
			let stru0 = db.getSQLObject(),
				stru1 = db.getSQLObject();

			stru0["query"] = "select";
			stru0["tables"] = "surveyData";
			stru0["data"] = {
				"sdata" : 0
			}
			stru0["where"]["condition"] = [
				"did = " + db.typeTransform(req.query.did)
			];

			stru1["query"] = "select";
			stru1["tables"] = "surveyCollection";
			stru1["data"] = {
				"uid" : 0,
				"scontent": 0
			};
			stru1["where"]["condition"] = [
				"did = " + db.typeTransform(req.query.did)
			];

			let result = await db.ControlAPI_objs_async(stru0, stru1);
			res.send({"msg" : "success", "data" : { "survey": result[0], "answers": result[1]}});
		}
		catch(error) {
			console.log(error);
			res.send({"msg" : "fail"});
		}
	};
}

module.exports = new surveySystem();
