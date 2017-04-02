
var baseUrl = require('../../config').baseUrl;
module.exports = function(app) {
  app.controller('scPortalController', ['$http', 'modalService', '$window', function($http, modalService, $window) {
    $http.defaults.headers.common.Authorization = localStorage.getItem('token');

    this.welcome = localStorage.getItem('service_center_name');
    console.log(this.welcome);
    this.newRequests = [];
    this.di = [];
    this.workrequests = [];


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

            console.log(res.data[i].work_request[0]);
            if (res.data[i].work_request[0] != '[') {
              res.data[i].describe_issue = res.data[i].work_request.slice(0, res.data[i].work_request.indexOf('[') - 1);
            }

            res.data[i].array_request =

          res.data[i].work_request.slice(res.data[i].work_request.indexOf('[') + 1,
            res.data[i].work_request.indexOf(']') - 1);

            this.workrequests.push(res.data[i]);
          }
        }

        console.log(res.data);
        // console.log(res.data[i].array_request[0]);

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
