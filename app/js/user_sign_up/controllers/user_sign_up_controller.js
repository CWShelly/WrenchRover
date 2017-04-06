
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

    // this.hasVehicle = modalService.hasVehicle;
    modalService.hasVehicle = false;


    this.users = [];
    this.errors = [];
    this.allProblems = null;
    this.previousItem;
    this.localStorageOil;
    this.localStorageDash;
    this.localStorageChosen;
    this.message = modalService.message;
    this.logInObject = {};
    // this.logInObject.user_email = 'a'


    this.previouslyEntered = localStorage.getItem('describeIssue');


    if (localStorage.getItem('chosen')) {
      this.localStorageChosen = JSON.parse(localStorage.getItem('chosen'));
      this.chosenArr = [];
      for (var i = 0; i < this.localStorageChosen.length; i++) {
        this.chosenArr.push(this.localStorageChosen[i].name);

      }

      console.log(this.chosenArr);
    }


    // var arr = [this.previouslyEntered ];

    // var arrFilter = arr.filter((z) => {
    //   return z != null;
    // });


    if (localStorage.getItem('user_name')) {
      modalService.user_name = localStorage.getItem('user_name');
    } else {
      modalService.user_name = 'Sign in';
    }


    var remote = new Resource(this.users, this.errors, baseUrl + 'users', { errMessages: { create: 'create error' } });

    this.storedVehicle = JSON.parse(localStorage.getItem('vehicle'));
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
      this.new_auto_id = null;
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


    this.createUser = function(resource) {
      this.requests = [];
      this.newRay = [];
      if (localStorage.getItem('describeIssue')) {
        this.requests.push(localStorage.getItem('describeIssue'));
      }
      if (localStorage.getItem('chosen')) {
        var newArr = JSON.parse(localStorage.getItem('chosen'));
        for (var i = 0; i < newArr.length; i++) {
          this.newRay.push(newArr[i].name);
        }
        this.requests.push(this.newRay);
      }
      console.log(this.requests);
      console.log(JSON.stringify(this.requests));
      console.log(this.requests.toString());

      this.serviceRequests.work_request = JSON.stringify(this.requests);

      console.log(this.serviceRequests.work_request);

      this.x = {
        user: resource
      };

      window.localStorage.user_name = resource.user_name;
      $http.post(baseUrl + 'users', this.x)
      .then((res) => {
        console.log('1. posting to users');
        console.log(this.x);
        this.auto.user_id = res.data.id;
        this.serviceRequests.user_id = res.data.id;
        window.localStorage.user_id = res.data.id;

      })
      .catch((error, data) => {
        console.log('oh no an error');
        console.log('error');
        // that.message = 'something is wrong';
        modalService.message = 'This email address ' + error.data.user_email[0];
        console.log(error);
     //    console.log(data);
        this.data.error = { message: error, status: status };
        console.log(this.data.error);
      })

      .then(() => {
        console.log(resource);
        $http.post(baseUrl + 'authenticate', resource)

        .catch((error) => {
          console.log('oh no an error');
          console.log('error');
          that.message = 'something is wrong';
          modalService.message = 'something is wrong';
          console.log(error);
       //    console.log(data);
          this.data.error = { message: error, status: status };
          console.log(this.data.error);
        })
        .then((res) => {
          console.log(res);

          modalService.message = 'Welcome';

          console.log('2. posting to authenticate');
          console.log(res);
          res.config.headers.Authorization = res.data.auth_token;
          this.token = res.data.auth_token;
          window.localStorage.token = this.token;
          $http.defaults.headers.common.Authorization = localStorage.getItem('token');
        })

     .catch((error) => {
       localStorage.removeItem('user_name');
       console.log('oh no an error');
       console.log('error');
       console.log(error);
    //    console.log(data);
       this.data.error = { message: error, status: status };
       console.log(this.data.error);
     })
        .then(() => {
          $http.post(baseUrl + 'service_requests', this.serviceRequests)
          .then((res) => {

            window.localStorage.service_requests = JSON.stringify(this.requests);

            this.auto.service_request_id = res.data.id;
            window.localStorage.service_request_id = res.data.id;
          })

          .then(() => {
            $http.post(baseUrl + 'autos', this.auto)
            .then((res) => {
              this.srthing = JSON.parse(localStorage.getItem('service_requests'));
              console.log(this.srthing);

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

// /////new login begins


    this.logIn = function(email, password) {
      console.log(email, password);
      console.log(this.logInObject);
    //   console.log(resource);
      console.log('logging in');
      console.log(this.logInObject.user_email);
      var resource = this.logInObject;
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

          } else {
            console.log(this.signedInUser);

            if (localStorage.getItem('vehicle')) {
            //   modalService.message = 'This user already has a vehicle stored. Do you want to replace it?';
              modalService.message = 'This user already has a vehicle stored. Add another?';
              console.log('user has vehicle already');
              modalService.hasVehicle = true;
            } else {
              console.log(res.data.service_requests[0].work_request);

              window.localStorage.service_requests = JSON.stringify(res.data.service_requests[0].work_request);
              $state.go('user_dashboard')
                    .then(() => {
                      console.log('reloading');
                      $window.location.reload();
                    });

            }

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
                      if (modalService.thing === 2 && !localStorage.getItem('vehicle')) {
                        that.closeModal();

                      } else {
                        that.closeDropDown();
                      }
                    }

                  });
      return;

    };


// new login ends
    // this.gotVehicle = function(resource) {
    //   console.log(resource);
    //   console.log('got a vehicle');
    // };

    this.testFunc = function(resource) {
      console.log(resource);
    };


// /////replace begins
// //////////old login begins
    this.replace = function(email, password) {
      this.requests = [];
      this.newRay = [];
      if (localStorage.getItem('describeIssue')) {
        this.requests.push(localStorage.getItem('describeIssue'));
      }
      if (localStorage.getItem('chosen')) {
        var newArr = JSON.parse(localStorage.getItem('chosen'));
        for (var i = 0; i < newArr.length; i++) {
          this.newRay.push(newArr[i].name);
        }
        this.requests.push(this.newRay);
      }
      that.serviceRequests.work_request = JSON.stringify(this.requests);


      console.log(email, password);
      console.log(this.logInObject);
      console.log('logging in');
      var resource = {};
      resource.user_email = email;
      resource.password = password;
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
         that.serviceRequests.user_id = res.data.id;
         console.log(res);
         console.log(res.data.user_name);
         window.localStorage.user_name = res.data.user_name;
         console.log(res.data.service_centers.length);
         console.log(this.signedInUser);
        //  console.log(res.data.service_requests[0].work_request);

        //  window.localStorage.service_requests = JSON.stringify(res.data.service_requests[0].work_request);

         console.log(that.storedVehicle);
         console.log(that.auto);
         that.auto.user_id = res.data.id;
// //new service request id begins

         console.log(that.serviceRequests);
        //  that.new_sr_id = res.data.service_requests[0].id;

         that.new_auto_id = res.data.autos[0].id;
        //  that.auto.id = res.data.autos[0].id;
        //  that.auto.service_request_id = res.data.service_requests[0].id;
        //  that.serviceRequests.id = res.data.service_requests[0].id;

         $http.post(baseUrl + 'service_requests' + '/', that.serviceRequests)
         .then((res) => {
           console.log(res);

           that.auto.service_request_id = res.data.id;

           $http.post(baseUrl + 'autos' + '/', that.auto)


             .then((res) => {
               console.log('posting the auto');
               console.log(res);
             });

         })


           .then(() => {
             $state.go('user_dashboard');
             console.log('reloading');
             $window.location.reload();
           });
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
// ////replace ends///

// //////////old login begins
    this.noReplace = function(email, password) {
      console.log(email, password);
      console.log(this.logInObject);
      console.log('logging in');
      var resource = this.logInObject;
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
         console.log(this.signedInUser);
         console.log(res.data.service_requests[0].work_request);

         window.localStorage.service_requests = JSON.stringify(res.data.service_requests[0].work_request);
         $state.go('user_dashboard')
           .then(() => {
             console.log('reloading');
             $window.location.reload();
           });
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


// //////////old login ends
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
