module.exports = function(app) {
  app.directive('avails', () => {
    return {
      restrict: 'E',
      controller: 'UserDashboardController',
      controllerAs: 'UserDashCtrl',
      transclude: true,
      templateUrl: 'templates/user/directives/avails.html',

      link: function(scope, element, attrs, controller) {


      }
    };
  });
};
