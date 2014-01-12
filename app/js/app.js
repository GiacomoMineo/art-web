angular.module('francyWebApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'paintingsModule'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'HomeCtrl'
      })
      .when('/paintings/:paintingId', {
        templateUrl: 'views/painting-detail.html',
        controller: 'PaintingDetailCtrl'
      })
      .when('/contacts', {
        templateUrl: 'views/contacts.html',
        controller: 'ContactsCtrl'
      })
      .when('/photos/:photoId', {
        templateUrl: 'views/photo-detail.html',
        controller: 'PhotoDetailCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })


