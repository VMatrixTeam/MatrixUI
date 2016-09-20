const express = require('express');
const app = new express();
const fs = require('fs');

app.set('view engine', 'jade');
app.set('views', './');
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/markdownTxt', function(req, res) {
  let path = __dirname + '/data/markdown.txt';
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) {
      console.log('读取文件出错');
      res.json({ data: null, msg: '读取文件出错'});
      console.log(err);
    } else {
      res.json({ data });
    }
  });
});

app.listen(8080, function() {
  console.log('MatrixUI开发服务器启动，正在监听端口：8080');
});
