/**
 *
 * @description radio组件，单选框
 * @author yourname <youremail>
 *
 */

angular
  .module('matrixui.components.radio', [])
  .directive('muRadio', muRadioDirective);

muRadioDirective.$inject = [];

function muRadioDirective() {

  function initAttrs(element, attrs){
    let target = angular.element(element);
    let id = `${attrs.name}-${attrs.value}`;
    target.attr('for', id);
    target.find('input').attr('id', id);
    target.find('input').attr('name', attrs.name);
    target.find('input').attr('value', attrs.value);
    setSize(element, attrs.size);
  }

  function setSize(element, size) {
    let target = angular.element(element);
    let label = target.find('label')[0];
    label.classList.add(size);
  }

  function initEvent(element) {
    let target = angular.element(element);
    target[0].addEventListener('click', (e) => {
      console.log('click');
      target.find('input').attr('checked', true);
    })
  }

  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: `<div class="radio"><input type="radio" class="regular-radio"></input><label></label></div>`,
    link: function(scope, element, attrs) {
      initAttrs(element, attrs);
      initEvent(element);
    }
  };
}
