
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
   //   this.workrequests.push(res.data[i]);
        }

        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].work_request.indexOf('[') != -1) {

            if (res.data[i].work_request[0] != '[') {
              res.data[i].describe_issue = res.data[i].work_request.slice(0, res.data[i].work_request.indexOf('[') - 1);
            }
            res.data[i].parstring = '';
            // res.data[i].arr = [];


            console.log(res.data[i].arr);

            res.data[i].array_request =
          res.data[i].work_request.slice(res.data[i].work_request.indexOf('[') + 1,
            res.data[i].work_request.indexOf(']') - 1)
            ;
            console.log(res.data[i].array_request);
            res.data[i].parstring = '';

            res.data[i].parstring = rq( res.data[i].work_request.slice(res.data[i].work_request.indexOf('[') + 1,
                    res.data[i].work_request.indexOf(']') - 1), this.empty);
            console.log('x');


            res.data[i].piped = res.data[i].parstring.replace(/,/g, ' | ');

// ....
            this.workrequests.push(res.data[i]);
          }

        }

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
