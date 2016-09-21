/**
 *
 * @description panel组件
 * @author yourname <youremail>
 *
 */

angular
  .module('matrixui.components.panel', [])
  .directive('muPanel', muPanelDirective);

function muPanelDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<h2>mu-panel组件</h2>`,
  };
}
