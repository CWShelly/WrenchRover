
var baseUrl = require('../../config').baseUrl;
module.exports = function(app) {
  app.controller('scPortalController', ['$http', 'modalService', '$window', function($http, modalService, $window) {
    $http.defaults.headers.common.Authorization = localStorage.getItem('token');

    this.welcome = localStorage.getItem('service_center_name');
    console.log(this.welcome);
    this.workrequests = [];


    this.getRequests = function() {
      $http.get(baseUrl + '/service_requests')
      .then((res) => {
        // console.log(res.data);

        for (var i = 0; i < res.data.length; i++) {
          res.data[i].converted = new Date(res.data[i].created_at);
          res.data[i].convertedToString = res.data[i].converted.toString();


          if (res.data[i].convertedToString.indexOf('Apr 10') != -1 && res.data[i].work_request.indexOf('[') === -1) {
            res.data[i].parsed_requests = JSON.parse(res.data[i].work_request);

            this.workrequests.push(res.data[i]);
          }
        }
        // console.log(this.workrequests);

        // console.log(res.data);
        console.log(this.workrequests);

      });};


  }]);};
