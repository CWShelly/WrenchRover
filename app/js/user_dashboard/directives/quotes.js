module.exports = function(app) {
  app.directive('quotes', () => {
    return {
      restrict: 'E',
      controller: 'UserDashboardController',
      controllerAs: 'UserDashCtrl',
      transclude: true,
      templateUrl: 'templates/user/directives/quotes.html',

      link: function(scope, element, attrs, controller) {


      }
    };
  });
};
