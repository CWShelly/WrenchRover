module.exports = function(app) {
  app.directive('secondSibling', () => {
    return {
      restrict: 'E',
      replace: true,
      controller: 'describeController',
      controllerAs: 'describe',
      transclude: true,
      templateUrl: '/templates/describe/directives/second_sibling.html',

      scope: {
        secondsibling: '='
      },
      link: function(scope, element, attrs, controller) {
        scope.checkedSelected = controller.checkedSelected;
        // scope.secondsibling.toggled = false;
        // console.log(scope.secondsibling.toggled);
        // console.log(scope.secondsibling);
        //
        // localStorage.proud = JSON.stringify(scope.secondsibling);
        // if (localStorage.getItem('newsib')) {
        //   console.log(JSON.parse(localStorage.getItem('newsib')));
        //   var newSib = JSON.parse(localStorage.getItem('newsib'));
        //   console.log(newSib);
        //   scope.secondSibling = newSib;
        // }
        //

      }
    };
  });
};
