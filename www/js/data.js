var DataService = ['$http',function($http){

  var _limit = 5;
  var _base = "http://www.diapazon.kz/rest/";

  var current_service = {};

  var Cache = {
    data : {},
    date_update: {},
    exists: function(name) {

    }

  };
  var cache_exp = 1000 * 60;  // 1 минута

  var isCache = function(name) {

  };

  var get = function(service, params, from, callcack) {
    current_service[service] = callcack;
    if(angular.isNumber(from)) {
      params.LF = from;
      params.LI = _limit;
    }
    params["action"] = service;
    $http.get(_base,{params:params})
      .success(function(result){
        callcack(result, true);
      })
      .error(function(result){
        callcack(result, false);
      });
  };

  this.home = function(limit_from, call_back) {
    get("lastnews", {}, limit_from, call_back);
  };

  this.menu = function(call_back) {
    get("menu",{},null,call_back);
  };


}];


function obj2conv( o ) {
  var h = "";
  if(angular.isObject(o)) {
    for(var k in o) h+="["+k+"]="+obj2conv(o[k])+"   <br>";
    return h;
  }
  if(angular.isArray(o)) {
    for(var i=0;i< o.length;i++) h+= obj2conv(o[k])+",   <br>";
    return h;
  }
  return o;
}
