## mu-codeeditor

### Depedencies

该依赖需要在`matrixui.js`加载之前加载。

`mu-codeeditor`的实现，参考的是：https://github.com/angular-ui/ui-codemirror

用法完全一致。

```html
<script src="/MatrixUI/deps/codemirror.min.js"></script>
```

### Usage

```html
<textarea mu-codeeditor></textarea>
<div mu-codeeditor></div>
<mu-codeeditor></mu-codeeditor>
```

### Docs

#### Options

All the [Codemirror configuration options](http://codemirror.net/doc/manual.html#config) can be passed through the directive.

```javascript
myAppModule.controller('MyController', [ '$scope', function($scope) {
  $scope.editorOptions = {
    lineWrapping : true,
    lineNumbers: true,
    readOnly: 'nocursor',
    mode: 'xml',
  };
}]);
```

If you update this variable with the new values, they will be merged and the ui will be updated.

```xml
<ui-codemirror ui-codemirror-opts="editorOptions"></ui-codemirror>
```

#### Working with ng-model

The ui-codemirror directive plays nicely with ng-model.

The ng-model will be watched for to set the CodeMirror document value (by [setValue](http://codemirror.net/doc/manual.html#setValue)).

_The ui-codemirror directive stores and expects the model value to be a standard javascript String._

#### ui-refresh directive

If you apply the refresh directive to element then any change to do this scope value will result to a [refresh of the CodeMirror instance](http://codemirror.net/doc/manual.html#refresh).

_The ui-refresh directive expects a scope variable that can be any thing...._

```html
<div ui-codemirror ng-model="x" ui-refresh='isSomething'></div>
```

Now you can set the _isSomething_ in the controller scope.

```javascript
$scope.isSomething = true;
```

Note: the comparison operator between the old and the new value is "!=="


#### CodeMirror instance direct access

For more interaction with the CodeMirror instance in the directive, we provide a direct access to it.
Using

```html
<div ui-codemirror="{ onLoad : codemirrorLoaded }" ></div>
```

the `$scope.codemirrorLoaded` function will be called with the [CodeMirror editor instance](http://codemirror.net/doc/manual.html#CodeMirror) as first argument

```javascript
myAppModule.controller('MyController', [ '$scope', function($scope) {

  $scope.codemirrorLoaded = function(_editor){
    // Editor part
    var _doc = _editor.getDoc();
    _editor.focus();

    // Options
    _editor.setOption('firstLineNumber', 10);
    _doc.markClean()

    // Events
    _editor.on("beforeChange", function(){ ... });
    _editor.on("change", function(){ ... });
  };

}]);
```
