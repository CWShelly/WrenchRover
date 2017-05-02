module.exports = function(app) {
  app.directive('dashSlug', () => {
    return {
      restrict: 'E',
      controller: 'UserDashboardController',
      controllerAs: 'UserDashCtrl.',
      transclude: true,
      templateUrl: 'templates/user/directives/dash_slug.html',

      link: function(scope, element, attrs, controller) {


      }
    };
  });
};
