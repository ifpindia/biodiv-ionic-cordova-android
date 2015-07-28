var appnService = angular.module('starter.services', [])

appnService.factory('LoginService', function($http, ApiEndpoint){

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
                alert("Please checkyour username and password");
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
                //alert("Please checkyour username and password");
        });
    }

    /*return {
        'RegisterUser':RegisterUser
    };*/
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
			console.log(data);
			$(".modal").show();
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

	var userSelectLoc = {
		latitude:"11.93707847595214",
		longitude:"79.83552551269528"
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
	},
	SetUserSelectedLocation: function(data){
		console.log(data.A);
		userSelectLoc.latitude = data.A;
		userSelectLoc.longitude = data.F;
		return null;
	},
	GetUserSelectedLocation: function(){
		return userSelectLoc;
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
					headers : {"X-Auth-Token":token}
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



/*appnService.factory('FileService', function() {
  var images;
  var IMAGE_STORAGE_KEY = 'images';
 
  function getImages() {
    var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
    if (img) {
      images = JSON.parse(img);
    } else {
      images = [];
    }
    return images;
  };
 
  function addImage(img) {
    images.push(img);
    window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
  };
 
  return {
    storeImage: addImage,
    images: getImages
  }
})

appnService.factory('ImageService', function($cordovaCamera, FileService, $q, $cordovaFile) {
 
  function makeid() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 
    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
 
  function optionsForType(type) {
    var source;
    switch (type) {
      case 0:
        source = Camera.PictureSourceType.CAMERA;
        break;
      case 1:
        source = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }
    return {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: source,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };
  }
 
  function saveMedia(type) {
    return $q(function(resolve, reject) {
      var options = optionsForType(type);
 
      $cordovaCamera.getPicture(options).then(function(imageUrl) {
        var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
        var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
        var newName = makeid() + name;
        $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
          .then(function(info) {
            FileService.storeImage(newName);
            resolve();
          }, function(e) {
            reject();
          });
      });
    })
  }
  return {
    handleMediaDialog: saveMedia
  }
});*/








