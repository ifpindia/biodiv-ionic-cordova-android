var appne = angular.module('starter.controllers', [])

appne.controller('AppCtrl', function($scope, $state,$ionicModal, $ionicSideMenuDelegate, $timeout,LoginService,$ionicPopup,$cordovaToast) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  //localStorage.removeItem('USER_KEY');
  $ionicSideMenuDelegate.canDragContent(false);
  if(localStorage.getItem('USER_KEY')!== null){

    $state.go("app.home");
  }


  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  /*$scope.closeLogin = function() {
    $scope.modal.hide();
  };*/

  // Open the login modal
  
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var check =internetCheck($ionicPopup);
    if(check == false){
      return;
    }
    /*var check = {"check1":"hi"}
    localStorage.setItem("checking",JSON.stringify(check));*/
    //console.log('Doing login', $scope.loginData);
    //localStorage.removeItem('USER_KEY');
    LoginService.GetUserDetails($scope.loginData).then(function(vals){

      console.log('Doing login', vals);

      var uservar = {"userKey":vals["data"]['model']['token'],"userID":vals["data"]['model']['id'],"nId":0};
       localStorage.setItem('USER_KEY',JSON.stringify(uservar));
        $state.go("app.home");
      /*var laboo = localStorage.getItem('checking');
      var taboo = JSON.parse(laboo);
      alert(taboo.check1);*/
      //$scope.userDetails = vals;
      //console.log('Doing login', vals["data"]['model']['token']);

      });

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
   
    $timeout(function() {
      //$scope.closeLogin();
    }, 1000);
  };
  $scope.forgotPassword = function() {
    $ionicPopup.prompt({
    title: 'Forgot Password ?:',
    subTitle: 'Password will be sent to this email id',
    inputType: 'text',
    inputPlaceholder: 'Email'
  }).then(function(email) {
   //console.log('Your password is', res);
   if(!validateEmail(email)){
        //alert("Invalid email");
       showToast($cordovaToast,"Please enter a valid Email")
        return ;
      }
 LoginService.ForgotPassword(email).then(function(res){

          console.log(res);
          $(".modal").hide();
          showToast($cordovaToast,res.data.msg);
       });

 });
    
  }
})


function showToast($cordovaToast,message) {
  $cordovaToast.show(message, "long", "bottom").then(function(success) {
            console.log("The toast was shown");
        }, function (error) {
            console.log("The toast was not shown due to " + error);
        });
        //else $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
    }

appne.controller('NewUserCtrl', function($scope,LoginService,$cordovaToast){

  $scope.register = {
    name:"",
    email:"",
    password:"",
    password2:""
  };

   $scope.doRegister = function() {

      var name = $scope.register.name;
      var email = $scope.register.email;
      var password = $scope.register.password;
      $scope.register.password2 = password;
      console.log(email);
          if(name.length == 0){
            showToast($cordovaToast,"name cannot be empty");
            return ;
          }
          //console.log(validateEmail(email));
          if(!validateEmail(email)){
            showToast($cordovaToast,"Invalid email");
            return ;
          }
          if(password.length <5){
            showToast($cordovaToast,"password length has to be 5 characters");
            return ;
          }

          //console.log(LoginService);

       LoginService.RegisterUser($scope.register).then(function(vals){

          console.log(vals);
          $(".modal").hide();
          showToast($cordovaToast,vals.data.msg);
       });

          //$(".modal").show();
   }

   
});

function validateEmail(email) { 
  // http://stackoverflow.com/a/46181/11236
  
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


appne.controller('LogoutController', function($scope,$state,$window,$ionicPopup) {

//alert("hello");
   $scope.logout = function(){
        console.log("logout");
        internetCheck($ionicPopup);
        localStorage.removeItem('USER_KEY');
        localStorage.removeItem('StatusArray');
         $state.go("login");
         //$window.location.reload(true)
      } 
     
});
appne.controller('observationStatusController', function($scope, NewObservationService){

  alert(localStorage.getItem('StatusArray'));

  if(localStorage.getItem('StatusArray')== null){

        $("div #obsStatusMsg").show();

  }else {
    //$route.reload();
    alert("statuscntrl");
      var status = localStorage.getItem('StatusArray');
      var statusArray1 = JSON.parse(status);

      console.log(statusArray1);
      $scope.details = statusArray1;
      
      $("div #obsStatusList").show();

  }
});
appne.controller('statusDetailsController', function($scope,$location) {
  
  console.log("statusDetailsController");

    $scope.singleObsDetails = [];
    $scope.singleImgDetails = [];
      var obsId = $location.path().split("/")[3];
      alert(obsId);
      var status = localStorage.getItem('StatusArray');
      var statusArray1 = JSON.parse(status);

      for(var i=0; i<Object.keys(statusArray1).length;i++){
        if(statusArray1[i]['id'] == obsId){
          $scope.singleObsDetails.push({"id":statusArray1[i]['id'],"scientificName":statusArray1[i]['sciName'],"CommonName":statusArray1[i]['commonName'],"observed":statusArray1[i]['date'],"updated":statusArray1[i]['date'],"submitted":statusArray1[i]['date'],"author":'',"place":statusArray1[i]['location'], "imgDetails":statusArray1[i]['imgArr'], "notes":statusArray1[i]['notes']});
          $scope.singleImgDetails.push([{"image":{"icon":statusArray1[i]['imgArr']}}])
        }
      }


//console.log(typeof(newUrl.split("/")[3]));
//console.log(obsId);


  
    //console.log(imgDetails);
})
appne.controller('BrowseDetailsCtrl', function($scope,$location,BrowseService) {
  
  console.log("BrowseDetailsCtrl");


var obsId = $location.path().split("/")[3];

//console.log(typeof(newUrl.split("/")[3]));
//console.log(obsId);

$scope.obsDetails=BrowseService.getObsList()

//console.log($scope.obsDetails);
browsingArray($scope,$scope.obsDetails,obsId)

  
    //console.log(imgDetails);
})

function browsingArray($scope,obsDetails,obsId){

  var updated ,submited, observed, commonname, sciName, id, notes, author ;


  $scope.insertDetails = [];
  var imgDetails=[];
  //console.log(obsDetails);
  for(i=0;i<obsDetails.length;i++){
    if(obsDetails[i].maxVotedReco.hasOwnProperty('commonNamesRecoList')){
            commonname = obsDetails[i].maxVotedReco.commonNamesRecoList[0].name;
        }else {
          commonname="";
        }

        if(obsDetails[i].maxVotedReco.hasOwnProperty('sciNameReco')){
                sciName = obsDetails[i].maxVotedReco.sciNameReco.name;

          }
      
    else{
      sciName="Unknown";
      commonname="";
      }
      id=obsDetails[i].id;
      
      imgDetails[id] ={};
      for(var j=0;j<obsDetails[i].resource.length;j++){
        //console.log(obsDetails[i].resource[j]);
        
        imgDetails[id][j]=obsDetails[i].resource[j];

      }
      
      //console.log(imgDetails);
      var updated1 = new Date(obsDetails[i].lastRevised.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      var updated2 = updated1.toString();
       updated = updated2.slice(4,15);
       //console.log(updated);
      var submited1 = new Date(obsDetails[i].createdOn.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      var submited2 = updated1.toString();
       submited = updated2.slice(4,15);
      var observed1 = new Date(obsDetails[i].fromDate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      var observed2 = updated1.toString();
       observed = updated2.slice(4,15);
      notes =  obsDetails[i].notes;
      author = obsDetails[i].author.name;
      place = obsDetails[i].reverseGeocodedName;
          $scope.insertDetails.push({"id":id,"scientificName":sciName,"CommonName":commonname,"observed":observed,"updated":updated,"submitted":submited,"author":author,"place":place, "imgDetails":imgDetails, "notes":notes});

    }



    for(var y=0;y<$scope.insertDetails.length;y++){

      if($scope.insertDetails[y].id==obsId){
        $scope.singleObsDetails = [];
        $scope.singleImgDetails = [];
        
        $scope.singleObsDetails.push({"id":$scope.insertDetails[y].id,"scientificName":$scope.insertDetails[y].scientificName,"CommonName":$scope.insertDetails[y].CommonName,"observed":$scope.insertDetails[y].observed,"updated":$scope.insertDetails[y].updated,"submitted":$scope.insertDetails[y].submitted,"author":$scope.insertDetails[y].author,"place":$scope.insertDetails[y].place, "imgDetails":$scope.insertDetails[y].imgDetails[$scope.insertDetails[y].id], "notes":$scope.insertDetails[y].notes});
        console.log($scope.singleObsDetails);
        if($scope.singleObsDetails[0]["notes"].length>0){
          $scope.visible=false;
        }else{
          $scope.visible=true;
        }
        $scope.singleImgDetails.push({"image":$scope.insertDetails[y].imgDetails[$scope.insertDetails[y].id]});
        break;
      }
    }
   
}



appne.controller('NewObservationCtrl', function($scope,$state,$http,$cordovaCamera,LocationService,$ionicPopup,$cordovaDevice, $cordovaFile, $ionicPlatform,  $ionicActionSheet, $filter, $cordovaFileTransfer, ApiEndpoint, UserGroupService, NewObservationService) {
    
    //alert("hello");
    $scope.newobs ={
      sciName    :'',
      commonName :'',
      notes : '',
      boxVal : false
    };
    $scope.submitObsParams = {};
    $scope.imgURI =[];
    $(function () {
      $('#check').change(function () {
          $(".check1").toggle(this.checked);
      });
  });

     $(function () {
      $('#dateSight').change(function () {
          //alert($scope.newobs.date);
        $scope.date = $filter('date')( $scope.newobs.date );
        console.log($scope.date);
        var currentDate = getDatetime();
        //console.log(currentDate);
        if(Date.parse($scope.date) > Date.parse(currentDate)){
           showDailog("Please slect a valid date");
           return;
        }else {
          $scope.newobs.date = $filter('date')( $scope.newobs.date,"dd/MM/yyyy" );
        }
        console.log($scope.newobs.date)
      });
  });

     
  function getDatetime() {
  var currentDate = $filter('date')(new Date);
  //console.log($filter('date')(new Date));
  return currentDate;
};

  $scope.submitNewObs = function(){
    //console.log(document.getElementById("check").checked);
    console.log("newobs");
    console.log($scope.newobs);
    console.log($scope.newobs.boxVal);
    //var date = $filter('date')( $scope.newobs.date );
    console.log($('#Locationval').text());
    console.log(typeof($('#Locationval').text()));
    validation();
  }

    function validation(){

      //if($scope.newobs)

      if($scope.imgURI.length == 0){
        showDailog("You must submit atleast one image");
        return;
      }
      if($scope.newobs.date == null){
        showDailog("You must enter date");
        return;
      }
      if($scope.newobs.boxVal == false){
        //console.log($scope.newobs['sciName'].length());
        if($scope.newobs['sciName'].length==0 && $scope.newobs['commonName'].length==0){
          showDailog("Please enter all fields");
          return;
        }
      }
      console.log($('#Locationval').text());
      $scope.locationAddress = $('#Locationval').text();
      if($scope.locationAddress == 'Location'){
        var confirmPopup = $ionicPopup.confirm({
           title: 'Location',
           template: 'you didnt entered Location. Default location will be taken'
         });
         confirmPopup.then(function(res) {
           if(res) {
            $scope.locationAddress = "Lally Tollendal Street, White Town, Puducherry, Puducherry 605002, India"; 
            $('#Locationval').text($scope.locationAddress);
            var loc = {'G':11.93707847595214 , 'K':79.83552551269528}
            LocationService.SetUserSelectedLocation(loc);
            executeRequest();
           } else {
             console.log('You are not sure');
             return;
           }
         });
      }else {
        executeRequest();
      }
      
      
    }

    function executeRequest(){

      var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var token = tokenvar1.userKey;
      var appkey = "a4fbb540-0385-4fff-b5da-590ddb9e2552";//"fc9a88b5-fac9-4f01-bc12-70e148f40a7f";
      $scope.count =0;
      $scope.newImageStr = [];
      console.log($scope.newobs);
       var options = new FileUploadOptions();
       /*{
            fileKey: "resources",
            fileName: imageLink.substr(imageLink.lastIndexOf('/')+1),
            chunkedMode: false,
            mimeType: "image/*",
            httpMethod:"POST",
            headers: {
            "X-Auth-Token":token,
            "X-AppKey":appkey
          }

        };*/
        for(var i = 0;i < $scope.imgURI.length; i++){
          var imageLink = $scope.imgURI[i] ;
            options.fileKey = "resources",
            options.fileName = imageLink.substr(imageLink.lastIndexOf('/')+1),
            options.chunkedMode = false,
            options.mimeType = "image/jpg",
            options.httpMethod = "POST",
            options.headers =  {
            "X-Auth-Token":token,
            "X-AppKey":appkey
          }

          var ft = new FileTransfer();
          var uri = encodeURI(ApiEndpoint.url+"/observation/upload_resource?resType=species.participation.Observation");
          
          //alert("file");
          ft.upload(imageLink, uri, win, fail, options);
        }

      }

          function win(data){
            //alert(response);
            //alert(JSON.stringify(response));
            //var val = JSON.stringify(response);
            //alert(data.response);
            //alert(data.response[0]);
            //console.log(data.response);
            var parsedData = JSON.parse(data.response);
            //alert(dat["model"]["observations"]["resources"]);
            //alert(parsedData["model"]);
            //alert(val.response["model"]["observations"]["resources"])
             //alert(jArray);
             

             var jArray = [];
             jArray = parsedData["model"]["observations"]["resources"];
             //alert(jArray[0]);

             if(jArray!=null && jArray.length>0){
                for(var i=0; i<jArray.length; i++){

                  $scope.newImageStr.push(jArray[i]["fileName"]);

                }
              $scope.count++;
             }

             //alert($scope.count);

             if($scope.count == $scope.imgURI.length){
              alert("parse");
              console.log("win parsing "+ $scope.count +" called parse resource");
              console.log(Object.keys($scope.newImageStr).length);
              parseResourceDetails();
             }
          }
          function fail(err){
            alert(err);
            statusCheck();
            console.log("error:fail " + JSON.stringify(err));
          }
          

          function parseResourceDetails(){
            var count1 = 0;
            console.log("newImgstr" + Object.keys($scope.newImageStr).length);
            alert(Object.keys($scope.newImageStr).length);
            for(var i=0; i<Object.keys($scope.newImageStr).length; i++){
              //alert()
              count1++;
              $scope.submitObsParams["file_"+(i+1)] = $scope.newImageStr[i];
              $scope.submitObsParams["type_"+(i+1)] = "IMAGE";
              $scope.submitObsParams["license_"+(i+1)] = "CC_BY";
              
              if(count1 == Object.keys($scope.newImageStr).length){
                alert("entered");
                submitObservationFinally();
              }
            }
            //console.log($scope.submitObsParams);
            
          }

          function statusCheck(){
            var sciName;
            var commonName;
            var obsNotes;
            if($scope.newobs['sciName'].length>0){
               sciName = $scope.newobs['sciName'];
            } else {
              sciName = "Unkown";
            }
            if($scope.newobs['commonName'].length>0){
               commonName = $scope.newobs['commonName'];
            } else {
              commonName = "";
            }
            if($scope.newobs['notes'].length>0){
               obsNotes = $scope.newobs['notes'];
            } else {
              obsNotes = "";
            }


            NewObservationService.SetStatus(sciName, commonName, "FAILURE", $scope.newobs.date, $scope.locationAddress, obsNotes, $scope.imgURI);
             
          }

          function submitObservationFinally(){
            var sciName1, commonName1;
            var uLatLong = LocationService.GetUserSelectedLocation();
            console.log("SUBMIT USER"+uLatLong.latitude+" SUBMI "+uLatLong.longitude)
            $scope.submitObsParams['group_id'] =  829;//9;
            $scope.submitObsParams['habitat_id'] = 267835; //1;
            $scope.submitObsParams['fromDate'] = $scope.newobs.date;
            $scope.submitObsParams['placeName'] = $scope.locationAddress;
            $scope.submitObsParams['areas'] =  "POINT("+uLatLong.longitude+" "+uLatLong.latitude+")"
            $scope.submitObsParams['notes'] = $scope.newobs.notes;
          
            if($scope.newobs['sciName'].length>0){
              $scope.submitObsParams['recoName'] = $scope.newobs['sciName'];
            }
            if($scope.newobs['commonName'].length>0){
              $scope.submitObsParams['commonName'] = $scope.newobs['commonName'];
            }
            $scope.submitObsParams['resourceListType'] = "ofObv" ;
            $scope.submitObsParams['agreeTerms'] = "on";
            if($scope.userGroupId !=null && $scope.userGroupId.length>0) {
              $scope.submitObsParams['userGroupsList'] = $scope.userGroupId
            }
            console.log($scope.submitObsParams);
            NewObservationService.SubmitObservation($scope.submitObsParams).then(function(obsResponse){
              
              alert("success" + obsResponse.data.success);
              if(obsResponse.data.success == false){

               statusCheck();
              }
              console.log(obsResponse);
            },
            function(err){
              alert("Nosuccess");
              console.log(err);
               statusCheck();
            });

          }

       /*$cordovaFileTransfer.upload(ApiEndpoint.url+"/observation/upload_resource?resType=species.participation.Observation", imageLink, options).then(function(result) {
            console.log("SUCCESS: " + result);
            console.log(result.status);
            consoe.log(result.observations.fileName)
            $scope.resourseResponse = result ;
        }, function(err) {
            console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
            // constant progress updates
        });*/

    //}
    function showDailog(message){

      $ionicPopup.alert({
          title: 'ERROR',
          content: message//'You must submit atleast one image'
        });
    }


    $scope.userGroup = function(){
      //alert("hhh");
      $scope.usrGrp =[]

      var groups = UserGroupService.GetUserJoinGroups()
      console.log(groups);
      var instanceList = groups['data']['model']['observations'];
      if(instanceList.length>0){
        for(var i=0; i<instanceList.length; i++){
          $scope.usrGrp.push({"id":instanceList[i].id,"name":instanceList[i].title})
        }
        console.log($scope.usrGrp);
         $scope.listPopup = $ionicPopup.show({
         template: '<ion-list>                                '+
                   '  <ion-item id="uGroup{{usrgrps.id}}" ng-repeat="usrgrps in usrGrp " ng-click="uploadTo({{usrgrps.id}});" > '+
                   '    {{usrgrps.name}}                             '+
                   '  </ion-item>                             '+
                   '</ion-list>                               ',
         
         title: 'Choose Option',
         scope: $scope,
         buttons: [
           { text: 'Ok' },
         ]
       });   

      } else {
       var lispop = $ionicPopup.alert({
                title: 'Success',
                content: 'Join atleast one user groups'
              });
            
      }
      
    }

    $scope.userGroupId =[];
    
    $scope.uploadTo = function(id){
      var addToArray = true;
      $scope.listPopup.close();

      //$('#uGroup'+id).addClass("addActive");

      for(var i=0;i<$scope.userGroupId.length;i++){
        if($scope.userGroupId[i] == id){
          var index = $scope.userGroupId.indexOf(id);
          if (index > -1) {
              $scope.userGroupId.splice(index, 1);
          }
          addToArray = false;
          
        }
      }
      if(addToArray){
        $scope.userGroupId.push(id);
      }
       $('#uGroupText').text($scope.userGroupId.length)
      console.log($scope.userGroupId);
    }

  $scope.addMedia = function() {

    if($scope.imgURI.length == 5){
      showDailog("Maximum Images reached");
      return;
    }
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take photo' },
        { text: 'Photo from library' }
      ],
      titleText: 'Add images',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        $scope.addImage(index);
      }
    });
  }
 
  $scope.addImage = function(type) {
    var z=1;
    $scope.hideSheet();
    //ImageService.handleMediaDialog(type).then(function() {
     // $scope.$apply();
    //});
    var source;
    var val;

  switch (type) {
      case 0:
        source = Camera.PictureSourceType.CAMERA;
        val = true;

        break;
      case 1:
        source = Camera.PictureSourceType.PHOTOLIBRARY;
        val = false;
        break;
    }
if(z==1){
   //$("#imgContent").append('<ion-scroll direction="x" style="height:200px; min-height: 200px; overflow: scroll; white-space: nowrap;"><img ng-repeat="images in imgURI" ng-show="imgURI !== undefined"  ng-src="{{images}}" style="height:200px; padding: 5px 5px 5px 5px;"/></ion-scroll>');
   z++;
}

var options = {
    destinationType: Camera.DestinationType.FILE_URI,
      sourceType: source,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: val
  };

  console.log(options);
  $cordovaCamera.getPicture(options).then(function(imageUrl) {
      $("#imgContent").show();
     // var link =  "data:image/jpeg;base64," +imageUrl;
      var link = imageUrl;
      $scope.imgURI.push(link);
      console.log($scope.imgURI);
      //console.log($scope.imageLink);
  }, function(err) {
            // An error occured. Show a message to the user
      });

}

var data = LocationService.getCurrentLocation()//.then(function(data){
    console.log(data);
      var code="https://maps.googleapis.com/maps/api/geocode/json?latlng="+data.latitude+","+data.longitude;
      var loc = {'G':data.latitude , 'K':data.longitude};
            LocationService.SetUserSelectedLocation(loc);
      $http.get(code).success(function(dataval){
            //console.log(dataval.results[0]);
            $("#Locationval").text(dataval.results[0]["formatted_address"]);

          });
   

});




appne.controller('newobs2', function($scope, $state, LocationService) {

  //alert("hi");
  });

appne.controller('GPSController', function($scope, $state,$http, LocationService) {

//alert($location.path());
 var myLatlng = new google.maps.LatLng(11.9384867, 79.8352657);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.mapval = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
          console.log($scope.mapval);
          

            /*map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
              //map.setOptions({draggable: true});
              var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location",
                draggable:true
            });
              
              myLocation.bindTo('position',map,'center');*/
              changeMarker()
        });

        
        function changeMarker(){
          $('<div/>').addClass('centerMarker').appendTo(map.getDiv())
          var mp = $('.centerMarker');
          mp.data('win',new google.maps.InfoWindow({content:'this is the center'}));
          mp.data('win').bindTo('position',map,'center');
          //console.log(loc);
          google.maps.event.addListener(mp.data('win'), 'position_changed', function(){
              //console.log('Current Latitude:',evt.latLng.lat(),'Current Longitude:',evt.latLng.lng());
              console.log(mp.data('win').getPosition());
              var locations = mp.data('win').getPosition();

              LocationService.SetUserSelectedLocation(locations);

              updating("texttop");
              });
        }

 
        $scope.doSomething = function(){
          //console.log($('#Locationval').html());
          updating("Locationval");
          
          $state.go("app.newObservation");
        }

        function updating(id){
          var data = LocationService.GetUserSelectedLocation()//.then(function(data){
          console.log(data);
      var code="https://maps.googleapis.com/maps/api/geocode/json?latlng="+data.latitude+","+data.longitude;
      
      $http.get(code).success(function(dataval){
            //console.log(dataval.results[0]);
            $("#"+id).text(dataval.results[0]["formatted_address"])
          });
        }

});






appne.controller('HomeController',[ '$scope', '$http', 'BrowseService','LocationService', '$ionicSideMenuDelegate','UserGroupService', function($scope,$http,BrowseService,LocationService,$ionicSideMenuDelegate, UserGroupService){
  
//$ionicSideMenuDelegate.canDragContent(true);
console.log($ionicSideMenuDelegate);
  LocationService.GetLocation().then(function(data){
  console.log(data);
  });
  
BrowseService.GetBrowseInfo().then(function(speciesGroup){

  console.log(speciesGroup);

} );

UserGroupService.GetJoinedGroups().then(function(groups){

  console.log(groups['data']['model']);
  UserGroupService.SetUserJoinGroups(groups);
});


}]);

appne.controller('MyCollectionCtrl',[ '$scope', '$http', 'BrowseService','LocationService', '$ionicPopup', function($scope,$http,BrowseService,LocationService,$ionicPopup){

//console.log($("#myCollectionMsg").html());


internetCheck($ionicPopup);
$scope.details = [];
  $scope.innerDetails = [];

var tokenvar = localStorage.getItem('USER_KEY');
var tokenvar1 = JSON.parse(tokenvar);
var userid = tokenvar1.userID;

$scope.listParams = {
  "offset": 0,
  "user": userid
}

BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

  //alert(obsList["data"]["model"]["observationInstanceList"].length);
  if(obsList["data"]["model"]["observationInstanceList"].length > 0){
    $("div #myCollectionList").show();
    arrayData($scope,obsList["data"]["model"]["observationInstanceList"],1,BrowseService);
  } else {
    $("div #myCollectionMsg").show();
  }
} );

$scope.loadMore = function() {
    $scope.noMoreItemsAvailable = false;

    $scope.listParams.offset = $scope.listParams.offset + 24;
    


    BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

      console.log(obsList);
      arrayData($scope,obsList["data"]["model"]["observationInstanceList"],2,BrowseService);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    } );

   
    
  };

}]);

appne.controller('ListController',[ '$scope', '$http', 'BrowseService', '$ionicPopup', function($scope,$http,BrowseService,$ionicPopup){
  internetCheck($ionicPopup);
  console.log("hi");
  $scope.details = [];
  $scope.innerDetails = [];
  

$scope.listParams = {
  offset:0,
  type:"nearBy",
  maxRadius:50000
}

BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

  console.log("hel");
  arrayData($scope,obsList["data"]["model"]["observationInstanceList"],1,BrowseService);
} );

  $scope.loadMore = function() {
   // alert("hi");
    $scope.noMoreItemsAvailable = false;

    $scope.listParams.offset = $scope.listParams.offset + 24;
    


    BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

      console.log(obsList);
      arrayData($scope,obsList["data"]["model"]["observationInstanceList"],2,BrowseService);
     $scope.$broadcast('scroll.infiniteScrollComplete');
    } );

    //$scope.$broadcast('scroll.infiniteScrollComplete');
    /*$http.get('js/data.json').success(function(data) {
      //console.log(data.observationInstanceList);
      arrayData($scope,data.observationInstanceList,2);
      
      //$scope.$digest();
//$timeout(function() {
  $scope.$broadcast('scroll.infiniteScrollComplete');
//});
    });*/
  };


 
}]);

appne.controller('ObsNearByCtrl', [ '$scope', '$http', 'BrowseService','LocationService', '$ionicPopup',function($scope,$http,BrowseService,LocationService,$ionicPopup){

internetCheck($ionicPopup);
 $scope.details = [];
  $scope.innerDetails = [];



$scope.listParams = {
  "offset":0,
  "type":"nearBy",
  "maxRadius":50000,
  "long":'',
  "lat":''
}
var location = LocationService.getCurrentLocation();

$scope.listParams["long"] = location["longitude"];
$scope.listParams["lat"] = location["latitude"];


BrowseService.GetBrowseList($scope.listParams).then(function(obsList){
  console.log("hel");
  arrayData($scope,obsList["data"]["model"]["observationInstanceList"],1,BrowseService);
} );

  $scope.loadMore = function() {

    $scope.listParams.offset = $scope.listParams.offset + 24;
    
    BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

      console.log(obsList);
      arrayData($scope,obsList["data"]["model"]["observationInstanceList"],2,BrowseService);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    } );


    
  };
  
}]);


appne.controller('JoinGroupCtrl',[ '$scope', '$http','$compile','UserGroupService', '$ionicPopup', function($scope,$http,$compile,UserGroupService,$ionicPopup){
  console.log("jgroup");

internetCheck($ionicPopup);
  /*$http.get('js/userGroup.json').success(function(data){
    //$scope.artists = data;
    //console.log($scope.artists.observationInstanceList );
    userGroupData($scope,data.userGroupInstanceList);
    
  });*/
console.log($(".button").html());
//$("div .hell").hide()
UserGroupService.GetUserGroups().then(function(groups){
//var groups = UserGroupService.GetUserJoinGroups()
  console.log(groups['data']['model']);
  userGroupData($scope,groups['data']['model'].userGroupInstanceList,UserGroupService);
});
   /*$http.get('js/joinedGroup.json').success(function(data){
    //$scope.artists = data;
    console.log(data.observations );
    checkGroup($scope,data.observations);
    
  });*/

  /*UserGroupService.GetJoinedGroups().then(function(userGroups){

  console.log(userGroups);
  console.log($("#button1 ").html());
  checkGroup($scope,userGroups['data']['model'].observations);
  //userGroupData($scope,groups['data']['model'].userGroupInstanceList);
});*/
  $scope.join = function(id,name){

    console.log(id,name);
    console.log(UserGroupService);
    if (confirm("Do you really want to join in "+name) == true) {

       UserGroupService.JoinGroup(id).then(function(groups){

        console.log(groups);
        $("#button"+id).hide();
        $("#joinedicon"+id).addClass("icon ion-checkmark-round");

      });
    } else {
        
    }
  }

}]);


function arrayData($scope,observationInstanceList,num,BrowseService){

BrowseService.setObsList(observationInstanceList);
  console.log("hi");
  //var arr = [];
  var sciName;
  var iconUrl;
  var commonname;
  var id;
  $scope.arr=[];

  for(i=0;i<observationInstanceList.length;i++){

    if(Object.keys(observationInstanceList[i].maxVotedReco).length >0){

      if(observationInstanceList[i].maxVotedReco.hasOwnProperty('commonNamesRecoList')){
            commonname = observationInstanceList[i].maxVotedReco.commonNamesRecoList[0]["name"];
        }else {
          commonname="";
        }

        if(observationInstanceList[i].maxVotedReco.hasOwnProperty('sciNameReco')){
                sciName = observationInstanceList[i].maxVotedReco.sciNameReco.name;

          } 
      
    }else{
      sciName="Unknown";
      commonname="";
    }
    iconUrl=observationInstanceList[i].thumbnail;
    id=observationInstanceList[i].id;
    //alert(sciName);
    if(num==1){
    $scope.details.push({"id":id,"iconUrl":iconUrl,"scientificName":sciName,"CommonName":commonname});
    //$scope.details = arr;
    }else{
      $scope.arr.push({"id":id,"iconUrl":iconUrl,"scientificName":sciName,"CommonName":commonname});
      
    //
    
    }
  }
  $(".modal").hide();
$scope.details = $scope.details.concat($scope.arr);
//BrowseService.setObsList($scope.details);
 
console.log($scope.details);
$scope.noMoreItemsAvailable = false;

}

function userGroupData($scope,userGroupInstanceList,UserGroupService){

  var usrGrp = [];

  for(i=0;i<userGroupInstanceList.length;i++){

    usrGrp.push({"id":userGroupInstanceList[i].id,"name":userGroupInstanceList[i].name});

  }
  $scope.usrGrpDetails = usrGrp;
  console.log(usrGrp);

  UserGroupService.GetJoinedGroups().then(function(userGroups){

    console.log(userGroups);
    console.log($("#button1 ").html());
    checkGroup($scope,userGroups['data']['model'].observations);
    //userGroupData($scope,groups['data']['model'].userGroupInstanceList);
  });

}

function checkGroup($scope,joinedgroup){

  var joinGrpid;

  for(i=0;i<joinedgroup.length;i++){

    joinGrpid = joinedgroup[i].id;
    console.log(joinGrpid);
    //console.log($("#button1 ").html());
    $("#button"+joinGrpid).hide();
    $("#joinedicon"+joinGrpid).addClass("icon ion-checkmark-round");
     
  }
 
  
}

function internetCheck($ionicPopup){
  console.log(window.Connection);
  if(window.Connection) {
    //alert("connection");
    if(navigator.connection.type == Connection.NONE) {
      //alert("no connection");
        $ionicPopup.alert({
            title: 'ERROR',
            content: "Plase make sure, you are connected to internet"//'You must submit atleast one image'
          });
      return false;
    }
  }
}






























