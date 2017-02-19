/**
 *
 * @description mdeditor组件，基于：https://github.com/NextStepWebs/simplemde-markdown-editor
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular
  .module('matrixui.components.mdeditor', [])
  .directive('muMdeditor', muMdeditorDirective);

muMdeditorDirective.$inject = ['$parse'];

function muMdeditorDirective($parse) {

  return {
    require: '?ngModel',
    restrict: 'E',
    transclude: true,
    scope: true,
    template: `<textarea style="display: none;"></textarea>`,
    link: muMdeditorLink
  };

  function muMdeditorLink(scope, element, attrs, ngModel) {

    /* 指令绑定的ng-model属性 */
    let modelName = attrs.ngModel;
    scope.heightType = attrs.heiType;
    let getter = $parse(modelName);
    let setter = getter.assign;


    let content = attrs.content;
    if (!content) {
      content = '';
    }
    if (ngModel) {
      if (getter(scope.$parent)) {
        content = getter(scope.$parent);
      } else {
        setter(scope.$parent, '');
      }
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
      let types = attrs.type || 'simple';
      let toolbar = null;

      let type = types.split(' ')[0];
      let heightType = types.split(' ')[1];


      if (!heightType) {
        heightType = 'median';
      }

      /*根据传进来的类型设置编辑器高度 */
      switch (heightType) {
        case 'small':
          element[0].className += ' mdeditor-height-small';
          break;
        case 'median':
          element[0].className += ' mdeditor-height-median';
          break;
        case 'large':
          element[0].className += ' mdeditor-height-large';
          break;
        default:
          // statements_def
          break;
      }

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
        toolbar,
        previewRender,
        tabSize: 2,
      });

      if (ngModel) {
        configNgModel();
      }

      /* 设置图片上传插件 */
      if (!window.inlineAttachment) {
        throw Error('InlineAttachment未加载');
      } else {
        var option = {
          uploadUrl: attrs.uploadUrl,
          uploadFieldName: attrs.uploadFieldName,
          jsonFieldName: attrs.jsonFieldName
        };
        inlineAttachment.editors.codemirror4.attach(scope.mde.codemirror, option);
      }

      /* 如果提供了content，则把编辑器的值设置为content的值 */

      if (attrs.content) {
        scope.mde.value(attrs.content);
      }
      
    }

    /**
     *
     * @description 配置ngModel的函数
     * @author 邓廷礼 <mymikotomisaka@gmail.com>
     *
     */
    
    function configNgModel() {
      /* 添加watch事件 同步scope和parent的model变量 */
      scope.$watch(modelName, function(newVal, oldVal) {
        setter(scope.$parent, newVal);
      });

      scope.$parent.$watch(modelName, function(newVal, oldVal) {
        setter(scope, newVal);
      });

      /* 验证model的合法性 */
      ngModel.$formatters.push(function (modelValue) {
        if (!modelValue) {
          return '';
        }
        else if (angular.isArray(modelValue) || angular.isObject(modelValue)) {
          throw Error('an array or an object can not be a model of mdeditor');
        }
        return modelValue;
      });

      /* 渲染视图 */
      ngModel.$render = function () {
        let oldValue = scope.mde.codemirror.getValue();
        if (ngModel.$viewValue !== oldValue) {
          scope.mde.value(ngModel.$viewValue);
        }
      };

      /* 绑定codemirror事件 同步view */
      scope.mde.codemirror.on('change', function(instance) {
        let newValue = instance.getValue();
        if (newValue !== ngModel.$viewValue) {
          scope.$evalAsync(function () {
            ngModel.$setViewValue(newValue);
          });
        }
      });
    }
  }

  /**
   *
   * @description 返回full类型顶部工具栏
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function getFullToolbar() {
    let toolbar = [
      'heading-1', 'heading-2', 'heading-3', 'bold', 'italic',
      '|',
      'quote', 'code', 'link', 'image',
      '|',
      'unordered-list', 'ordered-list',
      '|',
      'preview', 'side-by-side', 'fullscreen',
      '|',
      'guide'
    ];

    return toolbar;
  }

  /**
   *
   * @description 返回simple类型顶部工具栏
   * @author 吴家荣 <jiarongwu.se@foxmail.com>
   *
   */

  function getSimpleToolbar() {
    let toolbar = [
      'heading-1', 'heading-2', 'heading-3', 'bold', 'italic',
      '|',
      'quote', 'code', 'link', 'image',
      '|',
      'unordered-list', 'ordered-list',
      '|',
      'preview',
      '|',
      'guide'
    ];

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
          highlight: function (code) {
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
