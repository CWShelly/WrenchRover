module.exports = function(app) {
  app.factory('cmService', ['$http', function($http) {
    this.url = 'https://wrenchroverapi.herokuapp.com/service_requests';
    this.chosenService = null;
    this.chosenDashlight = null;
    var chosen = [];
    this.chosen = chosen;
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
      chosen: chosen,

      oilSelected: function(value, second) {
        this.chosenService = second;
        if (value && that.count === 0) {
          that.count = 5;
          oilChosen.push(second);
        } else {
          that.count = 0;
          var index = oilChosen.indexOf(second);
          oilChosen.splice(index);
        }
        this.count = that.count;
        this.oilChosen = that.oilChosen;
        window.localStorage.oilChosen = this.oilChosen;


      },


      checkedSelected: function(value, second) {
        this.chosenService = second;
        if (value) {
          that.nextCount = 7;
          chosen.push(second);
        } else {
          var index = chosen.indexOf(second);
          chosen.splice(index, 1);
          if (chosen.length === 0) {
            that.nextCount = 0;
          }
        }
        this.chosen = that.chosen;
        console.log(that.nextCount);
        window.localStorage.chosen = this.chosen;
        window.localStorage.stringChosen = JSON.stringify(this.chosen);
        this.nextCount = that.nextCount;
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


      removeChosenService: function(x) {
        console.log(x);
        var index = chosen.indexOf(x);
        chosen.splice(index, 1);
        console.log(chosen);
        if (chosen.length === 0) {
          that.nextCount = 0;
        }
        this.chosen = that.chosen;
        this.nextCount = that.nextCount;
        window.localStorage.chosen = this.chosen;
        this.nextCount = that.nextCount;
      },

      removeChosenDash: function(x) {
        console.log(x);
        var index = dashChosen.indexOf(x);
        dashChosen.splice(index, 1);
        if (dashChosen.length === 0) {
          that.dashCount = 0;
        }
        this.dashChosen = that.dashChosen;
        this.dashCount = that.dashCount;
        window.localStorage.dashChosen = this.dashChosen;
        window.localStorage.stringDash = JSON.stringify(this.dashChosen);
        this.dashCount = that.dashCount;

      },

      removeChosenOil: function(x) {

        var index = oilChosen.indexOf(x);

        oilChosen.splice(index, 1);
        if (oilChosen.length === 0) {
          that.count = 0;
        }
        this.oilChosen = that.oilChosen;
        this.count = that.count;
        window.localStorage.oilChosen = this.oilChosen;
        this.oilCount = that.oilCount;

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
