/**
 *
 * @description tab组件
 * @author yourname <youremail>
 *
 */

angular
  .module('matrixui.components.tab', [])
  .directive('muTab', muTabDirective);

muTabDirective.$inject = [];

function muTabDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<h2>mu-tab组件</h2>`,
  };
}
