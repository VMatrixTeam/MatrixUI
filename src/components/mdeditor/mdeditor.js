/**
 *
 * @description mdeditor组件
 * @author yourname <youremail>
 *
 */

angular
  .module('matrixui.components.mdeditor', [])
  .directive('muMdeditor', muMdeditorDirective);

function muMdeditorDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<h2>mu-mdeditor组件</h2>`,
  };
}
