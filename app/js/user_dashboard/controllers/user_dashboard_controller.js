/* eslint-disable prefer-arrow-callback */
var baseUrl = require('../../config').baseUrl;
module.exports = exports = function(app) {
  app.controller('UserDashboardController', ['$http', 'NgMap', 'string', '$state', '$window', 'modalService', '$location', function($http, NgMap, string, $state, $window, modalService, $location) {

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

    // console.log(this.heading);
    // console.log(this.li);


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
      console.log('getting user info');

      $http.get(this.url + 'users/' + this.user_id)
       .then((res) => {
           // fallback in case GPS doesn't work.
         console.log(res.data);
         vm.localCorrection = JSON.stringify(res.data.user_zip);
         if (this.local[0] == 0 && this.local[1] == 0 && res.data.user_zip == null) {
           console.log("GPS issue, using user's zip");
           vm.local = vm.localCorrection;
         }
         console.log('get user autos and requests');
         this.q = this.quicksortBasic(res.data.service_requests);
        //  console.log(this.quicksorted);
         console.log(this.q);

         for (var i = 0; i < res.data.autos.length; i++) {
           this.all.push(
             { id: i.toString(), make: res.data.autos[i].make, model: res.data.autos[i].model, requests: matchReq(res.data.service_requests, res.data.autos[i].id).join() }
            );
         }

         this.demo = 0;
         console.log(this.all);
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

        //  var quicksorted = quicksortBasic(res.data.service_requests);
        //  console.log(quicksorted);

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

      $http.get(this.url + 'service_quotes')
      .then((res) => {
        console.log(res.data);
        // this.service_quotes_table.splice(0);
        this.appointments_table.splice(0);
        console.log(this.service_request_id);

        for (var i = 0; i < res.data.length; i++) {

          if (res.data[i].accepted != null && res.data[i].service_request_id == this.service_request_id && res.data.length >= 1) {
            vm.message = 'Your upcoming appointment';
            vm.appointment.appointment_date_time = res.data[i].accepted;
            vm.appointment.service_center = res.data[i].service_center.service_name;
            vm.pending_message = 'Your upcoming appointment';

            vm.tab = 'New';

            console.log(res.data[i]);
            window.localStorage.appointment_service_center_name = res.data[i].service_center.service_name;
            window.localStorage.confirmedAppt = res.data[i].accepted;
            console.log(res.data[i].accepted);


            var loc_obj2 = {
              id: res.data[i].service_center.service_name,
              cost: res.data[i].quote_cost,
              notes: res.data[i].quote_text,
              accepted: res.data[i].accepted,
              available_date_1: res.data[i].available_date_1, available_date_2: res.data[i].available_date_2, available_date_3: res.data[i].available_date_3,
              pos:
               res.data[i].service_center.service_address + ', ' + res.data[i].service_center.service_city + ',' + res.data[i].service_center.service_state + ',' + res.data[i].service_center.service_zip, num: 'things',
              quote_id: res.data[i].id,
              cost: res.data[i].quote_cost,
              notes: res.data[i].quote_text,
              position: res.data[i].service_center.service_address + ', ' + res.data[i].service_center.service_city + ',' + res.data[i].service_center.service_state + ',' + res.data[i].service_center.service_zip,
              dates: [ res.data[i].available_date_1, res.data[i].available_date_2, res.data[i].available_date_3]
            };


            vm.positions2.push(loc_obj2);

            // this.service_quotes_table.push(res.data[i]);
            this.appointments_table.push(res.data[i]);
            console.log(vm.positions2);

            // ////////
            console.log(loc_obj2);
            for (var j = 0; j < vm.positions2.length; j++) {
              vm.positions2[j].map_icon_pics = map_icons[j];
              vm.positions2[j].item_number = j + 1;
            }

            vm.shop = vm.positions2[0];
            console.log(vm.shop);
            vm.showDetail = function(e, shop) {
              console.log(shop);
              vm.shop = shop;
              vm.map.showInfoWindow('foo-iw', shop.id);
              console.log(vm.map);
            };

            vm.hideDetail = function() {
              vm.map.hideInfoWindow('foo-iw');
            };
            vm.value = '';
            vm.newValue = function(value, x) {};

            this.available_date = 1;
            // ///////
            // return vm.pending_message;
            return;

          } else {
            console.log('NOTHING YET2');
            // vm.message = 'You have bids.';
            vm.appointment.service_center = 'Coming soon...';
            vm.pending_message = 'Coming soon...';
            vm.message = 'You have received bids';

          }
        } // for loop ends


      });
    };


    this.addRequest = function() {
    //   console.log();
      console.log('adding request');

    //   if (localStorage.getItem('vehicle')) {
    //     console.log(localStorage.getItem('vehicle'));
    //     $state.go('common_repairs_view.get_started');
    //   } else {
    //     console.log(' no vehicle');
    //     $state.go('vehicle_dropdown_selection');
      //
    //   }
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
      console.log(arr);
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].auto_id == item) {
          this.results.push(JSON.parse(arr[i].work_request));
        }
      }
      return this.results;
    };
// /sort and dupe ends
  }


  ]);
};
