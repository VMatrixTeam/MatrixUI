/**
 *
 * @description codeeditor组件，代码编辑器
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

angular
  .module('matrixui.components.codeeditor', [])
  .directive('muCodeeditor', muCodeeditorDirective);

muCodeeditorDirective.$inject = [];

function muCodeeditorDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<h2>mu-codeeditor组件</h2>`,
  };
}
