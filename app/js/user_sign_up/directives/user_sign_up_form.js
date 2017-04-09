module.exports = function(app) {
  app.directive('userSignUpFormPageOne', [function() {
    return {
      restrict: 'EA',
      require: '^ngController',
      controller: 'userSignUpController',
      controllerAs: 'userctrl',
      transclude: true,
      templateUrl: '/templates/user/directives/user_sign_up_form_page_one.html',
      scope: {
        xuser: '=',
        buttonText: '@',
        buttonLabel: '@',
        action: '@'
      },
      link: function(scope, element, attrs, controller) {
        var actions = {
        //   create: controller.createUser
          create: controller.altCreateUser


        //   auto: controller.autoX
        };
        // scope.save = controller.createUser;
        scope.save = controller.altCreateUser;

        // scope.save = actions[scope.action];


      }
    };
  }]);
};
