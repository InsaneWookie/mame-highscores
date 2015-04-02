/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {




	games: function(req, res) {
		var userId = req.param('id');

		var query = 
			"SELECT DISTINCT g.* FROM game g, score s, alias a \
			WHERE g.id = s.game_id \
			AND s.alias_id = a.id \
			AND a.user_id = $1";

		User.query(query, [userId], function(err, games){


			res.json(games.rows);
			//games.forEach(function(game){
			//	Scores.find({game_id: game.id}).exec(function(s))
			//});
		});
    
   },


  profile: function(req, res){
    //need to clone the object to clean it calling res.json calls Model.toJSON()
    var profileData = _.clone(req.user.toProfile());
    res.json(profileData);
  },

  machine: function(req, res){
    var params = req.allParams();
    var userId = params.id;

    //UserMachine.find({user_id: userId}).exec(function(err, userMachines) {
    //  if (err) {
    //    return res.serverError(err);
    //  }
    //
    //
    //
    //
    //  var machineIds = _.uniq(_.pluck(userMachines, 'machine'));
    //
    //  //want to get all the aliases for a machine and group
    //
    //
    //
    //  userMachines.forEach(function(userMachine){
    //
    //  });
    //
    //
    //  Machine.find({id: machineIds}).populate('usermachine', {user_id: userId}).exec(function (err, machines) {
    //    if (err) {
    //      return res.serverError(err);
    //    }
    //    //TODO: get the group somehow?
    //
    //
    //    res.json(machines);
    //
    //  });
    //});

    //UserMachine.find({user_id: userId}).exec(function(err, userMachines){
    //  if(err) { return res.serverError(err); }
    //
    //  var machineIds = _.uniq(_.pluck(userMachines, 'machine'));
    //
    //  Machine.find({id : machineIds}).populate('usermachine').exec(function(machines){
    //    if(err) { return res.serverError(err); }
    //    //TODO: get the group somehow?
    //
    //
    //
    //    res.json(machines);
    //
    //  });
    //})

  },

  player_scores: function(req, res){

    res.json([]);
    //var userId = req.param('id');
    //
    //var query =
    //  "SELECT g.id game_id, g.name game_name, g.full_name game_full_name, a.name alias_name, s.score, s.rank FROM \
    //    (SELECT s.game_id, a.user_id, min(s.rank) top_rank FROM score s, alias a WHERE \
    //      s.alias_id = a.id \
    //      GROUP BY s.game_id, a.user_id) tr, \
    //    \"user\" u, alias a, score s, game g \
    //  WHERE \
    //  tr.user_id = u.id \
    //  AND tr.game_id = g.id \
    //  AND tr.top_rank = s.rank \
    //  AND u.id = a.user_id \
    //  AND a.id = s.alias_id \
    //  AND s.game_id = g.id \
    //  AND u.id = $1 \
    //  ORDER BY g.full_name";
    //
    //User.query(query, [userId], function(err, topScores){
    //  if(err) { return res.serverError(err); }
    //
    //  //convert it into more of a model structure
    //  var games = [];
    //  topScores.rows.forEach(function(row){
    //    var score = { rank: row.rank, name: row.alias_name, score: row.score };
    //    var game = { id: row.game_id, name: row.game_name, full_name: row.game_full_name, top_score: score };
    //
    //    games.push(game);
    //  });
    //
    //  res.json(games);
    //});
  },

  points: function(req, res){

    var userId = req.param('id');

    User.points(userId, [], function(err, userPoints){
      if(err) return res.serverError(err);

      if(userPoints.length === 0) return res.notFound("User not found");

      res.json(userPoints);
    });
  },

  register_setup: function(req,res){

    var params = req.allParams();

    //add the user to the group

    var loggedInUser = req.user;

    var groupId = params.group.id;
    var machineId = params.machine.id;
    var aliases = _.map(params.machine.aliases, function (val) { return val.toUpperCase(); } );

    var userGroup = {
      group_id: groupId,
      user_id: loggedInUser.id
    };

    var uMachine = {
      group: groupId,
      user: loggedInUser.id,
      machine: machineId
    };

    var uMachines = [];

    aliases.forEach(function(alias){
      var um = _.clone(uMachine);
      um.alias = alias;
      uMachines.push(um)
    });


    UserGroup.create(userGroup).exec(function(err, newUserGroup){
      if(err) { return res.serverError(err); }
      //add the aliases to the machine for this group
      console.log(uMachine);
      console.log(uMachines);
      UserMachine.create(uMachines).exec(function(err, newUserMachines){
        if(err) { return res.serverError(err); }

         res.ok({});
      });
      
    });
  }

};

