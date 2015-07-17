var appnService = angular.module('starter.services', [])

appnService.factory('LoginService', function($http, ApiEndpoint){

    var GetUserDetails = function(data){
        return $http({
                method: "POST",
                url : ApiEndpoint.url + '/login',
                params : data,
            }).success(function(result) {
                //console.log("Auth.signin.success!")
                //console.log(result);
                //return result;
            }).error(function(d, status, headers, config) {
                
                alert("Please checkyour username and password");
        });

    }

    return {
        'GetUserDetails':GetUserDetails
    };
});

appnService.factory('BrowseService', function($http,ApiEndpoint){

	var items = [];
	var observationDetails = [];
	var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var token = tokenvar1.userKey;
	return {
		GetBrowseInfo: function(){
				return $http({
					method : "GET",
					url : ApiEndpoint.url + '/speciesGroup/list',
					headers : {"X-Auth-Token":token},

				}).success(function(data) {
					console.log("Auth.signin.success!")
					
					 items = data;
					 console.log(items);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("Auth.signin.error!")
			        		
			    });
		},
		getGroupVal: function(){
			console.log(items);
			return items;
		},
		GetBrowseList: function(data){
			return $http({
					method : "GET",
					url : ApiEndpoint.url + '/observation/list',
					headers : {"X-Auth-Token":token},
					params : data,
				}).success(function(data) {
					console.log("Auth.signin.success!")
					
					 //items = data;
					 //console.log(items);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("Auth.signin.error!")
			        		
			    });
		},
		setObsList: function(ListData){

					observationDetails = observationDetails.concat(ListData);
					console.log(observationDetails);
					return null;

		},
		getObsList: function(){
			return observationDetails;
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
	},
	getCurrentLocation: function(){
		return currentLocation;
	}
	};


});


appnService.factory('UserGroupService', function($http,ApiEndpoint){

	var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var token = tokenvar1.userKey;
      //alert(token);
      var userId = tokenvar1.userID;
      //alert(userId);

	return {
		GetUserGroups: function(){
				return $http({
					method : "GET",
					url : ApiEndpoint.url + '/group',
					headers : {
						"X-Auth-Token":token
					},
					param : {"max":50,"format":"json"}
				}).success(function(data) {
					console.log("Auth.signin.success!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("Auth.signin.error!")
			        		
			    });
		},
		GetJoinedGroups: function(){
			return $http({
					method : "GET",
					url : ApiEndpoint.url + '/userGroup/getUserUserGroups',
					headers : {"X-Auth-Token":token},
					params : {"limit":50,"id":parseInt(userId)}
				}).success(function(data) {
					console.log("Auth.signin.success!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("Auth.signin.error!")
			        		
			    });
		}
	};

});








