'use strict';

/**
 *
 * @description button组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components', ['matrixui.components.button', 'matrixui.components.markdown']);
'use strict';

angular.module('matrixui', ['matrixui.components']);
'use strict';

/**
 *
 * @description button组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components.button', []).directive('muButton', MuButtonDirective);

function MuButtonDirective($timeout) {

  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: getTemplate,
    link: postLink
  };

  function isAnchor(attr) {
    return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.ngLink) || angular.isDefined(attr.uiSref);
  }

  function getTemplate(element, attr) {
    if (isAnchor(attr)) {
      return '<a class="mu-button" ng-transclude></a>';
    } else {
      //If buttons don't have type="button", they will submit forms automatically.
      var btnType = typeof attr.type === 'undefined' ? 'button' : attr.type;
      return '<button class="mu-button" type="' + btnType + '" ng-transclude></button>';
    }
  }

  function postLink(scope, element, attr) {
    // For anchor elements, we have to set tabindex manually when the
    // element is disabled
    if (isAnchor(attr) && angular.isDefined(attr.ngDisabled)) {
      scope.$watch(attr.ngDisabled, function (isDisabled) {
        element.attr('tabindex', isDisabled ? -1 : 0);
      });
    }

    // disabling click event when disabled is true
    element.on('click', function (e) {
      if (attr.disabled === true) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });

    if (!element.hasClass('md-no-focus')) {
      // restrict focus styles to the keyboard
      scope.mouseActive = false;
      element.on('mousedown', function () {
        scope.mouseActive = true;
        $timeout(function () {
          scope.mouseActive = false;
        }, 100);
      }).on('focus', function () {
        if (scope.mouseActive === false) {
          element.addClass('md-focused');
        }
      }).on('blur', function (ev) {
        element.removeClass('md-focused');
      });
    }
  }
}
'use strict';

/**
 *
 * @description markdown组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 * @usage <mu-markdown ng-model='your scope property' content='your markdown content'></mu-markdown>
 * ng-model: 可以动态改变markdown文本
 * content: 静态内容，如果ng-model的值有效，则会显示ng-model的值得内容
 */

angular.module('matrixui.components.markdown', []).directive('muMarkdown', muMarkdowndDirective);

function muMarkdowndDirective() {

  return {
    restrict: 'E',
    template: '\n      <div class=\'markdown-body\'>\n        <div ng-transclude></div>\n      </div>\n    ',
    transclude: true,
    scope: true,
    link: muMarkdownLink
  };

  /**
   *
   * @description muMarkdown指令的Link函数
   * @params {object} scope 指令的$scope对象
   * @params {object} element 指令对应的jqlite元素对象
   * @params {object} attrs 能拿到用户赋予指令的所有属性的值
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   */

  function muMarkdownLink(scope, element, attrs) {

    insertMathJaxScript(scope);

    /* 指令绑定的ng-model属性 */

    scope.name = attrs.ngModel;

    /* 提取要显示的content的值，ng-model的重要性高于content */

    var content = attrs.content;
    if (!content) {
      content = '';
    }
    if (scope.$parent[scope.name]) {
      content = scope.$parent[scope.name];
    }
    scope.content = content;

    /* 把渲染出来的html插入页面 */

    element.find('div').html(markdownToHTML(scope.content));

    /* scope.name用来判断ng-model属性是否存在，如果ng-model属性存在，当ng-model属性改变的时候，动态渲染markdown文本 */

    if (scope.name) {
      scope.$parent.$watch(scope.name, function () {
        var content = scope.$parent[scope.name];

        if (!content) {
          content = scope.content;
        }
        if (window.MathJax) {
          MathJax.Hub.Queue([insertHTML, content], ["Typeset", MathJax.Hub, element[0]], ["resetEquationNumbers", MathJax.InputJax.TeX]);
        } else {
          var callback = function callback() {
            return function () {
              MathJax.Hub.Queue([insertHTML, content], ["Typeset", MathJax.Hub, element[0]], ["resetEquationNumbers", MathJax.InputJax.TeX]);
            };
          };

          window._mathJaxCallback[scope.$id] = callback();
        }
      });
    }

    function insertHTML(content) {
      element.find('div').html(markdownToHTML(content));
    }
  }

  /**
   *
   * @description 将markdown文本渲染成html字符串
   * @params {string} content 需要渲染的markdown文本
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function markdownToHTML(content) {
    if (window.marked) {
      if (hljs) {
        marked.setOptions({
          highlight: function highlight(code) {
            return hljs.highlightAuto(code).value;
          }
        });
      }
      return marked(content);
    } else {
      throw Error('marked is not defined');
    }
  }

  /**
   *
   * @description 添加MathJax的脚本和设置config
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function insertMathJaxScript(scope) {

    /* 记录添加过MathJax脚本，防止多次添加 */

    if (window._addingMathJax) {
      return;
    } else {
      window._addingMathJax = true;
      window._mathJaxCallback = {};
    }

    /* 添加config脚本 */

    var configScript = document.createElement('script');
    configScript.type = 'text/x-mathjax-config';
    configScript.text = '\n      MathJax.Hub.Config({\n        showProcessingMessages: false,\n        tex2jax: { inlineMath: [[\'$\',\'$\'],[\'\\(\',\'\\)\']] },\n        TeX: { equationNumbers: {autoNumber: "AMS"} }\n      });\n    ';
    document.body.appendChild(configScript);

    /* 添加MathJax脚本 */

    var mathJaxScript = document.createElement('script');
    mathJaxScript.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
    mathJaxScript.type = 'text/javascript';
    mathJaxScript.onload = function () {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var key = _step.value;

          var func = window._mathJaxCallback[key];
          setTimeout(function () {
            return function () {
              try {
                func();
              } catch (e) {}
            };
          }(), 0);
        };

        for (var _iterator = Object.keys(window._mathJaxCallback)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    };
    document.body.appendChild(mathJaxScript);
  }
};
"use strict";