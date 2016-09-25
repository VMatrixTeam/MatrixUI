/**
 *
 * @description codeeditor组件，代码编辑器
 * @author yourname <youremail>
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
