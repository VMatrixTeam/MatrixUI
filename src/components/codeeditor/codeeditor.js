/**
 *
 * @description codeeditor组件，代码编辑器，源代码参考：https://github.com/angular-ui/ui-codemirror
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

/**
 * Binds a CodeMirror widget to a <textarea> element.
 */

angular.module('matrixui.components.codeeditor', [])
  .constant('muCodeeditorConfig', {
    languageOpts: {
      "CPP": "text/x-c++src",
      "C": "text/x-csrc",
      "Java": "text/x-java",
      "PHP": "text/x-php"
    },
    codemirror: {
      mode: 'c++',
      theme: 'monokai',
      lineNumbers: true,
      mode: 'text/x-c++src',
      keyMap: 'sublime',
      tabSize: 2
    }
  })
  .directive('muCodeeditor', muCodeeditorDirective);

muCodeeditorDirective.$inject = ['$timeout', '$parse', 'muCodeeditorConfig'];

function muCodeeditorDirective($timeout, $parse, muCodeeditorConfig) {

  return {
    restrict: 'EA',
    require: '?ngModel',
    transclude: true,
    scope: {
      uiCodemirror: '=',
      uiCodemirrorOpts: '=',
      contentObj: '='
    },
    template: '' +
      // '<div class="mu-codeeditor-language">' +
      //   '<select ng-model="language">' +
      //     '<option ng-repeat="(language, mode) in languageOpts track by language">{{language}}</option>' +
      //   '</select>' +
      // '</div>' +
      '<div class="editor-instance"></div>',
    compile: function compile() {
      // Require CodeMirror
      if (angular.isUndefined(window.CodeMirror)) {
        throw new Error('ui-codemirror needs CodeMirror to work... (o rly?)');
      }
      return postLink;
    }
  };

  function postLink(scope, iElement, iAttrs, ngModel) {

    var codemirrorOptions = angular.extend(
      { value: iElement.text() },
      muCodeeditorConfig.codemirror || {},
      scope.$eval('uiCodemirror'),
      scope.$eval('uiCodemirrorOpts')
    );

    var codemirror = newCodemirrorEditor(iElement, codemirrorOptions);

    configOptionsWatcher(
      codemirror,
      iAttrs.uiCodemirror || iAttrs.uiCodemirrorOpts,
      scope
    );

    codemirror.on('beforeChange', function (instance, changeObj) {
      var from = changeObj.from,
            to = changeObj.to;
      var text = changeObj.text;
      text = text.map(function(line, index, text) {
        return line.replace(/[\u0009]/g, ' ');
      });
      
      changeObj.update(from, to, text);
    });

    var modelName = iAttrs.ngModel;

    configNgModelLink(codemirror, ngModel, scope, modelName);

    configConverter(codemirror);

    configUiRefreshAttribute(codemirror, iAttrs.uiRefresh, scope);

    //configLanguageOpts(codemirror, scope);

    //configContentBlock(codemirror, scope, modelName);
    // Allow access to the CodeMirror instance through a broadcasted event
    // eg: $broadcast('CodeMirror', function(cm){...});
    scope.$on('CodeMirror', function(event, callback) {
      if (angular.isFunction(callback)) {
        callback(codemirror);
      } else {
        throw new Error('the CodeMirror event requires a callback function');
      }
    });

    // onLoad callback
    if (angular.isFunction(codemirrorOptions.onLoad)) {
      codemirrorOptions.onLoad(codemirror);
    }
  }

  function newCodemirrorEditor(iElement, codemirrorOptions) {
    var codemirrot;
    var editorEle = angular.element(iElement[0].querySelectorAll('.editor-instance'));

    if (editorEle[0].tagName === 'TEXTAREA') {
      // Might bug but still ...
      codemirrot = window.CodeMirror.fromTextArea(editorEle[0], codemirrorOptions);
    } else {
      editorEle.html('');
      codemirrot = new window.CodeMirror(function(cm_el) {
        editorEle.append(cm_el);
      }, codemirrorOptions);
    }

    return codemirrot;
  }

  function configOptionsWatcher(codemirrot, uiCodemirrorAttr, scope) {
    if (!uiCodemirrorAttr) { return; }

    var codemirrorDefaultsKeys = Object.keys(window.CodeMirror.defaults);
    scope.$watch('uiCodemirrorOpts', updateOptions, true);
    function updateOptions(newValues, oldValue) {
      if (!angular.isObject(newValues)) { return; }
      codemirrorDefaultsKeys.forEach(function(key) {
        if (newValues.hasOwnProperty(key)) {

          if (oldValue && newValues[key] === oldValue[key]) {
            return;
          }

          codemirrot.setOption(key, newValues[key]);
        }
      });
    }
  }

  function configNgModelLink(codemirror, ngModel, scope, modelName) {
    if (!ngModel) { return; }
    // CodeMirror expects a string, so make sure it gets one.
    // This does not change the model.
    ngModel.$formatters.push(function(value) {
      if (angular.isUndefined(value) || value === null) {
        return '';
      } else if (angular.isObject(value) || angular.isArray(value)) {
        throw new Error('ui-codemirror cannot use an object or an array as a model');
      }
      return value;
    });


    // Override the ngModelController $render method, which is what gets called when the model is updated.
    // This takes care of the synchronizing the codeMirror element with the underlying model, in the case that it is changed by something else.
    ngModel.$render = function() {
      //Code mirror expects a string so make sure it gets one
      //Although the formatter have already done this, it can be possible that another formatter returns undefined (for example the required directive)
      var safeViewValue = ngModel.$viewValue || '';
      codemirror.setValue(safeViewValue);
    };


    // Keep the ngModel in sync with changes from CodeMirror
    codemirror.on('change', function(instance) {
      var newValue = instance.getValue();
      if (newValue !== ngModel.$viewValue) {
        scope.$evalAsync(function() {
          ngModel.$setViewValue(newValue);
        });
      }
    });

    var getter = $parse(modelName);
    var setter = getter.assign;

    // 配置父scope的监视
    scope.$parent.$watch(modelName, function (newVal, oldVal) {
      setter(scope, newVal);
    }); 

    scope.$watch(modelName, function (newVal, oldVal) {
      setter(scope.$parent, newVal);
    }); 
  }

  function configUiRefreshAttribute(codeMirror, uiRefreshAttr, scope) {
    if (!uiRefreshAttr) { return; }

    scope.$watch(uiRefreshAttr, function(newVal, oldVal) {
      // Skip the initial watch firing
      if (newVal !== oldVal) {
        $timeout(function() {
          codeMirror.refresh();
        });
      }
    });
  }

  /**
   * @description 配置tab转换(非法的tab会被转化为合法的tab)
   * @author 邓廷礼 <mymikotomisaka@gmail.com>
   * @param {object} codemirror cm实例
   */
  function configConverter(codemirror) {
    codemirror.on('beforeChange', function (instance, changeObj) {
      var from = changeObj.from,
            to = changeObj.to;
      var text = changeObj.text;
      text = text.map(function(line, index, text) {
        return line.replace(/[\u0009]/g, ' ');
      });
      
      changeObj.update(from, to, text);
    });
  }

  // function configLanguageOpts(codemirror, scope) {
  //   var languageOpts = scope.languageOpts = muCodeeditorConfig.languageOpts;
  //   scope.language = 'C';

  //   codemirror.setOption('mode', languageOpts[scope.language]);

  //   scope.$watch('language', function (newVal, oldVal) {
  //     codemirror.setOption('mode', languageOpts[newVal]);
  //   });
  // }

  // function configContentBlock(codemirror, scope, modelName) {
  //   if (angular.isObject(scope.contentObj)) {
  //     var keys = Object.key(scope.contentObj);
  //     if (keys.length === 0) return;
  //     scope.activeContent = keys[0];

  //     scope.changeContent = function (name) {
  //       if (angular.isUndefined(scope.contentObj[name])) return;

  //       scope.activeContent = name;
  //       codemirror.setValue(scope.contentObj[name]);
  //     }

  //     scope.deleteContent = function (name) {
  //       if (angular.isUndefined(scope.contentObj[name])) return;

  //       delete scope.contentObj[name];
  //     }

  //     scope.$watch('contentObj', function (newVal, oldVal) {
  //       if (newVal[scope.activeContent]) codemirror.setValue(newVal[scope.activeContent]);
  //       else {
  //         let names = Object.keys(scope.contentObj);
  //         if (angular.isUndefined(names[0])) {
  //           scope.activeContent = '';
  //           return;
  //         }
  //         scope.activeContent = names[0];
  //         codemirror.setValue(newVal[names[0]]);
  //       }
  //     }, true);

  //     scope.$watch(modelName, function (newVal, oldVal) {
  //       var name = scope.activeContent;
  //       if (angular.isUndefined(scope.contentObj[name])) return;

  //       scope.contentObj[name] = newVal;
  //     });
  //   }
  // }

}
