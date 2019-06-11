var express = require('express');
var router = express.Router();
var survey = require('./../controller/surveySystem_public');
var utils = require('./../controller/Utils_public');
// 获取问卷的所有回答
router.get('/data', utils.loginCheck, survey.getSurveyAnswer);
// 提交一个问卷回答
router.post('/data', utils.loginCheck, survey.submitSurvey);

module.exports = router;
