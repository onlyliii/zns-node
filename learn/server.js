const http = require('http');

const server = http.createServer(function (req, res) {
  console.log(req.url);
  switch(req.url) {
    case '/1.html':
      res.write('1111111');
      break;
    case '/2.html':
      res.write('2222222');
      break;
    default:
      res.write('404');
      break;
  }
  res.end();

});

// 监听 端口
server.listen(8012);
