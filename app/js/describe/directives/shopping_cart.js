module.exports = function(app) {
  app.directive('shoppingCart', () => {
    return {
      restrict: 'EAC',
      controller: 'describeController',
      controllerAs: 'describe',
      transclude: true,
      templateUrl: '/templates/describe/directives/shopping_cart.html',

      scope: {
        // description: '=',
        // buttonText: '@',
        // push: '@',
        // action: '@'
      },
      link: function(scope, element, attrs, controller) {


      }
    };
  });
};
