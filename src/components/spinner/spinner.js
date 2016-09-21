/**
 *
 * @description spinner组件
 * @author yourname <youremail>
 *
 */

angular
  .module('matrixui.components.spinner', [])
  .directive('muSpinner', muSpinnerDirective);

function muSpinnerDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<h2>mu-spinner组件</h2>`,
  };
}
