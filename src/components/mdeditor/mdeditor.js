/**
 *
 * @description mdeditor组件，基于：https://github.com/NextStepWebs/simplemde-markdown-editor
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular
  .module('matrixui.components.mdeditor', [])
  .directive('muMdeditor', muMdeditorDirective);


function muMdeditorDirective() {

  return {
    restrict: 'E',
    transclude: true,
    scope: true,
    template: `<textarea style="display: none;"></textarea>`,
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
      if (!angular.element(preview).hasClass('markdown-body'))
        angular.element(preview).addClass('markdown-body');

      /* 由于科学公式渲染速度较慢，因此通过timeout来减少渲染次数 */

      if (!scope.timeout) {
        scope.timeout = setTimeout(function() {
          MathJax.Hub.Queue(
            [insertHTML, plainText, preview],
            ["Typeset", MathJax.Hub, preview],
            ["resetEquationNumbers", MathJax.InputJax.TeX]
          );
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
      let type = attrs.type || 'simple';
      let toolbar = null;

      /* 不同的类型，具有不同的toolbar */

      if (type === 'full') {
        toolbar = ['heading-1', 'heading-2', 'heading-3', 'bold', 'italic', '|','quote', 'code', 'link', 'image', '|','unordered-list', 'ordered-list', '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide'];
      } else {
        toolbar = ['heading-1', 'heading-2', 'heading-3', 'bold', 'italic', '|','quote', 'code', 'link', 'image','|','unordered-list', 'ordered-list', '|', 'preview', '|', 'guide'];
      }

      /* 创建SimpleMDE实例 */

      scope.mde = new SimpleMDE({
        spellChecker: false,
        element: element.find('textarea')[0],
        toolbar,
        previewRender,
        tabSize: 2,
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

    let simpleMDEScript = document.createElement('script');
    simpleMDEScript.src = 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js';
    simpleMDEScript.type = 'text/javascript';
    simpleMDEScript.onload = function() {
      for (let key of Object.keys(window.MatrixUI.mdeditor.simpleMDECallbacks)) {
        let func = window.MatrixUI.mdeditor.simpleMDECallbacks[key];
        setTimeout((function() {
          return function() {
            try {
              func();
              delete window.MatrixUI.mdeditor.simpleMDECallbacks[key];
            } catch(e) {}
          };
        })(), 0);
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

    let configScript = document.createElement('script');
    configScript.type = 'text/x-mathjax-config';
    configScript.text = `
      MathJax.Hub.Config({
        showProcessingMessages: false,
        tex2jax: { inlineMath: [['$','$'],['\\\(','\\)']] },
        TeX: { equationNumbers: {autoNumber: "AMS"} }
      });
    `;
    document.body.appendChild(configScript);

    /* 添加MathJax脚本 */

    let mathJaxScript = document.createElement('script');
    mathJaxScript.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
    mathJaxScript.type = 'text/javascript';
    document.body.appendChild(mathJaxScript);
  }
}
