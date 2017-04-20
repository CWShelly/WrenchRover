/* eslint-disable prefer-arrow-callback */
module.exports = function(app) {
  app.directive('dashDir', ($compile, $parse) => {
    return {
      restrict: 'EA',
      controller: 'UserDashboardController',
      controllerAs: 'UserDashCtrl',
      transclude: true,

      scope: {
        // 'val': '@'
      },


      template: '<span map-lazy-load="https://maps.googleapis.com/maps/api/js?key={{UserDashCtrl.key}}" id = "map_canvas"><ng-map  default-style="true" zoom="15" center="{{UserDashCtrl.local}}"><marker position = "{{UserDashCtrl.local}}" animation="Animation.BOUNCE"  centered="true"> </marker><marker id="{{p.id}}" position="{{p.pos}}" ng-repeat="p in UserDashCtrl.positions"on-click="UserDashCtrl.showDetail(p)"icon="{{p.map_icon_pics}}"title="pos: {{p.pos}}"on-mouseover="UserDashCtrl.showDetail(p);"on-mouseout="UserDashCtrl.hideDetail()"></marker><info-window id="foo-iw"><div ng-non-bindable="">{{UserDashCtrl.shop.id}}<br/>{{UserDashCtrl.shop.pos}}<br/><br/></div></info-window> </ng-map></span>',


      link: function(scope, element, attrs, controller) {
        element.bind('click', function() {
          console.log('here');
        });
      }

    };
  });
};
