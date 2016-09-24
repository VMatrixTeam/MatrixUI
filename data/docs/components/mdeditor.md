## mu-mdeditor

### Dependencies

首先需要安装MathJax

```bash
bower install MathJax
```

然后在HTML文件中添加脚本

```html
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
```

### Docs

参数：type

* **simple**: toolbar按钮较少，适用于评论框等
* **full**: toolbar按钮较全，适用于描述的填写

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
