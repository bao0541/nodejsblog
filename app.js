
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');

var MongoStore = require('connect-mongo')(express);//session store in mongodb
var settings = require('./settings');//app settings
var flash = require('connect-flash');//flash 是一个在 session 中用于存储信息的特定区域。

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

app.use(express.favicon());
app.use(express.logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded());
app.use(express.bodyParser({keepExtensions: true, uploadDir: './public/images' }));
app.use(express.methodOverride());

//在后面的小节中，我们可以通过 req.session 获取当前用户的会话对象，
//获取用户的相关信息。
app.use(express.cookieParser());//express.cookieParser() 是 Cookie 解析的中间件
app.use(express.session({		//express.session() 则提供会话支持
	secret: settings.cookieSecret,//secret 用来防止篡改 cookie
	key: settings.db,			//key 的值为 cookie 的名字
	cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30days
	store: new MongoStore({
		db: settings.db
	})
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', routes.index);
// app.get('/users', user.list);
routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
