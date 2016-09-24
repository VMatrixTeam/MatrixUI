## mu-markdown

### Dependencies

```js
marked.js
highlight.js
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
