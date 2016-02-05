angular.module('ngValidateOn', []).config(["$provide", function($provide) {
  var DEFAULT_REGEXP;
  DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/;
  $provide.decorator('ngModelDirective', ["$delegate", function($delegate) {
    var compile, controller, ctrl, directive;
    directive = $delegate[0];
    compile = directive.compile;
    controller = directive.controller.pop();
    ctrl = function($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $rootScope, $q, $interpolate) {
      var vm;
      controller.apply(this, arguments);
      vm = this;
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
      var link, post, pre;
      link = compile.apply(this, arguments);
      post = function(scope, element, attrs, ctrls) {
        var vm;
        link.post.apply(this, arguments);
        vm = ctrls[0];
        if (vm.$options && vm.$options.validateOn) {
          element.on(vm.$options.validateOn, function(ev) {
            vm.$$runValidators(void 0, vm.$modelValue, vm.$viewValue, angular.noop);
          });
        }
      };
      pre = function(scope, element, attrs, ctrls) {
        link.pre.apply(this, arguments);
      };
      return {
        pre: pre,
        post: post,
        post: post
      };
    };
    return $delegate;
  }]);
  return $provide.decorator('ngModelOptionsDirective', ["$delegate", function($delegate) {
    var controller, ctrl, directive, trim;
    directive = $delegate[0];
    controller = directive.controller.pop();
    trim = function(value) {
      if (angular.isString(value)) {
        return value.trim();
      } else {
        return value;
      }
    };
    ctrl = function($scope, $attrs) {
      controller.apply(this, arguments);
      this.$options = angular.copy($scope.$eval($attrs.ngModelOptions));
      if (angular.isDefined(this.$options.validateOn)) {
        this.$options.validateOnDefault = false;
        this.$options.validateOn = trim(this.$options.validateOn.replace(DEFAULT_REGEXP, (function(_this) {
          return function() {
            _this.$options.validateOnDefault = true;
            return ' ';
          };
        })(this)));
      } else {
        this.$options.validateOnDefault = true;
      }
    };
    directive.controller.push(ctrl);
    return $delegate;
  }]);
}]);
