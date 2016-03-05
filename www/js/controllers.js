function S00(d){
  var r = "00"+d;
  return new String( r.substr(r.length-2,2) );
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
        return  requestGet("lastnews");
      }
    }

  }])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, DataService) {
    $scope.error = false;
    $scope.error2 = false;
    $scope.test = false;

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

    //DataService.menu(function(result, status){
    //  if(status===true) $scope.menu = result;
    //  else {$scope.error = result; $scope.test = "Ошибка"; }
    //});

    $scope.headers = false;
    $scope.config = false;

    $scope.read = function() {

      var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Access-Control-Allow-Headers' : 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      //$http({method:"GET",url:"http://www.diapazon.kz/rest/t.json", headers: headers})
      $http({method:"GET",url:"http://www.diapazon.kz/rest/t.php", headers: headers})
        .success(function(data){
          $scope.dt = data;
        })
        .error(function(error, status, headers, config){
          $scope.error = error;
          $scope.headers = headers;
          $scope.config = config;
          alert("Ошибка");
        })
    };

    $scope.goCategory = function(category_id) {
      $state.go("D.category",{categoryId:category_id});
    }
  })




  .controller('Home', function($scope, $state, $ionicLoading, Server, DataService) {

    $scope.post_id = false;
    $scope.post = false;
    $scope.error = false;
    $scope.data = false;
    //DataService.home(0, function(result, status){
    //  if(status) $scope.data = result;
    //  else $scope.error = result;
    //});

    $scope.imgTh = function (post) {
      var t = new Date(1000*post["create_time"]);
      return "http://www.diapazon.kz/files/post/images/"+ t.getFullYear()+"-"+ S00(1+ t.getMonth())+"/thumb/" + post["img_name"];
    };

    $scope.viewPost = function (id) {
      $scope.post = $scope.data.posts[id];
      $scope.post_id = id;
    };

    $scope.goPost = function (post_id) {
      $state.go("D.post",{postId:post_id});
    };

    $scope.FullDate = function(d) {
      var date = new Date(1000*d);
      return new String(date.getDate() + "." + S00(1+ date.getMonth()) + "." + date.getFullYear() + " "+ date.getHours() + ":" + date.getMinutes());
    };

    $scope.appLoaded = true;
    window.setTimeout(function() {
      $scope.appLoaded = true;
    });

    $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };
    $scope.hide = function(){
      $ionicLoading.hide();
    };

    $scope.test = "";
    $scope.error = false;



    $scope.addScroll = function() {

      //if(!$scope.data) return;


      //console.log($scope.data);

      //DataService.home(0,$scope.data.posts.length, function(result){



      if($scope.data) {
        DataService.home(Object.keys($scope.data.posts).length, function(result, status){

          if(status) {
            for(var i in result.posts) $scope.data.posts[i] = result.posts[i];
          } else {
            $scope.error = result;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      } else $scope.$broadcast('scroll.infiniteScrollComplete');



    };


  })


  .controller('Post', function($scope, $stateParams) {

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
    $scope.error = "";
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
        } else {
          $scope.error = result;
        }
      });
      load_start = false;
    };

    $scope.nextNews = function() {
      if(load_start) return;
      $scope.Load();
    }

  })


  .controller('Category', function($scope, $stateParams, DataService){
    $scope.category_id = $stateParams.categoryId;

  })

;
