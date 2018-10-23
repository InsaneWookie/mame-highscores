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

    sails.sendNativeQuery(query, [userId], function(err, games){


			res.json(games.rows);
			//games.forEach(function(game){
			//	Scores.find({game_id: game.id}).exec(function(s))
			//});
		});
    
   },


  player_scores: function(req, res){
    var userId = req.param('id');

    var query =
      "SELECT g.id game_id, g.name game_name, g.full_name game_full_name, a.name alias_name, s.score, s.rank FROM \
        (SELECT s.game_id, a.user_id, min(s.rank) top_rank FROM score s, alias a WHERE \
          s.alias_id = a.id \
          GROUP BY s.game_id, a.user_id) tr, \
        \"user\" u, alias a, score s, game g \
      WHERE \
      tr.user_id = u.id \
      AND tr.game_id = g.id \
      AND tr.top_rank = s.rank \
      AND u.id = a.user_id \
      AND a.id = s.alias_id \
      AND s.game_id = g.id \
      AND u.id = $1 \
      ORDER BY g.full_name";

    sails.sendNativeQuery(query, [userId], function(err, topScores){
      if(err) { return res.serverError(err); }

      //convert it into more of a model structure
      var games = [];
      topScores.rows.forEach(function(row){
        var score = { rank: row.rank, name: row.alias_name, score: row.score };
        var game = { id: row.game_id, name: row.game_name, full_name: row.game_full_name, top_score: score };

        games.push(game);
      });

      res.json(games);
    });
  },

  points: function(req, res){

    var userId = req.param('id');

    User.points(userId, [], function(err, userPoints){
      if(err) return res.serverError(err);

      if(userPoints.length === 0) return res.notFound("User not found");

      res.json(userPoints[0]);
    });
  }

};

