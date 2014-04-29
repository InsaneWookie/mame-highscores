var mongoose = require('mongoose');
var scoreDecoder = require('../modules/score_decoder');

exports.index = function(req, res){
	//TODO: add acces around admin actions
	res.render('admin', {});
};

exports.process_new_scores = function(req, res){
	//got through all the games and see if they have raw scores and a mapping
	//and if so process the raw scores
	var Game = mongoose.model('Game');

	//creates a variable gameMaps
	require('../game_mappings/gameMaps');
	
	Game.find({ hasMapping : true, rawScores: { $exists: true }}, function(err, games){

		if(err) {
			console.log(err);
			res.send(err);
		} else {

			updatedGames = [];

			games.forEach(function(game){

				updatedGames.push(game.name);

				game.rawScores.forEach(function(rawScore){

					var buffer = new Buffer(rawScore.bytes, 'hex');

					var decodedScores = scoreDecoder.decode(gameMaps, buffer, game.name);

					if(decodedScores === null){
						console.log('Unable to decode scores for game' + game.name);
					} else {

						game.addScores(decodedScores[game.name], function(err, saved){
							//TODO: need to remove any raw scores after we have processed them
						});
					}

				});
			});


			res.send('updated ' + updatedGames);
		}
	});

};

