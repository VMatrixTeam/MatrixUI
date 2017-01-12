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

function muRadioGroupDirective  () {

  RadioGroupController.prototype = {
    init: function(ngModelCtrl) {
      this._ngModelCtrl = ngModelCtrl;
      this._ngModelCtrl.$render = angular.bind(this, this.render);
    },
    push: function(renderFn) {
      this._radioButtonRenderFns.push(renderFn);
    },
    render: function() {
      for (let render of this._radioButtonRenderFns) {
        render();
      }
    },
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
      this.render();
    }
  };

  return {
    restrict: 'E',
    controller: ['$scope', RadioGroupController],
    // scope: true,
    // scope: {
    //   ngModel: '='
    // },
    require: ['muRadioGroup', '?ngModel'],
    link: { pre: linkRadioGroup }
  }

  function linkRadioGroup(scope, element, attrs, ctrls) {
    ctrls[0]._name = attrs.name;
    ctrls[0]._ngModelCtrl = ctrls[1];
    ctrls[0]._value = attrs.value;

    if (ctrls[1]) {
      scope.$watch(function() {
        ctrls[0].render();
        return ctrls[1];
      });
    }
  }

  function RadioGroupController($scope) {
    this._radioButtonRenderFns = [];
    // console.log('controller');
    // console.log(this);
  }

}


muRadioDirective.$inject = [];

function muRadioDirective() {

  return {
    restrict: 'EA',
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
    // render();
    // setTimeout(render, 200);

    function initAttrs() {
      rgCtrl.push(render);

      attrs.$observe('value', render);
      setSize(element, attrs.size);

    }

    function onModelUpdate() {
      let viewValue = rgCtrl.getValue();
      let input = element.find('input');
      if (!viewValue && attrs.checked != null && attrs.checked != undefined) {
        input.attr('checked', true);
      }
      if (viewValue == attrs.value) {
        input.attr('checked', true);
      }
    }

    function setSize(element, size) {
      let label = angular.element(element.children()[0]);
      label.find('label').addClass(size);
      element.addClass(size);
    }

    function initEvent() {
      // let label = angular.element(element.children());
      element.on('click', (e) => {
        scope.$apply(() => {
          rgCtrl.setValue(attrs.value, e && e.type);
        });
      });
    }

    function render() {
      let name = rgCtrl.getName();
      let viewValue = rgCtrl.getValue();
      let id = `${name}-${attrs.value}`;
      let label = element.find('label');
      let input = element.find('input');

      // console.log('render');
      // console.log('current value is: ' + rgCtrl.getValue());
      // console.log('attr value is ' + attrs.value);

      input.attr('name', name);
      input.attr('id', id);
      label.attr('for', id);
      input.attr('value', attrs.value);

      if (!viewValue && attrs.checked != null && attrs.checked != undefined) {
        input.attr('checked', true);
      }
      if (viewValue == attrs.value) {
        input.attr('checked', true);
      }
    };
  }

}
