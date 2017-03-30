var angular = require('angular');
require('ngmap');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('angular-animate');
require('angular-sanitize');
require('gm.datepicker-multi-select');
var config = require('../config.js');


var wrApp = angular.module('wrApp', ['wrApp.config', require('angular-route'), 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'gm.datepickerMultiSelect', 'ui.router', 'ngMap']);

require('./services')(wrApp);
require('./maps')(wrApp);
require('./service_centers')(wrApp);
require('./mechanic_sign_up')(wrApp);
require('./user_sign_up')(wrApp);
require('./vehicle')(wrApp);
require('./describe')(wrApp);
require('./user_dashboard')(wrApp);
require('./modal_window')(wrApp);
require('./modal_button')(wrApp);
require('./nav')(wrApp);
require('./modal_button_sign_in')(wrApp);
require('./modal_window_sign_in')(wrApp);
require('./sc_portal')(wrApp);
require('./time')(wrApp);
require('./datemodal')(wrApp);
require('./newcal')(wrApp);
require('./componentCtrl')(wrApp);
require('./mega')(wrApp);


wrApp.config(($stateProvider, $urlRouterProvider) => {
  $stateProvider
.state('user_sign_up_form_view_page_one', {
  url: '/sign_up',
  templateUrl: 'templates/user/views/user_sign_up_form_view_page_one.html',
  controller: 'userSignUpController',
  controllerAs: 'userctrl'

})
.state('common_repairs_view.get_started', {
  url: '/get_started',
  templateUrl: 'templates/describe/views/get_started.html'
})
.state('mechanic_sign_up', {
  url: '/mechanic_sign_up',
  templateUrl: 'templates/mechanic_sign_up/views/mechanic_sign_up_form_view.html',
  controller: 'mechanicSignUpController',
  controllerAs: 'scctrl'
})


.state('vehicle_dropdown_selection', {
  url: '/',
  templateUrl: 'templates/vehicle/views/stepOne.html',
  controller: 'VehicleInfoController',
  controllerAs: 'VehicleInfoController'
})

.state('common_repairs_view', {
  url: '/common_repairs',
  templateUrl:
    'templates/describe/views/common_repairs_view.html',
  controller: 'describeController',
  controllerAs: 'describe'
})

.state('service_list_view', {
  url: '/service_centers',
  templateUrl:
    'templates/service_centers/views/service_list_view.html',
  controller: 'serviceCenterController',
  controllerAs: 'scctrl'
})
.state('common_repairs_view.common_maintenance', {
  url: '/common_maintenance',
  templateUrl: 'templates/describe/views/common.html',
  controller: 'describeController',
  controllerAs: 'describe'
})
.state('common_repairs_view.dash_lights', {
  url: '/dashlights',
  templateUrl: 'templates/describe/views/dash.html',
  controller: 'describeController',
  controllerAs: 'describe'
})

.state('common_repairs_view.describe_issue', {
  url: '/describe_issue',
  templateUrl: 'templates/describe/views/describe.html',
  controller: 'describeController',
  controllerAs: 'describe'
})

.state('user_dashboard', {
  url: '/dashboard',
  templateUrl: 'templates/user/views/user_dashboard3.html',
  controller: 'UserDashboardController',
  controllerAs: 'UserDashCtrl'
})
.state('sc_portal_view', {
  url: '/scportal',
  templateUrl: 'templates/sc_portal/views/sc_portal_view.html',
  controller: 'scPortalController',
  controllerAs: 'portal'
})

.state('sc_portal_view.active_view', {
  url: '/active_bids',
  templateUrl: 'templates/sc_portal/views/active_view.html',
  controller: 'scPortalController',
  controllerAs: 'portal'
})

.state('sc_portal_view.pending_view', {
  url: '/pending_bids',
  templateUrl: 'templates/sc_portal/views/pending_view.html',
  controller: 'scPortalController',
  controllerAs: 'portal'
})
.state('sc_portal_view.past_view', {
  url: '/past_bids',
  templateUrl: 'templates/sc_portal/views/past_view.html',
  controller: 'scPortalController',
  controllerAs: 'portal'
})
.state('sc_portal_view.appointments_view', {
  url: '/appointments',
  templateUrl: 'templates/sc_portal/views/appointments_view.html',
  controller: 'scPortalController',
  controllerAs: 'portal'
})

.state('map_view', {
  url: '/map',
  templateUrl: 'templates/maps/views/map_view.html',
  controller: 'mapController',
  controllerAs: 'vm'
})

.state('mega_view', {
  url: '/mega',
  templateUrl: 'templates/mega/views/mega_view.html',
  controller: 'megaController',
  controllerAs: '$ctrl'
})
.state('user_dashboard_mini', {
  url: '/minidash',
  templateUrl: 'templates/user/views/user_dashboard_mini.html',
  controller: 'UserDashboardController',
  controllerAs: 'UserDashCtrl'
})
// .state('pending', {
//   url: '/resetpassword:token',
//   templateUrl: 'templates/user/views/pending.html',
//   controller: 'UserDashboardController',
//   controllerAs: 'UserDashboardController'
// })

.state('pending', {
  url: '/Password/reset?token=jnsbbwbwbrbbb12nn888b-9292',
  templateUrl: 'templates/user/views/pending.html',
  controller: 'UserDashboardController',
  controllerAs: 'UserDashboardController'
})

.state('contact_us_view', {
  url: '/contact',
  templateUrl: 'templates/user/views/contact_us_view.html',
  controller: 'userSignUpController',
  controllerAs: 'userctrl'
})

;
  $urlRouterProvider.otherwise('/');
});
