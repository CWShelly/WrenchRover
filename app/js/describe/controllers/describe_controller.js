/* eslint-disable prefer-arrow-callback */
var baseUrl = require('../../config').baseUrl;

module.exports = function(app) {
  app.controller('describeController', ['cmService', '$http', '$anchorScroll', '$location', '$state', '$uibModal', 'modalService', function( cmService, $http, $anchorScroll, $location, $state, $uibModal, modalService) {

    // if (!localStorage.getItem('token')) {
    //   $state.go('vehicle_dropdown_selection');
    // }


    if (!localStorage.getItem('vehicle')) {
      $state.go('vehicle_dropdown_selection');
    }


    this.descriptions = [];
    this.childrens = [];
    this.errors = [];
    this.checked = null;
    this.oils = [];
    this.service = cmService;
    this.selection = null;
    this.chosenService = [];
    this.chosenArr = [];
    this.message = cmService.message;
    this.editDescribeIssue = false;
    // this.chosen = cmService.chosen;

    // cmService.chosen = [{ name: 'mcc' }, { name: 'sc' }];


    this.toggleBtn = function(tube) {
      console.log(tube);
      console.log('toggling');
      tube.toggled = !tube.toggled;

    };
    // ////modal
    this.open = function(parentSelector) {
      cmService.editVehicle = true;
      this.modalObj = {
        templateUrl: 'templates/modal/directives/add_vehicle.html'
      };

      var modalInstance = $uibModal.open(
        {
          templateUrl: 'templates/modal/directives/add_vehicle.html',
          controller: 'VehicleInfoController',
          controllerAs: 'VehicleInfoController'
        }

      );
      this.pass = function(modalInstance) {
        modalService.pass(modalInstance);
      };
      this.pass(modalInstance);

    };

    // ////modal

    if (localStorage.getItem('token') != undefined || null) {
      this.token = localStorage.getItem('token');

    }


    this.previouslyEntered = localStorage.getItem('describeIssue');

    if (localStorage.getItem('describeIssue')) {
      cmService.message = localStorage.getItem('describeIssue');
    }


    this.localStorageChosen = localStorage.getItem('chosen');

    this.storedVehicle = JSON.parse(localStorage.getItem('vehicle'));
    cmService.storedVehicle = this.storedVehicle;


    var that = this;
    // that.value = this.value;
    this.placeholder = "Tell us what's happening with your car.";
    this.button = 'Enter';
    this.button = that.button;
    this.dashArr2 = [];
    // this.dashChild = [];
    this.mainLights = [];

    this.commonLight = {
      common: '../../../images/common_icons/common.png',
      dash: '../../../images/common_icons/dash.png',
      describe: '../../../images/common_icons/describe.png' };
    this.mainLights.push(this.commonLight);


    this.goTo = function() {
      cmService.editDescribeIssue = true;
      console.log(cmService.editDescribeIssue);

      if ($location.path() == '/common_repairs/describe_issue') {
        console.log('you are on describe');
        $location.hash('bottom');
        $anchorScroll();
      } else {
        $state.go('common_repairs_view.describe_issue');
        $location.hash('bottom');
        $anchorScroll();
      }
    };

    this.doneEditing = function(value) {
      console.log(value);

      this.value = localStorage.getItem('describeIssue');

      console.log('going back to the cart');
      $location.hash('shoppingCart');
      $anchorScroll();
    };


    this.keepAdding = function() {
      $state.go('common_repairs_view.get_started');
      $location.hash('keepAdding');
      $anchorScroll();
    };


    this.checkedSelected = function(value) {

      console.log(value);

      cmService.checkedSelected(value);
    //   that.chosenService = cmService.chosen;
    //   console.log(that.chosenService);
    //   window.localStorage.chosen = JSON.stringify(cmService.chosen);
    //   this.getReqLS();
    };

    this.remove = function(value) {
      cmService.remove(value);
    //   window.localStorage.chosen = JSON.stringify(cmService.chosen);
    };


// ///button version for choosing the service from cm end///


    this.textAreaFunc = function(x) {
      console.log(x);
      this.placeholder = 'Thank you';


      that.message = x;
      cmService.textAreaFunc(x);
      that.doneEditing();
      this.value = localStorage.getItem('describeIssue');

    };

    this.autoX = function() {
      cmService.autoX();
    };

  }]);
};
