/* eslint-disable prefer-arrow-callback */
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
    this.chosenService = [];
    this.chosenArr = [];


    if (localStorage.getItem('token') != undefined || null) {
      this.token = localStorage.getItem('token');

    }


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


// ///button version for choosing the service from cm begins///

    this.getReqLS = function() {
      if (localStorage.getItem('chosen')) {
        this.locallyStoredReqs = JSON.parse(localStorage.getItem('chosen'));
        console.log(this.locallyStoredReqs);


        cmService.chosen = this.locallyStoredReqs;
        console.log(cmService.chosen);
      } else {
        console.log('No requests in LS');
      }
    };

    this.checkedSelected = function(value) {

      console.log(value);
      cmService.checkedSelected(value);
      that.chosenService = cmService.chosen;
      this.getReqLS();
    };

    this.remove = function(value) {
      cmService.remove(value);
    };


// ///button version for choosing the service from cm end///


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


    this.autoX = function() {
      cmService.autoX();
    };

  }]);
};
