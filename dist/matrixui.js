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

muButtonDirective.$inject = ['$timeout'];

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

    if (attr.warn || attr.warn === '') element.addClass('mu-button-warn');
    if (attr.danger || attr.danger === '') element.addClass('mu-button-danger');

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

muCardDirective.$inject = [];

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

muCheckboxDirective.$inject = [];

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
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components.codeeditor', []).directive('muCodeeditor', muCodeeditorDirective);

muCodeeditorDirective.$inject = [];

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

muDatatableDirective.$inject = [];

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
 * @description dialog组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.dialog', []).directive('muDialog', muDialogDirective);

muDialogDirective.$inject = [];

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
 * @description markdown组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 * @usage <mu-markdown ng-model='your scope property' content='your markdown content'></mu-markdown>
 * ng-model: 可以动态改变markdown文本
 * content: 静态内容，如果ng-model的值有效，则会显示ng-model的值得内容
 */

angular.module('matrixui.components.markdown', []).directive('muMarkdown', muMarkdowndDirective);

muMarkdowndDirective.$inject = [];

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
   * @param {object} scope 指令的$scope对象
   * @param {object} element 指令对应的jqlite元素对象
   * @param {object} attrs 能拿到用户赋予指令的所有属性的值
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   */

  function muMarkdownLink(scope, element, attrs) {

    /* 指令绑定的ng-model属性 */

    scope.name = attrs.ngModel;

    /* 提取要显示的content的值，ng-model的重要性高于content */

    var content = attrs.content;
    if (!content) {
      content = '';
    }
    if (scope.$parent[scope.name]) {
      content = scope.$parent[scope.name];
    } else {
      scope.$parent[scope.name] = '';
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
          insertHTML(content);
          MathJax.Hub.Typeset(element[0]);
        }

        if (window.MathJax) {
          try {
            initMarkdown();
          } catch (e) {
            console.warn('markdown warn: 给定的数据暂时无法渲染，等待数据更新...');
          }
        } else {
          throw Error('MathJax没有加载');
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
   * @param {string} content 需要渲染的markdown文本
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
};
'use strict';

/**
 *
 * @description mdeditor组件，基于：https://github.com/NextStepWebs/simplemde-markdown-editor
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components.mdeditor', []).directive('muMdeditor', muMdeditorDirective);

muMdeditorDirective.$inject = [];

function muMdeditorDirective() {

  return {
    restrict: 'E',
    transclude: true,
    scope: true,
    template: '<textarea style="display: none;"></textarea>',
    link: muMdeditorLink
  };

  function muMdeditorLink(scope, element, attrs) {

    /* 指令绑定的ng-model属性 */

    scope.name = attrs.ngModel;

    var content = attrs.content;
    if (!content) {
      content = '';
    }
    if (scope.$parent[scope.name]) {
      content = scope.$parent[scope.name];
    } else {
      scope.$parent[scope.name] = '';
    }
    scope.content = content;

    if (scope.name) {
      scope.$parent.$watch(scope.name, function () {
        if (scope.mde) {
          scope.mde.value(scope.$parent[scope.name]);
        }
      });
    }

    if (window.SimpleMDE) {
      initMDE();
    } else {
      throw Error('mu-mdeditor error: SimpleMDE没有加载');
    }

    /**
     *
     * @description SimpleMDE的渲染函数
     * @param {string} plainText 编辑器里面的markdown文本
     * @param {object} preview 预览区域的dom对象
     * @author 吴家荣 <jiarongwu.se@foxmail.com>
     *
     */

    function previewRender(plainText, preview) {
      angular.element(preview).addClass('markdown-body');

      insertHTML(plainText, preview);
      MathJax.Hub.Typeset(preview);

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
        toolbar = getFullToolbar();
      } else {
        toolbar = getSimpleToolbar();
      }

      /* 创建SimpleMDE实例 */

      scope.mde = new SimpleMDE({
        spellChecker: false,
        element: element.find('textarea')[0],
        toolbar: toolbar,
        previewRender: previewRender,
        tabSize: 2
      });

      /* 如果提供了content，则把编辑器的值设置为content的值 */

      if (attrs.content) {
        scope.mde.value(attrs.content);
      }
    }
  }

  /**
   *
   * @description 返回full类型顶部工具栏
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function getFullToolbar() {
    var toolbar = ['heading-1', 'heading-2', 'heading-3', 'bold', 'italic', '|', 'quote', 'code', 'link', 'image', '|', 'unordered-list', 'ordered-list', '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide'];

    return toolbar;
  }

  /**
   *
   * @description 返回simple类型顶部工具栏
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function getSimpleToolbar() {
    var toolbar = ['heading-1', 'heading-2', 'heading-3', 'bold', 'italic', '|', 'quote', 'code', 'link', 'image', '|', 'unordered-list', 'ordered-list', '|', 'preview', '|', 'guide'];

    return toolbar;
  }

  /**
   *
   * @description 渲染markdown文本成HTML，并插入到指定的dom中
   * @param {string} content markdown文本
   * @param {object} dom 对应的dom对象
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function insertHTML(content, dom) {
    angular.element(dom).html(markdownToHTML(content));
  }

  /**
   *
   * @description 渲染markdown文本
   * @param {string} content markdown文本
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
}
'use strict';

/**
 *
 * @description panel组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.panel', []).directive('muPanel', muPanelDirective);

muPanelDirective.$inject = [];

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

muRadioDirective.$inject = [];

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
 * @description select组件，基于 angular.selector:https://github.com/indrimuska/angular-selector
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular.module('matrixui.components.select', []).run(muSelectRun).directive('muSelect', muSelectDirective);

muSelectRun.$inject = ['$templateCache'];

function muSelectRun($templateCache) {
  $templateCache.put('selector/selector.html', '<div class="selector-container" ng-attr-dir="{{rtl ? \'rtl\' : \'ltr\'}}" ' + 'ng-class="{open: isOpen, empty: !filteredOptions.length && (!create || !search), multiple: multiple, \'has-value\': hasValue(), rtl: rtl, ' + 'loading: loading, \'remove-button\': removeButton, disabled: disabled}">' + '<select name="{{name}}" ng-hide="true" ng-required="required && !hasValue()" ' + 'ng-model="selectedValues" multiple ng-options="option as getObjValue(option, labelAttr) for option in selectedValues"></select>' + '<label class="selector-input">' + '<ul class="selector-values">' + '<li ng-repeat="(index, option) in selectedValues track by index">' + '<div ng-include="viewItemTemplate"></div>' + '<div ng-if="multiple" class="selector-helper" ng-click="!disabled && unset(index)">' + '<span class="selector-icon"></span>' + '</div>' + '</li>' + '</ul>' + '<input ng-model="search" placeholder="{{!hasValue() ? placeholder : \'\'}}" ng-model-options="{debounce: debounce}"' + 'ng-disabled="disabled" ng-readonly="disableSearch" ng-required="required && !hasValue()" autocomplete="off">' + '<div ng-if="!multiple || loading" class="selector-helper selector-global-helper" ng-click="!disabled && removeButton && unset()">' + '<span class="selector-icon"></span>' + '</div>' + '</label>' + '<ul class="selector-dropdown" ng-show="filteredOptions.length > 0 || (create && search)">' + '<li class="selector-option create" ng-class="{active: highlighted == -1}" ng-if="create && search" ' + 'ng-include="dropdownCreateTemplate" ng-mouseover="highlight(-1)" ng-click="createOption(search)"></li>' + '<li ng-repeat-start="(index, option) in filteredOptions track by index" class="selector-optgroup" ' + 'ng-include="dropdownGroupTemplate" ng-show="groupAttr && ' + '(getObjValue(option, groupAttr) && index == 0 || getObjValue(filteredOptions[index - 1], groupAttr) != getObjValue(option, groupAttr))"></li>' + '<li ng-repeat-end ng-class="{active: highlighted == index, grouped: groupAttr && getObjValue(option, groupAttr)}" class="selector-option" ' + 'ng-include="dropdownItemTemplate" ng-mouseover="highlight(index)" ng-click="set()"></li>' + '</ul>' + '</div>');
  $templateCache.put('selector/item-create.html', 'Add <i ng-bind="search"></i>');
  $templateCache.put('selector/item-default.html', '<span ng-bind="getObjValue(option, labelAttr) || option"></span>');
  $templateCache.put('selector/group-default.html', '<span ng-bind="getObjValue(option, groupAttr)"></span>');
}

var Selector = null;

muSelectDirective.$inject = ['$filter', '$timeout', '$window', '$http', '$q'];

function muSelectDirective($filter, $timeout, $window, $http, $q) {
  return new Selector($filter, $timeout, $window, $http, $q);
}

Selector = function () {

  // Key codes
  var KEYS = { up: 38, down: 40, left: 37, right: 39, escape: 27, enter: 13, backspace: 8, delete: 46, shift: 16, leftCmd: 91, rightCmd: 93, ctrl: 17, alt: 18, tab: 9 };

  var $filter = void 0,
      $timeout = void 0,
      $window = void 0,
      $http = void 0,
      $q = void 0;

  function getStyles(element) {
    return !(element instanceof HTMLElement) ? {} : element.ownerDocument && element.ownerDocument.defaultView.opener ? element.ownerDocument.defaultView.getComputedStyle(element) : window.getComputedStyle(element);
  }

  // Selector directive
  function Selector(filter, timeout, window, http, q) {
    this.restrict = 'EAC';
    this.replace = true;
    this.transclude = true;
    this.scope = {
      name: '@?',
      value: '=model',
      disabled: '=?disable',
      disableSearch: '=?',
      required: '=?require',
      multiple: '=?multi',
      placeholder: '@?',
      valueAttr: '@',
      labelAttr: '@?',
      groupAttr: '@?',
      options: '=?',
      debounce: '=?',
      create: '&?',
      limit: '=?',
      rtl: '=?',
      api: '=?',
      change: '&?',
      remote: '&?',
      remoteParam: '@?',
      remoteValidation: '&?',
      remoteValidationParam: '@?',
      removeButton: '=?',
      softDelete: '=?',
      closeAfterSelection: '=?',
      viewItemTemplate: '=?',
      dropdownItemTemplate: '=?',
      dropdownCreateTemplate: '=?',
      dropdownGroupTemplate: '=?'
    };
    this.templateUrl = 'selector/selector.html';
    $filter = filter;
    $timeout = timeout;
    $window = window;
    $http = http;
    $q = q;
  }
  Selector.prototype.$inject = ['$filter', '$timeout', '$window', '$http', '$q'];
  Selector.prototype.link = function (scope, element, attrs, controller, transclude) {
    transclude(scope, function (clone, scope) {
      var filter = $filter('filter'),
          input = angular.element(element[0].querySelector('.selector-input input')),
          dropdown = angular.element(element[0].querySelector('.selector-dropdown')),
          inputCtrl = input.controller('ngModel'),
          selectCtrl = element.find('select').controller('ngModel'),
          initDeferred = $q.defer(),
          defaults = {
        api: {},
        search: '',
        disableSearch: false,
        selectedValues: [],
        highlighted: 0,
        valueAttr: null,
        labelAttr: 'label',
        groupAttr: 'group',
        options: [],
        debounce: 0,
        limit: Infinity,
        remoteParam: 'q',
        remoteValidationParam: 'value',
        removeButton: true,
        viewItemTemplate: 'selector/item-default.html',
        dropdownItemTemplate: 'selector/item-default.html',
        dropdownCreateTemplate: 'selector/item-create.html',
        dropdownGroupTemplate: 'selector/group-default.html'
      };

      // Default attributes
      if (!angular.isDefined(scope.value) && scope.multiple) scope.value = [];
      angular.forEach(defaults, function (value, key) {
        if (!angular.isDefined(scope[key])) scope[key] = value;
      });
      angular.forEach(['name', 'valueAttr', 'labelAttr'], function (attr) {
        if (!attrs[attr]) attrs[attr] = scope[attr];
      });

      // Options' utilities
      scope.getObjValue = function (obj, path) {
        var key;
        if (!angular.isDefined(obj) || !angular.isDefined(path)) return obj;
        path = angular.isArray(path) ? path : path.split('.');
        key = path.shift();

        if (key.indexOf('[') > 0) {
          var match = key.match(/(\w+)\[(\d+)\]/);
          if (match !== null) {
            obj = obj[match[1]];
            key = match[2];
          }
        }
        return path.length === 0 ? obj[key] : scope.getObjValue(obj[key], path);
      };
      scope.setObjValue = function (obj, path, value) {
        var key;
        if (!angular.isDefined(obj)) obj = {};
        path = angular.isArray(path) ? path : path.split('.');
        key = path.shift();

        if (key.indexOf('[') > 0) {
          var match = key.match(/(\w+)\[(\d+)\]/);
          if (match !== null) {
            obj = obj[match[1]];
            key = match[2];
          }
        }
        obj[key] = path.length === 0 ? value : scope.setObjValue(obj[key], path, value);
        return obj;
      };
      scope.optionValue = function (option) {
        return scope.valueAttr == null ? option : scope.getObjValue(option, scope.valueAttr);
      };
      scope.optionEquals = function (option, value) {
        return angular.equals(scope.optionValue(option), angular.isDefined(value) ? value : scope.value);
      };

      // Value utilities
      scope.setValue = function (value) {
        if (!scope.multiple) scope.value = scope.valueAttr == null ? value : scope.getObjValue(value || {}, scope.valueAttr);else scope.value = scope.valueAttr == null ? value || [] : (value || []).map(function (option) {
          return scope.getObjValue(option, scope.valueAttr);
        });
      };
      scope.hasValue = function () {
        return scope.multiple ? (scope.value || []).length > 0 : !!scope.value;
      };

      // Remote fetching
      scope.request = function (paramName, paramValue, remote, remoteParam) {
        var promise,
            remoteOptions = {};
        if (scope.disabled) return $q.reject();
        if (!angular.isDefined(remote)) throw 'Remote attribute is not defined';

        scope.loading = true;
        scope.options = [];
        remoteOptions[paramName] = paramValue;
        promise = remote(remoteOptions);
        if (typeof promise.then !== 'function') {
          var settings = { method: 'GET', cache: true, params: {} };
          angular.extend(settings, promise);
          angular.extend(settings.params, promise.params);
          settings.params[remoteParam] = paramValue;
          promise = $http(settings);
        }
        promise.then(function (data) {
          scope.options = data.data || data;
          scope.filterOptions();
          scope.loading = false;
          initDeferred.resolve();
        }, function (error) {
          scope.loading = false;
          initDeferred.reject();
          throw 'Error while fetching data: ' + (error.message || error);
        });
        return promise;
      };
      scope.fetch = function () {
        return scope.request('search', scope.search || '', scope.remote, scope.remoteParam);
      };
      scope.fetchValidation = function (value) {
        return scope.request('value', value, scope.remoteValidation, scope.remoteValidationParam);
      };
      if (!angular.isDefined(scope.remote)) {
        scope.remote = false;
        scope.remoteValidation = false;
        initDeferred.resolve();
      } else if (!angular.isDefined(scope.remoteValidation)) scope.remoteValidation = false;
      if (scope.remote) $timeout(function () {
        $q.when(!scope.hasValue() || !scope.remoteValidation ? angular.noop : scope.fetchValidation(scope.value)).then(function () {
          scope.$watch('search', function () {
            $timeout(scope.fetch);
          });
        });
      });

      // Fill with options in the select
      scope.optionToObject = function (option, group) {
        var object = {},
            element = angular.element(option);

        angular.forEach(option.dataset, function (value, key) {
          if (!key.match(/^\$/)) object[key] = value;
        });
        if (option.value) scope.setObjValue(object, scope.valueAttr || 'value', option.value);
        if (element.text()) scope.setObjValue(object, scope.labelAttr, element.text().trim());
        if (angular.isDefined(group)) scope.setObjValue(object, scope.groupAttr, group);
        scope.options.push(object);

        if (element.attr('selected') && (scope.multiple || !scope.hasValue())) if (!scope.multiple) {
          if (!scope.value) scope.value = scope.optionValue(object);
        } else {
          if (!scope.value) scope.value = [];
          scope.value.push(scope.optionValue(object));
        }
      };
      scope.fillWithHtml = function () {
        scope.options = [];
        angular.forEach(clone, function (element) {
          var tagName = (element.tagName || '').toLowerCase();

          if (tagName == 'option') scope.optionToObject(element);
          if (tagName == 'optgroup') {
            angular.forEach(element.querySelectorAll('option'), function (option) {
              scope.optionToObject(option, (element.attributes.label || {}).value);
            });
          }
        });
        scope.updateSelected();
      };

      // Initialization
      scope.initialize = function () {
        if (!scope.remote && (!angular.isArray(scope.options) || !scope.options.length)) scope.fillWithHtml();
        if (scope.hasValue()) {
          if (!scope.multiple) {
            if (angular.isArray(scope.value)) scope.value = scope.value[0];
          } else {
            if (!angular.isArray(scope.value)) scope.value = [scope.value];
          }
          scope.updateSelected();
          scope.filterOptions();
          scope.updateValue();
        }
      };
      scope.$watch('multiple', function () {
        $timeout(scope.setInputWidth);
        initDeferred.promise.then(scope.initialize, scope.initialize);
      });

      // Dropdown utilities
      scope.dropdownPosition = function () {
        var label = input.parent()[0],
            styles = getStyles(label),
            marginTop = parseFloat(styles.marginTop || 0),
            marginLeft = parseFloat(styles.marginLeft || 0);

        dropdown.css({
          top: label.offsetTop + label.offsetHeight + marginTop + 'px',
          left: label.offsetLeft + marginLeft + 'px',
          width: label.offsetWidth + 'px'
        });
      };
      scope.open = function () {
        if (scope.multiple && (scope.selectedValues || []).length >= scope.limit) return;
        scope.isOpen = true;
        scope.dropdownPosition();
        $timeout(scope.scrollToHighlighted);
      };
      scope.close = function () {
        scope.isOpen = false;
        scope.resetInput();
        if (scope.remote) $timeout(scope.fetch);
      };
      scope.decrementHighlighted = function () {
        scope.highlight(scope.highlighted - 1);
        scope.scrollToHighlighted();
      };
      scope.incrementHighlighted = function () {
        scope.highlight(scope.highlighted + 1);
        scope.scrollToHighlighted();
      };
      scope.highlight = function (index) {
        if (attrs.create && scope.search && index == -1) scope.highlighted = -1;else if (scope.filteredOptions.length) scope.highlighted = (scope.filteredOptions.length + index) % scope.filteredOptions.length;
      };
      scope.scrollToHighlighted = function () {
        var dd = dropdown[0],
            option = dd.querySelectorAll('li.selector-option')[scope.highlighted],
            styles = getStyles(option),
            marginTop = parseFloat(styles.marginTop || 0),
            marginBottom = parseFloat(styles.marginBottom || 0);

        if (!scope.filteredOptions.length) return;

        if (option.offsetTop + option.offsetHeight + marginBottom > dd.scrollTop + dd.offsetHeight) $timeout(function () {
          dd.scrollTop = option.offsetTop + option.offsetHeight + marginBottom - dd.offsetHeight;
        });

        if (option.offsetTop - marginTop < dd.scrollTop) $timeout(function () {
          dd.scrollTop = option.offsetTop - marginTop;
        });
      };
      scope.createOption = function (value) {
        $q.when(function () {
          var option = {};
          if (angular.isFunction(scope.create)) {
            option = scope.create({ input: value });
          } else {
            scope.setObjValue(option, scope.labelAttr, value);
            scope.setObjValue(option, scope.valueAttr || 'value', value);
          }
          return option;
        }()).then(function (option) {
          scope.options.push(option);
          scope.set(option);
        });
      };
      scope.set = function (option) {
        if (scope.multiple && (scope.selectedValues || []).length >= scope.limit) return;

        if (!angular.isDefined(option)) option = scope.filteredOptions[scope.highlighted];

        if (!scope.multiple) scope.selectedValues = [option];else {
          if (!scope.selectedValues) scope.selectedValues = [];
          if (scope.selectedValues.indexOf(option) < 0) scope.selectedValues.push(option);
        }
        if (!scope.multiple || scope.closeAfterSelection || (scope.selectedValues || []).length >= scope.limit) scope.close();
        scope.resetInput();
        selectCtrl.$setDirty();
      };
      scope.unset = function (index) {
        if (!scope.multiple) scope.selectedValues = [];else scope.selectedValues.splice(angular.isDefined(index) ? index : scope.selectedValues.length - 1, 1);
        scope.resetInput();
        selectCtrl.$setDirty();
      };
      scope.keydown = function (e) {
        switch (e.keyCode) {
          case KEYS.up:
            if (!scope.isOpen) break;
            scope.decrementHighlighted();
            e.preventDefault();
            break;
          case KEYS.down:
            if (!scope.isOpen) scope.open();else scope.incrementHighlighted();
            e.preventDefault();
            break;
          case KEYS.escape:
            scope.highlight(0);
            scope.close();
            break;
          case KEYS.enter:
            if (scope.isOpen) {
              if (attrs.create && scope.search && scope.highlighted == -1) scope.createOption(e.target.value);else if (scope.filteredOptions.length) scope.set();
              e.preventDefault();
            }
            break;
          case KEYS.backspace:
            if (!input.val()) {
              var search = scope.getObjValue(scope.selectedValues.slice(-1)[0] || {}, scope.labelAttr || '');
              scope.unset();
              scope.open();
              if (scope.softDelete && !scope.disableSearch) $timeout(function () {
                scope.search = search;
              });
              e.preventDefault();
            }
            break;
          case KEYS.left:
          case KEYS.right:
          case KEYS.shift:
          case KEYS.ctrl:
          case KEYS.alt:
          case KEYS.tab:
          case KEYS.leftCmd:
          case KEYS.rightCmd:
            break;
          default:
            if (!scope.multiple && scope.hasValue()) {
              e.preventDefault();
            } else {
              scope.open();
              scope.highlight(0);
            }
            break;
        }
      };

      // Filtered options
      scope.inOptions = function (options, value) {
        // if options are fetched from a remote source, it's not possibile to use
        // the simplest check with native `indexOf` function, beacause every object
        // in the results array has it own new address
        if (scope.remote) return options.filter(function (option) {
          return angular.equals(value, option);
        }).length > 0;else return options.indexOf(value) >= 0;
      };
      scope.filterOptions = function () {
        scope.filteredOptions = filter(scope.options || [], scope.search);
        if (!angular.isArray(scope.selectedValues)) scope.selectedValues = [];
        if (scope.multiple) scope.filteredOptions = scope.filteredOptions.filter(function (option) {
          return !scope.inOptions(scope.selectedValues, option);
        });else {
          var index = scope.filteredOptions.indexOf(scope.selectedValues[0]);
          if (index >= 0) scope.highlight(index);
        }
      };

      // Input width utilities
      scope.measureWidth = function () {
        var width,
            styles = getStyles(input[0]),
            shadow = angular.element('<span class="selector-shadow"></span>');
        shadow.text(input.val() || (!scope.hasValue() ? scope.placeholder : '') || '');
        angular.element(document.body).append(shadow);
        angular.forEach(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent'], function (style) {
          shadow.css(style, styles[style]);
        });
        width = shadow[0].offsetWidth;
        shadow.remove();
        return width;
      };
      scope.setInputWidth = function () {
        var width = scope.measureWidth() + 1;
        input.css('width', width + 'px');
      };
      scope.resetInput = function () {
        input.val('');
        scope.setInputWidth();
        $timeout(function () {
          scope.search = '';
        });
      };

      scope.$watch('[search, options, value]', function () {
        // hide selected items
        scope.filterOptions();
        $timeout(function () {
          // set input width
          scope.setInputWidth();
          // repositionate dropdown
          if (scope.isOpen) scope.dropdownPosition();
        });
      }, true);

      // Update value
      scope.updateValue = function (origin) {
        if (!angular.isDefined(origin)) origin = scope.selectedValues || [];
        scope.setValue(!scope.multiple ? origin[0] : origin);
      };
      scope.$watch('selectedValues', function (newValue, oldValue) {
        if (angular.equals(newValue, oldValue)) return;
        scope.updateValue();
        if (angular.isFunction(scope.change)) scope.change(scope.multiple ? { newValue: newValue, oldValue: oldValue } : { newValue: (newValue || [])[0], oldValue: (oldValue || [])[0] });
      }, true);
      scope.$watchCollection('options', function (newValue, oldValue) {
        if (angular.equals(newValue, oldValue) || scope.remote) return;
        scope.updateSelected();
      });

      // Update selected values
      scope.updateSelected = function () {
        if (!scope.multiple) scope.selectedValues = (scope.options || []).filter(function (option) {
          return scope.optionEquals(option);
        }).slice(0, 1);else scope.selectedValues = (scope.value || []).map(function (value) {
          return filter(scope.options, function (option) {
            return scope.optionEquals(option, value);
          })[0];
        }).filter(function (value) {
          return angular.isDefined(value);
        }).slice(0, scope.limit);
      };
      scope.$watch('value', function (newValue, oldValue) {
        if (angular.equals(newValue, oldValue)) return;
        $q.when(!scope.remote || !scope.remoteValidation || !scope.hasValue() ? angular.noop : scope.fetchValidation(newValue)).then(function () {
          scope.updateSelected();
          scope.filterOptions();
          scope.updateValue();
        });
      }, true);

      // DOM event listeners
      input = angular.element(element[0].querySelector('.selector-input input')).on('focus', function () {
        $timeout(function () {
          scope.$apply(scope.open);
        });
      }).on('blur', function () {
        scope.$apply(scope.close);
      }).on('keydown', function (e) {
        scope.$apply(function () {
          scope.keydown(e);
        });
      }).on('input', function () {
        scope.setInputWidth();
      });
      dropdown.on('mousedown', function (e) {
        e.preventDefault();
      });
      angular.element($window).on('resize', function () {
        scope.dropdownPosition();
      });

      // Update select controller
      scope.$watch(function () {
        return inputCtrl.$pristine;
      }, function ($pristine) {
        selectCtrl[$pristine ? '$setPristine' : '$setDirty']();
      });
      scope.$watch(function () {
        return inputCtrl.$touched;
      }, function ($touched) {
        selectCtrl[$touched ? '$setTouched' : '$setUntouched']();
      });

      // Expose APIs
      angular.forEach(['open', 'close', 'fetch'], function (api) {
        scope.api[api] = scope[api];
      });
      scope.api.focus = function () {
        input[0].focus();
      };
      scope.api.set = function (value) {
        return scope.value = value;
      };
      scope.api.unset = function (value) {
        var values = !value ? scope.selectedValues : (scope.selectedValues || []).filter(function (option) {
          return scope.optionEquals(option, value);
        }),
            indexes = scope.selectedValues.map(function (option, index) {
          return scope.inOptions(values, option) ? index : -1;
        }).filter(function (index) {
          return index >= 0;
        });

        angular.forEach(indexes, function (index, i) {
          scope.unset(index - i);
        });
      };
    });
  };

  return Selector;
}();
'use strict';

/**
 *
 * @description spinner组件
 * @author yourname <youremail>
 *
 */

angular.module('matrixui.components.spinner', []).directive('muSpinner', muSpinnerDirective);

muSpinnerDirective.$inject = [];

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

muTabDirective.$inject = [];

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
   * @param {object} scope 指令的$scope对象
   * @param {object} element 指令对应的jqlite元素对象
   * @param {object} attrs 能拿到用户赋予指令的所有属性的值
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