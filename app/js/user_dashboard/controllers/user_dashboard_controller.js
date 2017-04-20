/* eslint-disable prefer-arrow-callback */

var baseUrl = require('../../config').baseUrl;
module.exports = exports = function(app) {
  app.controller('UserDashboardController', ['$http', 'NgMap', 'string', '$state', '$window', 'modalService', '$location', '$compile', '$interpolate', '$sce', '$timeout', function($http, NgMap, string, $state, $window, modalService, $location, $compile, $interpolate, $sce, $timeout) {

    this.key = string;
    var vm = this;
    vm.positions = [];
    vm.positions2 = [];
    var loc_obj = {};
    this.url = 'https://wrenchroverapi.herokuapp.com/';
    this.count = 0;
    this.all = [];
    this.static_index_tabs = [
        { title: 'Appointments', content: 'appointmetns heres' },
        { title: 'History', content: 'historys here' }
    ];

    this.appointment = {};
    this.acceptedObject = {};
    this.service_requests_count = 0;
    this.modalService = modalService;
    this.message = 'We are currently digging for offers';
    // console.log('USHER DASH BOARDS');
    this.localCorrection = 'Seattle, WA';
    this.local = 'current-location';
    this.dummy = function() {
      console.log('this is a dummy function');
    };


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

    console.log(NgMap);
    NgMap.getMap('map').then(function() {
      vm.map = map;
    //   vm.map = NgMap.initMap('map');
    });

    vm.initMap = function(mapId) {
      vm.map = NgMap.initMap(mapId);
      console.log('vm.map 2', vm.map);
    };


    vm.showDetail = function(e, shop) {

      console.log('show the etail');
      console.log(shop);
    //   vm.shop = shop;
    //   vm.map.showInfoWindow('foo-iw', shop.id);
    //   console.log(vm.map);
    };

    vm.hideDetail = function() {
      console.log('hide hte detail');
    };

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
         this.q = this.quicksortBasic(res.data.service_requests, 'auto_id');
        //  console.log(this.q);

         console.log(res.data.autos);

         window.localStorage.auto_array = JSON.stringify(res.data.autos);

         for (var i = 0; i < res.data.autos.length; i++) {
           this.all.push(
             { id: i.toString(), make: res.data.autos[i].make, model: res.data.autos[i].model, year: res.data.autos[i].year.toString().slice(2), requests: matchReq(res.data.service_requests, res.data.autos[i].id).results, service_request_ids: matchReq(res.data.service_requests, res.data.autos[i].id).service_request_ids
             }
            );
           this.quote_first = [];

           matchQuotes(matchReq(res.data.service_requests, res.data.autos[i].id).results);

           var arr2 = matchReq(res.data.service_requests, res.data.autos[i].id).results;

           function matchQuotes(arr) {
             console.log(arr);
             for (var j = 0; j < arr.length; j++) {
               $http.get(baseUrl + 'service_requests/' + arr[j].id)
                  .then((res) => {

                    console.log(res.data);
                    if (res.data.length > 0 ) {
                      arr[j].quotes = [{ id: j.toString(), quotes: res.data.service_quotes }];
                    } else {
                      return;

                    }
                  });
               return arr[j].quotes;
             }
           }


         }

         console.log(this.all);
         console.log(this.all.length);
         this.demo = 0;
         this.demo2 = 0;

         function matchReq(arr, key) {
           console.log(arr);
           for (var i = 0; i < arr.length; i++) {
             if (arr[i].auto_id == key) {
            //    console.log(arr[i].auto_id);
            //    console.log(vm.q);
               return vm.findDupes(vm.q, arr[i].auto_id);
             }
           }
           return -1;
         }


       //  get user's date of signup:
         var month = parseInt(res.data.created_at.slice(5, 7), 10);
         var year = res.data.created_at.slice(0, 4);
        //  console.log(year);
         // 4/8/17 --join year shows at 2016?? I mean, that would be cool if we got to do 2016 over.

         var monthsArray = ['January', 'February', 'March', 'April', 'May',
           'June', 'July', 'August', 'September', 'October',
           'November', 'December'];
         var memberDate = monthsArray[month - 1] + ' ' + year;

         this.userObject = res.data;
         this.userObject.memberSince = memberDate;
         this.user_id_mini = this.userObject.user_name;


       });}.bind(this);


    this.getQuotesByRequest = function(value) {
      this.service_quotes_array = [];
    //   console.log(value);
      $http.get(baseUrl + 'service_quotes')
      .then((res) => {
        console.log(res);
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


    this.addRequest = function() {

// remove anything stored in local storage
      $state.go('common_repairs_view.get_started');

    };


    this.addVehicle = function() {
      if (localStorage.getItem('auto_array')) {
        this.user_autos = JSON.parse(localStorage.getItem('auto_array'));
        console.log(this.user_autos);

      }


      localStorage.removeItem('service_requests');
    //   $state.go('vehicle_dropdown_selection');
    };

// ====testfunc2======

    this.testfunc2 = function(value) {


      this.quoteArray = [];
      console.log(value);
      this.all_array = [];
      this.all_sc = [];
      var val_sri_arr = value.service_request_ids;

      $http.get(baseUrl + 'service_quotes')
      .then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          if (val_sri_arr.indexOf(res.data[i].service_request_id) != -1) {
            this.all_array.push(res.data[i]);
            this.all_sc.push(res.data[i].service_center.id);
          }
        }

        // if(this.all_array.length == 0){
        this.unique = this.all_sc.filter(function(el, i, arr) {
          return arr.indexOf(el) === i;
        });


        function x(arr, item) {
          ray3 = [];
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].service_center.id === item) {
              ray3.push(arr[i]);
            }
          }
          return ray3;
        }


        function three(arr) {
          console.log('yes');
          var newArr = [];
          for (var i = 0; i < arr.length; i++) {
            newArr.push(x(vm.all_array, arr[i]));
            // vm.bySCArr = x(vm.all_array, arr[i]);

            // vm.try = x(vm.all_array, arr[i]);
          }
          return newArr;
        }
        this.bySCArr = three(this.unique);


      });
    };

// ====== testfunc ======

    this.testfunc = function(value) {
      console.log('something');
      console.log(value);

      this.all_service_centers_id = [];
      console.log(value.service_request_ids);

      var arr = value.service_request_ids;


      $http.get(baseUrl + 'service_quotes')
      .then((res) => {
        var testfuncarray = [];


        for (var i = 0; i < res.data.length; i++) {
          if (arr.indexOf(res.data[i].service_request_id) != -1) {
            console.log(res.data[i]);
            this.all_service_centers_id.push(res.data[i].service_center.id);

            this.unique_service_centers_ids = this. all_service_centers_id.filter(function(el, i, arr) {
              return arr.indexOf(el) === i;
            });

            console.log(this.unique_service_centers_ids);
            // ///////
            if (this.all_service_centers_id.length > 0) {

            // ///////
              testfuncarray.push(res.data[i]);
              getWorkRequest(res.data[i]);
              function getWorkRequest(value) {
                $http.get(baseUrl + 'service_requests/' + value.service_request_id)
                .then((res) => {
                //   value.work_request = res.data.work_request;
                  value.work_request = JSON.parse(res.data.work_request);
                });


              }

              console.log(this.unique_service_centers_ids);


              console.log(testfuncarray);


            }
          }


          console.log(testfuncarray);


          this.quotes_by_car = testfuncarray;

// try by unique service center begins ===========
          this.all_sc = [];
          for (var i = 0; i < testfuncarray.length; i++) {
            this.all_sc.push(testfuncarray[i].service_center_id);
          }


          this.unique = this.all_sc.filter(function(el, i, arr) {
            return arr.indexOf(el) === i;
          });
          console.log(this.unique);

          function x(arr, item) {
            this.ray3 = [];

            for (var i = 0; i < arr.length; i++) {
              if (arr[i].service_center.id === item) {
                console.log(arr[i]);
                this.ray3.push(arr[i]);
              }
            }

            return ray3;
          }


          function three(arr) {
            var newObj = {};

            newArr = [];
            console.log('yes');
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {

              newArr.push(x(testfuncarray, arr[i]));

            // newObj['prop' + i] = x(testfuncarray, arr[i]);
            // console.log(x(testfuncarray, arr[i]));

            }
        //   console.log(newObj);

        //   newArr.push(newObj);
        //   return newObj;
            return newArr;
          }
          this.bySCArr = three(this.unique);
          this.the_quotes_array = four(this.bySCArr);
          console.log(this.finallyMaybe);

          function four(arr) {
            console.log(arr.length);
            this.yObj = {};
            this.yArr = [];
            for (var i = 0; i < arr.length; i++) {
              console.log(arr[i][0].service_center.service_name);


              this.yObj = { name: arr[i][0].service_center.service_name, theArray: arr[i] };
              this.yArr.push(this.yObj);

            }

            console.log(this.yObj);


        //   return this.yObj;
            return this.yArr;
          }
        // }

          this.testArray = [ ['one', 'two', 'three'], ['four', 'five', 'six']];


// get new map marker sc only

          function scMarkers(arr) {
        //   this.unique_markers = {};
            this.unique_markers = [];
            for (var i = 0; i < arr.length; i++) {
              $http.get(baseUrl + 'service_centers/' + arr[i].toString())
            .then((res) => {
              console.log(res.data);

            //   return this.unique_markers.push(res.data);

              this.loc_obj2 = {
                id: res.data.service_name,
                position: res.data.service_address + ',' + res.data.service_city + ',' + res.data.service_state + ',' + res.data.service_zip,
                pos: res.data.service_address + ',' + res.data.service_city + ',' + res.data.service_state + ',' + res.data.service_zip

              };

              this.unique_markers.push(res.data);
              vm.positions2.push(loc_obj2);

            });

            }
            for (var j = 0; j < vm.positions2.length; j++) {
              vm.positions2[j].map_icon_pics2 = map_icons[j];
              vm.positions2[j].item_number = j + 1;
            }
            console.log(this.unique_markers);
            console.log(vm.positions2);


          }

          scMarkers(this.unique);

// get new map marker sc only end
        }
        console.log('noooooooo quooooootes');
      });

    //   console.log('no stuff heres');
// }
// else{
//     console.log('no quotes yet');
// }
    };


// ====== sort and reduce duplicates functions ======


    this.quicksortBasic = function(array, theProp) {
      if (array.length < 2) {
        return array;
      }
      var pivot = array[0][theProp];
      var lesser = [];
      var greater = [];
      for (var i = 1; i < array.length; i++) {
        if (array[i][theProp] < pivot) {
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
          arr[i].parsed = JSON.parse(arr[i].work_request);
          this.service_request_ids.push(arr[i].id);
          this.results.push(arr[i]);

        }
      }
      this.dupeObj = { results: this.results, service_request_ids: this.service_request_ids };
    //   console.log(this.dupeObj);
      return this.dupeObj;
    };


// ///
    this.findDupes2 = function(arr, item, theProp) {
      this.results = [];
      this.new_array = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].service_center.id == item) {
          this.new_array.push(arr[i].id);
          this.results.push(arr[i]);
        }
      }
    //   this.dupeObj = { results: this.results, service_request_ids: this.service_request_ids };


      console.log(this.dupeObj);
      return this.dupeObj;
    };


// ///

  }
  ]);
};
