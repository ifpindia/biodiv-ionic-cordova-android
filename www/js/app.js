// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers','starter.services']).constant('ApiEndpoint', {
    //url: 'http://localhost:8100/api'
    url:'http://portal.wikwio.org/api'
    //url:'http://pamba.strandls.com/api'
})


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})



.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider


  .state('login', {
    url: "/login",
    //views: {
      //'menuContent':{
        cache:false,
        templateUrl: "templates/login.html",
        controller: 'AppCtrl'
    // }
    //}
  })

  .state('newUser', {
    url: "/newUser",
    //views: {
      //'menuContent':{
        templateUrl: "templates/newUser.html",
        controller: 'NewUserCtrl'
    // }
    //}
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    //controller: 'LogoutController'
    
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeController'
      }
    }
  })

  /*.state('app.login', {
    url: "/login",
    views: {
      'login':{
        templateUrl: "templates/login.html",
        
     }
    }
  })*/

  /*.state('app.forgotpassword', {
      url: '/forgot-password',
      views: {
      templateUrl: 'templates/forgot-password.html'
    }
    })*/



  .state('app.newObservation', {
    url: "/newObservation",
    views: {
      'menuContent': {
        templateUrl: "templates/newObservation.html",
        controller: 'NewObservationCtrl'
      }
    }
  })

  .state('app.gps', {
    url: "/gps",
    views: {
      'menuContent': {
        templateUrl: "templates/GPS.html",
        controller: 'GPSController'
      }
    }
  })



  .state('app.joinedGroups', {
      url: "/joinedGroups",
      views: {
        'menuContent': {
          templateUrl: "templates/joinedGroups.html",
          controller: 'JoinGroupCtrl'
        }
      }
    })

    .state('app.browsedetails', {
      url: "/browsedetails/:browseId",
      views: {
        'menuContent': {
          templateUrl: "templates/browsedetails.html",
          controller: 'BrowseDetailsCtrl'
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent': {
          templateUrl: "templates/observation_list.html",
          controller: 'ListController'
        }
      }
    })

    .state('app.observationnearby', {
      url: "/observationnearby",
      views: {
        'menuContent': {
          templateUrl: "templates/observation_list.html",
          controller: 'ObsNearByCtrl'
        }
      }
    })

    .state('app.mycollection', {
      url: "/mycollection",
      views: {
        'menuContent': {
          templateUrl: "templates/myCollection.html",
          controller: 'MyCollectionCtrl'
        }
      }
    })

    .state('app.statusDetails', {
      url: "/statusDetails/:browseId",
      views: {
        'menuContent': {
          templateUrl: "templates/browsedetails.html",
          controller: 'statusDetailsController'
        }
      }
    })

  .state('app.observationStatus', {
    cache:false,
    url: "/observationStatus",
    views: {
      'menuContent': {
        templateUrl: "templates/observationStatus.html",

        controller: 'observationStatusController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});


