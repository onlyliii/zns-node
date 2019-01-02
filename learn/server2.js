const express = require('express');
const expressStatic = require('express-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const consolidate = require('consolidate');

const server = express();
server.listen(8080);

//1.解析cookie
server.use(cookieParser('asdfghjkl'));

//2.使用session
const arr = [];
for (let i = 0; i < 10000; i++) {
  arr.push('keys' + Math.random());
}
server.use(cookieSession({name: 'zns_li', keys: arr, maxAge: 20 * 3600 * 1000}));

//3.post数据
server.use(bodyParser.urlencoded({extended: false}));
//文件数据
server.use(multer({dest: './www/upload'}).any());

// //用户请求
// server.use('/', (req, res, next) => {
//   console.log(req.query, req.body, req.files, req.cookies, req.session);
//   res.end();
// });

//配置模版引擎
//输出什么东西
server.set('view engine', 'html');
//模板文件放在哪儿
server.set('views', './views');
//那种模版引擎
server.engine('html', consolidate.ejs);

//接受用户请求
server.get('/index', (req, res, next) => {
  res.render('1.ejs', {name: 'liping'});
});

//4.static数据
server.use(expressStatic('./www'));
