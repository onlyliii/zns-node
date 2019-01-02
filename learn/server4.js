const express = require('express');
const expressStatic = require('express-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const consolidate = require('consolidate');
const mysql = require('mysql');

//mysql连接
const connection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'blog'
});

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

//配置模版引擎
//输出什么东西
server.set('view engine', 'html');
//模板文件放在哪儿
server.set('views', './template');
//那种模版引擎
server.engine('html', consolidate.ejs);

//接受用户请求
server.get('/', (req, res, next) => {
  // 查询banner的东西
  connection.query("SELECT * FROM banner_table", (err, data) => {
    if (err) {
      res.status(500).send('服务器错误').end();
      throw err;
    } else {
      res.banners = data;
      next();
      // res.render('index.ejs', { banners: data });
    }
  });
});

server.get('/', (req, res, next) => {
  //查询
  connection.query("SELECT ID,title,summary FROM article_table", (err, data) => {
    if (err) {
      res.status(500).send('服务器错误').end();
      throw err;
    } else {
      res.articles = data;
      next();
      // res.render('index.ejs', { banners: data });
    }
  });
});
server.get('/', (req, res) => {
  res.render('index.ejs', { banners: res.banners, articles: res.articles });
});
server.get('/article', (req, res) => {
  res.render('conText.ejs', { })
});
//4.static数据
server.use(expressStatic('./www'));
