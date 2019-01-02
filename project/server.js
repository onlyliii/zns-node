const express = require('express');
// const expressStatic = require('express-static');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
// const bodyParser = require('body-parser');
const multer = require('multer');
const expressRoute = require('express-route');

//mysql连接
const connection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'learn'
});

const server = express();
server.listen(8080);

//1.获取请求数据
// POST
server.use(express.urlencoded({extended: false}));
//文件数据
server.use(multer({dest: './static/upload'}).any());
//2.cookie session
server.use(cookieParser());
(function () {
  const keys = [];
  for (let i = 0; i < 100000; i++) {
    keys.push('s_' + Math.random());
  }
  server.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 20 * 60 * 1000
  }));
})();
//3.模板
server.engine('html', consolidate.ejs);
server.set('views', 'template');
server.set('view engine', 'html');
//4.route


//5.default static
server.use(express.static('./static/', {
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}));
