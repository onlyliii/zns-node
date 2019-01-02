const mysql = require('mysql');

//1.连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'zns'
});

connection.connect();

//2.查询
connection.query("SELECT * FROM `user_table`;", (err, data) => {
  if (err)
    throw err;
  else
    console.log('成功');
    console.log('The solution is: ', data);
});

//3.