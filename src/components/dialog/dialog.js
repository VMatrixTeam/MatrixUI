/**
 *
 * @description dialog组件
 * @author yourname <youremail>
 *
 */

angular
  .module('matrixui.components.dialog', [])
  .directive('muDialog', muDialogDirective);

function muDialogDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<h2>mu-dialog组件</h2>`,
  };
}
