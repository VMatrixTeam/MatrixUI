## mu-mdeditor

### Dependencies

首先需要安装MathJax，其次是fontawesome

```bash
bower install MathJax
```

然后在HTML文件中添加脚本

```html
<link rel="stylesheet" type="text/css" href="/fontawesome.min.css">
<script type="text/javascript" src="${your path}/MatrixUI/deps/marked.min.js"></script>
<script type="text/javascript" src="${your path}/MatrixUI/deps/highlight.pack.min.js"></script>
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    showProcessingMessages: false,
    tex2jax: { inlineMath: [['$','$'],['\\\(','\\)']] },
    TeX: { equationNumbers: {autoNumber: "AMS"} }
  });
</script>
<script type="text/javascript" src="${your path}/MatrixUI/bower_components/MathJax/MathJax.js"></script>
```

### Usage

```html
<mu-mdeditor type='simple' id='simpleMDE'></mu-mdeditor>
<mu-mdeditor type='full' id='fullMDE'></mu-mdeditor>
<mu-mdeditor type='full' content='default markdown content' ng-model='your scope variable' upload-url='/' upload-field-name='image' json-field-name='downloadUrl'></mu-mdeditor>
```

### Docs

参数：type

有两个参数，第一个参数表示 toolbar 按钮数量多少，第二个参数用来修改输入框高度

* **'simple'**: toolbar 按钮较少，适用于评论框等
* **'full'**: toolbar 按钮较全，适用于描述的填写
* **'simple/full small'**: 输入框高度类型为小
* **'simple/full median'**: 输入框高度类型为中
* **'simple/full large'**: 输入框高度类型为大

参数：content

默认填充的markdown文本

参数：ng-model

父级Scope变量，优先级比content高。如果ng-model有值，会覆盖content的内容。

下面三个参数与图片上传相关，需要根据前后端对接形式进行设置（详情见插件[inline-attachment](http://inlineattachment.readthedocs.io/en/latest/pages/configuration.html))

参数：upload-url

上传图片的接口url

参数：upload-field-name

上传的表单中图片对应的字段名

参数：json-field-name

上传成功后，服务器返回一个json报文，其中下载上传的图片的url对应的字段

取值：利用`angular.element().scope()`取得对应的`scope`，`SimpleMDE`实例就是`scope.mde`。

```js
let simpleMDE = document.querySelectorAll('#simpleMDE');
simpleMDEScope = angular.element(simpleMDE).scope();
let markdownText = simpleMDEScope.mde.value();
```

设置值：

```js
let simpleMDE = document.querySelectorAll('#simpleMDE');
simpleMDEScope = angular.element(simpleMDE).scope();
simpleMDEScope.mde.value('your content');
```
