/* eslint-disable prefer-arrow-callback */
module.exports = function(app) {
  app.factory('cmService', ['$http', function($http) {
    this.url = 'https://wrenchroverapi.herokuapp.com/service_requests';
    this.chosenService = null;
    this.chosenDashlight = null;
    var oilChosen = [];
    this.oilChosen = oilChosen;
    var dashChosen = [];
    this.dashChosen = dashChosen;
    var that = this;
    this.count = 0;
    this.nextCount = 0;
    this.dashCount = 0;
    this.textInput = null;


    console.log(this.count);

    return {
    //   chosen: chosen,
      chosen: [],
      checkedSelected: function(value) {
        console.log(this.chosen);
        // console.log(value);
        this.chosen.push(value);
        // console.log(chosen);
        window.localStorage.chosen = JSON.stringify(this.chosen);

      },


      remove: function(value) {
        console.log(value);
        var index = this.chosen.indexOf(value);
        this.chosen.splice(index, 1);
        console.log(this.chosen);
        window.localStorage.chosen = JSON.stringify(this.chosen);
      },


      textAreaFunc: function(value) {
        this.textInput = value;
        if (value === undefined) {
          window.localStorage.removeItem('describeIssue');

        } else {
          window.localStorage.describeIssue = this.textInput;
        }
      },

      dashSelect: function(y) {
        console.log(y);
        this.chosenDashlight = y;
        this.dashChosen = that.dashChosen;
        if (dashChosen.indexOf(y) == -1) {
          dashChosen.push(y);
          that.dashCount = 9;
        } else {

          var index = dashChosen.indexOf(y);
          dashChosen.splice(index, 1);
          if (dashChosen.length === 0) {
            that.dashCount = 0;
          }


        }

        this.dashCount = that.dashCount;
        window.localStorage.dashChosen = this.dashChosen;
        console.log(this.chosenDashlight);
      },


      nextPage: function() {
        console.log('next page');
      },
      autoX: function() {
        this.storedVehicle = JSON.parse(localStorage.getItem('vehicle'));

        if (this.storedVehicle) {
          this.auto = {
            year: this.storedVehicle.year,
            make: this.storedVehicle.make.name,
            model: this.storedVehicle.model.name,
            trim: this.storedVehicle.trim.name,
            engine: this.storedVehicle.engine,
            mileage: this.storedVehicle.mileage
          };
        }


        $http.post('https://wrenchroverapi.herokuapp.com/autos', this.auto)
        .then((res) => {
          console.log(res);
        });
      }

    };
  }]);

};
