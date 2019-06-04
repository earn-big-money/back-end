var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var util = require('util');

var utils = require('./Utils_public')

var imageSystem = function() {
    
    this.version = "1.0.0";

    this.uploadUserPhoto = function(req, res, next) {
        var form = new formidable.IncomingForm();
        form.encoding = "utf-8";
        form.uploadDir = path.join(__dirname, './../upload/user');
        form.maxFileSize = 10 * 1024 * 1024;
        form.parse(req, function(err, fields, files) {
            try {
                if(err){
                    console.log(err);
                    throw err;
                }
                var oldpath = files["file"].path;
                var newpath = path.join(path.dirname(oldpath), req.session.user.uid + path.extname(files["file"].name));
                fs.rename(oldpath, newpath, (err)=>{
                    try {
                        if(err) throw err;
                        res.send({"msg" : "success"});
                    }
                    catch(error) {
                        utils.sendError(res, 400, error);
                    }
                })
            }
            catch(error) {
                utils.sendError(res, 400, error);
            }
        });
    };

    this.uploadDutyPhoto = function(req, res, next) {

    };

    this.getUserPhoto = function(req, res, next) {
        console.log();
        let photo = path.join(__dirname, './../upload/user/' + req.params.id);
        fs.exists(photo + ".png", function(isExist){
            if(isExist){
                res.sendFile(photo + ".png");
                return;
            }
            else{
                res.sendFile(path.join(__dirname, './../upload/user/default.png'));
                return;
            }
        });
    };

    this.getDutyPhoto = function(req, res, next) {

    };
}

module.exports = new imageSystem();