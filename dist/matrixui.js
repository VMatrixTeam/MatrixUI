'use strict';

/**
 *
 * @description button组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components', ['matrixui.components.button', 'matrixui.components.card', 'matrixui.components.checkbox', 'matrixui.components.codeeditor', 'matrixui.components.datatable', 'matrixui.components.dialog', 'matrixui.components.markdown', 'matrixui.components.mdeditor', 'matrixui.components.panel', 'matrixui.components.radio', 'matrixui.components.select', 'matrixui.components.spinner', 'matrixui.components.tab']);
'use strict';

angular.module('matrixui', ['matrixui.components', 'matrixui.specials']);
'use strict';

/**
 *
 * @description button组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.specials', ['matrixui.specials.report']);
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
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<h2>mu-radio组件</h2>'
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
'use strict';

/**
 *
 * @description report组件过滤器
 * @author 王镇佳 <wzjfloor@163.com>
 *
 */

angular.module('matrixui.specials').filter('formatReportScore', function () {

  var formatReportScore = void 0;
  formatReportScore = function formatReportScore(data) {
    if (data === -1 || data === null) {
      return '正在评测并计算总分，请等候...';
    } else {
      return data;
    }
  };
  return formatReportScore;
});

angular.module('matrixui.specials').filter('formatReportGrade', function () {
  var formatReportGrade = void 0;
  formatReportGrade = function formatReportGrade(data) {
    if (data === undefined || data === null) {
      return '0';
    } else {
      return data;
    }
  };
  return formatReportGrade;
});
angular.module('matrixui.specials').filter('formatReportOutput', function () {

  var formatReportOutput = void 0;
  formatReportOutput = function formatReportOutput(data) {
    if (data === undefined || data === null || data === '') {
      return 'No output.';
    } else {
      return data;
    }
  };
  return formatReportOutput;
});
angular.module('matrixui.specials').filter('formatCheckMessage', function () {

  var formatCheckMessage = void 0;
  formatCheckMessage = function formatCheckMessage(data) {
    if (data === null || data === undefined) {
      return 'Pass.';
    } else {
      return data;
    }
  };
  return formatCheckMessage;
});
angular.module('matrixui.specials').filter('formatSubmissionsGrade', function () {

  var formatSubmissionsGrade = void 0;
  formatSubmissionsGrade = function formatSubmissionsGrade(data) {

    if (data === null) {
      return '等待评测中';
    } else if (data === '-1' || data === -1) {
      return '正在评测';
    } else {
      return data;
    }
  };
  return formatSubmissionsGrade;
});
angular.module('matrixui.specials').filter('formatReportResult', function () {

  var formatReportResult = void 0;
  formatReportResult = function formatReportResult(data) {
    if (data === 'WA') {
      return 'Wrong Answer';
    } else if (data === 'TL') {
      return 'Time Limit';
    } else if (data === 'CR') {
      return 'Correct';
    } else if (data === 'ML') {
      return 'Memory Limit';
    } else if (data === 'RE') {
      return 'Runtime Error';
    } else if (data === 'IE') {
      return 'Internal Error';
    } else if (data === 'OL') {
      return 'Output Limit';
    } else {
      return data;
    }
  };
  return formatReportResult;
});

angular.module('matrixui.specials').filter('deleteSpace', function () {

  var deleteSpace = void 0;
  deleteSpace = function deleteSpace(data) {

    var result = void 0;
    if (data[0] == '/') {
      result = data.slice(5);
    } else {
      result = data;
    }
    var i = 0;
    while (result[i] == ' ') {
      i++;
    }
    return result.slice(i);
  };

  return deleteSpace;
});

angular.module('matrixui.specials').filter('showWrongTests', function () {

  var showWrongTests = void 0;
  showWrongTests = function showWrongTests(array) {
    var results = void 0;
    if (array) {
      results = [];
      array.forEach(function (item) {
        if (item.result !== 'CR') {
          results.push(item);
        }
      });
      return results;
    }
  };
  return showWrongTests;
});
'use strict';

/**
 *
 * @description report组件
 * @author 王镇佳 <wzjfloor@163.com>
 *
 */

angular.module('matrixui.specials.report', []).directive('muReport', muReportDirective);

function muReportDirective() {
  return {

    restrict: 'E',
    transclude: true,
    replace: true,
    // templateUrl: '/src/specials/report/report.html',
    template: getTemplate,
    scope: true,
    link: muReportLink

  };

  /**
   *
   * @description muReport指令的Link函数
   * @params {object} scope 指令的$scope对象
   * @params {object} element 指令对应的jqlite元素对象
   * @params {object} attrs 能拿到用户赋予指令的所有属性的值
   * @author 王镇佳 <wzjfloor@163.com>
   */

  function muReportLink(scope, element, attrs) {

    /* 指令绑定的config 和 report属性 */
    scope.congigName = attrs.config;
    scope.reportName = attrs.report;

    var configContent = scope.$parent[scope.congigName];
    var reportContent = scope.$parent[scope.reportName];

    /* ng-model的重要性高于content */
    // 如果父级作用域已经加载出report
    if (reportContent && configContent) {

      //提取report和config
      scope.report = reportContent;
      scope.config = configContent;
      simplifyReport();
      fixReportLastWrap();
      extractGoogleTest();
    } else {
      //显示加载中...
      //但是显示方法待定
      scope.compileCheck = scope.staticCheck = scope.standardTests = scope.randomTests = scope.memoryCheck = scope.googleTest = null;
    }

    /* scope.name用来判断ng-model属性是否存在，如果ng-model属性存在，当ng-model属性改变的时候，动态渲染markdown文本 */
    if (scope.reportName) {

      scope.$parent.$watch(scope.reportName, function () {

        //获取report
        scope.report = scope.$parent[scope.reportName];
        simplifyReport();
        fixReportLastWrap();
        extractGoogleTest();
      });
    }

    if (scope.congigName) {

      scope.$parent.$watch(scope.congigName, function () {

        //获取config
        scope.config = scope.$parent[scope.congigName];
        simplifyReport();
        fixReportLastWrap();
        extractGoogleTest();
      });
    }

    //简化report
    function simplifyReport() {

      if (scope.report) {

        //简化report
        scope.compileCheck = scope.report['compile check'];
        scope.staticCheck = scope.report['static check'];
        scope.standardTests = scope.report['standard tests'];
        scope.randomTests = scope.report['random tests'];
        scope.memoryCheck = scope.report['memory check'];
        scope.googleTest = scope.report['google tests'];

        //提取report的googleTest信息
        scope.gtestFailedList = [];
        scope.gtestAllList = [];
      }
    }

    //处理换行问题
    function fixReportLastWrap() {

      // -------------------------------------
      // 处理standard input/output中的尾换行 START
      // -------------------------------------
      if (scope.standardTests) {

        var STAND_TESTS = scope.standardTests['standard tests'];

        for (var i = 0; i < STAND_TESTS.length; i++) {

          if (STAND_TESTS[i].stdin && STAND_TESTS[i].stdin[STAND_TESTS[i].stdin.length - 1] == '\n') {
            STAND_TESTS[i].stdin += '\n';
          }
          if (STAND_TESTS[i].standard_stdout && STAND_TESTS[i].standard_stdout[STAND_TESTS[i].standard_stdout.length - 1] == '\n') {
            STAND_TESTS[i].standard_stdout += '\n';
          }
          if (STAND_TESTS[i].stdout && STAND_TESTS[i].stdout[STAND_TESTS[i].stdout.length - 1] == '\n') {
            STAND_TESTS[i].stdout += '\n';
          }
        }
        scope.standardTests['standard tests'] = STAND_TESTS;
      }
      if (scope.randomTests) {

        var RANDOM_TESTS = scope.randomTests['random tests'];

        for (var _i = 0; _i < RANDOM_TESTS.length; _i++) {

          if (RANDOM_TESTS[_i].stdin && RANDOM_TESTS[_i].stdin[RANDOM_TESTS[_i].stdin.length - 1] == '\n') {
            RANDOM_TESTS[_i].stdin += '\n';
          }
          if (RANDOM_TESTS[_i].standard_stdout && RANDOM_TESTS[_i].standard_stdout[RANDOM_TESTS[_i].standard_stdout.length - 1] == '\n') {
            RANDOM_TESTS[_i].standard_stdout += '\n';
          }
          if (RANDOM_TESTS[_i].stdout && RANDOM_TESTS[_i].stdout[RANDOM_TESTS[_i].stdout.length - 1] == '\n') {
            RANDOM_TESTS[_i].stdout += '\n';
          }
        }
        scope.randomTests['random tests'] = RANDOM_TESTS;
      }
      // -------------------------------------
      // 处理standard input/output中的尾换行 END
      // -------------------------------------
    }

    //提取googleTest中的信息
    function extractGoogleTest() {

      if (scope.googleTest && scope.googleTest['google tests'][0].gtest.info) {
        scope.gtestAllList = Object.getOwnPropertyNames(scope.googleTest['google tests'][0].gtest.info);
        if (scope.googleTest['google tests'][0].gtest.failure != null) {
          //抽出failure数组的每个对象的属性名
          var obj = scope.googleTest['google tests'][0].gtest.failure;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var subobj = _step.value;

              scope.gtestFailedList.push(Object.getOwnPropertyNames(subobj)[0]);
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
        }
      }
    }
  }

  function getTemplate() {
    return '\n    <div id="matrixui-programming-report">\n      <div ng-if="config.grading[&quot;compile check&quot;]" class="compile-check report-section">\n        <div ng-click="toggleContent($event)" class="compile-check-score score">Compile Check : You Get {{compileCheck.grade? compileCheck.grade : 0}} Points of {{config.grading[\'compile check\']}} Points</div>\n        <div ng-if="compileCheck[&quot;compile check&quot;]" class="compile-error-content test-content">\n          <div ng-if="compileCheck.grade == config.grading[&quot;compile check&quot;]" class="report-detail">\n            <pre class="full-score">Pass compilation. You got full score!</pre>\n          </div>\n          <div ng-if="compileCheck &amp;&amp; compileCheck.grade != config.grading[&quot;compile check&quot;]" class="report-detail">\n            <pre class="error-content red-color">Compilation fail.</pre>\n            <div class="error-detail">\n              <pre class="error-content">{{compileCheck[\'compile check\']}}</pre>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="config.grading[&quot;static check&quot;]" class="static-check report-section">\n        <div ng-click="toggleContent($event)" class="static-check-score score">Static Check : You Get {{staticCheck.grade? staticCheck.grade : 0}} Points of {{config.grading[\'static check\']}} Points<a href="http://oclint.org/" target="_blank" ng-if="staticCheck.grade != config.grading[&quot;static check&quot;] &amp;&amp; staticCheck" class="link">Why it went wrong？</a></div>\n        <div class="static-check-content test-content">\n          <div ng-if="!staticCheck &amp;&amp; grade &gt;= 0" class="report-detail">\n            <pre class="not-executing-check">This check didn\'t execute because of errors above.</pre>\n          </div>\n          <div ng-if="!staticCheck &amp;&amp; grade == -1" class="report-detail">\n            <pre class="under-checking">Under testing...</pre>\n          </div>\n          <div ng-if="staticCheck.grade == config.grading[&quot;static check&quot;]" class="report-detail">\n            <pre class="full-score">Pass static check. You got full score!</pre>\n          </div>\n          <div ng-if="staticCheck &amp;&amp; (staticCheck.grade != config.grading[&quot;static check&quot;])" class="report-detail">\n            <pre class="error-content red-color">Static check fail.</pre>\n            <div class="error-detail">\n              <div class="message"></div>\n              <div ng-if="staticCheck[&quot;static check&quot;].summary" class="summary"></div>\n              <div ng-if="staticCheck[&quot;static check&quot;].violation" ng-repeat="item in staticCheck[&quot;static check&quot;].violation" class="violations">\n                <pre ng-if="item.message" class="error-content">{{ item.path | deleteSpace}} {{item.startLine}}:{{item.startColumn}} : {{item.category}}: {{item.message}}</pre>\n                <pre ng-if="item.rule &amp;&amp; !item.message" class="error-content">{{ item.path | deleteSpace }} {{item.startLine}}:{{item.startColumn}} : {{item.category}}: {{item.rule}}</pre>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="config.grading[&quot;standard tests&quot;]" class="standard-tests-check report-section">\n        <div ng-click="toggleContent($event)" class="standard-tests-check-score score">Standard Tests : You Get {{standardTests.grade | formatReportGrade }} Points of {{config.grading[\'standard tests\']}} Points</div>\n        <div class="standard-tests-content test-content">\n          <div ng-if="!standardTests &amp;&amp; grade &gt;= 0" class="report-detail">\n            <pre class="not-executing-check">This check didn\'t execute because of error above.</pre>\n          </div>\n          <div ng-if="!standardTests &amp;&amp; grade == -1" class="report-detail">\n            <pre class="under-checking">Under testing...</pre>\n          </div>\n          <div ng-if="standardTests.grade == config.grading[&quot;standard tests&quot;]" class="report-detail">\n            <pre class="full-score">Pass standard test. You got full score!</pre>\n          </div>\n          <div ng-if="standardTests &amp;&amp; standardTests.grade != config.grading[&quot;standard tests&quot;]" class="report-detail">\n            <pre class="error-content red-color">Some examples of failed standard test cases:</pre>\n            <div class="error-detail">\n              <div ng-repeat="test in standardTests[&quot;standard tests&quot;] | showWrongTests | limitTo: 3" class="standard-tests">\n                <hr ng-if="$index != 0"/>\n                <div ng-if="test.result != &quot;CR&quot;" class="standard-test">\n                  <div layout="layout" class="tests-check-summary">\n                    <pre layout="layout">[{{ $index+1 }}]</pre>\n                    <pre layout="layout" ng-if="test.memoryused">Memory Used : {{test.memoryused}}kb</pre>\n                    <pre layout="layout" ng-if="test.timeused">Time Used : {{test.timeused}}ms</pre>\n                    <pre layout="layout" ng-if="test.result">Result : {{test.result | formatReportResult}}</pre>\n                    <pre layout="layout" ng-if="test.memorylimit">Memory Limit : {{ test.memorylimit }}kb</pre>\n                    <pre layout="layout" ng-if="test.timelimit">Time Limit : {{ test.timelimit }}ms</pre>\n                  </div>\n                  <pre class="label">Standard Input :</pre>\n                  <pre class="error-content inout-tests">{{ test.stdin }}</pre>\n                  <pre class="label">Standard Output :</pre>\n                  <pre class="error-content inout-tests">{{ test.standard_stdout | formatReportOutput }}</pre>\n                  <pre class="label">Your Output :</pre>\n                  <pre class="error-content inout-tests">{{ test.stdout | formatReportOutput }}</pre>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="config.grading[&quot;random tests&quot;]" class="random-tests-check report-section">\n        <div ng-click="toggleContent($event)" class="random-tests-check-score score">Random Tests : You Get {{randomTests.grade | formatReportGrade}} Points of {{config.grading[\'random tests\']}} Points</div>\n        <div class="random-tests-content test-content">\n          <div ng-if="!randomTests &amp;&amp; grade &gt;= 0" class="report-detail">\n            <pre class="not-executing-check">This check didn\'t execute because of error above.</pre>\n          </div>\n          <div ng-if="!randomTest &amp;&amp; grade == -1" class="report-detail">\n            <pre class="under-checking">Under testing...</pre>\n          </div>\n          <div ng-if="randomTests.grade == config.grading[&quot;random tests&quot;]" class="report-detail">\n            <pre class="full-score">Pass random check. You got full score!</pre>\n          </div>\n          <div ng-if="randomTests &amp;&amp; randomTests.grade != config.grading[&quot;random tests&quot;]" class="report-detail">\n            <pre class="error-content red-color">Some examples of failed random test cases:</pre>\n            <div class="error-detail">\n              <div ng-repeat="test in randomTests[&quot;random tests&quot;] | showWrongTests | limitTo: 3" class="random-tests">\n                <hr ng-if="$index != 0"/>\n                <div ng-if="test.result != &quot;CR&quot;" class="random-test">\n                  <div layout="layout" class="tests-check-summary">\n                    <pre layout="layout">[{{ $index+1 }}]</pre>\n                    <pre layout="layout" ng-if="test.memoryused">Memory Used : {{ test.memoryused }}kb</pre>\n                    <pre layout="layout" ng-if="test.timeused">Time Used : {{ test.timeused }}ms</pre>\n                    <pre layout="layout" ng-if="test.result">Result : {{ test.result | formatReportResult}}</pre>\n                    <pre layout="layout" ng-if="test.memorylimit">Memory Limit : {{ test.memorylimit }}kb</pre>\n                    <pre layout="layout" ng-if="test.timelimit">Time Limit : {{ test.timelimit }}ms</pre>\n                  </div>\n                  <pre class="label">Standard Input :</pre>\n                  <pre class="error-content inout-tests">{{ test.stdin }}</pre>\n                  <pre class="label">Standard Output :</pre>\n                  <pre class="error-content inout-tests">{{ test.standard_stdout | formatReportOutput }}</pre>\n                  <pre class="label">Your Output :</pre>\n                  <pre class="error-content inout-tests">{{ test.stdout | formatReportOutput }}</pre>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="config.grading[&quot;memory check&quot;]" class="memory-check report-section">\n        <div ng-click="toggleContent($event)" class="memory-check-score score">Memory Check : You Get {{memoryCheck.grade | formatReportGrade}} Points of {{config.grading[\'memory check\']}} Points<a href="http://valgrind.org/" ng-if="memoryCheck.grade != config.grading[&quot;memory check&quot;] &amp;&amp; memoryCheck" class="link">Why it went wrong？</a></div>\n        <div class="memory-check-content test-content">\n          <div ng-if="!memoryCheck &amp;&amp; grade &gt;= 0" class="report-detail">\n            <pre class="not-executing-check">This check didn\'t execute because of error above.</pre>\n          </div>\n          <div ng-if="!memoryCheck &amp;&amp; grade == -1" class="report-detail">\n            <pre class="under-checking">Under testing...</pre>\n          </div>\n          <div ng-if="memoryCheck.grade == config.grading[&quot;memory check&quot;]" class="report-detail">\n            <pre class="full-score">Pass memory access check. You got full score!</pre>\n          </div>\n          <div ng-if="memoryCheck &amp;&amp; memoryCheck.grade != config.grading[&quot;memory check&quot;]" class="report-detail">\n            <pre class="error-content red-color">Memory check fail.</pre>\n            <div class="error-detail">\n              <div ng-repeat="check in memoryCheck[&quot;memory check&quot;]" class="memory-checks">\n                <hr ng-if="$index != 0"/>\n                <pre ng-if="check.message" class="memory-check-summary">[{{ $index+1 }}] {{ check.message }}</pre>\n                <pre ng-if="check.valgrindoutput.error.kind" class="memory-check-summary">[{{ $index+1 }}] Error :   {{ check.valgrindoutput.error.kind }}</pre>\n                <pre ng-if="check.stdin">Standard Input :</pre>\n                <pre ng-if="check.stdin" class="error-content inout-tests">{{ check.stdin }}</pre>\n                <div ng-if="check.valgrindoutput.error.stack.frame" class="memory-check">\n                  <div ng-repeat="frame in check.valgrindoutput.error.stack.frame">\n                    <hr ng-if="$index != 0"/>\n                    <pre ng-if="frame.obj" class="error-content">obj: {{ frame.obj }}</pre>\n                    <pre ng-if="frame.file &amp;&amp; frame.line" class="error-content">[{{ frame.file }}]: line {{ frame.line }}</pre>\n                    <pre ng-if="frame.fn" class="error-content">{{ frame.fn }}</pre>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="config.grading[&quot;google tests&quot;]" class="google-test report-section">\n        <div ng-click="toggleContent($event)" class="google-test-score score">Google Test : You Get {{googleTest.grade | formatReportGrade}} Points of {{config.grading[\'google tests\']}} Points</div>\n        <div class="google-test-content test-content">\n          <div ng-if="!googleTest &amp;&amp; grade &gt;= 0" class="report-detail">\n            <pre class="not-executing-check">This check didn\'t execute because of error above.</pre>\n          </div>\n          <div ng-if="!googleTest &amp;&amp; grade == -1" class="report-detail">\n            <pre class="under-checking">Under testing...</pre>\n          </div>\n          <div ng-if="googleTest.grade == config.grading[&quot;google tests&quot;]" class="report-detail">\n            <pre class="full-score">Pass Google test. You got full score!</pre>\n          </div>\n          <div ng-if="googleTest &amp;&amp; googleTest.grade != config.grading[&quot;google tests&quot;]" class="report-detail">\n            <pre class="error-content red-color">Google test fail</pre>\n            <div ng-show="googleTest[&quot;google tests&quot;][0].gtest.info != null" class="error-detail">\n              <pre ng-repeat="fail in gtestFailedList" class="error-content">{{fail}} : {{googleTest[\'google tests\'][0].gtest.info[fail]}}</pre>\n            </div>\n            <div ng-show="googleTest[&quot;google tests&quot;][0].gtest.info == null" class="error-detail">\n              <pre class="error-content">error: {{ googleTest[\'google tests\'][0].gtest.failure[0][\'error\'] }}</pre>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    ';
  }
}