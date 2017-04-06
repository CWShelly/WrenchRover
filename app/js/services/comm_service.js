/* eslint-disable prefer-arrow-callback */
module.exports = function(app) {
  app.factory('cmService', ['$http', function($http) {
    this.url = 'https://wrenchroverapi.herokuapp.com/service_requests';
    // var baseUrl = require('../../config').baseUrl;

    var baseUrl = 'https://wrenchroverapi.herokuapp.com/';
    var that = this;
    this.chosenService = null;
    this.chosenDashlight = null;
    var oilChosen = [];
    this.oilChosen = oilChosen;
    var dashChosen = [];
    this.dashChosen = dashChosen;

    this.count = 0;
    this.nextCount = 0;
    this.dashCount = 0;
    this.chosen = [];
    // var chosen = this.chosen;

    console.log(this.count);
    this.editDescribeIssue = false;
    this.editVehicle = false;
    this.childrens = [];
    this.descriptions = [];
    this.sbArr = [];
    // this.dashChild = [];
    var sb = [
      { imageSrc: '/../../../images/dashlights/001.png',
        name: 'Oil Light'
      },
      { imageSrc: '../../../images/dashlights/002.png',
        name: 'Battery Light' },
      {
        imageSrc: '../../../images/dashlights/003.png',
        name: 'Encircled Exclamation Point'
      },
      { imageSrc: '../../../images/dashlights/004.png',
        name: 'Airbag Light'
      },
      {
        imageSrc: '../../../images/dashlights/005.png',
        name: 'Temperature Light'
      },
      {
        imageSrc: '../../../images/dashlights/010.png',
        name: 'ABS Light'
      },
      {
        imageSrc: '../../../images/dashlights/011.png',
        name: 'Check Engine Light'
      },
      { imageSrc: '../../../images/dashlights/012.png',
        name4: 'Sprocket Light'
      },
      {
        imageSrc: '../../../images/dashlights/015.png',
        name: 'Coily Light'
      },
      {
        imageSrc: '../../../images/dashlights/016.png',
        name: 'Hazard Light'
      },
      {
        imageSrc: '../../../images/dashlights/017.png',
        name: 'Tire Pressure Light'
      },
      {
        imageSrc: '../../../images/dashlights/018.png',
        name: 'Lightbulb Light'
      }

    ];

    return {
      sbArr: this.sbArr,
      dashChild: this.dashChild,
      descriptions: this.descriptions,
      childrens: this.childrens,
      chosen: this.chosen,
      storedVehicle: JSON.parse(localStorage.getItem('vehicle')),
    //   storedChildrens: JSON.parse(localStorage.getItem('childrens')),


      getCat: function() {

        console.log('getting categories');
        if (!localStorage.getItem('childrens')) {
          console.log(' no childrens');
          $http.get(baseUrl + 'categories')
                  .then((res) => {
                    this.descriptions = res.data;
                    for (var i = 0; i < res.data[0].children.length; i++) {
                      that.childrens.push(res.data[0].children[i]);
                    }

                    // console.log(that.childrens);

                  });
        } else {
          console.log('childrens');
        }

      },

      getDash: function() {
        var dashChild = [];
        for (var i = 0; i < sb.length; i++ ) {
          if (i % 4 == 0) dashChild.push([]);
          dashChild[dashChild.length - 1].push(sb[i]);
        }
        return this.dashChild = dashChild;


      },

      getReqLS: function() {
        console.log('get the reqs ls');
        if (localStorage.getItem('chosen')) {

        //   this.chosen = [{ name: 'gigantic' }, { name: 'a big' }];

          this.chosen = JSON.parse(localStorage.getItem('chosen'));
        //   return this.chosen;
          console.log(this.chosen);

        } else {
          console.log('No requests in LS');
        }
      },

      checkedSelected: function(value) {
        console.log(this.chosen);
        // var stored = this.getReqLS();

        if (this.chosen.indexOf(value) == -1) {
          this.chosen.push(value);
        } else {
          var index = this.chosen.indexOf(value);
          this.chosen.splice(index, 1);
        }
        console.log(this.chosen);
        console.log('pushed to chosen');

        // var storedPlus = this.chosen.concat(stored);

        window.localStorage.chosen = JSON.stringify(this.chosen);


      },

      remove: function(value) {
        // console.log(value);
        var index = this.chosen.indexOf(value);
        this.chosen.splice(index, 1);
        console.log(this.chosen);
        window.localStorage.chosen = JSON.stringify(this.chosen);
      },


      textAreaFunc: function(value) {
        console.log(value);
        this.message = value;
        console.log(this.message);
        window.localStorage.describeIssue = this.message;
      },

      done: function(value) {
        console.log('value');
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
