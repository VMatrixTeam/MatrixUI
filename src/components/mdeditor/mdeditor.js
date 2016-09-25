/**
 *
 * @description mdeditor组件，基于：https://github.com/NextStepWebs/simplemde-markdown-editor
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular
  .module('matrixui.components.mdeditor', [])
  .directive('muMdeditor', muMdeditorDirective);

muMdeditorDirective.$inject = [];

function muMdeditorDirective() {

  return {
    restrict: 'E',
    transclude: true,
    scope: true,
    template: `<textarea style="display: none;"></textarea>`,
    link: muMdeditorLink
  };

  function muMdeditorLink(scope, element, attrs) {

    /* 指令绑定的ng-model属性 */

    scope.name = attrs.ngModel;

    let content = attrs.content;
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
      scope.$parent.$watch(scope.name, function() {
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
      let type = attrs.type || 'simple';
      let toolbar = null;

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
