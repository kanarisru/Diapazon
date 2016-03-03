angular.module('Diapazon', ['ionic', 'Diapazon.controllers'])

.run(function($ionicPlatform) {


  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider

    .state('D', {
    url: '/Diapazon',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })


    .state('D.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'Home'
        }
      }
    })

    .state('D.post', {
      url: '/post/:postId',
      views: {
        'menuContent': {
          templateUrl: 'templates/post.html',
          controller: 'Post'
        }
      }
    })


    .state('D.category', {
      url: '/category/:categoryId',
      views: {
        'menuContent': {
          templateUrl: 'templates/category.html',
          controller: 'Category'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/Diapazon/home');
    //$locationProvider.html5Mode(true);
});
