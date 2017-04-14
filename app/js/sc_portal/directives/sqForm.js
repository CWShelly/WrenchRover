module.exports = function(app) {
  app.directive('sqForm', () => {
    return {
      restrict: 'EAC',
      require: '^ngController',
      controller: 'scPortalController',
      controllerAs: 'portal',
      transclude: true,
      templateUrl: '/templates/sc_portal/directives/sq_form.html',

      scope: {

        buttonText: '@',
        action: '@',
        scquote: '='
      },
      link: function(scope, element, attrs, controller) {
        var actions = {
        //   update: controller.updateMug,
        //   create: controller.createQuote
        //   create: controller.createQuote,
        //   add: controller.addDates,
        //   both: controller.addDates && controller.createQuote
          create: controller.testFunc


        };
        scope.save = actions[scope.action];
        // scope.create = controller.testFunc;

      }
    };
  });
};
