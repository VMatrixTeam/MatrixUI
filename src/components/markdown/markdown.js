/**
 *
 * @description markdown组件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular
  .module('matrixui.components.markdown', [])
  .directive('muMarkdown', muMarkdowndDirective);

function muMarkdowndDirective() {

  return {
    restrict: 'E',
    template: `<div></div>`,
    scope: {},
    link: muMarkdownLink
  };

  function muMarkdownLink(scope, element, attrs) {
    if (marked) {
      element.html(marked(attrs.content));
    } else {
      throw Error('marked is not defined');
    }
  }
};
