/**
 *
 * @description radio组件，单选框
 * @author yourname <youremail>
 *
 */

angular
  .module('matrixui.components.radio', [])
  .directive('muRadio', muRadioDirective);

function muRadioDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<h2>mu-radio组件</h2>`,
  };
}
