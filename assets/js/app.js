'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  //'ngSailsBind',
  'ngSails',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',

  // 3rd party dependencies
  //'btford.socket-io'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'SettingsCtrl'});
  $routeProvider.when('/game-upload', {templateUrl: 'partials/game-upload.html', controller: 'GameUploadCtrl'});

	$routeProvider.when('/games', {templateUrl: 'partials/game-list.html', controller: 'GameListCtrl'});
	$routeProvider.when('/games/:id', {templateUrl: 'partials/game-detail.html', controller: 'GameDetailCtrl'});


	$routeProvider.when('/create-user', {templateUrl: 'partials/user-create.html', controller: 'UserCreateCtrl'});
  $routeProvider.when('/users', {templateUrl: 'partials/user-list.html', controller: 'UserListCtrl'});
	$routeProvider.when('/users/:id', {templateUrl: 'partials/user-detail.html', controller: 'UserDetailCtrl'});

	$routeProvider.otherwise({redirectTo: '/home'});
}]);
