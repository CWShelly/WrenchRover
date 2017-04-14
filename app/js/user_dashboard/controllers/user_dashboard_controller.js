/* eslint-disable prefer-arrow-callback */

var baseUrl = require('../../config').baseUrl;
module.exports = exports = function(app) {
  app.controller('UserDashboardController', ['$http', 'NgMap', 'string', '$state', '$window', 'modalService', '$location', '$q', '$timeout', function($http, NgMap, string, $state, $window, modalService, $location, $q, $timeout) {

    this.key = string;
    var vm = this;
    vm.positions = [];
    vm.positions2 = [];
    var loc_obj = {};
    this.url = 'https://wrenchroverapi.herokuapp.com/';
    this.count = 0;
    this.all = [];
    // this.carRequests = [];

    this.appointment = {};
    this.acceptedObject = {};
    this.service_requests_count = 0;
    this.modalService = modalService;
    this.message = 'We are currently digging for offers';
    // console.log('USHER DASH BOARDS');
    this.localCorrection = 'Seattle, WA';
    this.local = 'current-location';

    if (localStorage.getItem('user_name')) {
      modalService.user_name = localStorage.getItem('user_name');
    } else {
      modalService.user_name = 'Sign in';
    }

    if (!localStorage.getItem('token')) {
      this.heading = 'Sign in';
      modalService.heading = 'Sign in';
      this.signedIn = false;
      this.li = 'Sign in';
    } else {
      this.heading = 'Log Out';
      modalService.heading = 'Log Out';
      this.signedIn = true;
      this.li = 'My Dash';
    }


    this.closeDropDown = function() {
      console.log('closing the drop down');
      modalService.closeDropDown();
    };

    this.goDash = function() {
      console.log('going to dash');
      $state.go('user_dashboard');
      this.closeDropDown();
    };

    this.getDash = function() {
      if (localStorage.getItem('user_id')) {
        console.log('going to the dashboard');
        vm.getUserInfo();
      } else {
        console.log('please sign in');
        vm.mini_dash_message = 'please sign in';
      }
    };

    this.getAll = function() {

      console.log('x');

    };


    var map_icons = [ '../../../images/map_icons/number_1.png',
      '../../../images/map_icons/number_2.png',
      '../../../images/map_icons/number_3.png', '../../../images/map_icons/number_4.png',
      '../../../images/map_icons/number_5.png', '../../../images/map_icons/number_6.png', '../../../images/map_icons/number_7.png',
      '../../../images/map_icons/number_8.png',
      '../../../images/map_icons/number_9.png',
      '../../../images/map_icons/number_10.png' ];


    NgMap.getMap().then(function(map) {
      vm.map = map;
    });

    if (localStorage.getItem('user_id')) {

      this.user_id = JSON.parse(localStorage.getItem('user_id'));
      this.user_id_mini = null;
      $http.defaults.headers.common.Authorization = localStorage.getItem('token');
    }


    if (!localStorage.getItem('user_id')) {
      this.user_id_mini = 'Not Signed In';
    }

    this.userObject = {};
    this.service_quotes = [];
    this.service_quotes_table = [];
    this.appointments_table = [];

    this.confirm = function(value, time) {
      console.log(value);
      console.log(time);

      window.localStorage.confirmedAppt = JSON.stringify(value);
      if (time == undefined) {
        console.log('time undefined');
        console.log(typeof time);

      } else {
        console.log(typeof time);

        var timeString = time.toString();
      }


      this.acceptedObject.id = value.id;
      this.acceptedObject.accepted = timeString;
      this.acceptedObject.service_center_id = value.service_center_id;
      var resource = this.acceptedObject;
      console.log(resource);

      window.localStorage.appointment_service_center_name = value.service_center.service_name;

      window.localStorage.appointment_date_time = time;

      $http.put(baseUrl + 'service_quotes' + '/' + value.id, resource )
     .then((res) => {
       console.log(res);
       console.log('Successfully put it to /service_quotes/' + value.id);
       $window.location.reload();
     })
     .catch((error) => {
       console.log(error);
       console.log('Failed to put it to /service_quotes/' + value.id);
     });

    };


    this.getUserInfo = function() {
      if (!localStorage.getItem('token')) {
        $state.go('vehicle_dropdown_selection');
      }

      $http.get(this.url + 'users/' + this.user_id)
       .then((res) => {
           // fallback in case GPS doesn't work.
         vm.localCorrection = JSON.stringify(res.data.user_zip);
         if (this.local[0] == 0 && this.local[1] == 0 && res.data.user_zip == null) {
           console.log("GPS issue, using user's zip");
           vm.local = vm.localCorrection;
         }
         this.q = this.quicksortBasic(res.data.service_requests);
         console.log(this.q);
        //  this.quotes = '3';
         for (var i = 0; i < res.data.autos.length; i++) {
           this.all.push(
             { id: i.toString(), make: res.data.autos[i].make, model: res.data.autos[i].model, requests: matchReq(res.data.service_requests, res.data.autos[i].id).results, service_request_ids: matchReq(res.data.service_requests, res.data.autos[i].id).service_request_ids.join()
             }


            );
           matchQuotes(matchReq(res.data.service_requests, res.data.autos[i].id).results);

           var arr2 = matchReq(res.data.service_requests, res.data.autos[i].id).results;

           function matchQuotes(arr) {
             console.log(arr);
            //  this.quotes_array = [];
             for (var j = 0; j <= arr.length; j++) {
               console.log(arr);
               console.log(arr[j]);
               $http.get(baseUrl + 'service_requests/' + arr[j].id)
                  .then((res) => {
                    console.log(arr);
                    console.log(arr[j]);
                    console.log(typeof arr[j]);

                    arr[j].quotes = [{ id: j.toString(), quotes: res.data.service_quotes }];

                  });


               return arr[j].quotes;

             }
           }


         }

         this.demo = 0;
         this.demo2 = 0;

         function matchReq(arr, key) {
           for (var i = 0; i <= arr.length; i++) {
             if (arr[i].auto_id == key) {
               console.log(arr[i].auto_id);
               console.log(vm.q);
               return vm.findDupes(vm.q, arr[i].auto_id);
             }
           }
           return -1;
         }


         console.log('y');
         console.log(this.all);
       //  get user's date of signup:
         var month = parseInt(res.data.created_at.slice(5, 7), 10);
         var year = res.data.created_at.slice(0, 4);
         console.log(year);
         // 4/8/17 --join year shows at 2016?? I mean, that would be cool if we got to do 2016 over.

         var monthsArray = ['January', 'February', 'March', 'April', 'May',
           'June', 'July', 'August', 'September', 'October',
           'November', 'December'];
         var memberDate = monthsArray[month - 1] + ' ' + year;

         this.userObject = res.data;
         this.userObject.memberSince = memberDate;
         this.user_id_mini = this.userObject.user_name;


       });}.bind(this);


    this.getAppointments = function() {
      console.log('GETTING THE APPOINTMENTS!');

    };
// ////


    this.testFunc = function(value) {
      this.service_quotes_array = [];
      console.log(value);
      $http.get(baseUrl + 'service_quotes')
      .then((res) => {
        console.log(res);
        // console.log(res.data.service_request_id);
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].service_request_id == value.id) {
            this.service_quotes_array.push(res.data[i]);
            this.sq_array = this.service_quotes_array;
          }
        }
        console.log(this.service_quotes_array);
        return this.service_quotes_array;
      });
    };
    this.testFuncOG = function(value) {
      console.log(value);

      $http.get(baseUrl + 'service_requests/' + value.id)
      .then((res) => {

        vm.the_quotes = res.data.service_quotes;

        if (res.data.service_quotes.length > 0) {
          var arr = res.data.service_quotes;
          for (var i = 0; i < arr.length; i++) {
            console.log(arr[i]);

          }
        } else {
          console.log('not long enough');
        }

      })

      .then(() => {

        $http.get(baseUrl + '/service_quotes/' + 248)
        .then((res) => {

          console.log(res.data);

        });

      });


    };


// ///

    this.addRequest = function() {
    //   console.log();
      console.log('adding request');

      console.log(localStorage.getItem('vehicle'));
      $state.go('common_repairs_view.get_started');
    };


    this.addVehicle = function(value) {
      console.log('adding vehicle');
      console.log(value);
      $state.go('vehicle_dropdown_selection');
    };


// //sort and dupe begins///


    this.quicksortBasic = function(array) {
      if (array.length < 2) {
        return array;
      }
      var pivot = array[0].auto_id;
      var lesser = [];
      var greater = [];
      for (var i = 1; i < array.length; i++) {
        if (array[i].auto_id < pivot) {
          lesser.push(array[i]);
        } else {
          greater.push(array[i]);
        }
      }
      return this.quicksortBasic(lesser).concat(array[0], this.quicksortBasic(greater));
    };


    this.findDupes = function(arr, item) {
      this.results = [];
      this.service_request_ids = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].auto_id == item) {
          console.log(arr[i]);
          arr[i].parsed = JSON.parse(arr[i].work_request);
          this.service_request_ids.push(arr[i].id);
          console.log(arr[i]);
          this.results.push(arr[i]);
        }
      }


      this.dupeObj = { results: this.results, service_request_ids: this.service_request_ids };
      console.log(this.dupeObj);
      return this.dupeObj;

    };


    this.ex = {
      id: 588
    };
// //


  }
  ]);
};
