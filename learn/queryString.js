const queryString = require('queryString');

let json = queryString.parse('age=17&user=liping&name=li');
console.log(json); // { age: '17', user: 'liping', name: 'li' }