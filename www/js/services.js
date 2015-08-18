var appnService = angular.module('starter.services', [])

appnService.factory('LoginService', function($http, ApiEndpoint, $ionicPopup){

	return {
     GetUserDetails : function(data){
        return $http({
                method: "POST",
                url : ApiEndpoint.url + '/login',
                params : data,
            }).success(function(result) {
                //console.log("Auth.signin.success!")
                //console.log(result);
                //return result;
            }).error(function(d, status, headers, config) {
                console.log(status);
                showDailog($ionicPopup,"Please checkyour username and password");
        });

    },

    /*return {
        'GetUserDetails':GetUserDetails
    };*/
    RegisterUser : function(data){
    	$(".modal").show();
    	return $http({
                method: "POST",
                url : ApiEndpoint.url + '/register/user',
                params : data,
            }).success(function(result) {
                //console.log("Auth.signin.success!")
                console.log(result);
                //return result;
            }).error(function(d, status, headers, config) {
                
                //alert("Please checkyour username and password");
                showDailog($ionicPopup,"Unknown error, Please try again")
        });
    },

    ForgotPassword : function(email){
    	$(".modal").show();
    	return $http({
                method: "POST",
                url : ApiEndpoint.url + '/register/forgotPassword?email='+email,
               // params : data,
            }).success(function(result) {
                //console.log("Auth.signin.success!")
                console.log(result);
                //return result;
            }).error(function(d, status, headers, config) {
                
                console.log(d);
                showDailog($ionicPopup,"Unknown error, Please try again")
        });
    },
    GoogleUserlogin : function(token){
    	//alert(token);
    	return $http({
                method: "GET",
                url : ApiEndpoint.url + '/oauth/callback/google',
                params : {"access_token":token},
            }).success(function(response) {
            	//alert("came");
                console.log(response)
                //alert(JSON.stringify(response));
                //return result;
            }).error(function(d, status, headers, config) {
                $(".modal").hide();
                //alert("Please checkyour username and password");
                console.log(config)
                alert("Unknown error");
        });
     },

      FacebookUserlogin : function(tokenVal){
    	alert(tokenVal);
    	return $http({
                method: "GET",
                url : ApiEndpoint.url + '/oauth/callback/facebook',
                params : {"access_token":tokenVal},
            }).success(function(response) {
            	alert("came");
                console.log(response)
                //alert(JSON.stringify(response));
                //return result;
            }).error(function(d, status, headers, config) {
                $(".modal").hide();
                //alert("Please checkyour username and password");
                console.log(config);
                console.log("console  "+JSON.stringify(d));
                alert("Unknown error");
        });
     }
	

    
	};
});

appnService.factory('BrowseService', function($http,ApiEndpoint){

	var items = [];
	var observationDetails = [];
	var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var token = tokenvar1.userKey;
      var justCount = 0;
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
			//justCount++;
			console.log(data);
			//if(justCount)
			
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
		latitude:"11.93707847595214",
		longitude:"79.83552551269528"
	}

	var userSelectLoc = {
		latitude:"11.93707847595214",
		longitude:"79.83552551269528"
	}

	var detailedAdd = '';


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
	},
	SetUserSelectedLocation: function(data){
		//alert(data.G);
		userSelectLoc.latitude = data.G;
		userSelectLoc.longitude = data.K;
		return null;
	},
	GetUserSelectedLocation: function(){
		return userSelectLoc;
	},
	SetUserSelectedLocAdd: function(address){
		detailedAdd = address;
	},
	GetUserSelectedLocAdd: function(){
		return detailedAdd ;
	}
	};


});


appnService.factory('UserGroupService', function($http,ApiEndpoint){

	var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var token = tokenvar1.userKey;
      //alert(token);
      var userId = tokenvar1.userID;
      var appkey = "a4fbb540-0385-4fff-b5da-590ddb9e2552";
      //alert(userId);
      var userGroups;

	return {
		GetUserGroups: function(){
				return $http({
					method : "GET",
					url : ApiEndpoint.url + '/group/list',
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
							console.log("get usrgrp error")
			        		
			    });
		},
		JoinGroup: function(id){
			console.log(token);
			return $http({
					method : "GET",
					url : ApiEndpoint.url + '/group/'+ id +'/joinUs',
					headers : {
						"X-Auth-Token":token,
						"X-AppKey":appkey
					}
					//params : {"id":id}
				}).success(function(data) {
					console.log("joining success!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("joining error!")
							console.log(data);
				        		
			    });
		},
		SetUserJoinGroups: function(groups){

			userGroups = groups;
			return null;
		},
		GetUserJoinGroups: function(){
			return userGroups;
		}
	};

});

appnService.factory('NewObservationService', function($http,ApiEndpoint){

	  var tokenvar = localStorage.getItem('USER_KEY');
	  var tokenvar1 = JSON.parse(tokenvar);
	  var token = tokenvar1.userKey;
	  var userId = tokenvar1.userID;
	  //var id = tokenvar1.nId;
	  var appkey = "a4fbb540-0385-4fff-b5da-590ddb9e2552";//"fc9a88b5-fac9-4f01-bc12-70e148f40a7f";
	  var statusDetails = [];
	  var obsDetailVals = [];
	 

	  return {
	  	SubmitObservation: function(paramsData){
				return $http({
					method : "POST",
					url : ApiEndpoint.url + '/observation/save',
					headers : {
						"X-Auth-Token":token,
						"X-AppKey":appkey
					},
					params : paramsData
				}).success(function(data) {
					console.log("Obs submitted!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("submission error");
							console.log("data"+data);
							console.log("headers"+headers);
							console.log("config"+config);
							//SetStatus("FAILURE");
			        		
			    });
		},
		/*SetStatus: function(sName, cName, status, date, location, notes, imageArray){
			
			alert(id);
			if(id==0){
				id++;
				statusDetails.push({"id":id, "sciName":sName, "commonName":cName, "status":status, "date":date, "location":location, "notes":notes, "imgArr":imageArray});
				localStorage.setItem('StatusArray',JSON.stringify(statusDetails));
				return;
			} else{
				id++;
				alert("statusfun");
				var getStatusVal = 	localStorage.getItem('StatusArray');
				var parsed = JSON.parse(getStatusVal);
				alert(parsed);

				parsed.push({"id":id, "sciName":sName, "commonName":cName, "status":status, "date":date, "location":location, "notes":notes, "imgArr":imageArray});

				//getStatusVal.push({"id":id, "sciName":sName, "commonName":cName, "status":status, "date":date, "location":location, "notes":notes, "imgArr":imageArray});

				localStorage.setItem('StatusArray',JSON.stringify(parsed));
				return;
			}
			
			tokenvar1.nId = id;
			//statusDetails.push({"id":id, "sciName":sName, "commonName":cName, "status":status, "date":date, "location":location, "notes":notes, "imgArr":imageArray});
			//localStorage.setItem('StatusArray',JSON.stringify(statusDetails));
			
			localStorage.setItem('USER_KEY',JSON.stringify(tokenvar1));
			return null;
		},*/
		SetDetails: function(details){
			 statusDetails = details;
		},
		GetDetails: function(){
			return statusDetails;
		},
		SetEditObsDetails: function(obsDetails){
			//alert("editdetails");
			obsDetailVals = obsDetails;
		},
		GetEditObsDetails: function(){
			return obsDetailVals;
		},
		DeleteObservation: function(id){
			return $http({
					method : "POST",
					url : ApiEndpoint.url + '/observation/'+id+'/flagDeleted',
					headers : {
						"X-Auth-Token":token,
						"X-AppKey":appkey
					},
					params : paramsData
				}).success(function(data) {
					console.log("Obs deleted!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("submission error");
							console.log("data"+data);
							console.log("headers"+headers);
							console.log("config"+config);
							//SetStatus("FAILURE");
			        		
			    });
		},
		EditSubmitObservation: function(paramsData,id){
			alert(id);
			alert(JSON.stringify(paramsData));
			
				return $http({
					method : "PUT",
					url : ApiEndpoint.url + '/observation/'+id,
					headers : {
						"X-Auth-Token":token,
						"X-AppKey":appkey
					},
					params : paramsData
				}).success(function(data) {
					console.log("Obs submitted!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
			    	alert("edit error");
							console.log("submission error");
							console.log("data"+data);
							console.log("headers"+headers);
							console.log("config"+config);
							//SetStatus("FAILURE");
			        		
			    });
		}
	  };



});

 function showDailog($ionicPopup,message){

      $ionicPopup.alert({
          title: 'ERROR',
          content: message//'You must submit atleast one image'
        });
    }









