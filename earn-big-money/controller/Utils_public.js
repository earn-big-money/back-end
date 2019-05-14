/*
此文件用于放置公共函数
*/

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