'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('GameListCtrl', ['$scope', '$sails', function($scope, $sails) {
  	//$http.get('games').success(function(data) {
    //	$scope.games = data;
  	//});

	  	// To easily add new items to the collection.
	  $scope.newGame = {};  
	  /** This will:
	  *     1. Add a "items" model to $scope. (pluralized)
	  *     2. Get the data from your http://<examplesite.com>/item thru sailsjs socket get.
	  *     3. Setup socket io so that, when something changes in the sailsjs backend, they will be reflected
	  *        in the angular "items" model.
	  *     4. Watch the "items" model for collection changes in angular (add and removal of items
	  *        and send them to the backend using socket.
	  **/
	  //$sailsBind.bind("game", $scope);


	  $scope.games = [];

    //(function () {
      /*
      $sails.on("message", function (message){
        console.log(message);
      });
    */

      $sails.on("game", function (message) {
        console.log('got socket message');
        //console.log(message);
        if (message.verb === "created") {
          $scope.games.push(message.data);
        }
      });

      $sails.get("/game?has_mapping=true&limit=500&sort=full_name ASC").success(function (data) {

        $scope.games = data;
        $scope.$watchCollection('games', function(newGames, oldGames){
          console.log("game colletion changed");
          //console.log(newGames);

          var addedElements = newGames.filter(function (i) {
              return oldGames.indexOf(i) < 0;
            });


          addedElements.forEach(function (item) {
              if (!item.id) { //if is a brand new item w/o id from the database
                  $sails.post('/game', angular.copy(item));
              }
          });

          //$sails.post()
        });
      })
      .error(function (data) {
        alert('Houston, we got a problem!');
      });


      
    //}());


  }])
  .controller('GameDetailCtrl', ['$scope', '$routeParams', '$sails', function($scope, $routeParams, $sails) {
	  //$sailsBind.bind("game", $scope, { id: $routeParams.id });
///score?game=19

    $scope.game = [];
    $scope.scores = [];
    $scope.clones = [];

    (function () {

      $sails.get("/game/" + $routeParams.id).success(function (data) {
        $scope.game = data;

        $sails.get('/game?clone_of=' + data.id, function(clones){

          //$scope.clones = clones;

          clones.forEach(function(clone){

            if(clone.scores.length != 0){

              $scope.clones.push(clone);

              $sails.get("/score?sort=score DESC&game=" + clone.id).success(function (cloneScores) {
                cloneScores.sort(function(a, b){
                  return parseInt(b.score) - parseInt(a.score);
                });

                if(cloneScores.length == 0){
                  //delete clone;
                } else {
                  clone.scores = cloneScores;
                }


              })
              .error(function (data) {
                alert('Houston, we got a problem!');
              });

            }
          });
        });

      })
      .error(function (data) {
        alert('Houston, we got a problem!');
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


      $sails.get("/score?sort=score DESC&game=" + $routeParams.id).success(function (data) {
        data.sort(function(a, b){
          return parseInt(b.score) - parseInt(a.score);
        });
        $scope.scores = data;
      })
      .error(function (data) {
        alert('Houston, we got a problem!');
      });


      $sails.on("score", function (message) {
        console.log('got score detail message');
        console.log(message);

        if (message.verb === "created") {
          //angular.extend($scope.scores, message.data);
          $scope.scores.push(message.data);
        }
      });

    }());

  }]).controller('HomeCtrl', ['$scope', '$sails', '$location', function($scope, $sails, $location) {

    $scope.selectedGame = {};

    $scope.games = [];
    $scope.lastPlayedGames = [];
    $scope.lastestScores = [];
    $scope.topPlayers = [];

    $sails.get('/game?limit=500&sort=full_name ASC&populate=[]&where={"has_mapping":true,"clone_of":null}').success(function (data) {
        $scope.games = data;
        $scope.selectedGame = $scope[0];

        $scope.$watch( 'selectedGame', function ( game ) {
          if(game){
            $location.path( 'games/' + game.id );
          }
        });
    })
    .error(function (data) {
      alert('Houston, we got a problem!');
    });

    $sails.get('/game?sort=last_played DESC&limit=5&where={"has_mapping": true,"last_played": {"!": null}}&populate=[]').success(function (data){
      $scope.lastPlayedGames = data;
    });

    $sails.get('/score?sort=updatedAt DESC&limit=10&where={"updatedAt": {"!": null}}').success(function (data){
      $scope.lastestScores = data;
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

    $sails.get('/game/top_players').success(function (data){
      $scope.topPlayers = data;
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

    $scope.user = {};
    $scope.games = [];

    $sails.get('/user/' + $routeParams.id ).success(function (data){
      $scope.user = data;
    });

    $sails.get('/user/' + $routeParams.id + '/games' ).success(function (games){
      $scope.games = games;

      games.forEach(function(game){
        $sails.get('/score?game=' + game.id).success(function (scores){

          scores.sort(function(a, b){
            return parseInt(b.score) - parseInt(a.score);
          });
          game.scores = scores;
        });
      })
    });

  }])
  .controller('SettingsCtrl', ['$scope', '$sails', function($scope, $sails) {
    //do nothin fo now, settings page is just for enabling notifications
  }])
  .controller('GameUploadCtrl', ['$scope', '$sails', function($scope, $sails) {
    
  }])
  .controller('UserListCtrl', ['$scope', '$sails', function($scope, $sails) {
    //probably dont really need real time updates of user create
      // $sails.on("user", function (message) {
      //   if (message.verb === "created") {
      //     $scope.users.push(message.data);
      //   }
      // });
      $scope.users = [];

      $sails.get("/user").success(function (data) {
        $scope.users = data;
      })
      .error(function (data) {
        alert('Houston, we got a problem!');
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
      alert('Houston, we got a problem!');
    });

  }]);
