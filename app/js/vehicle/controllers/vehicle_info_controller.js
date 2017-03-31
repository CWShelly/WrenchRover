
var baseUrl = require('../../config').baseUrl;
module.exports = exports = function(app) {
  app.controller('VehicleInfoController', ['edmundsVehicleListResource', 'vicClearSelections', '$state', '$http', 'modalService', '$window', '$uibModal', 'cmService',
    function(Resource, ClearSelections, $state, $http, modalService, $window, $uibModal, cmService) {
      this.cookies = navigator.cookieEnabled;
    // console.log('the thing is:');

      this.url = '/api/vehicleInfo/';

      console.log(modalService.thing);
      var that = this;

      this.service = modalService;
      this.vehicleObject = {
        year: '',
        make: '',
        model: '',
        trim: '',
        engine: '',
        miles: '',
        vin: '',
        vinMiles: ''
      };
      console.log(localStorage.getItem('vehicle'));

      if (localStorage.getItem('vehicle')) {
        this.storedVehicle = JSON.parse(localStorage.getItem('vehicle'));
      }
      if (!localStorage.getItem('vehicle')) {
        this.year = 'Year';
        this.make = 'Make';
        this.model = 'Model';
        this.trim = 'Trim';
        this.engine = 'Engine';
        this.mileage = 'Mileage';
      } else {
        this.year = this.storedVehicle.year;
        this.make = this.storedVehicle.make.name;
        this.model = this.storedVehicle.model.name;
        this.trim = this.storedVehicle.trim.name;
        this.engine = this.storedVehicle.engine;
        this.mileage = this.storedVehicle.miles;
      }
      this.commService = cmService;

      modalService.vehicleObject = this.vehicleObject;
      this.vehicleListOptions = {
        yearsList: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000,
          2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011,
          2012, 2013, 2014, 2015, 2016, 2017],
        makeList: [],

        modelList: [],
        trimList: [],
        engineList: []
      };
      this.errors = [];


      // /////open begins//////
      this.open = function(parentSelector) {
        this.modalObj = {
          templateUrl: 'templates/vehicle/directives/vin_error.html'
        };

        var modalInstance = $uibModal.open(
          {
            templateUrl: 'templates/vehicle/directives/vin_error.html',
            controller: 'VehicleInfoController',
            controllerAs: 'VehicleInfoController'
          }

        );
        this.pass = function(modalInstance) {
          modalService.pass(modalInstance);
        };


        this.pass(modalInstance);

      };
    //   open ends//////


      this.closeModal = function() {
        console.log('closing from the vehicle controller');
        modalService.instance.close();
      };

      var resource = new Resource(this.vehicleObject, this.vehicleListOptions, this.errors);
      var clearSelections = new ClearSelections(this.vehicleObject, this.vehicleListOptions, this.errors);

      this.getVehicleMakes = resource.getVehicleMakes.bind(resource);
      this.getVehicleModels = resource.getVehicleModels.bind(resource);
      this.getVehicleTrims = resource.getVehicleTrims.bind(resource);
      this.getVehicleEngines = resource.getVehicleEngines.bind(resource);
    //   this.getVin = resource.getVin.bind(resource);

      this.vehicle = {};
      this.getVin = function(vin) {
        console.log(vin);

        console.log(this.vehicle.vin);

        if (this.vehicle.vin != '') {
          $http.get(this.url + 'vin/vin/vin/' + vin)
          .then( (res) => {
            console.log(res);
            this.vehicleObject2 = {};
            this.vehicleObject2.year = res.data.year;
            this.vehicleObject2.make = {};
            this.vehicleObject2.make.name = res.data.make;
            this.vehicleObject2.model = {};
            this.vehicleObject2.model.name = res.data.model;
            this.vehicleObject2.trim = {};
            this.vehicleObject2.trim.name = res.data.trim;
            this.vehicleObject2.engine = res.data.engine;


            this.auto = {
              year: res.data.year,
              make: res.data.make,
              model: res.data.model,
              trim: res.data.trim,
              engine: res.data.engine
            };
            console.log(this.vehicleObject2);
            console.log(this.auto);

            window.localStorage.vehicle = JSON.stringify(this.vehicleObject2);
            $state.go('common_repairs_view.get_started');
          })
          .catch((error) => {
            console.log(error);
            console.log('there has been errors');
            this.open();
          });

        }

      };

      this.newYearSelected = clearSelections.newYearSelected.bind(clearSelections);
      this.newMakeSelected = clearSelections.newMakeSelected.bind(clearSelections);
      this.newModelSelected = clearSelections.newModelSelected.bind(clearSelections);
      this.newTrimSelected = clearSelections.newTrimSelected.bind(clearSelections);

      this.update = function() {
        console.log(this.vehicleObject);
        console.log('updating vehichle');
        if (this.vehicleObject.miles === null) {
          this.vehicleObject.miles = this.vehicleObject.vinMiles;
        }
        if (this.vehicleObject.engine === 'default' || this.vehicleObject.engine === 'Not Sure') {
          this.vehicleObject.engine = '';
        }
        window.localStorage.vehicle = JSON.stringify(this.vehicleObject);
        cmService.storedVehicle = JSON.parse(localStorage.getItem('vehicle'));

        that.closeModal();
        // .then(() => {
        //
        //   $window.location.reload();
        // });
      };

      that.closeModal = function() {
        console.log('closing from the vehicle controller');
        modalService.instance.close();
        // $window.location.reload();
      };

      this.saveToLocalStorage = function() {
        console.log('save to local');
        console.log(this.vehicleObject);
        if (this.vehicleObject.miles === null) {
          this.vehicleObject.miles = this.vehicleObject.vinMiles;
        }
        if (this.vehicleObject.engine === 'N/A' || this.vehicleObject.engine === 'Not Sure') {
          this.vehicleObject.engine = '';
        }

        window.localStorage.vehicle = JSON.stringify(this.vehicleObject);
        console.log(this.vehicleObject);
        console.log(localStorage.getItem('vehicle'));

        if (localStorage.getItem('token')) {
          console.log('there is a token');
          this.auto = {
            year: this.vehicleObject.year,
            make: this.vehicleObject.make.name,
            model: this.vehicleObject.model.name,
            trim: this.vehicleObject.trim.name,
            engine: this.vehicleObject.engine,
            mileage: this.vehicleObject.miles,
            user_id: localStorage.getItem('user_id'),
            service_request_id: null
          };
          $http.post(baseUrl + 'autos', this.auto)
        .then( (config) => {
          console.log(config);
          if (modalService.thing == 2) {
            $window.location.reload();
          } else {
            // $state.go('user_dashboard');
            $state.go('common_repairs_view.get_started');
          }

        })
        .then(() => {
          if (modalService.thing === 2) {
            console.log('closing modal');
            that.closeModal();

          } else {
            console.log('from the original flow');
          }
        });

        // $state.go('user_dashboard');


        } else {
          console.log('there is not a token');
          $state.go('common_repairs_view.get_started');
        }
      };


      this.logVehicle = function() {

        console.log(this.vehicleObject);
      };

      this.showMe = function(id) {
        document.getElementById(id).disabled = false;
      };

      this.disableMe = function(id) {
        console.log(this.vehicleObject.mileage);
        document.getElementById(id).disabled = true;
        console.log(id);
      };

    }]);};
