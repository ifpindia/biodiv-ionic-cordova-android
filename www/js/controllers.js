var appne = angular.module('starter.controllers', [])

appne.controller('AppCtrl', function($scope, $location,$state,$ionicModal, $ionicSideMenuDelegate, $timeout,LoginService,$ionicPopup,$cordovaToast, $cordovaOauth, ApiEndpoint, $http) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  //localStorage.removeItem('USER_KEY');
  //alert($location.absUrl());
  $ionicSideMenuDelegate.canDragContent(false);
  if(localStorage.getItem('USER_KEY')!== null){
    //alert(Icheck());
    $state.go("app.home",{},{cache:false});
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

  $scope.facebookLogin = function() {
    $cordovaOauth.facebook("836915199738203", ["email"]).then(function(result) {
            //alert(JSON.stringify(result));
            //var res = JSON.stringify(result);
            var access_token = result.access_token;
            //alert(access_token);
        facebook(access_token);
    });
  }

  $scope.googleLogin = function() {
    $(".modal").show();
    //667301081944-v71rladv4mlt3ockv2rjomtfs4rckebp.apps.googleusercontent.com
    //29806730219-b6l9ofjup5f1luupdjngtv7ir8r8vlrv.apps.googleusercontent.com
        $cordovaOauth.google("667301081944-v71rladv4mlt3ockv2rjomtfs4rckebp.apps.googleusercontent.com", ["email"]).then(function(result) {
            console.log(JSON.stringify(result));
            //var res = JSON.stringify(result);
            var access_token = result.access_token;
            //alert(access_token);
        google(access_token);
    });
  }

  function facebook(accessKey){
    //alert("accessKey" + accessKey);
    $(".modal").hide();
    LoginService.FacebookUserlogin(accessKey).then(function(res){
     // alert("in to success");
          console.log(res);
          //alert(JSON.stringify(res));
          var gToken = res.data.model.token ;
          //alert(gToken);
          var uservar = {"userKey":res["data"]['model']['token'],"userID":res["data"]['model']['id'],"nId":0};
          localStorage.setItem('USER_KEY',JSON.stringify(uservar));
          $state.go("app.home");
       });
  }

  function google(accesVal){
    //alert("came");
    $(".modal").hide();
    LoginService.GoogleUserlogin(accesVal).then(function(res){
      //alert("in to success");
          console.log(res);
          //alert(JSON.stringify(res));
          var gToken = res.data.model.token ;
          //alert(gToken);
          var uservar = {"userKey":res["data"]['model']['token'],"userID":res["data"]['model']['id'],"nId":0};
          localStorage.setItem('USER_KEY',JSON.stringify(uservar));
          $state.go("app.home",{},{cache:false});
       });
  }

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


appne.controller('LogoutController', function($scope, $state, $window, $ionicPopup, $cordovaSQLite) {

//alert("hello");
   $scope.logout = function(){
        console.log("logout");
        //internetCheck($ionicPopup);
        localStorage.removeItem('USER_KEY');
        localStorage.removeItem('StatusArray');
         $state.go("login");
         //$window.location.reload(true)
         var query = "DELETE FROM OBSERVATION WHERE STATUS='FAILED'";
         //alert(query);
          $cordovaSQLite.execute(db, query).then(function(res) {
              console.log("INSERT ID -> " + res);
              //alert("transactedlogout");
          }, function (err) {
            //alert(err);
              console.error("erorrrrrr   "+err);
          });
      } 

      $scope.goToNewObs = function(){
         var tokenVal = localStorage.getItem('USER_KEY');
      var tokenVar = JSON.parse(tokenVal);
      var countVal = tokenVar.nId;
        if(countVal==0){
          tokenVar.nId = 1;
          localStorage.setItem('USER_KEY',JSON.stringify(tokenVar));
          $state.go("app.newObservation");
        }else{
      
          $state.go("app.newObservation",null,{reload:true});
        }
        //return false;
      }
     
});
appne.controller('observationStatusController', function($scope, NewObservationService, $cordovaSQLite){

  //alert(localStorage.getItem('StatusArray'));
$scope.details = [];
  var query = "SELECT * from observation ";
    $cordovaSQLite.execute(db, query).then(function(res) {
      if(res.rows.length == 0){
        $("div #obsStatusMsg").show();
      }else{
        for(var i=0;i<res.rows.length;i++){
          var dat = JSON.parse(res.rows.item(i)['obslist']);

          console.log(dat);

          $scope.details.push({"id":res.rows.item(i)['id'], "sciName":dat['recoName'],"status":res.rows.item(i)['status'], "imgArr":dat['imagePath'], "date":dat['fromDate'], "location":dat['placeName'], "notes":dat['notes'] });
        }
        $("div #obsStatusList").show();
        NewObservationService.SetDetails($scope.details);
      }
      console.log($scope.details);
        /*console.log("INSERT ID -> " + res.rows.item(0).status +" ");
        var dat = res.rows.item(0)['obslist'];
        console.log(JSON.parse(dat));*/
        //alert("transacted");
    }, function (err) {
      //alert(err);
        console.error(err);
    });
  /*if(localStorage.getItem('StatusArray')== null){

        

  }else {
    //$route.reload();
    //alert("statuscntrl");
      var status = localStorage.getItem('StatusArray');
      var statusArray1 = JSON.parse(status);

      console.log(statusArray1);
      $scope.details = statusArray1;
      
      $("div #obsStatusList").show();

  }*/
});
appne.controller('statusDetailsController', function($scope,$location,NewObservationService) {
  
  console.log("statusDetailsController");

    $scope.singleObsDetails = [];
    $scope.singleImgDetails = [];
      var obsId = $location.path().split("/")[3];
      //alert(obsId);
    var statusArray1 = NewObservationService.GetDetails();
    console.log(statusArray1);
      //var status = localStorage.getItem('StatusArray');
      //var statusArray1 = JSON.parse(status);

      for(var i=0; i<Object.keys(statusArray1).length;i++){
        if(statusArray1[i]['id'] == obsId){
          $scope.singleObsDetails.push({"id":statusArray1[i]['id'],"scientificName":statusArray1[i]['sciName'],"CommonName":statusArray1[i]['commonName'],"observed":statusArray1[i]['date'],"updated":statusArray1[i]['date'],"submitted":statusArray1[i]['date'],"author":'',"place":statusArray1[i]['location'], "imgDetails":statusArray1[i]['imgArr'], "notes":statusArray1[i]['notes']});
          //$scope.singleImgDetails.push({"image":{"icon":statusArray1[i]['imgArr']}})
          $scope.singleImgDetails.push({"image":statusArray1[i]['imgArr']});

        }
      }


//alert($scope.singleImgDetails[0]["image"]);
//console.log($scope.singleImgDetails[0]["image"]["icon"]);
//console.log(obsId);


  
    //console.log(imgDetails);
});
appne.controller('BrowseDetailsCtrl', function($scope,$window,$filter,$cordovaInAppBrowser,$location,BrowseService,NewObservationService,LocationService,$ionicPopup,UserGroupService,$cordovaToast) {
  $scope.vedio = false;
  $scope.showButton = true;
    //$scope.agreeButton = false;
    //$scope.acceptedName = true;
    $scope.showMore = true;

  var tokenvar = localStorage.getItem('USER_KEY');
  var tokenvar1 = JSON.parse(tokenvar);
  var userId = tokenvar1.userID;

  $scope.userValue = tokenvar1.userID;
  //alert($scope.userValue);
  console.log("BrowseDetailsCtrl");
  $scope.comment = {
    text:''
  };
  $scope.suggest = {
    sciName:'',
    commonName:'',
    comment:'',
    lang:'Anglais / English'
  };
  $scope.languages = [];
  $scope.languages.push("Anglais / English","Bangla","Créole Guyane","Créole Maurice","Créole Réunion","Creoles and pidgins, French-based","Créole Seychelles","Français / French","Malgache","Ndebele","Pedi","Siswati","Sotho","Swazi","Taki-taki");
$scope.editButton = function(){
  LocationService.SetUserSelectedLocAdd('');
}
//window.open('http://indiabiodiversity.org/biodiv/user/{{item.userId}}', '_system');
var obsId = $location.path().split("/")[3];

$scope.openUser = function(userId){
  //$window.open('http://indiabiodiversity.org/user/show/'+userId, '_system');

$cordovaInAppBrowser.open('http://indiabiodiversity.org/user/show/'+userId, '_blank')
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
}
//console.log(typeof(newUrl.split("/")[3]));
//console.log(obsId);

$scope.obsDetails=BrowseService.getObsList()

console.log($scope.obsDetails);
browsingArray($scope,$scope.obsDetails,obsId, NewObservationService)
$scope.commentList = [];


  BrowseService.GetComments(obsId).then(function(commentsList){

    console.log(commentsList);
    for(var i=0;i<commentsList['data']['model']['instanceList'].length;i++){
      $scope.commentList.push({"userIcon":commentsList['data']['model']['instanceList'][i]['author']['icon'],"userId":commentsList['data']['model']['instanceList'][i]['author']['id'],"userName":commentsList['data']['model']['instanceList'][i]['author']['name'],"activityAction":'',"activityName":$("<p>").html(commentsList['data']['model']['instanceList'][i]['text']).text(),"date":$filter('date')( commentsList['data']['model']['instanceList'][i]['lastUpdated'] ), "fullDate":commentsList['data']['model']['instanceList'][i]['lastUpdated'], "commentId":commentsList['data']['model']['instanceList'][i]['id'], "commentFlag":false });
    
    }
    

  } );


   BrowseService.GetServerTime().then(function(time){

      console.log(time);
      $scope.serverTime = time;
       BrowseService.GetActivityFeed(obsId,time.data).then(function(feedList){

          console.log(feedList);
          $scope.timeVal = feedList['data']['newerTimeRef'] ;
          parsingFeedDetails($scope,feedList['data']['model']['feeds'],$filter,UserGroupService);

          //$scope.commentList.push({"userName":"karthik","activityAction":"Posted observation to group","activityName":"Western Ghats"}, {"userName":"karthik","activityAction":"Posted observation to group","activityName":"Western Ghats"});

        } );

    } );

   $scope.showMoreButton = function(){
    console.log($scope.timeVal);
    BrowseService.GetActivityFeed(obsId,$scope.timeVal).then(function(newFeedList){
      $scope.listFeed=[];
          console.log(newFeedList);
          $scope.timeVal = newFeedList['data']['newerTimeRef'] ;
          //for(var i=0;i<1;i++){
            
            $scope.listFeed.push(newFeedList['data']['model']['feeds'][0]);
            
          //}
          console.log($scope.listFeed);
          parsingFeedDetails($scope,$scope.listFeed,$filter,UserGroupService);

          //$scope.commentList.push({"userName":"karthik","activityAction":"Posted observation to group","activityName":"Western Ghats"}, {"userName":"karthik","activityAction":"Posted observation to group","activityName":"Western Ghats"});

        } );
   }
  


  BrowseService.GetRecommendationVotes(obsId).then(function(recommendationVotes){
    //$scope.acceptedName = true;
    console.log(recommendationVotes);
    //alert(recommendationVotes.data.model.recoVotes.length);
    parsingRecoDetails($scope,recommendationVotes['data']['model']['recoVotes'], userId);


  }, function (err){
    //alert("err");
    //$scope.acceptedName = false;
  });
$scope.paramsList ={};
  $scope.postComments = function(){
    if($scope.comment.text == ''){
      showIonicAlert($ionicPopup,'Please enter a comment');
    } else{
      $scope.paramsList['rootHolderId'] = obsId ;
      $scope.paramsList['rootHolderType'] = "species.participation.Observation" ;
      $scope.paramsList['commentBody'] = $scope.comment.text ;
      $scope.paramsList['commentHolderId'] = obsId ;
      $scope.paramsList['commentHolderType'] = "species.participation.Observation" ;
      $scope.paramsList['newerTimeRef'] = $scope.serverTime ;
      BrowseService.AddComments( $scope.paramsList).then(function(res){
        console.log(res);
        if(res.data.success == true){
          $scope.commentList.push({"userIcon":"","userId":"","userName":"you","activityAction":"","activityName":$scope.comment.text,"date":"now","fullDate":""});
          $scope.comment.text ='';
          showToast($cordovaToast,"successfully added, please visit the page again to see updated details");

        }
      });
        //$scope.commentList.push({"userName":"karthik","activityAction":"Posted observation to group","activityName":$scope.comment.text});

    }
    
  }

  $scope.agreButton = function(recoId){
    BrowseService.AgreeRecommendationVotes(obsId, recoId).then(function(res){
      console.log(res);
      console.log(recoId);
      console.log($scope.agreeDetails);
      if(res.data.success==true){
      /*for(var i=0;i < $scope.agreeDetails.length;i++){
                    alert($scope.agreeDetails[i]['recoId']);

          if($scope.agreeDetails[i]['recoId'] == recoId){
            alert('here');
            $scope.agreeDetails[i]['noOfVotes'] = ++$scope.agreeDetails[i]['noOfVotes'];
            $scope.agreeDetails[i]['buttonVal'] = true;
            break;
          }
        }*/
         //showToast($cordovaToast,"successfully added, please visit the page again to see updated details");
         BrowseService.GetRecommendationVotes(obsId).then(function(recommendationVotes){
          //$scope.acceptedName = true;
          console.log(recommendationVotes);
          //alert(recommendationVotes.data.model.recoVotes.length);
          parsingRecoDetails($scope,recommendationVotes['data']['model']['recoVotes'], userId);


        }, function (err){
          //alert("err");
          //$scope.acceptedName = false;
        });
      }
    });
    //$scope.agreeButton = true;
    //$("#removeButton"+recoId).show();
    //$("#agreeButton"+recoId).hide();
    
  }
  $scope.removeButton = function(recoId){
    //alert(recoId);
    BrowseService.RemoveRecommendationVotes(obsId, recoId).then(function(res){
      //console.log(res);
      if(res.data.success==true){
        /*for(var i=0;i < $scope.agreeDetails.length;i++){
          if($scope.agreeDetails[i]['recoId'] == recoId){
            //console.log("here11");
            $scope.agreeDetails[i]['noOfVotes'] = --$scope.agreeDetails[i]['noOfVotes'];
             //console.log("here");
            for(var j = 0;j < $scope.agreeDetails[i]['userDetails'].length ; j++){
              if($scope.agreeDetails[i]['userDetails'][j]['userId'] == userId){
                //console.log("here");
                $scope.agreeDetails[i]['userDetails'].splice(j,1);
                $scope.agreeDetails[i]['buttonVal'] = false;
                //console.log($scope.agreeDetails);
                break;
              }
            }
            break;
          }
        }
        showToast($cordovaToast,"successfully removed, please visit the page again to see updated details");
*/
        BrowseService.GetRecommendationVotes(obsId).then(function(recommendationVotes){
            //$scope.acceptedName = true;
            console.log(recommendationVotes);
            //alert(recommendationVotes.data.model.recoVotes.length);
            parsingRecoDetails($scope,recommendationVotes['data']['model']['recoVotes'], userId);


          }, function (err){
            //alert("err");
            //$scope.acceptedName = false;
          });
      }

    });
    //$scope.agreeButton = false;
     //$("#agreeButton"+recoId).show();
    //$("#removeButton"+recoId).hide();
  }
  $scope.editDiv = false;
  $scope.edit = {
    editText : ''
  }
  $scope.editComment = function(id, comment){
    
    $scope.editDiv = true;
    $scope.edit.editText = comment;
          for(var i=0;i< $scope.commentList.length ;i++){
            if($scope.commentList[i]['activityAction']==''&& $scope.commentList[i]['commentId'] ==id){
              $scope.commentList[i]['commentFlag'] = true;
              alert($scope.commentList[i]['commentFlag']);
              break;
            }
          }
   }
   $scope.updateComment = function(id,comment){
    alert(id);
    if($scope.edit.editText == '' ){
      showIonicAlert($ionicPopup,'Please enter a comment');
    } else if($scope.edit.editText == comment){
      showIonicAlert($ionicPopup,'comment not changed');
    } else {
        $scope.paramsList['commentBody'] = $scope.edit.editText ;
        $scope.paramsList['commentId'] = id ;
        BrowseService.AddComments( $scope.paramsList).then(function(res){
        console.log(res);
        if(res.data.success == true){
          //$scope.commentList.push({"userIcon":"","userId":"","userName":"you","activityAction":"","activityName":$scope.reply.replyText,"date":"now","fullDate":""});
          $scope.edit.editText ='';
          $scope.editDiv = false;
          showToast($cordovaToast,"successfully Updated, please visit the page again to see updated details");

        }
      });
    }
   }
   $scope.deleteComment = function(id){
    var confirmPopup = $ionicPopup.confirm({
           title: 'Delete Comment',
           template: 'This comment will be deleted. Are you sure ? '
         });
         confirmPopup.then(function(result) {
           if(result) {

            BrowseService.DeleteComment(id).then(function(res){
            console.log(res);
            if(res.data.success == true){
              for(var i=0;i< $scope.commentList.length ;i++){
                if($scope.commentList[i]['commentId'] ==id){
                  $scope.commentList.splice(i,1);
                  break;
                }
              }
              //$scope.commentList.push({"userIcon":"","userId":"","userName":"you","activityAction":"","activityName":$scope.reply.replyText,"date":"now","fullDate":""});
              $scope.editDiv = false;
              //showToast($cordovaToast,"successfully deleted, please visit the page again to see updated details");

            }
          });

           } else {
              return;
           }
         });
    
   }
  $scope.replyDiv = false;
   $scope.replyToComment = function(id){
    alert(id);
    $scope.replyDiv = true;
          for(var i=0;i< $scope.commentList.length ;i++){
            if($scope.commentList[i]['activityAction']==''&& $scope.commentList[i]['commentId'] ==id){
              $scope.commentList[i]['commentFlag'] = true;
              alert($scope.commentList[i]['commentFlag']);
              break;
            }
          }
   }
   $scope.hideDiv = function(){
    $scope.replyDiv = false;
   }
   $scope.reply={
    replyText:''
   };
   $scope.postReply = function(id){
    
    alert($scope.reply.replyText)
    //alert(id);
    if($scope.reply.replyText == ''){
      showIonicAlert($ionicPopup,'Please enter a comment');
    } else{
      $scope.paramsList['rootHolderId'] = obsId ;
      $scope.paramsList['rootHolderType'] = "species.participation.Observation" ;
      $scope.paramsList['commentBody'] = $scope.reply.replyText ;
      $scope.paramsList['commentHolderId'] = obsId ;
      $scope.paramsList['commentHolderType'] = "species.participation.Observation" ;
      $scope.paramsList['parentId'] = id ;
      $scope.paramsList['newerTimeRef'] = $scope.serverTime ;
      BrowseService.AddComments( $scope.paramsList).then(function(res){
        console.log(res);
        if(res.data.success == true){
          $scope.commentList.push({"userIcon":"","userId":"","userName":"me","activityAction":"","activityName":$scope.reply.replyText,"date":"now","fullDate":""});
          $scope.reply.replyText ='';
          $scope.replyDiv = false;
          showToast($cordovaToast,"successfully added, please visit the page again to see updated details");

        }
      });
        //$scope.commentList.push({"userName":"karthik","activityAction":"Posted observation to group","activityName":$scope.comment.text});

    }
   }
  $scope.suggestNames = function(){
    //console.log($scope.suggest);
    $scope.addReco = {
      obvId:obsId,
      recoName:'',
      commonName:'',
      languageName:'',
      recoComment:''
    };
    
    if($scope.suggest.commonName == '' && $scope.suggest.sciName ==''){
      showIonicAlert($ionicPopup,'Please enter a name');
      return;
    }

    if($scope.suggest.sciName.length >0){
      $scope.addReco.recoName = $scope.suggest.sciName
    }
    if($scope.suggest.commonName.length >0){
      $scope.addReco.commonName = $scope.suggest.commonName;
      $scope.addReco.languageName = $scope.suggest.lang;
    }
    if($scope.suggest.comment.length >0){
      $scope.addReco.recoComment = $scope.suggest.comment;
    }

    //console.log($scope.addReco);
    BrowseService.AddRecommendationVotes(obsId, $scope.addReco).then(function(result){

    console.log(result);
    for(var i=0;i < $scope.agreeDetails.length;i++){
      $scope.agreeDetails[i]['buttonVal'] = false;
    }
    //$scope.agreeDetails.push({"noOfVotes":"you" ,"canonicalForm": $scope.addReco.recoName,"commonNames": "("+$scope.addReco.commonName+")","userDetails":"", "recoId":"", "buttonVal":"tfal" })

    $scope.suggest.sciName='',
    $scope.suggest.commonName ='',
    $scope.suggest.recoComment='',
    BrowseService.GetRecommendationVotes(obsId).then(function(recommendationVotes){
    //$scope.acceptedName = true;
    console.log(recommendationVotes);
    //alert(recommendationVotes.data.model.recoVotes.length);
    parsingRecoDetails($scope,recommendationVotes['data']['model']['recoVotes'], userId);


  }, function (err){
    //alert("err");
    //$scope.acceptedName = false;
  });

    //showToast($cordovaToast,"successfully added, please visit the page again to see updated details");
    //if($scope.agreeButton){

    //}

   
  });

  }
  
    //console.log(imgDetails);
})

function showIonicAlert($ionicPopup,message){

      $ionicPopup.alert({
          title: 'ERROR',
          content: message//'You must submit atleast one image'
        });
    }

function parsingRecoDetails($scope, recommendationDetails, userId){

  $scope.agreeDetails =[];
  if(recommendationDetails.length>0){
    $scope.checkReco = true;
    var buttonVal = false;
  for(var i=0; i< recommendationDetails.length; i++){
    var agreedUser =[];
    for(var j=0; j< recommendationDetails[i]['authors'].length; j++){

       agreedUser.push({"userIcon": recommendationDetails[i]['authors'][j]['icon'], "userId": recommendationDetails[i]['authors'][j]['id']});
       if(recommendationDetails[i]['authors'][j]['id'] == userId){
        alert('came'+ userId);
          //$scope.agreeButton = true;
          //$(".listss #removeButton"+recommendationDetails[i]['recoId']).show();
          //$(".listss #agreeButton"+recommendationDetails[i]['recoId']).hide();
          //console.log($("#agreeButton"+recommendationDetails[i]['recoId']).html());
          //alert($(".listss").html());
          buttonVal = true;
          $scope.recoValue = recommendationDetails[i]['recoId'];
       } else {
          //$scope.agreeButton = false;
          buttonVal = false;
          //$("#agreeButton"+recommendationDetails[i]['recoId']).show();
          //$("#removeButton"+recommendationDetails[i]['recoId']).hide();
       }
    }
      $scope.agreeDetails.push({"noOfVotes":recommendationDetails[i]['noOfVotes'] ,"canonicalForm": recommendationDetails[i]['name'],"commonNames": recommendationDetails[i]['commonNames'],"userDetails":agreedUser, "recoId":recommendationDetails[i]['recoId'], "buttonVal":buttonVal })
      //alert(typeof($scope.agreeDetails[0]['noOfVotes']));
    }
  }else {
    $scope.checkReco = false;
  }


}
function parsingFeedDetails($scope,feedDetails,$filter,UserGroupService){
  //alert(JSON.stringify(feedDetails[3]));
  if(feedDetails.length==5 ){
    $scope.showMore = true;
  //} else if(feedDetails.length < 5){
   // $scope.showMore = false;
  } else if(feedDetails.length==1&&feedDetails[0]['activityType']=="Observation created"){
    $scope.showMore = false;
  }else if(feedDetails.length==1){
      $scope.showMore = true;
  }else{
    $scope.showMore = false;
  }

  var userGrp = UserGroupService.GetUserGroupsList();
  console.log(userGrp);
  var groupName;

  for(var i=0;i<feedDetails.length;i++){
    if(feedDetails[i]['activityHolderType'] == 'species.participation.RecommendationVote'){
      $scope.commentList.push({"userIcon":feedDetails[i]['author']['icon'],"userId":feedDetails[i]['author']['id'],"userName":feedDetails[i]['author']['name'],"activityAction":feedDetails[i]['activityType'],"activityName":$("<p>").html(feedDetails[i]['activityDescription']).text(),"date":$filter('date')( feedDetails[i]['lastUpdated'] ), "fullDate":feedDetails[i]['lastUpdated']});
    }
    if(feedDetails[i]['activityHolderType'] == 'species.groups.UserGroup'){
      var groupId = feedDetails[i]['activityHolderId'];

      for(var j=0;j<userGrp.length;j++){
        if(groupId == userGrp[j]['id']){
          groupName = userGrp[j]['name'];
           $scope.commentList.push({"userIcon":feedDetails[i]['author']['icon'],"userId":feedDetails[i]['author']['id'],"userName":feedDetails[i]['author']['name'],"activityAction":feedDetails[i]['activityDescription'],"activityName":groupName,"date":$filter('date')( feedDetails[i]['lastUpdated'] ), "fullDate":feedDetails[i]['lastUpdated']});
           break;
        }
      }
    }
    if(feedDetails[i]['activityHolderType'] == 'species.participation.Observation'){
      $scope.commentList.push({"userIcon":feedDetails[i]['author']['icon'],"userId":feedDetails[i]['author']['id'],"userName":feedDetails[i]['author']['name'],"activityAction":feedDetails[i]['activityType'],"activityName":$("<p>").html(feedDetails[i]['activityDescription']).text(),"date":$filter('date')( feedDetails[i]['lastUpdated'] ), "fullDate":feedDetails[i]['lastUpdated']});
    }
    if(i== (feedDetails.length - 1)){
      $scope.commentList = $scope.commentList.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        //return new Date(a.date) - new Date(b.date) && new Date(a['fullDate']).getTime() - new Date(b['fullDate']).getTime();
        return new Date(a['fullDate']).getTime() - new Date(b['fullDate']).getTime();
      });
      console.log($scope.commentList);
    }
  }
}
function browsingArray($scope,obsDetails,obsId,NewObservationService){

    var tokenvar = localStorage.getItem('USER_KEY');
    var tokenvar1 = JSON.parse(tokenvar);
    var currentUserId = tokenvar1.userID;
  var updated ,submited, observed, commonname, sciName, id, notes, author ;


  $scope.insertDetails = [];
  var imgDetails=[];
  var userid;
  //console.log(obsDetails);
  for(var i=0;i<obsDetails.length;i++){
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
      id = obsDetails[i].id;
      userid =  obsDetails[i]['author']['id'];
      //console.log(userid);
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
      notes =  $("<p>").html(obsDetails[i].notes).text();

      author = obsDetails[i].author.name;
      place = obsDetails[i].reverseGeocodedName;
          $scope.insertDetails.push({"id":id,"scientificName":sciName,"CommonName":commonname,"observed":observed,"updated":updated,"submitted":submited,"author":author,"place":place, "imgDetails":imgDetails, "notes":notes, "userIdVal":userid});

    }



    for(var y=0;y<$scope.insertDetails.length;y++){

      

      if($scope.insertDetails[y].id==obsId){

        if($scope.insertDetails[y].userIdVal==currentUserId){
          NewObservationService.SetEditObsDetails(obsDetails[y]);
          $scope.vedio = true;
        } else {
          $scope.vedio = false;
        }
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

appne.controller('EditObservationCtrl', function($scope,$state,$http,$cordovaCamera,LocationService,$ionicPopup,$cordovaDevice, $cordovaFile, $ionicPlatform,  $ionicActionSheet, $filter, $cordovaFileTransfer, ApiEndpoint, UserGroupService, NewObservationService, $cordovaSQLite, $cordovaToast) {
  $scope.submitObsVal = false;
  //alert("came")
  var obsDetails = NewObservationService.GetEditObsDetails();
  console.log(obsDetails);
  var z=0;
  var date = new Date(obsDetails.fromDate);
  console.log(date);
 $scope.newobs ={
      sciName    :'',
      commonName :'',
      notes : '',
      boxVal : false
    };
    $scope.newobs.date = date;
    $scope.submitObsParams = {};
    $scope.submitDbParams = {};
    $scope.imgURI =[];
    $scope.userGroupId = [];

    var address = LocationService.GetUserSelectedLocAdd();
    //alert(address);
    if(address != ''){
      $scope.newobs['location'] = address;
    }else{
    $scope.newobs['location'] = obsDetails.reverseGeocodedName;
  }



    // $("#Locationval").text(obsDetails.reverseGeocodedName);
      for(var i=0; i<obsDetails['resource'].length; i++){
        //$("#imgContent").show();
        z++;
        //alert($("#imgContent").html());
        $scope.imgURI.push({"id":z,"path":obsDetails['resource'][i].url});
      }
      console.log($scope);

     if(Object.keys(obsDetails.maxVotedReco).length >0){

        if(obsDetails.maxVotedReco.hasOwnProperty('commonNamesRecoList')){
              $scope.newobs.commonName = obsDetails.maxVotedReco.commonNamesRecoList[0]["name"];
          }

        if(obsDetails.maxVotedReco.hasOwnProperty('sciNameReco')){
                $scope.newobs.sciName = obsDetails.maxVotedReco.sciNameReco.name;

          } 
      
    }
    if(obsDetails.hasOwnProperty('notes')){
      $scope.newobs.notes = obsDetails.notes;
    }
    $(function () {
      $('#check').change(function () {
          $(".check1").toggle(this.checked);
      });
  });
    $('#uGroupText').text(obsDetails['userGroups'].length);
    if(obsDetails['userGroups'].length > 0){
      for (var z = 0; z < obsDetails['userGroups'].length; i++) {
          $scope.userGroupId.push(obsDetails['userGroups'][z].id);
      }
    }

     $(function () {
      $('#dateSight').change(function () {
          //alert($scope.newobs.date);
        $scope.date = $filter('date')( $scope.newobs.date );
        console.log($scope.date);
        var currentDate = getDatetime();
        //console.log(currentDate);
        if(Date.parse($scope.date) > Date.parse(currentDate)){
           showDailog("Please slect a valid date");
           $scope.newobs.date = date;
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
  

 

  $scope.addMedia = function() {

    if($scope.imgURI.length == 10){
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
      
     
      z++;
      onImageSuccess(imageUrl);
 
       function onImageSuccess(fileURI) {
          createFileEntry(fileURI);
       }
       
       function createFileEntry(fileURI) {
          window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
       }
       
       // 5
       function copyFile(fileEntry) {
         var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
         var newName = makeid() + name;
         
         window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
         fileEntry.copyTo(fileSystem2,newName,onCopySuccess,fail);
         },
         fail);
       }
       
       // 6
       function onCopySuccess(entry) {
         $scope.$apply(function () {
          //alert(urlForImage(entry.nativeURL));
         $scope.imgURI.push({"id":z,"path":urlForImage(entry.nativeURL)});
         });
       }
       
       function fail(error) {
          console.log("fail: " + error.code);
       }
       
       function makeid() {
         var text = "";
         var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
         
         for (var i=0; i < 5; i++) {
           text += possible.charAt(Math.floor(Math.random() * possible.length));
         }
         return text;
       }

      }, function(err) {
                // An error occured. Show a message to the user
          });

    }

      function urlForImage(imageName) {
        //alert($scope.imgURI.length);
        console.log(imageName);
        //alert("y r u cmg here");
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        console.log(cordova.file.dataDirectory);
        return trueOrigin;
      }

   
         


    $scope.removeImage = function(id){
    //alert($scope.imgURI.length);
      for(var i=0; i<$scope.imgURI.length;i++){
        if($scope.imgURI[i]['id']==id){
          $scope.imgURI.splice(i,1);
          break;
        }
      }
      console.log($scope.imgURI);
      $('#imgContent #'+id).hide();

    //alert(id);
    }

    $scope.gps = function(){
      var inter = internetCheck($ionicPopup);
      if(inter == false){
        
        return;
      }else {
        $state.go("app.location");
      }
    }
    function showDailog(message){

      $ionicPopup.alert({
          title: 'ERROR',
          content: message//'You must submit atleast one image'
        });
    }



$scope.select = [];
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
         template: '<ion-list class="item-icon-right">                                '+
                   '  <ion-item class="item " id="uGroup{{usrgrps.id}}" ng-repeat="usrgrps in usrGrp " ng-click="uploadTo({{usrgrps.id}});" > '+
                   '    {{usrgrps.name}}                             '+
                   '<i ng-if="userGroupId.indexOf(usrgrps.id) > -1" class="icon ion-checkmark-round" style="font-size: 18px;right: -7px;"></i>'+
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
       $scope.vedio = true;
      }

       $('#uGroupText').text($scope.userGroupId.length);
      console.log($scope.userGroupId);
    }




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
      var check =Icheck();
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
      } else {
        $scope.newobs['sciName'] = "";
        $scope.newobs['commonName'] = "";
      }
      //console.log($('#Locationval').text());
      $scope.locationAddress = $scope.newobs['location'];
      if($scope.locationAddress == 'Location'){
        //alert($scope.locationAddress);
        var confirmPopup = $ionicPopup.confirm({
           title: 'Location',
           template: 'you didnt entered Location. Default location will be taken'
         });
         confirmPopup.then(function(res) {
           if(res) {
            $scope.locationAddress = "Lally Tollendal Street, White Town, Puducherry, Puducherry 605002, India"; 
            //$('#Locationval').text($scope.locationAddress);
            $scope.newobs['location'] = $scope.locationAddress;
            var loc = {'G':11.93707847595214 , 'K':79.83552551269528}
            LocationService.SetUserSelectedLocation(loc);
            if(check == false) {
              //alert("store"+check);
              storeinDb();
            }else {
               //alert("exec"+check);
              executeRequest();
             }
           } else {
             console.log('You are not sure');
             return;
           }
         });
      }else {
        if(check == false) {
          storeinDb();
        }else {
          executeRequest();
         }
      }
      
      
    }

    function storeinDb(){
       //console.log($state);
      $state.go("app.home");

      $scope.imgName = [];
      //alert("storedb");
      showToast($cordovaToast,"Your observation will be submitted when you are next online.");
      console.log("storedb");
      console.log(db);
        var uLatLong = LocationService.GetUserSelectedLocation();
        console.log("SUBMIT USER"+uLatLong.latitude+" SUBMI "+uLatLong.longitude)
        $scope.submitDbParams['observationId'] = obsDetails.id;
        $scope.submitDbParams['group_id']   =  10;
        $scope.submitDbParams['habitat_id'] = 1;
        $scope.submitDbParams['fromDate']   = $scope.newobs.date;
        $scope.submitDbParams['placeName']  = $scope.locationAddress;
        $scope.submitDbParams['areas']      =  "POINT("+uLatLong.longitude+" "+uLatLong.latitude+")"
        $scope.submitDbParams['notes']      = $scope.newobs.notes;
       
        $scope.submitDbParams['imagePath']  = $scope.imgURI;
        //console.log(JSON.stringify($scope.submitDbParams));;
        if($scope.newobs['sciName'].length>0){
          $scope.submitDbParams['recoName'] = $scope.newobs['sciName'];
        } else {
          $scope.submitDbParams['recoName'] = "Unknown";
        }
        if($scope.newobs['commonName'].length>0){
          $scope.submitDbParams['commonName'] = $scope.newobs['commonName'];
        } else {
          $scope.submitDbParams['commonName'] = "";
        }
        $scope.submitDbParams['resourceListType'] = "ofObv" ;
        $scope.submitDbParams['agreeTerms'] = "on";
        if($scope.userGroupId !=null && $scope.userGroupId.length>0) {
          $scope.submitDbParams['userGroupsList'] = $scope.userGroupId
        }
        //alert("came");
        console.log(JSON.stringify($scope.submitDbParams));
        var query = "INSERT INTO observation (status,obslist) VALUES (?,?)";
        $cordovaSQLite.execute(db, query, ["PENDING",JSON.stringify($scope.submitDbParams)]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            //alert("transacted");
        }, function (err) {
          //alert(err);
            console.error(err);
        });
    }

    function executeRequest(){
      $state.go("app.home");
      showToast($cordovaToast,"Your observation will be submitted shortly");

      $scope.times = 0;
      var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var token = tokenvar1.userKey;
      var appkey = "a4fbb540-0385-4fff-b5da-590ddb9e2552";//"fc9a88b5-fac9-4f01-bc12-70e148f40a7f";
      $scope.count =0;
      $scope.newImageStr = [];
      console.log($scope.newobs);
       var options = new FileUploadOptions();
       $scope.nativeImg = [];
       for(var i = 0;i < $scope.imgURI.length; i++){
          var imageLink = $scope.imgURI[i]['path'] ;
          if(imageLink.match("http://")){

           var nameCreate =  "/"+imageLink.split('//')[2];

              $scope.newImageStr.push(nameCreate);
              $scope.count++;
              if($scope.count == $scope.imgURI.length){
              //alert("parse");
              console.log("win parsing "+ $scope.count +" called parse resource");
              console.log(Object.keys($scope.newImageStr).length);
              parseResourceDetails();
             }
          } else {
              $scope.nativeImg.push(imageLink);
          }
        }
       
        for(var i = 0;i < $scope.nativeImg.length; i++){
          var imageLink = $scope.nativeImg[i] ;
          
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
              //alert("parse");
              console.log("win parsing "+ $scope.count +" called parse resource");
              console.log(Object.keys($scope.newImageStr).length);
              parseResourceDetails();
             }
          }
          function fail(err){
            $scope.times++;
            //alert(err);
            if($scope.times == 1){
            statusCheck();
          }
            console.log("error:fail " + JSON.stringify(err));
          }
          

          function parseResourceDetails(){
            //alert("parseResourceDetails");
            var count1 = 0;
            console.log("newImgstr" + Object.keys($scope.newImageStr).length);
            //alert(Object.keys($scope.newImageStr).length);
            for(var i=0; i<Object.keys($scope.newImageStr).length; i++){
              //alert()
              count1++;
              $scope.submitObsParams["file_"+(i+1)] = $scope.newImageStr[i];
              $scope.submitObsParams["type_"+(i+1)] = "IMAGE";
              $scope.submitObsParams["license_"+(i+1)] = "CC_BY";
              
              if(count1 == Object.keys($scope.newImageStr).length){
                //alert("entered");
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
            $scope.failedObs = {};

            $scope.failedObs['recoName'] = sciName ;
            $scope.failedObs['commonName'] = commonName ;
            //$scope.failedObs['status'] =
            $scope.failedObs['fromDate'] = $scope.newobs.date;
            $scope.failedObs['placeName'] = $scope.locationAddress;
            $scope.failedObs['notes'] = obsNotes ;
            $scope.failedObs['imagePath'] = $scope.imgURI;

            //NewObservationService.SetStatus(sciName, commonName, "FAILURE", $scope.newobs.date, $scope.locationAddress, obsNotes, $scope.imgURI);
             var query = "INSERT INTO observation (status,obslist) VALUES (?,?)";
              $cordovaSQLite.execute(db, query, ["FAILED",JSON.stringify($scope.failedObs)]).then(function(res) {
                  console.log("INSERT ID -> " + res.insertId);
                  //alert("transacted");
              }, function (err) {
                //alert(err);
                  console.error(err);
              });
          }

          function submitObservationFinally(){
            var uLatLong = LocationService.GetUserSelectedLocation();
            console.log("SUBMIT USER"+uLatLong.latitude+" SUBMI "+uLatLong.longitude)
            $scope.submitObsParams['group_id']   =  10;//829;//10;
            $scope.submitObsParams['habitat_id'] =  1;//267835; //1;
            
            $scope.newobs.date = $filter('date')( $scope.newobs.date,"dd/MM/yyyy" );
            //alert($scope.newobs.date);
            $scope.submitObsParams['fromDate']   = $scope.newobs.date;
            $scope.submitObsParams['placeName']  = $scope.locationAddress;
            $scope.submitObsParams['areas']      =  "POINT("+uLatLong.longitude+" "+uLatLong.latitude+")"
            $scope.submitObsParams['notes']      = $scope.newobs.notes;
          
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
            NewObservationService.EditSubmitObservation($scope.submitObsParams,obsDetails.id).then(function(obsResponse){
              
              //alert("success" + JSON.stringify(obsResponse));;
              if(obsResponse.data.success == false){

               statusCheck();
              }
              console.log(obsResponse);
            },
            function(err){
              //alert("Nosuccess");
              console.log(err);
               statusCheck();
            });

          }

    $scope.deleteObs = function(){
      NewObservationService.DeleteObservation(obsDetails.id).then(function(obsResponse){
              
              //alert("success" + obsResponse.data.success);
              if(obsResponse.data.success == false){

               showToast($cordovaToast,"Observation couldnot be deleted");
              }else{
                showToast($cordovaToast,"Observation deleted");
                $state.go("app.home");
                
              }
              console.log(obsResponse);
            },
            function(err){
             showDailog("Unknown Error occurred");
            });

    } 




  });



appne.controller('NewObservationCtrl', function($scope,$window,$route,$state,$location,$http,$cordovaCamera,LocationService,$ionicPopup,$cordovaDevice, $cordovaFile, $ionicPlatform,  $ionicActionSheet, $filter, $cordovaFileTransfer, ApiEndpoint, UserGroupService, NewObservationService, $cordovaSQLite, $cordovaToast) {
   //alert('new');
   UserGroupService.GetJoinedGroups().then(function(groups){

    console.log(groups['data']['model']);
    UserGroupService.SetUserJoinGroups(groups);
  });
    var tokenVal = localStorage.getItem('USER_KEY');
      var tokenVar = JSON.parse(tokenVal);
      var countVal = tokenVar.nId;
      //alert(countVal);
      var countVal1 =0
      /*if(countVal==0){
        //var currentPageTemplate = $route.current.templateUrl;
        //$templateCache.remove(currentPageTemplate);
         //alert('came');
       // $state.go($state.current, null, { reload: true });
        //$location.path('/newObservation');
        //$ionicHistory.clearCache([stateId]);
        //alert($route.reload());
        //$route.reload()
        //$state.$current
       location.reload();
        tokenVar.nId = 1;
        localStorage.setItem('USER_KEY',JSON.stringify(tokenVar));
      } */
    setTimeout(function(){
      if($('ion-nav-bar').hasClass('hide')){
        //alert('came');
        $('ion-nav-bar').removeClass('hide');
        //$('ion-view').css('padding-top','44px');
        //$('ion-content').css('margin-top','43px');
      }
    },100);
    //alert($('#neobsbuttons').html());
    //$window.location.reload(true);
    //$('#neobsbuttons .menu-content .nav-bar-container').removeClass('hide');
    //$('.neobsbuttons').show();
    //$scope.showButton1 = true;
    $scope.submitObsVal = true;
    $scope.newobs ={
      sciName    :'',
      commonName :'',
      notes : '',
      boxVal : false
    };
    $scope.submitObsParams = {};
    $scope.submitDbParams = {};
    $scope.imgURI =[];
    /*$(function () {
      $(document).on('change', '#check', function() {
        //alert($scope.newobs.boxVal);
        $(".check1").toggle(this.checked);
      
      });
  });*/

     $(function () {
      $(document).on('change', '#dateSight', function() {
      //$('#dateSight').change(function () {
          //alert($scope.newobs.date);
        $scope.date = $filter('date')( $scope.newobs.date );
        console.log($scope.date);
        var currentDate = getDatetime();
        //console.log(currentDate);
        if(Date.parse($scope.date) > Date.parse(currentDate)){
          $scope.newobs.date = "";
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
      var check =Icheck();
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
      } else {
        $scope.newobs['sciName'] = "";
        $scope.newobs['commonName'] = "";
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
            if(check == false) {
              //alert("store"+check);
              storeinDb();
            }else {
               //alert("exec"+check);
              executeRequest();
             }
           } else {
             console.log('You are not sure');
             return;
           }
         });
      }else {
        if(check == false) {
          storeinDb();
        }else {
          executeRequest();
         }
      }
      
      
    }

    function storeinDb(){
       //console.log($state);
      $state.go("app.home");

      $scope.imgName = [];
      //alert("storedb");
      showToast($cordovaToast,"Your observation will be submitted when you are next online.");
      console.log("storedb");
      console.log(db);
        var uLatLong = LocationService.GetUserSelectedLocation();
        console.log("SUBMIT USER"+uLatLong.latitude+" SUBMI "+uLatLong.longitude)
        $scope.submitDbParams['group_id']   =  10;
        $scope.submitDbParams['habitat_id'] = 1;
        $scope.submitDbParams['fromDate']   = $scope.newobs.date;
        $scope.submitDbParams['placeName']  = $scope.locationAddress;
        $scope.submitDbParams['areas']      =  "POINT("+uLatLong.longitude+" "+uLatLong.latitude+")"
        $scope.submitDbParams['notes']      = $scope.newobs.notes;
       
        $scope.submitDbParams['imagePath']  = $scope.imgURI;
        //console.log(JSON.stringify($scope.submitDbParams));;
        if($scope.newobs['sciName'].length>0){
          $scope.submitDbParams['recoName'] = $scope.newobs['sciName'];
        } else {
          $scope.submitDbParams['recoName'] = "Unknown";
        }
        if($scope.newobs['commonName'].length>0){
          $scope.submitDbParams['commonName'] = $scope.newobs['commonName'];
        } else {
          $scope.submitDbParams['commonName'] = "";
        }
        $scope.submitDbParams['resourceListType'] = "ofObv" ;
        $scope.submitDbParams['agreeTerms'] = "on";
        if($scope.userGroupId !=null && $scope.userGroupId.length>0) {
          $scope.submitDbParams['userGroupsList'] = $scope.userGroupId
        }
        //alert("came");
        console.log(JSON.stringify($scope.submitDbParams));
        var query = "INSERT INTO observation (status,obslist) VALUES (?,?)";
        $cordovaSQLite.execute(db, query, ["PENDING",JSON.stringify($scope.submitDbParams)]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            //alert("transacted");
        }, function (err) {
          //alert(err);
            console.error(err);
        });
    }

    function executeRequest(){
      $state.go("app.home");
      showToast($cordovaToast,"Your observation will be submitted shortly");

      $scope.times = 0;
      var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var token = tokenvar1.userKey;
      var appkey = "a4fbb540-0385-4fff-b5da-590ddb9e2552";//"fc9a88b5-fac9-4f01-bc12-70e148f40a7f";
      $scope.count =0;
      $scope.newImageStr = [];
      console.log($scope.newobs);
       var options = new FileUploadOptions();
       
        for(var i = 0;i < $scope.imgURI.length; i++){
          var imageLink = $scope.imgURI[i]['path'] ;
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
              //alert("parse");
              console.log("win parsing "+ $scope.count +" called parse resource");
              console.log(Object.keys($scope.newImageStr).length);
              parseResourceDetails();
             }
          }
          function fail(err){
            $scope.times++;
            //alert(err);
            if($scope.times == 1){
            statusCheck();
          }
            console.log("error:fail " + JSON.stringify(err));
          }
          

          function parseResourceDetails(){
            var count1 = 0;
            console.log("newImgstr" + Object.keys($scope.newImageStr).length);
            //alert(Object.keys($scope.newImageStr).length);
            for(var i=0; i<Object.keys($scope.newImageStr).length; i++){
              //alert()
              count1++;
              $scope.submitObsParams["file_"+(i+1)] = $scope.newImageStr[i];
              $scope.submitObsParams["type_"+(i+1)] = "IMAGE";
              $scope.submitObsParams["license_"+(i+1)] = "CC_BY";
              
              if(count1 == Object.keys($scope.newImageStr).length){
                //alert("entered");
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
            $scope.failedObs = {};

            $scope.failedObs['recoName'] = sciName ;
            $scope.failedObs['commonName'] = commonName ;
            //$scope.failedObs['status'] =
            $scope.failedObs['fromDate'] = $scope.newobs.date;
            $scope.failedObs['placeName'] = $scope.locationAddress;
            $scope.failedObs['notes'] = obsNotes ;
            $scope.failedObs['imagePath'] = $scope.imgURI;

            //NewObservationService.SetStatus(sciName, commonName, "FAILURE", $scope.newobs.date, $scope.locationAddress, obsNotes, $scope.imgURI);
             var query = "INSERT INTO observation (status,obslist) VALUES (?,?)";
              $cordovaSQLite.execute(db, query, ["FAILED",JSON.stringify($scope.failedObs)]).then(function(res) {
                  console.log("INSERT ID -> " + res.insertId);
                  //alert("transacted");
              }, function (err) {
                //alert(err);
                  console.error(err);
              });
          }

          function submitObservationFinally(){
            var uLatLong = LocationService.GetUserSelectedLocation();
            console.log("SUBMIT USER"+uLatLong.latitude+" SUBMI "+uLatLong.longitude)
            $scope.submitObsParams['group_id']   =  10;//829;//10;
            $scope.submitObsParams['habitat_id'] =  1;//267835; //1;
            $scope.submitObsParams['fromDate']   = $scope.newobs.date;
            $scope.submitObsParams['placeName']  = $scope.locationAddress;
            $scope.submitObsParams['areas']      =  "POINT("+uLatLong.longitude+" "+uLatLong.latitude+")"
            $scope.submitObsParams['notes']      = $scope.newobs.notes;
          
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
              
              //alert("success" + obsResponse.data.success);
              if(obsResponse.data.success == false){

               statusCheck();
              }
              console.log(obsResponse);
            },
            function(err){
              //alert("Nosuccess");
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
         template: '<ion-list class="item-icon-right">                                '+
                   '  <ion-item class="item " id="uGroup{{usrgrps.id}}" ng-repeat="usrgrps in usrGrp " ng-click="uploadTo({{usrgrps.id}});" > '+
                   '    {{usrgrps.name}}                             '+
                   '<i ng-if="userGroupId.indexOf(usrgrps.id) > -1" class="icon ion-checkmark-round" style="font-size: 18px;right: -7px;"></i>'+
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

    if($scope.imgURI.length == 10){
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
 var z=0;
  $scope.addImage = function(type) {
    
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
      /*var link = imageUrl;
      z++;
      $scope.imgURI.push({"id":z,"path":link});
      console.log($scope.imgURI);*/
      //console.log($scope.imageLink);
      z++;
      onImageSuccess(imageUrl);
 
       function onImageSuccess(fileURI) {
          createFileEntry(fileURI);
       }
       
       function createFileEntry(fileURI) {
          window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
       }
       
       // 5
       function copyFile(fileEntry) {
         var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
         var newName = makeid() + name;
         
         window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
         fileEntry.copyTo(fileSystem2,newName,onCopySuccess,fail);
         },
         fail);
       }
       
       // 6
       function onCopySuccess(entry) {
         $scope.$apply(function () {
          //alert(urlForImage(entry.nativeURL));
         $scope.imgURI.push({"id":z,"path":urlForImage(entry.nativeURL)});
         });
       }
       
       function fail(error) {
          console.log("fail: " + error.code);
       }
       
       function makeid() {
         var text = "";
         var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
         
         for (var i=0; i < 5; i++) {
           text += possible.charAt(Math.floor(Math.random() * possible.length));
         }
         return text;
       }







  }, function(err) {
            // An error occured. Show a message to the user
      });

}

  function urlForImage(imageName) {
    //alert($scope.imgURI.length);
    console.log(imageName);
    //alert("y r u cmg here");
    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;
    console.log(cordova.file.dataDirectory);
    return trueOrigin;
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

$scope.removeImage = function(id){
//alert($scope.imgURI.length);
  for(var i=0; i<$scope.imgURI.length;i++){
    if($scope.imgURI[i]['id']==id){
      $scope.imgURI.splice(i,1);
      break;
    }
  }
  console.log($scope.imgURI);
  $('#imgContent #'+id).hide();

//alert(id);
}

$scope.gps = function(){
  
  var inter = internetCheck($ionicPopup);
  if(inter == false){
    return;
  }else {
    $('ion-nav-bar').addClass('hide');
    $state.go("app.gps");
  }
}

});




appne.controller('newobs2', function($scope, $state, LocationService) {

  //alert("hi");
  });

appne.controller('ViewOnMapController', function($scope, $state, BrowseService) {

  //alert("hi");
  var ListObsDetails=BrowseService.getObsList();
  /*alert(ListObsDetails[0]['topology']);

  var lat = ListObsDetails[0]['topology'].split("(")[1].split(" ")[0];
  var lng1 = ListObsDetails[0]['topology'].split("(")[1].split(" ")[1];
    var lng = lng1.split(")")[0];
    console.log(lat,lng);*/

var myOptions = {
      center: new google.maps.LatLng(75.13991099999998, 27.6094),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP

    };
    var map = new google.maps.Map(document.getElementById("map"), myOptions);

    var marker, i;
    //alert(ListObsDetails.length);
    for (var i = 0; i < ListObsDetails.length; i++){
      var lng = ListObsDetails[i]['topology'].split("(")[1].split(" ")[0];
      var lat1 = ListObsDetails[i]['topology'].split("(")[1].split(" ")[1];
      var lat = lat1.split(")")[0];
      latlngset = new google.maps.LatLng(lat, lng);
      //alert(latlngset);
      var marker = new google.maps.Marker({  
          map: map, position: latlngset  
        });
        map.setCenter(marker.getPosition())
    
    var CommonName, sciName;
      if(Object.keys(ListObsDetails[i].maxVotedReco).length >0){

        if(ListObsDetails[i].maxVotedReco.hasOwnProperty('commonNamesRecoList')){
              CommonName = ListObsDetails[i].maxVotedReco.commonNamesRecoList[0]["name"];
          }else {
            CommonName="";
          }

        if(ListObsDetails[i].maxVotedReco.hasOwnProperty('sciNameReco')){
                sciName = ListObsDetails[i].maxVotedReco.sciNameReco.name;

          } 
      
    }else{
      sciName="Unknown";
      CommonName="";
    }
    var iconUrl=ListObsDetails[i].thumbnail;
    var id=ListObsDetails[i].id;

    //$scope.item = {"id":id,"iconUrl":iconUrl, "scientificName":sciName, "CommonName":commonname}
    //console.log($scope.item);
      var content = '<ion-list class="item-icon-right"> <ion-item class="item-thumbnail-left"> <a style="margin-left: -105px;text-decoration: none;" href="#/app/browsedetails/'+id+'"><img height="50px" src="'+iconUrl+'" alt="'+sciName+' photo"><p style="margin-left: 58px;margin-top: -44px;font-size: 19px;color:black;">'+sciName+'</p><p style="margin-left: 55px;margin-top: -8px;font-size: smaller;color:#666;">'+CommonName+'</p><i class="icon ion-chevron-right " style="right:-8px;"></i></ion-item></ion-list>'//<div><h1 onclick=\"alert('clicked')\">hi</h1></div>"

     var infowindow = new google.maps.InfoWindow()

    google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
          return function() {
             infowindow.setContent(content);
             infowindow.open(map,marker);
          };
      })(marker,content,infowindow)); 

    }

});

appne.controller('GPSController', function($scope, $state,$http, LocationService) {

//alert($location.path());
setTimeout(function(){
      if($('button').hasClass('hide')){
        //alert('came');
        $('button').removeClass('hide');
        //$('ion-view').css('padding-top','44px');
        //$('ion-content').css('margin-top','43px');
      }else{
        //$('ion-view').css('padding-top','0');
        //$('ion-content').css('margin-top','-1px');
      }
    },100);
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
//alert("gps");
        
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
          //alert($('#checking').html());
          updating("Locationval");
          $state.go("app.newObservation",{},{reload:false});
        }

         $scope.getLocation = function(){
          //console.log($('#Locationval').html());
          var data = LocationService.GetUserSelectedLocation()//.then(function(data){
          console.log(data);
          var code="https://maps.googleapis.com/maps/api/geocode/json?latlng="+data.latitude+","+data.longitude;
      
           $http.get(code).success(function(dataval){
            //console.log(dataval.results[0]);
              
               
                LocationService.SetUserSelectedLocAdd(dataval.results[0]["formatted_address"]);
              $state.go("app.editDetails",{},{cache:true});
            });
          
         
        }

        function updating(id){
          var data = LocationService.GetUserSelectedLocation()//.then(function(data){
          console.log(data);
      var code="https://maps.googleapis.com/maps/api/geocode/json?latlng="+data.latitude+","+data.longitude;
      
      $http.get(code).success(function(dataval){
            //console.log(dataval.results[0]);
            if(id == 1){
              //alert("came");
              LocationService.SetUserSelectedLocAdd(dataval.results[0]["formatted_address"]);
            }else{
            $("#"+id).text(dataval.results[0]["formatted_address"])
            }
          });
        }

});




appne.controller('HomeController',[ '$scope', '$state', '$window', '$timeout', '$http', 'BrowseService','LocationService', '$ionicSideMenuDelegate','UserGroupService','$cordovaSQLite', '$ionicPlatform', 'ApiEndpoint', 'NewObservationService' ,'$filter' , '$ionicHistory',function($scope,$state,$window,$timeout,$http,BrowseService,LocationService,$ionicSideMenuDelegate, UserGroupService, $cordovaSQLite, $ionicPlatform, ApiEndpoint, NewObservationService,$filter,$ionicHistory){
  
//$ionicSideMenuDelegate.canDragContent(true);
//$cordovaSQLite.deleteDB("observationQueue.db");
 //$ionicPlatform.on('online', pendingObservation);
//alert($ionicPlatform.on('online', pendingObservation, false));
  var check ;
  var editCheck = 0; 
  //$ionicHistory.clearCache();
  $scope.goNewObs = function(){
       var tokenVal = localStorage.getItem('USER_KEY');
      var tokenVar = JSON.parse(tokenVal);
      var countVal = tokenVar.nId;
        if(countVal==0){
          tokenVar.nId = 1;
          localStorage.setItem('USER_KEY',JSON.stringify(tokenVar));
          $state.go("app.newObservation");
        }else{
              $state.go("app.newObservation",null,{reload:true});

        }
  }
  //$scope.showButton = false;
  //alert(Icheck());
  /*offlinesubmission();
  $scope.callMethod = 0;
  function offlinesubmission(){
    var query = "SELECT count(ID) FROM OBSERVATION WHERE STATUS= 'PENDING' ";
    
    $cordovaSQLite.execute(db, query).then(function(res) {
      console.log(res);
      $scope.pendingCount = res.rows['length'];
      if(check == true){

      pendingObservation();
    }
      //alert(JSON.stringify(res));
    }, function (err) {
      alert(err);
        console.error("newwww"+err);
    });
    
  }*/
   $ionicPlatform.ready(function() {
    check = Icheck();
  if(check == true){

    pendingObservation();
  }
  });
   var obsid;
 function pendingObservation(){
  //$scope.callMethod++;
  //alert('pendingObservation');
  $scope.offlineSubmit ={};
  var query = "SELECT * FROM OBSERVATION WHERE STATUS= ? ORDER BY ROWID ASC LIMIT 1 ";
  //alert(query);
  $cordovaSQLite.execute(db, query, ['PENDING']).then(function(res) {
      //alert(res.rows.length);
      if(res.rows.length >0){
        $scope.idVal = res.rows.item(0)['id'];
        $scope.offlineSubmit = JSON.parse(res.rows.item(0)['obslist']);
        
        $scope.offlineSubmit['fromDate'] = $filter('date')( $scope.offlineSubmit.fromDate,"dd/MM/yyyy" );
        //alert($scope.offlineSubmit['fromDate']);
        console.log($scope.offlineSubmit);
        fileUpload();
      }
    }, function (err) {
      //alert(err);
        console.error("newwww"+err);
    });


  }
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






 function fileUpload(){
  //alert("fileUpload");
      $scope.times = 0;
      var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var token = tokenvar1.userKey;
      var appkey = "a4fbb540-0385-4fff-b5da-590ddb9e2552";//"fc9a88b5-fac9-4f01-bc12-70e148f40a7f";
      $scope.count =0;
      $scope.newImageStr = [];
      //console.log($scope.newobs);
       $scope.nativeImg = [];



       for(var i = 0;i < $scope.offlineSubmit['imagePath'].length; i++){
       // alert('came');
        editCheck = 1;
          var imageLink = $scope.offlineSubmit['imagePath'][i]['path'] ;
          if(imageLink.match("http://")){

           var nameCreate =  "/"+imageLink.split('//')[2];

              $scope.newImageStr.push(nameCreate);
              $scope.count++;
              if($scope.count == $scope.offlineSubmit['imagePath'].length){
              //alert("parse");
              console.log("win parsing "+ $scope.count +" called parse resource");
              //console.log(Object.keys($scope.newImageStr).length);
              storeResourceDetails();
             }
          } else {
              $scope.nativeImg.push(imageLink);
          }
        }



       var options = new FileUploadOptions();
       //alert($scope.offlineSubmit['imagePath'].length);
       //alert($scope.offlineSubmit['imagePath'][0]['path']);
        //for(var i = 0;i < $scope.offlineSubmit['imagePath'].length; i++){
          //var imageLink = $scope.offlineSubmit['imagePath'][i]['path'] ;
          for(var i = 0;i < $scope.nativeImg.length; i++){
          var imageLink = $scope.nativeImg[i] ;
          //alert('file up');
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
          ft.upload(imageLink, uri, succes, failed, options);
        }

      }

          function succes(data){
            //alert("file upload success");
            var parsedData = JSON.parse(data.response);
           

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

             if($scope.count == $scope.offlineSubmit['imagePath'].length){
              //alert("parse");
              console.log("win parsing "+ $scope.count +" called parse resource");
              console.log(Object.keys($scope.newImageStr).length);
              storeResourceDetails();
             }
          }
          function failed(err){
            $scope.times++;
            //alert("file transfer"+err);
            if($scope.times == 1){
            storeStatusCheck();
          }
            console.log("error:fail " + JSON.stringify(err));
          }
          

          function storeResourceDetails(){
            delete $scope.offlineSubmit['imagePath'];
            var count1 = 0;
            console.log("newImgstr" + Object.keys($scope.newImageStr).length);
            //alert(Object.keys($scope.newImageStr).length);
            for(var i=0; i<Object.keys($scope.newImageStr).length; i++){
              //alert()
              count1++;
              $scope.offlineSubmit["file_"+(i+1)] = $scope.newImageStr[i];
              $scope.offlineSubmit["type_"+(i+1)] = "IMAGE";
              $scope.offlineSubmit["license_"+(i+1)] = "CC_BY";
              
              if(count1 == Object.keys($scope.newImageStr).length){
                //alert("entered");
                submitObservation();
              }
            }
            //console.log($scope.submitObsParams);
            
          }

          function storeStatusCheck(){
            //alert("store status check");
            var sciName;
            var commonName;
            var obsNotes;
            if($scope.offlineSubmit['recoName'] != "Unknown"){
               sciName = $scope.offlineSubmit['recoName'];
            } else {
              sciName = "Unkown";
            }
            if($scope.offlineSubmit.hasOwnProperty('commonName')){
              if($scope.offlineSubmit['commonName'].length>0){
               commonName = $scope.offlineSubmit['commonName'];
             }
            } else {
              commonName = "";
            }
            if($scope.offlineSubmit['notes'].length>0){
               obsNotes = $scope.offlineSubmit['notes'];
            } else {
              obsNotes = "";
            }
            $scope.failedObs = {};

            $scope.failedObs['recoName'] = sciName ;
            $scope.failedObs['commonName'] = commonName ;
            //$scope.failedObs['status'] =$filter('date')( $scope.newobs.date,"dd/MM/yyyy" );
            $scope.failedObs['fromDate'] = $filter('date')( $scope.offlineSubmit.fromDate,"dd/MM/yyyy" );
            $scope.failedObs['placeName'] = $scope.offlineSubmit['placeName'];
            $scope.failedObs['notes'] = obsNotes ;
            $scope.failedObs['imagePath'] = $scope.offlineSubmit['imagePath'];
            //alert($scope.failedObs);
            //console.log()
            //NewObservationService.SetStatus(sciName, commonName, "FAILURE", $scope.newobs.date, $scope.locationAddress, obsNotes, $scope.imgURI);
             var query = "UPDATE OBSERVATION SET STATUS='FAILED', OBSLIST='"+JSON.stringify($scope.failedObs)+"' WHERE ID ="+$scope.idVal;
            // alert(query);
              $cordovaSQLite.execute(db, query).then(function(res) {
                  //console.log("INSERT ID -> " + res.insertId);
                  callOffline();
                  //alert("transacted");
              }, function (err) {
                //alert(err);
                  console.error("erorrrrrr   "+err);
              });
              
          }

          function submitObservation(){
            
            
            if($scope.offlineSubmit['recoName'] == "Unknown"){
                delete $scope.offlineSubmit['recoName'];
            }
            if($scope.offlineSubmit['commonName'] == ""){
              delete $scope.offlineSubmit['commonName'];
            }
            
            console.log($scope.offlineSubmit);
            if($scope.offlineSubmit.hasOwnProperty('observationId')){
              obsid = $scope.offlineSubmit['observationId'];
              delete $scope.offlineSubmit['observationId'];
            }

            //alert($scope.offlineSubmit['fromDate']);
          if(editCheck==0){
            NewObservationService.SubmitObservation($scope.offlineSubmit).then(function(obsResponse){
              
              //alert("success" + obsResponse.data.success);
              if(obsResponse.data.success == true){
                var query1 = "DELETE FROM OBSERVATION WHERE ID ="+$scope.idVal;
               //alert(query1);
                $cordovaSQLite.execute(db, query1).then(function(result) {
                  callOffline();
                    //console.log("INSERT ID -> " + res.insertId);
                    //alert("transacted");
                }, function (err) {
                  //alert(err);
                    console.error("erorrrrrr   "+err);
                });

              }
              if(obsResponse.data.success == false){

               storeStatusCheck();
              }
              console.log(obsResponse);
            },
            function(err){
             // alert("Nosuccess");
              console.log(err);
               storeStatusCheck();
            });

          }
        else {

          NewObservationService.EditSubmitObservation($scope.offlineSubmit,obsid).then(function(obsResponse){
              
              //alert("success" + obsResponse.data.success);
              if(obsResponse.data.success == true){
                var query1 = "DELETE FROM OBSERVATION WHERE ID ="+$scope.idVal;
               //alert(query1);
                $cordovaSQLite.execute(db, query1).then(function(result) {
                  callOffline();
                    //console.log("INSERT ID -> " + res.insertId);
                    //alert("transacted");
                }, function (err) {
                  //alert(err);
                    console.error("erorrrrrr   "+err);
                });

              }
              if(obsResponse.data.success == false){
                //alert("error1");
               storeStatusCheck();
              }
              console.log(obsResponse);
            },
            function(err){
              //alert("Nosuccess");
              console.log(err);
               storeStatusCheck();
            });

          }
        }

          function callOffline(){
            if(check == true){
              pendingObservation();
            }
          }


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

appne.controller('ListController',[ '$scope', '$state','$http', 'BrowseService', '$ionicPopup','UserGroupService', function($scope,$state,$http,BrowseService,$ionicPopup,UserGroupService){
  internetCheck($ionicPopup);
  $scope.showButton = true;
  console.log("hi");
  $scope.details = [];
  $scope.innerDetails = [];
  $(".modal").show();

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
  UserGroupService.GetUserGroups().then(function(groups){

    console.log(groups['data']['model']);
    UserGroupService.SetUserGroups(groups['data']['model']['userGroupInstanceList']);
  });

  $scope.enableMap = function(){
   // alert('map');
    $state.go("app.viewMap");
  }
 
}]);

appne.controller('ObsNearByCtrl', [ '$scope', '$state', '$http', 'BrowseService','LocationService', '$ionicPopup',function($scope,$state,$http,BrowseService,LocationService,$ionicPopup){

internetCheck($ionicPopup);
 $scope.details = [];
  $scope.innerDetails = [];

$(".modal").show();

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

  $scope.enableMap = function(){
    //alert('map');
    $state.go("app.viewMap");
  }
  
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

function Icheck(){
  var connectionVal ;
  console.log(window.Connection);
  if(window.Connection) {
    //alert("connection");
    if(navigator.connection.type == Connection.NONE) {
      
      connectionVal = false;
    } else {
      connectionVal = true;
    }
  }
  return connectionVal;
}






























