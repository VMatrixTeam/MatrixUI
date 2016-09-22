## mu-mdeditor

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
