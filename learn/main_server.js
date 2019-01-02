const http = require('http');
const fs = require('learn/fs');
const querystring = require('queryString');
const urlLib = require('url');

const server = http.createServer((req, res) => {
  // get
  // post
  let str = '';
  req.on('data', (data) => {
    str += data;
  });
  req.on('end', () => {
    var obj = urlLib.parse(req.url, true);

    var url = obj.pathname;
    const GET = obj.query;
    const POST = querystring.parse(str);

    // console.log(url);
    // console.log(GET);
    // console.log(POST);
    // 区分接口和文件
    if (url === '/user') {  // 接口

    } else {                // 文件
      // 文件请求
      let file_name = './www' + url;
      fs.readFile(file_name, (err, data) => {
        if (err) {
          res.write(404);
        } else {
          res.write(data);
        }
        res.end();
      });
    }
  });
});

server.listen('8012');
