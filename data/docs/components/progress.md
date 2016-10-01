## mu-progress

`mu-progress`的实现，参考的是：https://github.com/VictorBjelkholm/ngProgress

使用方法完全一致。

### Usage

```js
function yourController($scope, muProgressFactory) {

  $scope.progressbar = muProgressFactory.createInstance();
  $scope.progressbar.start();
  $scope.progressbar.complete();

}
```

### Docs

**API**

* **start** - Starts the animation and adds between 0 - 5 percent to loading
each 400 milliseconds. Should always be finished with ngProgress.complete()
to hide it

```javascript
ngProgress.start();
```
* **setHeight** - Sets the height of the progressbar. Use any valid CSS value
Eg '10px', '1em' or '1%'

```javascript
ngProgress.setHeight('10px');
```

* **setColor** - Sets the color of the progressbar and it's shadow. Use any valid HTML color

```javascript
ngProgress.setColor('#fff');
```

* **status** - Returns on how many percent the progressbar is at. Should'nt be needed

```javascript
var status = ngProgress.status();
```

* **stop** - Stops the progressbar at it's current location

```javascript
ngProgress.stop();
```

* **set** - Set's the progressbar percentage. Use a number between 0 - 100. If 100 is provided, complete will be called.

```javascript
ngProgress.set(100);
```

* **reset** - Resets the progressbar to percetage 0 and therefore will be hided after it's rollbacked

```javascript
ngProgress.reset();
```

* **complete** - Jumps to 100% progress and fades away progressbar

```javascript
ngProgress.complete();
```

* **setParent** - Changes the parent of the DOM element which visualizes the progress bar

```javascript
ngProgress.setParent(document.getElementById('container'));
```

* **getDomElement** - Gets the DOM element  which visizualizes the progress bar. It is wrapped as a jqlite element - https://docs.angularjs.org/api/ng/function/angular.element

```javascript
var element = ngProgress.getDomElement();
```
