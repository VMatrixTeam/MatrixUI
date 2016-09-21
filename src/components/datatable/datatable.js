/**
 *
 * @description datatable组件，数据表格
 * @author yourname <youremail>
 *
 */

angular
  .module('matrixui.components.datatable', [])
  .directive('muDatatable', muDatatableDirective);

function muDatatableDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<h2>mu-datable组件</h2>`,
  };
}
