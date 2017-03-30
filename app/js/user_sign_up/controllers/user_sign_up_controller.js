
var baseUrl = require('../../config').baseUrl;

var modalObj = require('../../modalObject').modalObj;

module.exports = function(app) {
  app.controller('userSignUpController', ['wrResource', '$http', '$state', 'wrHandleError', 'modalService', '$uibModal', '$window', function(Resource, $http, $state, wrError, modalService, $uibModal, $window) {
    var that = this;
    this.msg = 'Create New Account';
    this.errorMsg = null;
    this.service = modalService;
    console.log('user sign up controller');
    console.log(this.token);
    console.log(modalService.heading);
    if (!localStorage.getItem('token')) {
      this.heading = 'Sign in';
    //   modalService.heading = 'Sign in';``
      this.signedIn = false;
      this.li = 'Sign in';
      this.heading2 = 'Sign in';
      this.dashTest = 'xxx';
      modalService.indexNumberA = 2;
      modalService.indexNumberB = 3;
    } else {
      modalService.indexNumberA = 3;
      modalService.indexNumberB = 2;
      this.heading = 'Log Out';
      modalService.heading = 'Log Out';
      this.signedIn = true;
      this.li = 'My Dash';
    //   this.heading2 = 'My Profile';
      this.dashTest = 'yyy';
    }
    console.log(modalService.heading);

    this.users = [];
    this.errors = [];
    this.allProblems = null;
    this.previousItem;
    this.localStorageOil;
    this.localStorageDash;
    this.localStorageChosen;
    this.message = null;


    this.previouslyEntered = localStorage.getItem('describeIssue');
    this.localStorageOil = localStorage.getItem('oilChosen');
    this.localStorageDash = localStorage.getItem('dashChosen');
    this.localStorageChosen = localStorage.getItem('chosen');


    var arr = [this.previouslyEntered, this.localStorageOil, this.localStorageChosen, this.localStorageDash];

    var arrFilter = arr.filter((z) => {
      return z != null;
    });


    if (localStorage.getItem('user_name')) {
      modalService.user_name = localStorage.getItem('user_name');
    } else {
      modalService.user_name = 'Sign in';
    }


    this.storedVehicle = JSON.parse(localStorage.getItem('vehicle'));

    var remote = new Resource(this.users, this.errors, baseUrl + 'users', { errMessages: { create: 'create error' } });


    if (this.storedVehicle) {
      this.auto = {
        year: this.storedVehicle.year,
        make: this.storedVehicle.make.name,
        model: this.storedVehicle.model.name,
        trim: this.storedVehicle.trim.name,
        engine: this.storedVehicle.engine,
        mileage: this.storedVehicle.miles,
        user_id: null,
        service_request_id: null
      };
    //   console.log(this.storedVehicle);
    //   console.log(this.auto);


    }


    this.serviceRequests = {
      user_id: null,
      work_request: null
    };


    this.closeModal = function() {

      modalService.instance.close();
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

    this.addServiceRequests = function() {
      $http.defaults.headers.common.Authorization = localStorage.getItem('token');
      console.log('service requesting');
      this.previouslyEntered = localStorage.getItem('describeIssue');
      this.localStorageOil = localStorage.getItem('oilChosen');
      this.localStorageDash = localStorage.getItem('dashChosen');
      this.localStorageChosen = localStorage.getItem('chosen');

      var arr = [this.previouslyEntered, this.localStorageOil, this.localStorageChosen, this.localStorageDash];

      var arrFilter = arr.filter((z) => {
        console.log(z);
        return z != null;
      });
      console.log(arr);
      console.log(arrFilter);
      this.requests = [];
      for (var i = 0; i < arrFilter.length; i++) {
        if (Array.isArray(arrFilter[i])) {
          console.log(arrFilter[i]);
          this.requests = this.requests.concat(flatten(arrFilter[i]));
        } else this.requests.push(arrFilter[i]);
        console.log(arrFilter[i]);
      }
      console.log(this.requests);

      this.serviceRequests.work_request = this.requests.toString();
      this.serviceRequests.user_id = localStorage.getItem('user_id');
      console.log(this.serviceRequests.user_id);
      this.serviceRequests.auto = {};
      this.serviceRequests.auto.id = localStorage.getItem('auto_id');

      console.log(this.serviceRequests);
      $http.post(baseUrl + 'service_requests', this.serviceRequests)
      .then((res) => {
        console.log(res);
        window.localStorage.service_requests = JSON.stringify(res.data.work_request);
        $state.go('user_dashboard');
      });

    };

    this.createUser = function(resource) {
      this.requests = [];
      for (var i = 0; i < arrFilter.length; i++) {
        if (Array.isArray(arrFilter[i])) {
          this.requests = this.requests.concat(flatten(arrFilter[i]));
        } else this.requests.push(arrFilter[i]);
      }
      this.serviceRequests.work_request = this.requests.toString();

      this.x = {
        user: resource
      };
      $http.post(baseUrl + 'users', this.x)
      .then((res) => {
        console.log('1. posting to users');
        console.log(this.x);
        this.auto.user_id = res.data.id;
        this.serviceRequests.user_id = res.data.id;
        window.localStorage.user_id = res.data.id;
      })
      .then(() => {
        console.log(resource);
        $http.post(baseUrl + 'authenticate', resource)
        .then((res) => {
          console.log('2. posting to authenticate');
          console.log(res);
          res.config.headers.Authorization = res.data.auth_token;
          this.token = res.data.auth_token;
          window.localStorage.token = this.token;
          $http.defaults.headers.common.Authorization = localStorage.getItem('token');
        })

     .catch((error) => {
       console.log('error');
       console.log(error);
    //    console.log(data);
       this.data.error = { message: error, status: status };
       console.log(this.data.error);
     })
        .then(() => {
          $http.post(baseUrl + 'service_requests', this.serviceRequests)
          .then((res) => {
            window.localStorage.service_requests = JSON.stringify(res.data.work_request);
            this.auto.service_request_id = res.data.id;
            window.localStorage.service_request_id = res.data.id;
          })

          .then(() => {
            $http.post(baseUrl + 'autos', this.auto)
            .then((res) => {
              this.srthing = JSON.parse(localStorage.getItem('service_requests'));

            });
          })
          .then(() => {
            console.log('after autos');
            this.message = 'Thank you for signing up!';
            console.log(JSON.parse(localStorage.getItem('service_requests')));
            $state.go('user_dashboard');
          })

          .then(() => {
            console.log('closing');
            console.log(modalService.thing);
            if (modalService.thing === 2) {
              that.closeModal();

            } else {
              that.closeDropDown();
            }

          });


        });

      });


    }.bind(this);

    this.logIn = function(resource) {
      console.log('logging in');
      console.log(this.login.user_email);

      $http.post(baseUrl + 'authenticate', resource)
      .then((res) => {
        console.log(res);
        res.headers.Authorization = res.data.auth_token;
        this.token = res.data.auth_token;
        $http.defaults.headers.common.Authorization = this.token.toString();
        console.log($http.defaults.headers.common.Authorization);
        window.localStorage.token = this.token;
        window.localStorage.user_id = res.data.user_id;
        this.signedInUser = resource.user_email;
        this.user_id = res.data.user_id;

        $http.get(baseUrl + 'users/' + this.user_id )
        .then((res) => {
          console.log(res);
          console.log(res.data.user_name);
          window.localStorage.user_name = res.data.user_name;
          console.log(res.data.service_centers.length);
          if (res.data.service_centers.length != 0) {
            console.log('service center person');

            console.log(this.signedInUser);
            console.log(res.data.service_centers[0].service_name);
            window.localStorage.service_center_name = res.data.service_centers[0].service_name;


// ////////
            $http.get(baseUrl + 'service_centers').
then((res) => {
  console.log(res);
  for (var i = 0; i < res.data.length; i++) {
    if (res.data[i].service_email === this.signedInUser) {
      console.log(res.data[i].service_email);
      console.log(this.signedInUser);
      window.localStorage.user_id = res.data[i].id;
      window.localStorage.service_center_id = res.data[i].id;
      window.localStorage.user_name = res.data[i].service_name;
    } else {
      console.log('no');
    }
  }
})
.then(() => {
  $state.go('sc_portal_view')
  .then(() => {
    console.log('reloading');
    $window.location.reload();
  });


});


// /////


          } else {
            console.log(this.signedInUser);

            console.log(res.data.service_requests[0].work_request);

            window.localStorage.service_requests = JSON.stringify(res.data.service_requests[0].work_request);
            $state.go('user_dashboard')
            .then(() => {
              console.log('reloading');
              $window.location.reload();
            });

          }
        });


      })
      .catch((res) => {
        this.message = 'Sorry, either your email or your password was wrong. Try again.';
      })

      .then(() => {
        if (this.message === 'Sorry, either your email or your password was wrong. Try again.') {
          console.log('sorry again');
        } else {
          console.log(modalService.thing);
          if (modalService.thing === 2) {
            that.closeModal();

          } else {
            that.closeDropDown();
          }
        }

      });
      return;

    };


    this.logout = function() {
      console.log('logging out');
      $http.defaults.headers.common.Authorization = '';
      localStorage.clear();
      this.closeDropDown();
      $state.go('vehicle_dropdown_selection')
      .then(() => {
        $window.location.reload();

      });

    };

  }]);
};
