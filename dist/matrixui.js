'use strict';

angular.module('matrixui', ['matrixui.components', 'matrixui.specials']);
'use strict';

/**
 *
 * @description button组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components', ['matrixui.components.button', 'matrixui.components.card', 'matrixui.components.checkbox', 'matrixui.components.codeeditor', 'matrixui.components.datatable', 'matrixui.components.dialog', 'matrixui.components.markdown', 'matrixui.components.mdeditor', 'matrixui.components.panel', 'matrixui.components.radio', 'matrixui.components.select', 'matrixui.components.spinner', 'matrixui.components.tab']);
'use strict';

/**
 *
 * @description button组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.specials', []);
'use strict';

/**
 *
 * @description button组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components.button', []).directive('muButton', muButtonDirective);

function muButtonDirective($timeout) {

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
 * @description card组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.card', []).directive('muCard', muCardDirective);

function muCardDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>Card组件</h2>'
  };
}
'use strict';

/**
 *
 * @description checkbox组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.checkbox', []).directive('muCheckbox', muCheckboxDirective);

function muCheckboxDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-checkbox组件</h2>'
  };
}
'use strict';

/**
 *
 * @description codeeditor组件，代码编辑器
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.codeeditor', []).directive('muCodeeditor', muCodeeditorDirective);

function muCodeeditorDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-codeeditor组件</h2>'
  };
}
'use strict';

/**
 *
 * @description datatable组件，数据表格
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.datatable', []).directive('muDatatable', muDatatableDirective);

function muDatatableDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-datable组件</h2>'
  };
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

    insertMathJaxScript();

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

        /* 如果MathJax存在，则开始渲染，否则直到MathJax加载完毕才开始渲染 */

        function initMarkdown() {
          MathJax.Hub.Queue([insertHTML, content], ["Typeset", MathJax.Hub, element[0]], ["resetEquationNumbers", MathJax.InputJax.TeX]);
        }

        if (window.MathJax) {
          initMarkdown();
        } else {
          window.MatrixUI.markdown.mathJaxCallbacks[scope.$id] = initMarkdown;
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

  function insertMathJaxScript() {

    window.MatrixUI = window.MatrixUI || {};
    window.MatrixUI.markdown = window.MatrixUI.markdown || {};

    /* 记录添加过MathJax脚本，防止多次添加 */

    if (window.MatrixUI.markdown.addedMathJax) {
      return;
    } else {
      window.MatrixUI.markdown.addedMathJax = true;
      window.MatrixUI.markdown.mathJaxCallbacks = window.MatrixUI.markdown.mathJaxCallbacks || {};
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

          var func = window.MatrixUI.markdown.mathJaxCallbacks[key];
          setTimeout(function () {
            return function () {
              try {
                func();
                delete window.MatrixUI.markdown.mathJaxCallbacks[key];
              } catch (e) {}
            };
          }(), 0);
        };

        for (var _iterator = Object.keys(window.MatrixUI.markdown.mathJaxCallbacks)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
'use strict';

/**
 *
 * @description dialog组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.dialog', []).directive('muDialog', muDialogDirective);

function muDialogDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-dialog组件</h2>'
  };
}
'use strict';

/**
 *
 * @description mdeditor组件，基于：https://github.com/NextStepWebs/simplemde-markdown-editor
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components.mdeditor', []).directive('muMdeditor', muMdeditorDirective);

function muMdeditorDirective() {

  return {
    restrict: 'E',
    transclude: true,
    scope: true,
    template: '<textarea style="display: none;"></textarea>',
    link: muMdeditorLink
  };

  function muMdeditorLink(scope, element, attrs) {

    /* 插入需要的脚本代码 */

    insertSimpleMDEScript();
    insertMathJaxScript();

    /**
     *
     * @description SimpleMDE的渲染函数
     * @params {string} plainText 编辑器里面的markdown文本
     * @params {object} preview 预览区域的dom对象
     * @author 吴家荣 <jiarongwu.se@foxmail.com>
     *
     */

    function previewRender(plainText, preview) {
      if (!angular.element(preview).hasClass('markdown-body')) angular.element(preview).addClass('markdown-body');

      /* 由于科学公式渲染速度较慢，因此通过timeout来减少渲染次数 */

      if (!scope.timeout) {
        scope.timeout = setTimeout(function () {
          MathJax.Hub.Queue([insertHTML, plainText, preview], ["Typeset", MathJax.Hub, preview], ["resetEquationNumbers", MathJax.InputJax.TeX]);
          scope.timeout = null;
        }, 200);
      }

      return preview.innerHTML;
    }

    /**
     *
     * @description 创建SimpleMDE实例
     * @author 吴家荣 <jiarongwu.se@foxmail.com>
     *
     */

    function initMDE() {
      var type = attrs.type || 'simple';
      var toolbar = null;

      /* 不同的类型，具有不同的toolbar */

      if (type === 'full') {
        toolbar = ['heading-1', 'heading-2', 'heading-3', 'bold', 'italic', '|', 'quote', 'code', 'link', 'image', '|', 'unordered-list', 'ordered-list', '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide'];
      } else {
        toolbar = ['heading-1', 'heading-2', 'heading-3', 'bold', 'italic', '|', 'quote', 'code', 'link', 'image', '|', 'unordered-list', 'ordered-list', '|', 'preview', '|', 'guide'];
      }

      /* 创建SimpleMDE实例 */

      scope.mde = new SimpleMDE({
        spellChecker: false,
        element: element.find('textarea')[0],
        toolbar: toolbar,
        previewRender: previewRender,
        tabSize: 2
      });
    }

    if (window.SimpleMDE) {
      initMDE();
    } else {
      window.MatrixUI.mdeditor.simpleMDECallbacks[scope.$id] = initMDE;
    }
  }

  /**
   *
   * @description 渲染markdown文本成HTML，并插入到指定的dom中
   * @params {string} content markdown文本
   * @params {object} dom 对应的dom对象
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function insertHTML(content, dom) {
    angular.element(dom).html(markdownToHTML(content));
  }

  /**
   *
   * @description 渲染markdown文本
   * @params {string} content markdown文本
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
   * @description 插入SimpleMDE对应的js脚本
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function insertSimpleMDEScript() {

    window.MatrixUI = window.MatrixUI || {};
    window.MatrixUI.mdeditor = window.MatrixUI.mdeditor || {};

    if (window.MatrixUI.mdeditor.addedSimpleMDE) {
      return;
    } else {
      window.MatrixUI.mdeditor.addedSimpleMDE = true;
      window.MatrixUI.mdeditor.simpleMDECallbacks = window.MatrixUI.mdeditor.simpleMDECallbacks || {};
    }

    /* 添加simpleMDE脚本 */

    var simpleMDEScript = document.createElement('script');
    simpleMDEScript.src = 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js';
    simpleMDEScript.type = 'text/javascript';
    simpleMDEScript.onload = function () {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var key = _step.value;

          var func = window.MatrixUI.mdeditor.simpleMDECallbacks[key];
          setTimeout(function () {
            return function () {
              try {
                func();
                delete window.MatrixUI.mdeditor.simpleMDECallbacks[key];
              } catch (e) {}
            };
          }(), 0);
        };

        for (var _iterator = Object.keys(window.MatrixUI.mdeditor.simpleMDECallbacks)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
    document.body.appendChild(simpleMDEScript);
  }

  /**
   *
   * @description 插入MathJax对应的js脚本
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function insertMathJaxScript() {

    if (window.MathJax) return;

    /* 添加config脚本 */

    var configScript = document.createElement('script');
    configScript.type = 'text/x-mathjax-config';
    configScript.text = '\n      MathJax.Hub.Config({\n        showProcessingMessages: false,\n        tex2jax: { inlineMath: [[\'$\',\'$\'],[\'\\(\',\'\\)\']] },\n        TeX: { equationNumbers: {autoNumber: "AMS"} }\n      });\n    ';
    document.body.appendChild(configScript);

    /* 添加MathJax脚本 */

    var mathJaxScript = document.createElement('script');
    mathJaxScript.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
    mathJaxScript.type = 'text/javascript';
    document.body.appendChild(mathJaxScript);
  }
}
'use strict';

/**
 *
 * @description panel组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.panel', []).directive('muPanel', muPanelDirective);

function muPanelDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-panel组件</h2>'
  };
}
'use strict';

/**
 *
 * @description radio组件，单选框
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.radio', []).directive('muRadio', muRadioDirective);

function muRadioDirective() {

  function initAttrs(element, attrs) {
    var target = angular.element(element);
    var id = attrs.name + '-' + attrs.value;
    target.attr('for', id);
    target.find('input').attr('id', id);
    target.find('input').attr('name', attrs.name);
    target.find('input').attr('value', attrs.value);
    setSize(element, attrs.size);
  }

  function setSize(element, size) {
    var target = angular.element(element);
    var label = target.find('label')[0];
    label.classList.add(size);
  }

  function initEvent(element) {
    var target = angular.element(element);
    target[0].addEventListener('click', function (e) {
      console.log('click');
      target.find('input').attr('checked', true);
    });
  }

  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: '<div class="radio"><input type="radio" class="regular-radio"></input><label></label></div>',
    link: function link(scope, element, attrs) {
      initAttrs(element, attrs);
      initEvent(element);
    }
  };
}
'use strict';

/**
 *
 * @description select组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.select', []).directive('muSelect', muSelectDirective);

function muSelectDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-select组件</h2>'
  };
}
'use strict';

/**
 *
 * @description spinner组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.spinner', []).directive('muSpinner', muSpinnerDirective);

function muSpinnerDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-spinner组件</h2>'
  };
}
'use strict';

/**
 *
 * @description tab组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.tab', []).directive('muTab', muTabDirective);

function muTabDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-tab组件</h2>'
  };
}