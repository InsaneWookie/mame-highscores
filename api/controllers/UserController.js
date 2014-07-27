/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	games: function(req, res) {
		var user_id = req.param('id');

		var query = 
			"SELECT DISTINCT g.* FROM game g, score s, alias a \
			WHERE g.id = s.game_id \
			AND s.alias_id = a.id \
			AND a.user_id = $1";

		User.query(query, [user_id], function(err, games){


			res.json(games.rows);
			//games.forEach(function(game){
			//	Scores.find({game_id: game.id}).exec(function(s))
			//});
		});
    
   }
};

