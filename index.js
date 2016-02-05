angular.module('ngValidateOn', [])

.config(function($provide) {
  var DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/;
  
  var trim = function(value) {
    if (angular.isString(value)) {
      return value.trim();
    } else {
      return value;
    }
  };
  
  $provide.decorator('ngModelDirective', function($delegate) {
    var compile, controller, ctrl, directive;
    directive = $delegate[0];
    compile = directive.compile;
    controller = directive.controller.pop();
    
    ctrl = function($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $rootScope, $q, $interpolate) {
      controller.apply(this, arguments);
      var vm = this;
      vm.$setViewValue = function(value, trigger) {
        vm.$viewValue = value;
        if (!vm.$options || vm.$options.validateOnDefault) {
          vm.$$runValidators(void 0, vm.$modelValue, vm.$viewValue, angular.noop);
        }
        if (!vm.$options || vm.$options.updateOnDefault) {
          vm.$$debounceViewValueCommit(trigger);
        }
      };
    };
    
    directive.controller.push(ctrl);
    
    directive.compile = function(tElement, tAttrs) {
      var link = compile.apply(this, arguments);
    
      var post = function(scope, element, attrs, ctrls) {
        link.post.apply(this, arguments);
        var vm = ctrls[0];
        if (vm.$options && vm.$options.validateOn) {
          element.on(vm.$options.validateOn, function(ev) {
            vm.$$runValidators(void 0, vm.$modelValue, vm.$viewValue, angular.noop);
          });
          return;
        }
      };
      
      var pre = function(scope, element, attrs, ctrls) {
        link.pre.apply(this, arguments);
      };
      
      return {
        pre: pre,
        post: post
      };
    };
    return $delegate;
  });
  
  return $provide.decorator('ngModelOptionsDirective', function($delegate) {
    var directive = $delegate[0];
    var controller = directive.controller.pop();
    
    var ctrl = function($scope, $attrs) {
      controller.apply(this, arguments);
      var vm = this;
      vm.$options = angular.copy($scope.$eval($attrs.ngModelOptions));
    
      if (angular.isDefined(vm.$options.validateOn)) {
        vm.$options.validateOnDefault = false;
        vm.$options.validateOn = trim(vm.$options.validateOn.replace(DEFAULT_REGEXP, function() {
          vm.$options.validateOnDefault = true;
          return ' ';
        }));
      } else {
        vm.$options.validateOnDefault = true;
      }
    };
    
    directive.controller.push(ctrl);
    
    return $delegate;
  });
});
