angular.module 'ngValidateOn', []

.config ($provide) ->
  DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/

  trim = (value) ->
    if angular.isString(value) then value.trim() else value

  $provide.decorator 'ngModelDirective', ($delegate) ->
    directive = $delegate[0]

    compile = directive.compile
    controller = directive.controller.pop()

    ctrl = ($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $rootScope, $q, $interpolate) ->
      controller.apply this, arguments

      vm = this

      vm.$setViewValue = (value, trigger) ->
        vm.$viewValue = value

        if !vm.$options or vm.$options.validateOnDefault
          vm.$$runValidators undefined, vm.$modelValue, vm.$viewValue, angular.noop

        if !vm.$options or vm.$options.updateOnDefault
          vm.$$debounceViewValueCommit trigger

        return
      return

    directive.controller.push ctrl

    directive.compile = (tElement, tAttrs) ->
      link = compile.apply this, arguments

      post = (scope, element, attrs, ctrls) ->
        link.post.apply this, arguments

        vm = ctrls[0]

        if vm.$options and vm.$options.validateOn
          element.on vm.$options.validateOn, (ev) ->
            vm.$$runValidators undefined, vm.$modelValue, vm.$viewValue, angular.noop
            return

          return
        return

      pre = (scope, element, attrs, ctrls) ->
        link.pre.apply this, arguments

        return

      { pre: pre, post: post }

    $delegate

  $provide.decorator 'ngModelOptionsDirective', ($delegate) ->
    directive = $delegate[0]

    controller = directive.controller.pop()

    ctrl = ($scope, $attrs) ->
      controller.apply this, arguments

      vm = this

      vm.$options = angular.copy $scope.$eval($attrs.ngModelOptions)

      if angular.isDefined vm.$options.validateOn
        vm.$options.validateOnDefault = false

        vm.$options.validateOn = trim vm.$options.validateOn.replace DEFAULT_REGEXP, ->
          vm.$options.validateOnDefault = true
          ' '
      else
        vm.$options.validateOnDefault = true

      return

    directive.controller.push ctrl

    $delegate
