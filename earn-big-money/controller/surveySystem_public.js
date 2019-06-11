var db = require('./DBController_public');
var duty = require('./dutySystem_public');

var surveySystem = function() {
	this.version = "1.0.0";

	// 提交问卷
	this.submitSurvey = async function(req, res, next) {
		try {
			let stru = db.getSQLObject();
			stru["query"] = "insert";
			stru["tables"] = "surveyCollection";
			stru["data"] = {
				"did" : req.body.did,
				"uid" : req.session.user.uid,
				"scontent": req.body.answer
			};
			await db.ControlAPI_obj_async(stru);
			duty.commitDuty(req, res, next);
		}
		catch(error) {
			console.log(error);
			res.send({"msg":"submit fail"});
		}
	};
	
	// 获取问卷
	this.getSurveyAnswer = async function(req, res, next) {
		try {
			let stru1 = db.getSQLObject();
			stru1["query"] = "select";
			stru1["tables"] = "surveyCollection";
			stru1["data"] = {
				"uid" : 0,
				"scontent": 0
			};
			stru1["where"]["condition"] = [
				"did = " + db.typeTransform(req.query.did)
			];

			let result = await db.ControlAPI_objs_async(stru1);
			res.send({"msg" : "success", "data" : result[0]});
		}
		catch(error) {
			console.log(error);
			res.send({"msg" : "fail"});
		}
	};
}

module.exports = new surveySystem();
