module.exports = function(app) {
  app.directive('userSignInForm', [function() {
    return {
      restrict: 'EA',
      require: '^ngController',
      controller: 'userSignUpController',
      controllerAs: 'userctrl',
      transclude: true,
      templateUrl: '/templates/user/directives/user_sign_in_form.html',
      scope: {
        login: '=',
        buttonText: '@',
        buttonLabel: '@',
        action: '@',
        theUser: '='
      },
      link: function(scope, element, attrs, controller) {
        // var actions = {
        //   create: controller.logIn,
        //   hasVehicle: controller.gotVehicle,
        //   testFunc: controller.testFunc
        // };
        //
        // scope.save = actions[scope.action];
        scope.logIn = controller.logIn;

        scope.replace = controller.replace;
        scope.noReplace = controller.noReplace;

      }
    };
  }]);
};
