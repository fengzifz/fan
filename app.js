
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

// 获取 connect-mongo 模块，用来维持会话
// var MongoStore = require('connect-mongo'); 是express 2.0的写法，express 3.0的写法是：var MongoStore = require('connect-mongo')(express);
// 否则会报 TypeError:Cannot read property 'Store' of undefined 错误
// package.json 修改版本
//   "connect": "1.8.5",
//   "connect-mongo": "0.1.9",
//  "express": "2.5.8",

// app.js 中改变获取方法
// var express = require('express');
// var MongoStore = require('connect-mongo')(express),
var MongoStore = require('connect-mongo')(express);

var settings = require('./settings');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000); // 端口
app.set('views', path.join(__dirname, 'views')); // views
app.set('view engine', 'jade'); // 模板引擎
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser()); // 用于解析cookie

app.use(express.session({
	secret: settings.cookieSecret,
	store: new MongoStore({
      db: settings.db
    })
}));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes
app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
