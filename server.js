const express = require('express');
const app = new express();
const fs = require('fs');

app.set('view engine', 'jade');
app.set('views', './');
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(8099, function() {
  console.log('MatrixUI开发服务器启动，正在监听端口：8099');
});
