
/* eslint-disable prefer-arrow-callback */
var baseUrl = require('../../config').baseUrl;
module.exports = function(app) {
  app.controller('scPortalController', ['$http', 'modalService', '$window', function($http, modalService, $window ) {

    $http.defaults.headers.common.Authorization = localStorage.getItem('token');
    this.service = modalService;

    var that = this;
    modalService.welcome = localStorage.getItem('service_center_name');

    modalService.user_name = localStorage.getItem('service_center_name');
    this.workrequests = [];
    this.unique_cars = [];
    this.all_autos = [];

    this.quote_object = {};
    this.testFunc = function(value, value2) {
      console.log('test func');
      console.log(value);
      console.log(value2);
      this.quote_object = value;
      this.quote_object.service_center_id = localStorage.getItem('service_center_id');
      this.quote_object.service_request_id = value2.id;
      this.quote_object.available_date_1 = '5/12 at 3pm';
      this.quote_object.available_date_2 = '5/14 at 4:30pm';
      this.quote_object.available_date_3 = '5/12 at 9am';
      console.log(this.quote_object);

      $http.post(baseUrl + 'service_quotes', value)
      .then((res) => {
        console.log('posting');
        console.log(res);
      });

    //   value.quote_cost = '';
    //   value.quote_text = '';
    };


    this.altGetRequests = function() {
      $http.get(baseUrl + '/service_requests')
      .then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].converted = new Date(res.data[i].created_at);
          res.data[i].convertedToString = res.data[i].converted.toString();
          res.data[i].date_sliced = res.data[i].convertedToString.slice(0, 10);
        //   if (res.data[i].convertedToString.indexOf('Apr 17') != -1) {
            // console.log(res.data);
          this.all_autos.push(res.data[i].auto_id);
        //   }
        }
        this.unique_auto_ids = this.all_autos.filter(function(el, i, arr) {
        //   console.log(el);
          return arr.indexOf(el) === i;
        });
        console.log(this.unique_auto_ids);

        for (var i = 0; i < this.unique_auto_ids.length; i++) {
          $http.get(baseUrl + 'autos/' + this.unique_auto_ids[i])
            .then((res) => {
              console.log(res.data);
              for (var j = 0; j < res.data.service_requests.length; j++) {
                console.log(res.data.service_requests[j].work_request);

                res.data.service_requests[j].parsed = JSON.parse(res.data.service_requests[j].work_request);
                res.data.id = res.data.id.toString();
              }

              this.demo = 0;
              that.workrequests.push(res.data);
            });
        }

        console.log(that.workrequests);

      }
  );

    };

    this.oneAtATime = true;


  }]);};
