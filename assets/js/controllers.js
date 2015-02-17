'use strict';

/* Controllers */
//TODO: separate out the controllers in to their own files
angular.module('myApp.controllers', [])

  .controller('AuthLoginCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

    //$scope.user = { email: '', password: ''};

    //$scope.login = function(){
    //  $http.post('/auth/login', { email: $scope.user.email, password: $scope.user.password }).success(function(data){
    //    $location.path('#/home');
    //  });
    //}
  }])
  .controller('AuthResetCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

    $scope.identifier = null;
    $scope.emailSent = false;

    $scope.reset = function(){
      $http.post('/auth/reset', { email: $scope.identifier }).success(function(data){
        $scope.emailSent = true;
      });
    }
  }])
  .controller('RegisterCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

    $scope.user = {};

    $scope.update = function(user) {
      //var newUser = angular.copy(user);
      //newUser.aliases = aliases;

      $http.post('/user', user).success(function (data){
        //$location.path('/users/' + data.id );

        //select group and add machine

        $http.post('/auth/local', { identifier: $scope.user.email, password: $scope.user.password }).success(function(data){
          $location.path('/register-setup');
        });


      });
    };


  }])
  .controller('RegisterSetupCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

    $scope.groups = [];
    $scope.machines = [];
    $scope.aliases = [];
    $scope.selectedGroup = {};
    $scope.selectedMachine = {};
    //
    //$scope.user.aliases.split(',').forEach(function (alias){
    //  aliases.push({name: alias});
    //});

    $scope.save = function(){
      var data = {
        group: $scope.selectedGroup,
        machine: $scope.selectedMachine
      };

      data.machine.aliases = $scope.aliases.split(',');

      $http.post('/user/register_setup', data).success(function(result){
        $location.path('#/home');
      });
    };

    $http.get('/group?populate=[]').success(function(groups){
      $scope.groups = groups;
      $scope.selectedGroup = $scope.groups[0];

      //TODO: fetch other machines on group change
      $http.get('/group/' + $scope.selectedGroup.id + '/machine').success(function(machines){
        $scope.machines = machines;
        $scope.selectedMachine = $scope.machines[0];
      });
    });


  }])
  .controller('GameListCtrl', ['$scope', '$http', function($scope, $http) {

	  	// To easily add new items to the collection.
	  $scope.newGame = {};

	  $scope.games = [];

    $scope.loadingPromise = $http.get('/game?where={"has_mapping": true, "clone_of":null}&limit=500&sort=full_name ASC').success(function (data) {

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
  .controller('GameDetailCtrl', ['$scope', '$routeParams', '$http', '$modal', function($scope, $routeParams, $http, $modal) {

    $scope.game = {};
    $scope.scores = [];
    $scope.clones = [];

    function getScores(gameId){
      return $http.get("/score?sort=rank ASC&game=" + gameId)
        .error(function (data) {
          console.error(data);
        });
    }

    $http.get("/game/" + $routeParams.id, {populate: []}).success(function (game) {

      //always look up the non clone name otherwise we wont find the image
      var imgName = (game.clone_of_name) ? game.clone_of_name : game.name;
      game.imgUrl = "http://sifty.tk/hiscores/titles/" + imgName + ".png";
      $scope.game = game;

      getScores(game.id).success(function(scores){
        $scope.scores = scores;
      });


      $http.get('/game?clone_of=' + game.id, {populate: []}).success(function (clones) {

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


//      $http.on("game", function (message) {
//        console.log('got game detail message');
//        console.log(message);
//
//        if (message.verb === "updated") {
//
//          angular.extend($scope.game, message.data);
//
//        } else if (message.verb === 'addedTo') {
//          //for now just refetch the game TODO: just fetch the score that was added
//          $http.get("/game/" + message.id).success(function (data) {
//            $scope.game = data;
//          })
//          .error(function (data) {
//            alert('Houston, we got a problem!');
//          });
//        }
//      });





//    $http.on("score", function (message) {
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
        $http.post('/score/' + scoreToClaim.id + '/claim', { alias: scoreToClaim.name.trim() }).success(function(updatedScore){
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
  .controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

    $scope.selectedGame = {};

    $scope.games = [];
    $scope.lastPlayedGames = [];
    $scope.lastestScores = [];
    $scope.topPlayers = [];

    $http.get('/game?limit=500&sort=full_name ASC&populate=[]&where={"has_mapping":true,"clone_of":null}').success(function (data) {
        $scope.games = data;
        $scope.selectedGame = $scope[0];

        $scope.$watch('selectedGame', function ( game ) {
          if(game){
            $location.path('games/' + game.id );
          }
        });
    });

    $scope.lastPlayedLoading = $http.get('/game/play_count').success(function (data){
      $scope.lastPlayedGames = data;
    });

    $scope.latestScoresLoading = $http.get('/score?sort=updatedAt DESC&limit=10&where={"updatedAt": {"!": null}}').success(function (data){
      $scope.lastestScores = data
    });

    $scope.topPlayersLoading = $http.get('/game/top_players').success(function (data){
      //just want the top 10 for now
      $scope.topPlayers = data.slice(0,10);
    });

    //$http.on("game", function (message) {
    //  console.log('got home game message');
    //  console.log(message);
    //  if (message.verb === "updated") {
    //    //$scope.lastPlayedGames.unshift(message.data);
    //    //for now lest just refresh the full list when we get an updated record
    //    $http.get('/game?sort=last_played ASC&limit=5').success(function (data){
    //      $scope.lastPlayedGames = data;
    //    });
    //  }
    //});




  }])
  .controller('UserCreateCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

    $scope.user = {};

    $scope.update = function(user) {
      var aliases = [];
      $scope.user.aliases.split(',').forEach(function (alias){
        aliases.push({name: alias});
      });

      //FIXME: this causes the alias field on the form to update as we are changeing the object
      var newUser = angular.copy(user);
      newUser.aliases = aliases;

      $http.post('/user', newUser).success(function (data){
        $location.path('/users/' + data.id );
      });
    };
  }])
  .controller('UserDetailCtrl', ['$scope', '$location', '$routeParams', '$http', 'Session', function($scope, $location, $routeParams, $http, Session) {


    var userId = null;
    var userDataUrl = '';

    //hacky hack
    if($location.path() === '/users/profile'){
      userId = Session.userId;
      userDataUrl = '/user/profile'
    } else {
      userId = $routeParams.id;
      userDataUrl = '/user/' + userId
    }


    $scope.user = {};
    $scope.topGames = [];


    $http.get(userDataUrl).success(function (data){
      $scope.user = data;
    });

    $http.get('/user/player_scores/' + userId ).success(function (data){
      $scope.topGames = data;
    });

    $http.get('/user/' + userId + '/points').success(function(data){
      $scope.user.points = data.total_points;
    });

    $http.get('/usermachine', { params: {populate: ['machine', 'group'], user: userId }}).success(function(data){
      $scope.usermachines = data;
    });

    $http.get('/usergroup', { params: { populate: ['group'], user: userId } }).success(function(data){
      $scope.usergroups = data;
    });
    //$http.get('/machine?populate=[]').success(function(data){
    //
    //  $scope.machines = data;
    //});

  }])
  .controller('SettingsCtrl', ['$scope', '$http', function($scope, $http) {
    //do nothin fo now, settings page is just for enabling notifications
  }])
  .controller('GameUploadCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.machines = [];
    $scope.selectedMachine = {};

    $http.get('/machine', { params: { populate: [], where: {api_key: {'!': null} } } }).success(function(machines){
      $scope.machines = machines;
      $scope.selectedMachine = $scope.machines[0]
    })
  }])
  .controller('UserListCtrl', ['$scope', '$http', function($scope, $http) {

      $scope.users = [];

      $http.get("/user").success(function (data) {
        $scope.users = data;
      });
      //.error(function (data) {
      //  console.error(data);
      //});

  }])
  .controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Session', function($rootScope, $scope, $location, Session) {

    $scope.$on('user.authed', function(){
      console.log('got user.authed event');
      //$scope.isAuthed = true; //todo: put this higher up in a parent controller/scope
    });


  }])
  .controller('SearchCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

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
  .controller('GameDecodeDetailCtrl', ['$scope', '$http', '$routeParams', 'mamedecoder', function($scope, $http, $routeParams, mamedecoder) {

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
  }])
  .controller('MachineCreateCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){

    var userId = $routeParams.id;

    $scope.machine = {
      usermachine: { alias: null, user: userId}
    };

    $scope.create = function(machine){
      $http.post('/machine', $scope.machine).success(function(resposeData){
        $location.path('/users/' + userId);
      });
    }

  }])
  .controller('MachineDetailCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){

    var machineId = $routeParams.id;

    $scope.machine = {};


    $scope.generate = function(){
      $http.post('/machine/' + machineId + '/new_key', {}).success(function(machine){
        $scope.machine = machine;
      });
    };

    $http.get('/machine/' + machineId).success(function(machine){
      $scope.machine = machine
    });

  }])
  .controller('GroupCreateCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){

    var userId = $routeParams.id;

    $scope.group = {
      name: '',
      description: '',
      usergroups: [{ group: null, user: userId}]
    };

    $scope.create = function(group){
      $http.post('/group', $scope.group).success(function(resposeData){
        $location.path('/users/' + userId);
      });
    }

  }])
  .controller('GroupDetailCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

    var groupId = $routeParams.id;

    $scope.group = {};
    $scope.users = [];

    $http.get('/group/' + groupId).success(function(group){
      $scope.group = group;
    });

    $http.get('/group/' + groupId +  '/user').success(function(users){
      $scope.users = users;
    });

  }]);
