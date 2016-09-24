## mu-markdown

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
<mu-markdown ng-model='your scope variable'></mu-markdown>
<mu-markdown content='your markdown text'></mu-markdown>
<mu-markdown ng-model='your scope variable' content='your markdown text'></mu-markdown>
```

### Docs

`ng-model`的优先级高于`content`，赋值给前者的是`$scope`变量，内容可以动态改变。赋值给后者的是静态的markdown文本。

**推荐用法**

```html
<mu-markdown ng-model='markdown' content='加载中...'></mu-markdown>
```
