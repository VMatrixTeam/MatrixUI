/**
 *
 * @description checkbox组件
 * @author yourname <youremail>
 *
 */

angular
  .module('matrixui.components.checkbox', [])
  .directive('muCheckbox', muCheckboxDirective);

function muCheckboxDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<h2>mu-checkbox组件</h2>`,
  };
}
