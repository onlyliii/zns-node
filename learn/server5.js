const express = require('express');
const expressStatic = require('express-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const consolidate = require('consolidate');
const mysql = require('mysql');
const common = require('./libs/common');

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
    }
  });
});
server.get('/', (req, res) => {
  res.render('index.ejs', {banners: res.banners, articles: res.articles});
});
server.get('/article', (req, res) => {
  if (req.query.id) {
      if (req.query.act === 'like') {
        //增加一个赞
        connection.query(`UPDATE article_table SET n_like=n_like+1 WHERE ID=${req.query.id}`, (err, data) => {
          if (err) {
            res.status(500).send('数据有问题').end();
            throw err;
          } else {
            //查询
            connection.query(`SELECT * FROM article_table WHERE ID=${req.query.id}`, (err, data) => {
              if (err) {
                res.status(500).send('数据有问题').end();
                throw err;
              } else {
                if (!data.length) {
                  res.status(404).send('您请求的文章找不到').end();
                } else {
                  const articleData = data[0];
                  //格式化时间
                  articleData.sDate = common.time2date(articleData.post_time);
                  //处理换行
                  articleData.content = articleData.content.replace(/^/gm, '<p>').replace(/$/gm, '</p>');
                  res.render('conText.ejs', {article_data: articleData});
                }
              }
            });
          }
        });
      } else {
        //查询
        connection.query(`SELECT * FROM article_table WHERE ID=${req.query.id}`, (err, data) => {
          if (err) {
            res.status(500).send('数据有问题').end();
            throw err;
          } else {
            if (!data.length) {
              res.status(404).send('您请求的文章找不到').end();
            } else {
              const articleData = data[0];
              //格式化时间
              articleData.sDate = common.time2date(articleData.post_time);
              //处理换行
              articleData.content = articleData.content.replace(/^/gm, '<p>').replace(/$/gm, '</p>');
              res.render('conText.ejs', {article_data: articleData});
            }
          }
        });
      }
  } else {
    res.status(404).send('您请求的文章找不到').end();
  }
});
//4.static数据
server.use(expressStatic('./www'));
