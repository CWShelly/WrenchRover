module.exports = function(app) {
  app.directive('describeIssue', function() {
    return {
      restrict: 'EAC',
    //   require: 'describeController',
      require: '^ngController',
      transclude: true,
      templateUrl: '/templates/describe/directives/describe_issue.html',

      scope: {
        description: '=',
        buttonText: '@',
        action: '@'
      },
      link: function(scope, element, attrs, controller) {
        var actions = {
          create: controller.describeIt
        };
        scope.save = actions[scope.action];
        scope.describeIt = controller.describeIt;
      }
    };
  });
};
