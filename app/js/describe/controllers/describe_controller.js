
var baseUrl = require('../../config').baseUrl;

module.exports = function(app) {
  app.controller('describeController', ['cmService', '$http', function( cmService, $http) {
    this.descriptions = [];
    this.childrens = [];
    this.errors = [];
    this.checked = null;
    this.oils = [];
    this.service = cmService;
    this.selection = null;


    if (localStorage.getItem('token') != undefined || null) {
      this.token = localStorage.getItem('token');

    }

    // ////
    if (localStorage.getItem('stringChosen')) {
      console.log('chosen');
      this.arrChosen = JSON.parse(localStorage.getItem('stringChosen'));

      console.log(this.arrChosen);

      this.removeStringChosen = function(value) {
        var index = this.arrChosen.indexOf(value);
        this.arrChosen.splice(index, 1);

      };


    } else {
      this.chosen = 'a';
    }
    if (localStorage.getItem('stringDash')) {
      console.log('dash chosen');
      this.dashChosen = JSON.parse(localStorage.getItem('stringDash'));

    } else {
      this.dashChosen = 'b';
    }

    if (localStorage.getItem('describeIssue')) {
      console.log('describe issue');
      this.describeIssue = localStorage.getItem('describeIssue');

    } else {
      this.describeIssue = 'c';
    }

    // ////


    this.previouslyEntered = localStorage.getItem('describeIssue');
    this.localStorageOil = localStorage.getItem('oilChosen');
    this.localStorageDash = localStorage.getItem('dashChosen');
    this.localStorageChosen = localStorage.getItem('chosen');

    this.storedVehicle = JSON.parse(localStorage.getItem('vehicle'));


    var that = this;
    that.value = this.value;
    this.placeholder = "Tell us what's happening with your car.";
    this.button = 'Enter';
    this.button = that.button;
    this.dashArr2 = [];
    this.dashChild = [];
    this.mainLights = [];

    this.commonLight = {
      common: '../../../images/common_icons/common.png',
      dash: '../../../images/common_icons/dash.png',
      describe: '../../../images/common_icons/describe.png' };
    this.mainLights.push(this.commonLight);


    this.sbArr = [];


    this.sb = {
      children: [
        { imageSrc: '../../../images/dashlights/001.png',
          imageSrc2: '../../../images/dashlights/002.png',
          imageSrc3: '../../../images/dashlights/003.png',
          imageSrc4: '../../../images/dashlights/004.png',
          name: 'Oil Light',
          name2: 'Battery Light',
          name3: 'Encircled Exclamation Point',
          name4: 'Airbag Light'
        },
        { imageSrc: '../../../images/dashlights/005.png',
          imageSrc2: '../../../images/dashlights/010.png',
          imageSrc3: '../../../images/dashlights/011.png',
          imageSrc4: '../../../images/dashlights/012.png',
          name: 'Temperature Light',
          name2: 'ABS Light',
          name3: 'Check Engine Light',
          name4: 'Sprocket Light'
        },
        { imageSrc: '../../../images/dashlights/015.png',
          imageSrc2: '../../../images/dashlights/016.png',
          imageSrc3: '../../../images/dashlights/017.png',
          imageSrc4: '../../../images/dashlights/018.png',
          name: 'Coily Light',
          name2: 'Hazard Light',
          name3: 'Tire Pressure Light',
          name4: 'Lightbulb Light'
        }
      ]
    };

    this.sbArr.push(this.sb);
    for (var i = 0; i < this.sbArr[0].children.length; i++) {
      this.dashChild.push(this.sbArr[0].children[i]);
    }


    $http.get(baseUrl + 'categories')
    .then((res) => {
      this.descriptions = res.data;

      for (var i = 0; i < res.data[0].children.length; i++) {
        if (res.data[0].children[i].name != 'Oil Change') {
          this.childrens.push(res.data[0].children[i]);
        } else {
          this.oils.push(res.data[0].children[i]);
        }
      }

    });

    this.oilSelected = function(x, y) {
      var value = this.value;
      cmService.oilSelected(value, y);
    };

    this.checkedSelected = function(x, y) {
    //   console.log('(else)parenthetical checkSelcted values: ' + x);
      var value = this.value;
      cmService.checkedSelected(value, y);
      console.log(cmService.chosen);

    };


    this.textAreaFunc = function(x) {
      var value = this.value;
      this.value = 'Thank you';
      cmService.textAreaFunc(value);
    };

    this.editThis = function() {
      var value = '';
      this.placeholder = 'Update?';
      this.textAreaFunc();
    };

    this.changeText = function() {
      that.button = 'x';
    };

    this.dashSelect = function(x) {
      console.log(x);
      var value = x;
      cmService.dashSelect(value);

    };


    this.removeChosenService = function(z) {
      var x = z;
      cmService.removeChosenService(x);
    };

    this.removeChosenDash = function(value) {
      var x = value;
      cmService.removeChosenDash(x);
    };

    this.removeChosenOil = function(value) {
      console.log(value);
      var x = value;
      cmService.removeChosenOil(x);
    };

    this.autoX = function() {
      cmService.autoX();
    };

  }]);
};
