module.exports = function(app) {
  app.controller('AddVehicleButtonController', ['$uibModal', '$log', '$document', '$http',
    function($uibModal, $log, $document, $http) {

      this.open = function(parentSelector) {
        var parentElem = parentSelector ?
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;

        var modalInstance = $uibModal.open({
          templateUrl: 'templates/add_vehicle/add_vehicle_modal.html',
          controller: 'windowController',
          controllerAs: '$ctrl',
          appendTo: parentElem
        });

        modalInstance.result.then(() => {
          console.log('dismissed');
        }, () => {
          $log.info('Modal dismissed at: ' + new Date());
        });

        this.exit = function() {
          modalInstance.result.then(() => {
            console.log('dismissed');
          });
        };
      };
    }]);
};
