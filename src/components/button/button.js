angular
  .module('matrixui.components.button', [])
  .directive('muButton', MuButtonDirective);

function MuButtonDirective($timeout) {

  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: getTemplate,
    link: postLink
  };

  function isAnchor(attr) {
    return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.ngLink) || angular.isDefined(attr.uiSref);
  }

  function getTemplate(element, attr) {
    if (isAnchor(attr)) {
      return '<a class="mu-button" ng-transclude></a>';
    } else {
      //If buttons don't have type="button", they will submit forms automatically.
      var btnType = (typeof attr.type === 'undefined') ? 'button' : attr.type;
      return '<button class="mu-button" type="' + btnType + '" ng-transclude></button>';
    }
  }

  function postLink(scope, element, attr) {
    // For anchor elements, we have to set tabindex manually when the
    // element is disabled
    if (isAnchor(attr) && angular.isDefined(attr.ngDisabled) ) {
      scope.$watch(attr.ngDisabled, function(isDisabled) {
        element.attr('tabindex', isDisabled ? -1 : 0);
      });
    }

    // disabling click event when disabled is true
    element.on('click', function(e){
      if (attr.disabled === true) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });

    if (!element.hasClass('md-no-focus')) {
      // restrict focus styles to the keyboard
      scope.mouseActive = false;
      element.on('mousedown', function() {
        scope.mouseActive = true;
        $timeout(function(){
          scope.mouseActive = false;
        }, 100);
      })
      .on('focus', function() {
        if (scope.mouseActive === false) {
          element.addClass('md-focused');
        }
      })
      .on('blur', function(ev) {
        element.removeClass('md-focused');
      });
    }
  }

}
