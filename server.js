/**
 *
 * @description 简单的测试、发布服务端
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

const express = require('express');
const app = new express();
const fs = require('fs');
const compression = require('compression');

app.set('view engine', 'jade');
app.set('views', './views');
app.use(compression());
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/deps'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/data'));

let env = process.env.NODE_ENV || 'production';
let data = {};

if (env === 'development') {
  data = { dev: true };
} else {
  data = { pro: true };
}

console.log(data);

app.get('/', function(req, res) {
  res.render('index', data);
});

let port = 8099;

app.listen(port, function() {
  console.log(`MatrixUI开发服务器启动，正在监听端口：${port}，环境变量是：${env}`);
});
