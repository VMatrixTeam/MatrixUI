/**
 *
 * @description markdown组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 * @usage <mu-markdown ng-model='your scope property' content='your markdown content'></mu-markdown>
 * ng-model: 可以动态改变markdown文本
 * content: 静态内容，如果ng-model的值有效，则会显示ng-model的值得内容
 */

angular
  .module('matrixui.components.markdown', [])
  .directive('muMarkdown', muMarkdowndDirective);

function muMarkdowndDirective() {

  return {
    restrict: 'E',
    template: `
      <div class='markdown-body'>
        <div ng-transclude></div>
      </div>
    `,
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

    let content = attrs.content;
    if (!content) {
      content = '';
    }
    if (scope.$parent[scope.name]) {
      content = scope.$parent[scope.name]
    }
    scope.content = content;

    /* 把渲染出来的html插入页面 */

    element.find('div').html(markdownToHTML(scope.content));

    /* scope.name用来判断ng-model属性是否存在，如果ng-model属性存在，当ng-model属性改变的时候，动态渲染markdown文本 */

    if (scope.name) {
      scope.$parent.$watch(scope.name, function() {
        let content = scope.$parent[scope.name];

        if (!content) {
          content = scope.content;
        }

        /* 如果MathJax存在，则开始渲染，否则直到MathJax加载完毕才开始渲染 */

        if (window.MathJax) {
          MathJax.Hub.Queue(
            [insertHTML, content],
            ["Typeset", MathJax.Hub, element[0]],
            ["resetEquationNumbers", MathJax.InputJax.TeX]
          );
        } else {
          function callback() {
            return function() {
              MathJax.Hub.Queue(
                [insertHTML, content],
                ["Typeset", MathJax.Hub, element[0]],
                ["resetEquationNumbers", MathJax.InputJax.TeX]
              );
            };
          }
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
    mathJaxScript.onload = function() {
      for (let key of Object.keys(window._mathJaxCallback)) {
        let func = window._mathJaxCallback[key];
        setTimeout((function() {
          return function() {
            try {
              func();
            } catch(e) {}
          };
        })(), 0);
      }
    };
    document.body.appendChild(mathJaxScript);
  }
};
