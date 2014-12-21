'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  //'ngSailsBind',
  'angularMoment',
  'ui.bootstrap',

  'cgBusy',

  'ngSails',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'

  // 3rd party dependencies
  //'btford.socket-io'
]).
    config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
      $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'SettingsCtrl'});
      $routeProvider.when('/game-upload', {templateUrl: 'partials/game-upload.html', controller: 'GameUploadCtrl'});

      $routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: 'AdminCtrl'});

      $routeProvider.when('/games', {templateUrl: 'partials/game-list.html', controller: 'GameListCtrl'});
      $routeProvider.when('/games/:id', {templateUrl: 'partials/game-detail.html', controller: 'GameDetailCtrl'});

      $routeProvider.when('/games/:id/decode', {
        templateUrl: 'partials/gamedecoding-detail.html',
        controller: 'GameDecodeDetailCtrl'
      });

      $routeProvider.when('/create-user', {templateUrl: 'partials/user-create.html', controller: 'UserCreateCtrl'});
      $routeProvider.when('/users', {templateUrl: 'partials/user-list.html', controller: 'UserListCtrl'});
      $routeProvider.when('/users/:id', {templateUrl: 'partials/user-detail.html', controller: 'UserDetailCtrl'});
      $routeProvider.when('/users/alias/:aliasId', {
        templateUrl: 'partials/user-detail.html',
        controller: 'UserDetailCtrl'
      });

      $routeProvider.when('/users/:id/machine-create', {
        templateUrl: 'partials/machine-create.html',
        controller: 'MachineCreateCtrl'
      });

      $routeProvider.when('/users/:id/group-create', {
        templateUrl: 'partials/group-create.html',
        controller: 'GroupCreateCtrl'
      });

      $routeProvider.when('/sign-up', {
        templateUrl: 'partials/sign-up.html',
        controller: 'SignUpCtrl'
      });


      $routeProvider.otherwise({redirectTo: '/home'});
    }]).value('cgBusyDefaults', {
      backdrop: true,
      templateUrl: 'partials/loading-indicator.html',
      delay: 200,
      minDuration: 300
    }).constant('angularMomentConfig', {
      //nothing at the moment
    }).run(function (amMoment) {
      amMoment.changeLocale('en-au'); //no nz locale so australia is close enough
    });
