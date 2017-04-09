
var baseUrl = require('../../config').baseUrl;
module.exports = function(app) {
  app.controller('scPortalController', ['$http', 'modalService', '$window', function($http, modalService, $window) {
    $http.defaults.headers.common.Authorization = localStorage.getItem('token');

    this.welcome = localStorage.getItem('service_center_name');
    console.log(this.welcome);
    this.newRequests = [];
    this.arr = [];
    this.workrequests = [];
    this.empty = '';


    this.getRequests = function() {
      $http.get(baseUrl + '/service_requests')
      .then((res) => {
        console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].converted = new Date(res.data[i].created_at);
          res.data[i].convertedToString = res.data[i].converted.toString();
          this.workrequests.push(res.data[i]);
        }


        // for (var i = 0; i < res.data.length; i++) {
        //   console.log(typeof res.data[i].work_request);
        // //   console.log(res.data[i].work_request);
        //
        //
        // //   if (res.data[i].work_request != null &&
        // //   }
        //   this.workrequests.push(res.data[i]);
        // }
        console.log(this.workrequests);
        function two(arr) {
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] == ',') {
              arr[i] = ' | ';
            }
          }
          return arr.join();
        }

        function rq(str, str2) {
          for (var i = 0; i < str.length; i++) {
            if (str[i] != '"') {
              str2 += str[i];
            }
          }
          return str2;
        }


        console.log(res.data);
        console.log(this.workrequests);

      });};


    function one(str, arr) {
      for (var i = 0; i < str.length; i++) {
        if (str.charAt(i) != '"') {
          arr.push(str[i]);
        }
      }
      return arr;
    }
  }]);};
