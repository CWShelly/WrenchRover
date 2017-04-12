
/* eslint-disable prefer-arrow-callback */
var baseUrl = require('../../config').baseUrl;
module.exports = function(app) {
  app.controller('scPortalController', ['$http', 'modalService', '$window', function($http, modalService, $window) {
    $http.defaults.headers.common.Authorization = localStorage.getItem('token');
    this.service = modalService;
    modalService.welcome = localStorage.getItem('service_center_name');

    modalService.user_name = localStorage.getItem('service_center_name');
    this.workrequests = [];
    this.unique_cars = [];
    this.all_autos = [];
    var that = this;


    this.altGetRequests = function() {
      console.log('xxx');
      $http.get(baseUrl + '/service_requests')
      .then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].converted = new Date(res.data[i].created_at);
          res.data[i].convertedToString = res.data[i].converted.toString();
          res.data[i].date_sliced = res.data[i].convertedToString.slice(0, 10);
          if (res.data[i].convertedToString.indexOf('Apr 11') != -1) {
            console.log(res.data);
            this.all_autos.push(res.data[i].auto_id);
          }
        }//
        this.unique_auto_ids = this.all_autos.filter(function(el, i, arr) {
          console.log(el);
          return arr.indexOf(el) === i;
        });
        console.log(this.unique_auto_ids);

        for (var i = 0; i < this.unique_auto_ids.length; i++) {
          $http.get(baseUrl + 'autos/' + this.unique_auto_ids[i])
            .then((res) => {
              console.log(res.data);
              console.log(res.data.service_requests);
              for (var j = 0; j < res.data.service_requests.length; j++) {
                console.log(res.data.service_requests[j].work_request);

                res.data.service_requests[j].parsed = JSON.parse(res.data.service_requests[j].work_request);

                //  console.log(JSON.parse(res.data.service_requests[j].work_request)
            //  );

              }
              that.workrequests.push(res.data);
            });
        }

        console.log(that.workrequests);

      }
  );

    };

    this.findDupes = function(arr, item) {
      this.results = [];
      console.log(arr);
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].auto_id == item) {
          this.results.push(arr[i]);
        //   this.results.push(JSON.parse(arr[i].work_request));
        }
      }
      return this.results;
    };


    this.getRequests = function() {
      $http.get(baseUrl + '/service_requests')
      .then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].converted = new Date(res.data[i].created_at);
          res.data[i].convertedToString = res.data[i].converted.toString();
          res.data[i].date_sliced = res.data[i].convertedToString.slice(0, 10);

          if (res.data[i].convertedToString.indexOf('Apr 11') != -1 && res.data[i].work_request.indexOf('[') === -1) {
            res.data[i].parsed_requests = JSON.parse(res.data[i].work_request);
            this.cars.push(res.data[i].auto);

            console.log(this.cars);


            this.workrequests.push(res.data[i]);
          }
        }
        console.log(this.workrequests);
        console.log(this.cars);

      });};
    this.oneAtATime = true;
    this.oneAtATime2 = false;
    //
    // this.status = {
    //   isCustomHeaderOpen: false,
    //   isFirstOpen: true,
    //   isFirstDisabled: false
    // };
    //
    // this.innerStatus = {
    //   isCustomHeaderOpen: false,
    //   isFirstOpen: true,
    //   isFirstDisabled: false
    //
    //
    // };


  }]);};
