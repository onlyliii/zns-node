const express = require('express');
const expressStatic = require('express-static');

const server = express();

server.use('/', (req, res) => {
  res.send('aaaa');
  res.end();
});

server.use(expressStatic('./www'));

server.listen(8080);

