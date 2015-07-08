var appnService = angular.module('starter.services', [])

appnService.factory('LoginService', function($http,ApiEndpoint){
	var BASE_URL = "http://portal.wikwio.org/api/login";
	var items = [];
	var UsrName ;
	var password ;
	var headers = {
				'Access-Control-Allow-Origin' : '*',
				'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			};
	return {
		GetUserDetails: function(data){
				 UsrName =data.username;
				 password = data.password;
			/*return $http.post(BASE_URL+'?username='+UsrName+'&password='+password).then(function(response){
				items = response
				console.log(items);
				return items;
			});*/
	return $http({
				method: "POST",
				headers: headers,
				dataType: 'jsonp',
	      		url: ApiEndpoint.url+'/login',
				data: {"email":UsrName,"password":password}
	    }).success(function(result) {
					console.log("Auth.signin.success!")
					console.log(result);
	    }).error(function(data, status, headers, config) {
					console.log("Auth.signin.error!")
	        console.log(data);
	        console.log(status);
	        console.log(headers);
	        console.log(config);
	    });

		}
	};
});

appnService.factory('BrowseService', function($http){

	var items = [];
	return {
		GetBroseInfo: function(){
				
				return $http.get('js/data3.json').success(function(data) {
					console.log("Auth.signin.success!")
					
					 items = data;
					 //console.log(items);
					return items;
	    }).error(function(data, status, headers, config) {
					console.log("Auth.signin.error!")
	        console.log(data);
	        console.log(status);
	        console.log(headers);
	        console.log(config);
	    });
		}
	};
});
