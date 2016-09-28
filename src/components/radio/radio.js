/**
 *
 * @description radio组件，单选框
 * @author yourname <williamjwking@gmail.com>
 *
 */

angular
  .module('matrixui.components.radio', [])
  .directive('muRadioGroup', muRadioGroupDirective)
  .directive('muRadio', muRadioDirective);


muRadioGroupDirective.$inject = [];

function muRadioGroupDirective() {

  RadioGroupController.prototype = {
    getName: function() {
      return this._name;
    },
    getValue: function() {
      if (!this._ngModelCtrl) return null;
      return this._ngModelCtrl.$viewValue;
    },
    setValue: function(value, eventType) {
      if (!this._ngModelCtrl) return;
      this._ngModelCtrl.$setViewValue(value, eventType);
    }
  };

  return {
    restrict: 'E',
    controller: ['$scope', RadioGroupController],
    scope: true,
    require: ['muRadioGroup', '?ngModel'],
    link: { pre: linkRadioGroup }
  }

  function linkRadioGroup(scope, element, attrs, ctrls) {
    ctrls[0]._name = attrs.name;
    ctrls[0]._ngModelCtrl = ctrls[1];
    ctrls[0]._value = attrs.value;
  }

  function RadioGroupController($scope) {
  }

}
 

muRadioDirective.$inject = [];

function muRadioDirective() {

  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    require: '^muRadioGroup',
    template: `<div class="radio-container">` +
                `<div class="radio">` +
                  `<input type="radio" class="regular-radio"></input>` +
                  `<label class="mu-radio"></label>` +
                `</div>` +
                `<label ng-transclude class="mu-label"></label>` +
              `</div>`,
    link: link
  };

  function link(scope, element, attrs, rgCtrl) {
    initAttrs(),
    initEvent();

    function initAttrs(){
      let name = rgCtrl.getName();
      let id = `${name}-${attrs.value}`;
      let label = element.find('label');
      let input = element.find('input');

      label.attr('for', id);
      input.attr('id', id);
      input.attr('name', name);
      input.attr('value', attrs.value);
      setSize(element, attrs.size);

      scope.$watch(rgCtrl._ngModelCtrl, () => {
        let viewValue = rgCtrl.getValue();
        if (!viewValue && attrs.checked != null && attrs.checked != undefined) {
          input.attr('checked', true);
        }
        if (viewValue == attrs.value) {
          input.attr('checked', true);
        }
      });

    }

    function setSize(element, size) {
      let label = angular.element(element.children()[0]);
      label.find('label').addClass(size);
      element.addClass(size);
    }

    function initEvent() {
      element.on('click', (e) => {
        rgCtrl.setValue(attrs.value, e && e.type);
      });
    }
  }

}
