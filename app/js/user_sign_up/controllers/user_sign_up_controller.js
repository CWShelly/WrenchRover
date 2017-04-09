
var baseUrl = require('../../config').baseUrl;

var modalObj = require('../../modalObject').modalObj;

module.exports = function(app) {
  app.controller('userSignUpController', ['wrResource', '$http', '$state', 'wrHandleError', 'modalService', '$uibModal', '$window', function(Resource, $http, $state, wrError, modalService, $uibModal, $window) {
    var that = this;
    this.service = modalService;
    this.msg = 'Create New Account';
    this.errorMsg = null;
    console.log('user sign up controller');
    console.log(this.token);
    console.log(modalService.heading);
    if (!localStorage.getItem('token')) {
      this.heading = 'Sign in';
    //   modalService.heading = 'Sign in';``
      this.signedIn = false;
      this.li = 'Sign in';
      this.heading2 = 'Sign in';
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
    }

    this.user_autos = [];
    this.user_requests = [];
    this.all = [];
    console.log(modalService.heading);

    if (localStorage.getItem('token')) {
      $http.defaults.headers.common.Authorization = localStorage.getItem('token');

      this.token = localStorage.getItem('token');
    }

    if (localStorage.getItem('user_autos')) {

      this.user_autos = JSON.parse(localStorage.getItem('user_autos'));
      console.log(this.user_autos);
    }

    if (localStorage.getItem('user_requests')) {
      this.user_requests_arr = [];

      this.user_requests = JSON.parse(localStorage.getItem('user_requests'));
      console.log(this.user_requests);

    }


    this.combine = function() {
      for (var i = 0; i < this.user_autos.length; i++) {
        this.all.push({ auto_id: this.user_autos[i].id, model: this.user_autos[i].model, request: this.user_requests[i].work_request });

      }
      console.log(this.all);
    };

    if (localStorage.getItem('user_autos') && localStorage.getItem('user_requests')) {
      this.combine();
    }
    modalService.hasVehicle = false;


    this.users = [];
    this.errors = [];
    this.localStorageChosen;
    this.message = modalService.message;
    this.logInObject = {};
    this.serviceRequests = {
      user_id: null,
      work_request: null
    };

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


    this.altCreateUser = function(resource) {

      this.requests = [];
      this.newRay = [];
      if (localStorage.getItem('describeIssue')) {
        this.requests.push(localStorage.getItem('describeIssue'));
      }
      if (localStorage.getItem('chosen')) {
        console.log(localStorage.getItem('chosen')[0]);
        var newArr = JSON.parse(localStorage.getItem('chosen'));
        console.log(newArr[0]);
        for (var i = 0; i < newArr.length; i++) {
          this.newRay.push(newArr[i].name);
        }
        this.requests.push(this.newRay);
      }

      this.serviceRequests.work_request = JSON.stringify(this.requests);
      window.localStorage.service_requests = JSON.stringify(this.requests);

      this.x = {
        user: resource
      };
      $http.post(baseUrl + 'users', this.x)
              .catch((error) => {
                console.log(error);
                console.log('the eror');
                modalService.message = error.data.user_email[0];
              })
              .then((res) => {
                console.log(res);

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
               modalService.message = 'TAKEN';
               this.data.error = { message: error, status: status };
               console.log(this.data.error);
             })


                .then(() => {
                  console.log('begining recursivePost');
                  var newArr = JSON.parse(localStorage.getItem('chosen'));
                  recursivePost(newArr, baseUrl + 'service_requests');

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
              }
        );
    }.bind(this);

    this.createUser = function(resource) {
      console.log(this.auto);

      this.requests = [];
      this.newRay = [];
      if (localStorage.getItem('describeIssue')) {
        this.requests.push(localStorage.getItem('describeIssue'));
      }
      if (localStorage.getItem('chosen')) {
        console.log(localStorage.getItem('chosen')[0]);
        var newArr = JSON.parse(localStorage.getItem('chosen'));
        console.log(newArr[0]);
        for (var i = 0; i < newArr.length; i++) {
          this.newRay.push(newArr[i].name);
        }
        this.requests.push(this.newRay);
      }

      this.serviceRequests.work_request = JSON.stringify(this.requests);
      window.localStorage.service_requests = JSON.stringify(this.requests);

      this.x = {
        user: resource
      };
      $http.post(baseUrl + 'users', this.x)
      .catch((error) => {
        console.log(error);
        console.log('the eror');
        modalService.message = error.data.user_email[0];
      })
      .then((res) => {
        console.log(res);

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
       modalService.message = 'TAKEN';
       this.data.error = { message: error, status: status };
       console.log(this.data.error);
     })
        .then(() => {
          $http.post(baseUrl + 'service_requests', this.serviceRequests)
          .then((res) => {
            console.log(res);
            window.localStorage.service_requests = JSON.stringify(res.data.work_request);
            this.auto.service_request_id = res.data.id;
            window.localStorage.service_request_id = res.data.id;
          })

          .then(() => {
            console.log(this.auto);
            $http.post(baseUrl + 'autos', this.auto)
            .then((res) => {

              console.log(res);
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

// /////new login begins


    this.logIn = function(email, password) {
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
          window.localStorage.user_name = res.data.user_name;
          console.log(res.data.service_centers.length);
          if (res.data.service_centers.length != 0) {
            console.log('service center person');
            // console.log(this.signedInUser);

            console.log(res.data.service_centers[0].service_name);
            window.localStorage.service_center_name = res.data.service_centers[0].service_name;
            $http.get(baseUrl + 'service_centers').
                then((res) => {
                  console.log(res);
                  for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].service_email === this.signedInUser) {
                      console.log(res.data[i].service_email);
                    //   console.log(this.signedInUser);
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
            // console.log(this.signedInUser);

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


    function recursivePost(arr, url) {
      console.log('recursivePost');
      if (arr.length == 0) {
        console.log(that.auto);
        console.log('empty');
        // $http.post(baseUrl + 'autos', that.auto)
        // .then((res) => {
        //   console.log('POSTING THE AUTO');
        //   console.log(res);
        // });
        return;
      } else {
        var value = arr.pop();
        that.serviceRequests.work_request = JSON.stringify(value.name);

        $http.post(url, that.serviceRequests)
            .then((res) => {
              console.log('posting');
              console.log(res.data);
              that.auto.service_request_id = res.data.id++;
              console.log(that.auto);

            })

        .then(() => {
          $http.post(baseUrl + 'autos', that.auto)
                .then((res) => {
                  console.log('POSTING THE AUTO');
                  console.log(res);
                  return recursivePost(arr, url);
                });
        });


      }
    }

    this.replace = function(email, password) {
      this.logInObject = {};

      this.logInObject.user_email = email;
      this.logInObject.password = password;

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

      console.log(this.logInObject);
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
       this.user_id = res.data.user_id;

       $http.get(baseUrl + 'users/' + this.user_id )
       .then((res) => {
         that.serviceRequests.user_id = res.data.id;
         console.log(res);
         window.localStorage.user_name = res.data.user_name;
         console.log(that.storedVehicle);

         that.auto.user_id = res.data.id;
         console.log(that.auto);
         console.log(that.serviceRequests);

         $http.post(baseUrl + 'service_requests' + '/', that.serviceRequests)
         .then((res) => {
           console.log(res);

           that.auto.service_request_id = res.data.id;

           $http.post(baseUrl + 'autos' + '/', that.auto)
             .then((res) => {
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
         console.log('sorry, but no');
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
      console.log(this.logInObject);
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
    //    this.signedInUser = resource.user_email;
       this.user_id = res.data.user_id;

       $http.get(baseUrl + 'users/' + this.user_id )
       .then((res) => {
         console.log(res);
         window.localStorage.user_name = res.data.user_name;
         console.log(res.data.service_centers.length);
        //  console.log(this.signedInUser);
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


    this.addServiceRequests = function(value) {

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

      for (var i = 0; i < this.user_autos.length; i++) {
        if (value.service_request_id == this.user_requests[i].id) {
          this.user_requests[i].work_request += this.requests;

        }
        var h = this.user_requests[i].work_request;
        // var that.new_sr_id = value.service_request_id
      }
      console.log(h);

      that.serviceRequests.work_request = JSON.stringify(h);


      this.serviceRequests.user_id = localStorage.getItem('user_id');
      console.log(this.serviceRequests.user_id);
// bookmark
      this.serviceRequests.auto = {};
      this.serviceRequests.auto.id = value.id;
      console.log(value);

      console.log(this.serviceRequests);
      console.log(that.serviceRequests);

    //   $http.put(baseUrl + 'service_requests' + '/' + value.service_request_id, that.serviceRequests)
    //       .then((res) => {
    //         console.log(res);
    //         $state.go('user_dashboard');
    //       });

      $http.post(baseUrl + 'service_requests', that.serviceRequests)
      .then((res) => {
        console.log(res);
        $state.go('user_dashboard');
      });

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
