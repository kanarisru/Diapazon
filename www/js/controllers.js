function S00(d){
  d = "00"+d;
  return d.substr(d.length-2,2);
}


angular.module('Diapazon.controllers', [])
  .service('DataService',DataService)
  .service( 'Server', ['$http',function ($http) {
    var base = "http://www.diapazon.kz/rest/";

    var requestGet = function (action, params) {
      if(angular.isUndefined(params)) params = {};
      params["action"] = action;
      return $http.get(base, {params: params}); //, headers: {"referer": "http://www.diapazpn.kz/"}
    };

    return {
      home: function() {
        return  requestGet("lastnews");;
      }
    }

  }])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, DataService) {


    $scope.loginData = {};

    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modalLogin = modal;
    });

    $scope.closeLogin = function() {
      $scope.modalLogin.hide();
    };

    $scope.login = function() {
      $scope.modalLogin.show();
    };


    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };

    DataService.menu(function(result, status){
      if(status===true) $scope.menu = result;
    });

    $scope.goCategory = function(category_id) {
      $state.go("D.category",{categoryId:category_id});
    }
  })




  .controller('Home', function($scope, $state, $ionicLoading, Server, DataService) {

    $scope.post_id = false;
    $scope.post = false;
    $scope.data;
    DataService.home(0, function(data, status){
      if(status) $scope.data = data;
    });

    $scope.imgTh = function (post) {
      var t = new Date(1000*post["create_time"]);
      var path = "http://www.diapazon.kz/files/post/images/"+ t.getFullYear()+"-"+ S00(1+ t.getMonth())+"/thumb/" + post["img_name"];
      return path;
    }

    $scope.viewPost = function (id) {
      $scope.post = $scope.data.posts[id];
      $scope.post_id = id;
    }

    $scope.goPost = function (post_id) {
      $state.go("D.post",{postId:post_id});
    }

    $scope.FullDate = function(d) {
      var d = new Date(1000*d);
      return d.getDate() + "." + S00(1+ d.getMonth()) + "." + d.getFullYear() + " "+ d.getHours() + ":" + d.getMinutes();
    }

    $scope.appLoaded = true;
    window.setTimeout(function() {
      $scope.appLoaded = true;
    })

    $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };
    $scope.hide = function(){
      $ionicLoading.hide();
    };

    $scope.test = "";



    $scope.addScroll = function() {

      //if(!$scope.data) return;


      //console.log($scope.data);

      //DataService.home(0,$scope.data.posts.length, function(result){



      if($scope.data) {
        DataService.home(Object.keys($scope.data.posts).length, function(result){
          console.log(Object.keys($scope.data.posts).length);
          for(var i in result.posts) $scope.data.posts[i] = result.posts[i];
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      } else $scope.$broadcast('scroll.infiniteScrollComplete');



    };


  })


  .controller('Post', function($scope, $stateParams, Server) {

    $scope.post_id = $stateParams.postId;
    console.log("post_id = "+$scope.post_id);
  })

  .controller("Loader", function($scope, $state){
    $scope.appLoaded = false;
    window.setTimeout(function(){
      $scope.appLoaded = false;
      $state.go("D.home");
    }, 2000);

  })




.controller('NewListController', function($scope, $stateParams, DataService) {
    var service_name = "home";
    var request_param = {};
    var list_from = 0;
    $scope.error = false;
    $scope.posts = false;
    $scope.complite = false;
    var load_start = false;


    $scope.Load = function() {
      load_start = true;
      DataService.get(service_name, request_param, list_from, function(result, status){
        if(status) {
          $scope.error = false;
          if(list_from==0) $scope.posts = result.posts;  // Может быть изменено
          else {
            for(var post_id in result.posts) $scope.posts[post_id] = result.posts[post_id];
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
          list_from = Object.keys($scope.data.posts).length;
          if( result.complite ) $scope.complite = true;
        }
      });
      load_start = false;
    }

    $scope.nextNews = function() {
      if(load_start) return;
      $scope.Load();
    }

  })


  .controller('Category', function($scope, $stateParams, DataService){
    $scope.category_id = $stateParams.categoryId;

  })

;


