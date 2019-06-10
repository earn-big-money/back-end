var express = require('express');
var router = express.Router();
var survey = require('./../controller/surveySystem_public');
var utils = require('./../controller/Utils_public');

router.post('/submit', utils.loginCheck, survey.submitSurvey);

router.get('/getAnswer', utils.loginCheck, survey.getSurveyAnswer);

module.exports = router;
