var db = require('./DBController_public');

var groupSystem = function() {
	this.version = "1.0.0";

	// 用于创建兴趣组
	this.createGroup = function(req, res, next) {
        let stru0 = db.getSQLObject(),
            stru1 = db.getSQLObject(),
            stru2 = db.getSQLObject();
        // 添加组信息
        stru0["query"] = "insert";
        stru0["tables"] = "groupInfo";
        stru0["data"] = {
            'gname' : req.body.name,
            'gintroduction' : req.body.introduction,
            'gsponsor' : req.body.id
        };
        // 查询组ID
        stru1["query"] = "select";
        stru1["tables"] = "groupInfo";
        stru1["data"] = {
            'gid': 0
        };
        stru1["where"]["condition"] = [
            'gname = ' + db.typeTransform(req.body.name)
        ];
        // 添加组员信息
        stru2["query"] = "insert";
        stru2["tables"] = "userGroup";
        stru2["data"] = {
            "uid" : req.body.id,
            "grole" : "leader"
        };
        
        db.ControlAPI_obj(stru0, (result) => {
            if(result != null){
                db.ControlAPI_obj(stru1, (result1) => {
                    if(result1 != null){
                        let gid = result1[0].gid;
                        stru2["data"]["gid"] = gid;
                        db.ControlAPI_obj(stru2, (result2) => {
                            if(result2 == null){
                                res.send({"msg":"Can not insert a group leader"});
                            }
                            else{
                                res.send({"msg": "Success"});
                            }
                        });
                    }
                    else{
                        res.send({"msg":"Can not find that group"});
                    }
                });
            }
            else {
                res.send({"msg":"Can not create a group"});
            }
        });
	};
	
	// 加入兴趣组
	this.joinGroup = function(req, res, next){
        let stru = db.getSQLObject();
        stru["query"] = "insert";
        stru["tables"] = "userGroup";
        stru["data"] = {
            'gid' : req.body.gid,
            'uid' : req.body.id,
            'grole' : req.body.role
        };
        db.ControlAPI_obj(stru, (result) => {
            if(result == null){
                res.send({"msg":"Can not join the group"});
            }
            else{
                res.send({"msg": "Success"});
            }
        });
	};
	
	// 更新兴趣组
	this.updateGroup = function(req, res, next){
		let stru = db.getSQLObject();
        stru["query"] = "update";
        stru["tables"] = "groupInfo";
        stru["data"] = {
            'gname' : req.body.name,
            'gintroduction' : req.body.introduction
        };
        stru["where"]["condition"] = [
            'gid = ' + db.typeTransform(req.body.gid),
            '\'leader\' = (select grole from userGroup where gid = ' + db.typeTransform(req.body.gid) + ' and uid = ' + db.typeTransform(req.body.id) + ')'
        ];
        db.ControlAPI_obj(stru, (result) => {
            if(result == null){
                res.send({"msg":"Can not join the group"});
            }
            else{
                res.send({"msg": "Success"});
            }
        });
	};
	
	// 退出兴趣组
	this.quitGroup = function(req, res, next){
        let stru0 = db.getSQLObject(),
            stru1 = db.getSQLObject();
        // 从兴趣组中移除
        stru0["query"] = "delete";
        stru0["tables"] = "userGroup";
        stru0["where"]["condition"] = [
            'gid = ' + db.typeTransform(req.body.gid),
            'uid = ' + db.typeTransform(req.body.id)
        ];
        // 移除空的兴趣组
        stru1["query"] = "delete";
        stru1["tables"] = "groupInfo";
        stru1["where"]["condition"] = [
            '(select COUNT(*) from userGroup where gid = ' + db.typeTransform(req.body.gid) + ') = 0'
        ];

        db.ControlAPI_obj(stru0, (result) => {
            if(result != null) {
                db.ControlAPI_obj(stru1, (result1) => {
                    if(result1 != null){
                        res.send({"msg": "Success"});
                    }
                    else {
                        res.send({"msg":"Can not delete the empty group"});
                    }
                });
            }
            else{
                res.send({"msg":"Can not quit the group"});
            }
        });
    };
    
    // 查找兴趣组
    this.searchGroup = function(req, res, next) {
        let stru = db.getSQLObject();
        stru["query"] = "select";
        stru["tables"] = `(select gid, grole from userGroup where uid = ${db.typeTransform(req.query.id)}) as GINFO left join groupInfo on GINFO.gid = groupInfo.gid`;
        stru["data"] = {
            "groupInfo.gid": 0,
            "groupInfo.gname": 0,
            "groupInfo.gintroduction": 0,
            "groupInfo.gsponsor": 0,
            "GINFO.grole": 0
        };
        db.ControlAPI_obj(stru, (result) => {
            if(result != null){
                res.send({"msg": "success", "data": result});
            }
            else{
                res.send({"msg":"Can not quit the group"});
            }
        })
    };
}

module.exports = new groupSystem();
