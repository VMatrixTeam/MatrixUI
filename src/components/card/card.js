/**
 *
 * @description card组件
 * @author yourname <youremail>
 *
 */

angular
  .module('matrixui.components.card', [])
  .directive('muCard', muCardDirective);

function muCardDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<h2>Card组件</h2>`,
  };
}
