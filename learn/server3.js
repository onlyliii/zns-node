const express = require('express');

const server = express();
server.listen(8080);

const routerUser = express.Router();

routerUser.get('/1.html', (req, res) => {
  res.send('aaaa');
});

server.use('/user', routerUser);
