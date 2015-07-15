var appnService = angular.module('starter.services', [])

appnService.factory('LoginService', function($http, ApiEndpoint){

    var GetUserDetails = function(data){
        return $http({
                method: "POST",
                url : ApiEndpoint.url + '/login',
                params : data,
            }).success(function(result) {
                console.log("Auth.signin.success!")
                console.log(result);
            }).error(function(d, status, headers, config) {
                console.log("Auth.signin.error!")
                console.log(d);
                console.log(status);
                console.log(headers);
                console.log(config);
        });

    }

    return {
        'GetUserDetails':GetUserDetails
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









