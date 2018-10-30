'use strict';

/* Controllers */
//TODO: separate out the controllers in to their own files
angular.module('myApp.controllers', [])
  .controller('GameListCtrl', ['$scope', '$sails', function($scope, $sails) {

	  	// To easily add new items to the collection.
	  $scope.newGame = {};

	  $scope.games = [];

    $scope.loadingPromise = $sails.get('/game?where={"has_mapping": true, "clone_of":null}&limit=500&sort=full_name ASC').success(function (data) {

      //need to sort the scores so we get the first one
      //probably should do this on the backend
      data.forEach(function(game){
        game.scores.sort(function(a, b){
          return a.rank - b.rank;
        });

        //games.push({id: game.id, name: game.name, full_name: game.full_name, scores: [game.scores[0]]});
      });


      $scope.games = data;

    })
    .error(function (data) {
      console.error(data);
    });

  }])
  .controller('GameDetailCtrl', ['$scope', '$routeParams', '$sails', '$modal', function($scope, $routeParams, $sails, $modal) {

    $scope.game = {};
    $scope.scores = [];
    $scope.clones = [];

    function getScores(gameId){
      return $sails.get("/score?sort=rank ASC&game=" + gameId)
        .error(function (data) {
          console.error(data);
        });
    }

    $sails.get("/game/" + $routeParams.id, {populate: []}).success(function (game) {

      //always look up the non clone name otherwise we wont find the image
      var imgName = (game.clone_of_name) ? game.clone_of_name : game.name;
      game.imgUrl = "http://sifty.tk/hiscores/titles/" + imgName + ".png";
      $scope.game = game;

      getScores(game.id).success(function(scores){
        $scope.scores = scores;
      });


      $sails.get('/game?clone_of=' + game.id, {populate: []}).success(function (clones) {

        clones.forEach(function (clone) {

          getScores(clone.id).success(function(scores){
            if (scores.length != 0) {
              clone.scores = scores;
              $scope.clones.push(clone);
            }
          });

        });
      });
    }).error(function (data) {
      console.error(data);
    });


//      $sails.on("game", function (message) {
//        console.log('got game detail message');
//        console.log(message);
//
//        if (message.verb === "updated") {
//
//          angular.extend($scope.game, message.data);
//
//        } else if (message.verb === 'addedTo') {
//          //for now just refetch the game TODO: just fetch the score that was added
//          $sails.get("/game/" + message.id).success(function (data) {
//            $scope.game = data;
//          })
//          .error(function (data) {
//            alert('Houston, we got a problem!');
//          });
//        }
//      });





//    $sails.on("score", function (message) {
//      console.log('got score detail message');
//      console.log(message);
//
//      if (message.verb === "created") {
//        $scope.scores.push(message.data);
//      }
//    });


    $scope.openClaimScore = function (score) {

      var modalInstance = $modal.open({
        templateUrl: 'score-claim.html',
        controller: 'ClaimScoreModalInstanceCtrl',

        resolve: {
          selectedScore: function () {
            return score;
          }
        }
      });

      modalInstance.result.then(function (scoreToClaim) {
        //need to save the score
        $sails.post('/score/' + scoreToClaim.id + '/claim', { alias: scoreToClaim.name.trim() }).success(function(updatedScore){
          //probably a correct binding way of doing this
          if($scope.game.id === updatedScore.game){
            getScores(updatedScore.game).success(function(scores){
              $scope.scores = scores;
            });
          } else {
            $scope.clones.forEach(function (clone) {
              if (clone.id === updatedScore.game) {
                getScores(clone.id).success(function (scores) {
                    clone.scores = scores;
                });
              }
            });
          }

        });
        //$scope.selected = selectedItem;
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });



    };




  }])
  .controller('ClaimScoreModalInstanceCtrl', ['$scope', '$modalInstance', 'selectedScore', function($scope, $modalInstance, selectedScore){

    $scope.score = selectedScore;

    $scope.save = function () {
      $modalInstance.close($scope.score);
    };

    $scope.cancel = function () {
      $scope.score.name = '';
      $modalInstance.dismiss('cancel');
    };
  }])
  .controller('HomeCtrl', ['$scope', '$sails', '$location', function($scope, $sails, $location) {

    $scope.selectedGame = {};

    $scope.games = [];
    $scope.lastPlayedGames = [];
    $scope.lastestScores = [];
    $scope.topPlayers = [];

    $sails.get('/game?limit=500&sort=full_name ASC&populate=[]&where={"has_mapping":true,"clone_of":null}').success(function (data) {
        $scope.games = data;
        $scope.selectedGame = $scope[0];

        $scope.$watch('selectedGame', function ( game ) {
          if(game){
            $location.path('games/' + game.id );
          }
        });
    });

    $scope.lastPlayedLoading = $sails.get('/game?sort=last_played DESC&limit=10&where={"has_mapping": true,"last_played": {"!": null}}&populate=[]').success(function (data){
      $scope.lastPlayedGames = data;
    });

    $scope.latestScoresLoading = $sails.get('/score?sort=updatedAt DESC&limit=10&where={"updatedAt": {"!": null}}').success(function (data){
      $scope.lastestScores = data
    });

    $scope.topPlayersLoading = $sails.get('/game/top_players').success(function (data){
      //just want the top 10 for now
      $scope.topPlayers = data.slice(0,10);
    });

    $sails.on("game", function (message) {
      console.log('got home game message');
      console.log(message);
      if (message.verb === "updated") {
        //$scope.lastPlayedGames.unshift(message.data);
        //for now lest just refresh the full list when we get an updated record
        $sails.get('/game?sort=last_played ASC&limit=5').success(function (data){
          $scope.lastPlayedGames = data;
        });
      }
    });




  }])
  .controller('UserCreateCtrl', ['$scope', '$sails', '$location', function($scope, $sails, $location) {

    $scope.user = {};

    $scope.update = function(user) {
      var aliases = [];
      $scope.user.aliases.split(',').forEach(function (alias){
        aliases.push({name: alias});
      });

      //FIXME: this causes the alias field on the form to update as we are changeing the object
      var newUser = angular.copy(user);
      newUser.aliases = aliases;

      $sails.post('/user', newUser).success(function (data){
        $location.path('/users/' + data.id );
      });
    };
  }])
  .controller('UserDetailCtrl', ['$scope', '$routeParams', '$sails', function($scope, $routeParams, $sails) {

    var userId = $routeParams.id;

    $scope.user = {};
    $scope.topGames = [];


   $sails.get('/user/' + userId ).success(function (data){
      $scope.user = data;
    });

    $sails.get('/user/player_scores/' + userId ).success(function (data){
      $scope.topGames = data;
    });

    $sails.get('/user/' + userId + '/points').success(function(data){
      $scope.user.points = data.total_points;
    });

  }])
  .controller('SettingsCtrl', ['$scope', '$sails', function($scope, $sails) {
    //do nothin fo now, settings page is just for enabling notifications
  }])
  .controller('GameUploadCtrl', ['$scope', '$sails', function($scope, $sails) {
    
  }])
  .controller('UserListCtrl', ['$scope', '$sails', function($scope, $sails) {

      $scope.users = [];

      $sails.get("/user").success(function (data) {
        $scope.users = data;
      })
      .error(function (data) {
        console.error(data);
      });

  }])
  .controller('SearchCtrl', ['$scope', '$sails', '$http', '$location', function($scope, $sails, $http, $location) {

    $scope.selected = null;

    $scope.onSelected = function($item, $model, $label){
      $location.path('/games/' + $item.id );
      $scope.selected = null;
    };

    $scope.games = [];
    //sails socket io not working (probably hasn't connected when this is called)
    $http.get("/game/search_list").success(function (data) {
      $scope.games = data;
    })
    .error(function (data) {
        console.error(data);
    });

  }])
  .controller('GameDecodeDetailCtrl', ['$scope', '$sails', '$http', '$routeParams', 'mamedecoder', function($scope, $sails, $http, $routeParams, mamedecoder) {

    var gameId = $routeParams.id;
    $scope.game = {};

    $scope.rawscore = [];

    $scope.rawscore = {};
    $scope.asciiDecoded = "";

    $scope.startByte = null;
    $scope.endByte = null;

    $scope.selectedBytes = "";

    $scope.decodeMapping = "";
    $scope.fileType = 'hi';

    $scope.decodedScores = "";

    $scope.decodings = {
      'bcd': null,
      'bcdReversed': null,
      'packedBcd': null,
      'packedBcdReversed': null,
      'hexToDecimal': null,
      'reverseHexToDecimal': null
    };

      $scope.selectedTab = null;
      $scope.tabSelected = function(tab){
        $scope.selectedTab = tab;
      };

    var hexToAscii = function (hexString) {
      var hex = hexString.toString();//force conversion
      var str = '';
      for (var i = 0; i < hex.length; i += 2) {
        var charCode = parseInt(hex.substr(i, 2), 16);
        //only want printable ascii codes
        str += (charCode >= 32 && charCode <= 126) ? String.fromCharCode(charCode) : ".";
      }
      return str;
    };

    $scope.updateSelected = function(){

      var selectedBytes = window.getSelection().toString().replace(/(\r\n|\n|\r|\s)/gm,"");

      $scope.selectedBytes = selectedBytes;

      for (var key in $scope.decodings) {
        if($scope.decodings.hasOwnProperty(key)){

          $scope.decodings[key] = (selectedBytes == "") ? "" : mamedecoder.decodeBytes(selectedBytes, key);
        }
      }
    };

    $scope.decodeScores = function(){
      var mapping = $scope.decodeMapping;

      try {
        var mappingJson = JSON.parse(mapping);

        var postData = {
          gameMapping: mappingJson,
          rawBytes: $scope.selectedTab.bytes,
          fileType: $scope.fileType
        };

        $http.post('/game/' + gameId + '/mapping', postData).success(function(data){
          $scope.decodedScores = JSON.stringify(data, null, 2);
        });

      } catch (e) {
        alert("invalid decode mapping")
      }
    };


    $http.get('/game/' + gameId).success(function(game){
      $scope.game = game;
    });

    var getRawScores = function (){
      $http.get('/rawscore', { params: {game_id: gameId, file_type: $scope.fileType, sort: 'createdAt DESC' }})
          .success(function(data){

            data.forEach(function(rawScore){
              // rawScore.byteArray = rawScore.bytes.match(/.{1,2}/g);
              rawScore.formattedBytes = rawScore.bytes.match(/.{1,2}/g).join(' ').match(/.{1,48}/g).join('\n');
              rawScore.asciiDecoded = hexToAscii(rawScore.bytes).match(/.{1,1}/g).join(' ').match(/.{1,24}/g).join('\n');
            });

            $scope.rawscores = data;

            $scope.selectedTab = data[0];

            //console.log(hexToAscii($scope.rawscore.bytes));

          });
    };

    getRawScores();

    //var getMappingHttpPromise = $http.get('/game/' + gameId + '/mapping', { params: { file_type: $scope.fileType }, cache: false});

    function handleMappingResponse (data){
      if(data != 'null'){
        $scope.decodeMapping = JSON.stringify(data, null, 2);
      } else {
        $scope.decodeMapping = '';
        alert("No mapping for this file type");
      }

    }

    $http.get('/game/' + gameId + '/mapping', { params: { file_type: $scope.fileType }, cache: false}).success(handleMappingResponse);

    $scope.getMapping = function(){
      getRawScores();
      $http.get('/game/' + gameId + '/mapping', { params: { file_type: $scope.fileType }, cache: false}).success(handleMappingResponse)
    };




  }])
  .controller('AdminCtrl', ['$scope', '$http', function($scope, $http){

    $scope.updateHasMapping = function(){
      $http.post('/game/update_has_mapping').success(function(updatedGames){
        $scope.updatedGames = updatedGames;

        if(updatedGames.length > 0){
          $scope.updateMappingMessage = "Updated " + updatedGames.length + " game(s)";
        } else {
          $scope.updateMappingMessage = 'All "has_mapping" flags correct';
        }

      });
    }
  }]);
