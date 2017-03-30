
module.exports = function(app) {
  app.controller('navController', ['modalService', function(modalService) {
    var that = this;
    console.log('navbaring');
    // this.isNavCollapsed = true;
    this.checkcookies = function() {
      console.log('initting cookie check');
      console.log(navigator.cookieEnabled);
    };
    this.service = modalService;

    // console.log(modalService.user_name);
    this.user_name = modalService.user_name;
    console.log(modalService.user_name);
    this.serviceCenter = false;
    // this.activeButton = function() {
    //   this.serviceCenter = !this.serviceCenter;
    // };
    this.items = ['Coffee', 'Tea', 'Red Bull'];
    this.status = {
      isopen: true

    };


    if (!localStorage.getItem('user_name')) {
      this.user_name = 'Sign in';
      console.log('THERE IS A PERSON!');
    } else {
      this.user_name = localStorage.getItem('user_name');
      console.log(this.user_name);
    }

    this.toggled = function(open) {

      console.log('Dropdown is now: ', open);

    };


    this.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
    //   this.status.isopen = !this.status.isopen;
      that.status.isopen = !that.status.isopen;
    };

  }]);
};
