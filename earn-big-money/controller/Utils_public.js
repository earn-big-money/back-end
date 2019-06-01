/*
此文件用于放置公共函数
*/

// 错误返回函数
module.exports.sendError = function(status, msg){
    res.status(status);
    res.send({msg : msg});
}

// 登录验证中间件
module.exports.loginCheck = function(req, res, next){
	if (req.session.user == null) {
        res.status(400);
        res.send({'msg':'Please login first.'});
    }
    else{
        next();
    }
}

// yyyy-M-dd : 数据库统一使用此格式
module.exports.getLocalDate = function(date){
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
};

// hh:mm:ss
module.exports.getLocalTime = function(date){
    let currentTime = date.toLocaleTimeString('chinese', { hour12: false });
	return currentTime;
};

// yyyy/M/dd hh:mm:ss
module.exports.getLocalDateAndTime = function(){
	var date = new Date();
    return date.toLocaleString('chinese', { hour12: false });
};

// 获取毫秒数
module.exports.getMilliseconds = function(){
	var date = new Date();
	return date.valueOf();
}