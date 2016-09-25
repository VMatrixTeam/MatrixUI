/**
 *
 * @description select组件
 * @author yourname <youremail>
 *
 */

angular
  .module('matrixui.components.select', [])
  .directive('muSelect', muSelectDirective);

muSelectDirective.$inject = [];

function muSelectDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<h2>mu-select组件</h2>`,
  };
}
