var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var app = express();

// routers define
var index = require('./routes/index');
var users = require('./routes/users');
var test = require('./routes/test');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: "EBMcookie",
  store: new FileStore(),
  secret: 'earnbigmoney',
  resave: true,
  saveUninitialized: false,
  cookie: {
      maxAge: 1000 * 60 * 60  // 有效期，单位是毫秒
  }
}));


// add access control header
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

// 生产环境路径
app.use('/index', index);
app.use('/users', users);
// 测试环境路径
app.use('/test', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.error(err);

  // render the error page
  res.status(err.status || 500);
  res.send();
});

app.listen(8080,function(){
    console.log('run server');
})

module.exports = app;
