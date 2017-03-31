module.exports = exports = function(app) {
  app.factory('edmundsVehicleListResource', ['$http', 'wrHandleError', '$state', function($http, errorHandler, $state) {
    var Resource = function(vehicleObject, vehicleListOptions, errors) {
      this.vehicle = vehicleObject;
      this.vehicleListOptions = vehicleListOptions;
      this.errorsArray = errors;
      this.savedTrims = [];
      this.url = '/api/vehicleInfo/';
    };

    Resource.prototype.getVehicleMakes = function() {
      return $http.get(this.url + this.vehicle.year)
      .then( (res) => {
        this.vehicleListOptions.makeList = res.data;
      });
    };

    Resource.prototype.getVehicleModels = function() {
      return $http.get(this.url + this.vehicle.make.niceName +
                      '/' + this.vehicle.year)
      .then( (res) => {
        this.vehicleListOptions.modelList = res.data;
      });
    };

    Resource.prototype.getVehicleTrims = function() {

      return $http.get(this.url + this.vehicle.make.niceName + '/' +
                      this.vehicle.model.niceName + '/' + this.vehicle.year)
      .then( (res) => {
        this.savedTrims = res.data.slice(0);
        for (var j = 1; j < res.data.length; j++) {
          if (res.data[j].name === res.data[j - 1].name) {
            res.data.splice(j, 1);
          }
        }
        this.vehicleListOptions.trimList = res.data;
      });
    };

    Resource.prototype.getVehicleEngines = function() {

      var optionsArray = this.savedTrims;
      this.vehicleListOptions.engineList = [];
      for (var i = 0; i < optionsArray.length; i++) {
        if (optionsArray[i].name === this.vehicle.trim.name && optionsArray[i].engine) {
          this.vehicleListOptions.engineList.push(optionsArray[i].engine);
        }
      }
      if (this.vehicleListOptions.engineList.length === 0) {
        console.log(this.vehicleListOptions.engineList);
        this.vehicleListOptions.engineList.push('Default');
      }
      if (this.vehicleListOptions.engineList.length > 1) {
        this.vehicleListOptions.engineList.sort();
        this.vehicleListOptions.engineList.push('Not Sure');
      }
      console.log(this.vehicle);
    };

    Resource.prototype.getVin = function() {


      console.log(this.vehicle.vin);

      if (this.vehicle.vin != '') {
        $http.get(this.url + 'vin/vin/vin/' + this.vehicle.vin)
      .then( (res) => {
        console.log(res);
        this.vehicle.make = { name: '' };
        this.vehicle.model = { name: '' };
        this.vehicle.trim = { name: '' };
        this.vehicle.year = res.data.year;
        this.vehicle.make.name = res.data.make;
        this.vehicle.model.name = res.data.model;
        this.vehicle.trim.name = res.data.trim;
        this.vehicle.mileage = this.vehicle.mileage;
        if (res.data.engine) this.vehicle.engine = res.data.engine;
        console.log(this.vehicle);
      })
      .catch((error) => {
        console.log(error);
        console.log('there has been errors');
      })
      .then(() => {

        window.localStorage.vehicle = JSON.stringify(this.vehicle);
        console.log(localStorage.getItem('vehicle'));
        if (localStorage.getItem('token')) {
          console.log('there is a token');
          this.auto = {
            year: this.vehicle.year,
            make: this.vehicle.make.name,
            model: this.vehicle.model.name,
            trim: this.vehicle.trim.name,
            engine: this.vehicle.engine,
            mileage: this.vehicle.mileage,
            user_id: localStorage.getItem('user_id'),
            service_request_id: null
          };
          $http.post(baseUrl + 'autos', this.auto)
            .then( (config) => {
              console.log(config);
            });
          $state.go('user_dashboard');
        //   (change this depending on what paul and dru decide for flow)
        } else {

          console.log('there is not a token');
          $state.go('common_repairs_view.get_started');
        }
      });
      } else {
        console.log('empty');
      }


    };

    return Resource;
  }]);
};
