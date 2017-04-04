module.exports = function(app) {
  app.directive('describeItem', () => {
    return {
      restrict: 'E',
      replace: true,
      controller: 'describeController',
      controllerAs: 'describe',
      transclude: true,
      templateUrl: '/templates/describe/directives/describe_list_item.html',
    //   template: '<p> yes</p>',
      scope: {
        description: '='
      },
      link: function(scope, element, attrs, controller) {
        // scope.remove = controller.removeMug;
      }
    };
  });
};
