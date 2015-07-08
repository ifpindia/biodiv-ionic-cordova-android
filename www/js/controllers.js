var appne = angular.module('starter.controllers', [])

appne.controller('AppCtrl', function($scope, $ionicModal, $timeout,LoginService) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
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

    console.log('Doing login', $scope.loginData);
    LoginService.GetUserDetails($scope.loginData).then(function(vals){

      $scope.userDetails = vals;
      console.log('Doing login', $scope.userDetails);
      });

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      //$scope.closeLogin();
    }, 1000);
  };
})

appne.controller('BrowseDetailsCtrl', function($scope,$location,BrowseService) {
  
  console.log("BrowseDetailsCtrl");
var obsDetails = [];

var obsId = $location.path().split("/")[3];

//console.log(typeof(newUrl.split("/")[3]));
//console.log(obsId);
BrowseService.GetBroseInfo().then(function(data) {

   obsDetails = data.data.observationInstanceList;
      //console.log(obsDetails.length);
browsingArray($scope,obsDetails,obsId)

});



  
    //console.log(imgDetails);
})

function browsingArray($scope,obsDetails,obsId){

  var updated ,submited, observed, commonname, sciName, id, notes, author ;


  $scope.insertDetails = [];
  var imgDetails=[];
  //console.log(obsDetails);
  for(i=0;i<obsDetails.length;i++){
    if(obsDetails[i].maxVotedReco.hasOwnProperty('commonNamesRecoList')){
            commonname = obsDetails[i].maxVotedReco.commonNamesRecoList[0];
        }
        if(obsDetails[i].maxVotedReco.hasOwnProperty('sciNameReco')){
                sciName = obsDetails[i].maxVotedReco.sciNameReco.name;

          }
      
    else{
      sciName="Unknown";
      commonname="";
      }
      id=obsDetails[i].id;
      
      for(var j=0;j<obsDetails[i].resource.length;j++){
        console.log(obsDetails[i].resource[j]);
        imgDetails[id][0]=obsDetails[i].resource[j];

      }
      return false;
      console.log(imgDetails);
      updated = new Date(obsDetails[i].lastRevised.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      submited = new Date(obsDetails[i].createdOn.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      observed = new Date(obsDetails[i].fromDate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      notes =  obsDetails[i].notes;
      author = obsDetails[i].author.name;
      place = obsDetails[i].reverseGeocodedName;
          $scope.insertDetails.push({"id":id,"scientificName":sciName,"CommonName":commonname,"observed":observed,"updated":updated,"submitted":submited,"author":author,"place":place, "imgDetails":imgDetails});

    }
//console.log($scope.insertDetails);


    for(var y=0;y<$scope.insertDetails.length;y++){
      if($scope.insertDetails[y].id=obsId){
        $scope.singleObsDetails=[];
        $scope.singleObsDetails.push({"id":$scope.insertDetails[y].id,"scientificName":$scope.insertDetails[y].scientificName,"CommonName":$scope.insertDetails[y].CommonName,"observed":$scope.insertDetails[y].observed,"updated":$scope.insertDetails[y].updated,"submitted":$scope.insertDetails[y].submitted,"author":$scope.insertDetails[y].author,"place":$scope.insertDetails[y].place, "imgDetails":$scope.insertDetails[y].imgDetails[$scope.insertDetails[y].id]});
        console.log($scope.singleObsDetails);
        return false;
      }
    }
    
      //  console.log($scope.insertDetails);


}



appne.controller('PlaylistCtrl', function($scope, $stateParams) {
});

appne.controller('homeController', function($scope,$state){

  $scope.browse=function(){
    console.log("clicked");
        $state.go('app.browse');
  };
});

appne.controller('ListController',[ '$scope', '$http', function($scope,$http,BrowseService){
  console.log("List");
  $scope.details = [];
  $scope.innerDetails = [];
  
  $http.get('js/data3.json').success(function(data){

    //$scope.artists = data;
    
    $scope.innerDetails = data.observationInstanceList;
    console.log(data.observationInstanceList);
    arrayData($scope,data.observationInstanceList,1);
    
  });
  $scope.loadMore = function() {
    $scope.noMoreItemsAvailable = false;
    
    $http.get('js/data.json').success(function(data) {
      //console.log(data.observationInstanceList);
      arrayData($scope,data.observationInstanceList,2);
      
      //$scope.$digest();
//$timeout(function() {
  $scope.$broadcast('scroll.infiniteScrollComplete');
//});
    });
  };


 
}]);


appne.controller('JoinGroupCtrl',[ '$scope', '$http', function($scope,$http){
  console.log("jgroup");
  $http.get('js/userGroup.json').success(function(data){
    //$scope.artists = data;
    //console.log($scope.artists.observationInstanceList );
    userGroupData($scope,data.userGroupInstanceList);
    
  });
   $http.get('js/joinedGroup.json').success(function(data){
    //$scope.artists = data;
    console.log(data.observations );
    checkGroup($scope,data.observations);
    
  });
}]);


function arrayData($scope,observationInstanceList,num){

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
            commonname = observationInstanceList[i].maxVotedReco.commonNamesRecoList[0];
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
      
    //$scope.noMoreItemsAvailable = true;
    
    
    
    }
  }
  
$scope.details = $scope.details.concat($scope.arr);
console.log($scope.details);

}

function userGroupData($scope,userGroupInstanceList){

  var usrGrp = [];

  for(i=0;i<userGroupInstanceList.length;i++){

    usrGrp.push({"id":userGroupInstanceList[i].id,"name":userGroupInstanceList[i].name});

  }
  $scope.usrGrpDetails = usrGrp;
  console.log(usrGrp);
}

function checkGroup($scope,joinedgroup){

  var joinGrpid;

  for(i=0;i<joinedgroup.length;i++){

    joinGrpid = joinedgroup[i].id;

    $(".button"+joinGrpid).hide();
    $(".joinedicon"+joinGrpid).addClass(" icon ion-checkmark-round");

  }
 
  
}





























