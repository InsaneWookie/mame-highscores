var mongoose = require('mongoose');
var scoreDecoder = require('../modules/score_decoder');
var async = require('async');

exports.index = function(req, res){
	//TODO: add acces around admin actions
	res.render('admin', {});
};

//FIXME: this is buggy, it may create duplicate scores
exports.process_new_scores = function(req, res){
	//got through all the games and see if they have raw scores and a mapping
	//and if so process the raw scores
	var Game = mongoose.model('Game');
	
	var gameMaps = require('../game_mappings/gameMaps.json');
	
	Game.find({ hasMapping : true, rawScores: { $exists: true }}, function(err, games){

		if(err) {
			console.log(err);
			res.send(err);
		} else {

			var updatedGames = [];

			games.forEach(function(game){

				var gameName = game.name;

				updatedGames.push(gameName);

				game.rawScores.forEach(function(rawScore){

					var buffer = new Buffer(rawScore.bytes, 'hex');

					var decodedScores = scoreDecoder.decode(gameMaps, buffer, gameName);

					if(decodedScores === null){
						console.log('Unable to decode scores for game' + gameName);
					} else {

						game.addScores(decodedScores[gameName], function(err, saved){
							if(err){
								console.log(err);
							} else {
								game.collection.update({name: gameName}, { $unset: { rawScores: "" } }, function(){});
							}
						});
					}

				});
			});


			res.send('updated ' + updatedGames);
		}
	});
};

