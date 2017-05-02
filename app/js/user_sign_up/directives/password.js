module.exports = function(app) {
  app.directive('password', [function() {
    return {
      restrict: 'EA',
      require: '^ngController',
      controller: 'userSignUpController',
      controllerAs: 'userctrl',
      transclude: true,
      templateUrl: '/templates/user/directives/password.html',
      scope: {

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
        scope.dummy = controller.dummy;

      }
    };
  }]);
};
