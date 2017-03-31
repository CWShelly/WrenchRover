module.exports = exports = function(app) {
  app.directive('myVehicleSelect', () => {
    return {
      restrict: 'EAC',
      controller: 'VehicleInfoController',
      controllerAs: 'VehicleInfoController',
      templateUrl: '/templates/vehicle/directives/vehicle_dropdown_selection.html',
      transclude: true,
      scope: {
        buttonText: '@',
        click: '@',
        update: '@'

      },
      link: function(scope, element, attrs, controller) {
    //     var clicks = [
    //       save: controller.saveToLocalStorage,
    //       update: controller.update
    //   ]

        scope.save = controller.saveToLocalStorage;
        scope.update = controller.update;
        // scope.save = clicks[scope.click];
        // scope.save = controller.saveToLocalStorage;
        // scope.update = controller.update;
      }
    };
  });
};
