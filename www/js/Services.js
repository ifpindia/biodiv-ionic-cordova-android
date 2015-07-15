var appnService = angular.module('starter.services', [])

appnService.factory('LoginService', function($http,ApiEndpoint){
	//var BASE_URL = "http://indiabiodiversity.org/api/login";
	var items = [];
	var UsrName ;
	var password ;
	var headers = {
				/*'Access-Control-Allow-Origin' : '*',
				'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
				'Content-Type': 'application/json',
				'Accept': 'application/json'*/
				'Access-Control-Allow-Headers': 'X-ACCESS_TOKEN, Access-Control-Allow-Origin, Authorization, Origin, x-requested-with, Content-Type, Content-Range, Content-Disposition, Content-Description',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
				'Access-Control-Allow-Origin': '*'
			};
			var xsrf;
	return {
		GetUserDetails: function(data){
				 UsrName =data.username;
				 password = data.password;
				 console.log(UsrName,password);
				 xsrf = $.param({"username":UsrName,"password":password});
			
	return $http.post(ApiEndpoint.url+"/login",xsrf//{
				//method: "POST",
				 /*url: BASE_URL,
				 headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				 transformRequest: function(obj) {
							        var str = [];
							        for(var p in obj)
							        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
							        return str.join("&");
							    },
				//dataType: 'json',
	      		
				data:xsrf// $.param({username:"yeruvakarthik@gmail.com",password:"karthik.yeruva1"})*/
	    //}
	    ).success(function(result) {
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

appnService.factory('LocationService', function($q){

	var currentLocation = {
		latitude:"",
		longitude:""
	}

	return {
		GetLocation : function(){
				var d = $q.defer();
				//console.log(d);
			navigator.geolocation.getCurrentPosition(function (pos) {
            currentLocation.latitude = pos.coords.latitude;
            currentLocation.longitude = pos.coords.longitude;
            d.resolve(currentLocation);
        });
        return d.promise
	}
	};


});









