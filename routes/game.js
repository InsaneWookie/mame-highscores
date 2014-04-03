var db = require('../db');


var mongoose = require('mongoose');

/* GET high scores listing. */
exports.list = function(req, res){
	if(req.query.game){
		res.redirect('/games/' + req.query.game); //this url building feel so wrong
	} else {
		sort = {name: 1};
		query = req.query;


		var Game = mongoose.model('Game');
		Game.find(query).sort(sort).lean().exec(function (err, docs) {
			if(req.accepts('json, html') == 'json'){
				res.json(docs);
			} else {
				res.render('games', {games: docs});
			}
		});
	}
};

exports.game = function(req, res){
	var Game = mongoose.model('Game');
	Game.findOne({name: req.params.game_id}, function (err, game){
		if(req.accepts('json, html') == 'json'){
			res.json(game);
		} else {
			res.render('game', {game: game});
		}
	});
	
};


exports.upload = function(req, res){

	path = require('path');
  	require('../game_mappings/gameMaps');

  	decoder = require('../modules/score_decoder');
  	

  	var filePath = req.files.game.path;
  	var gameName = req.body.gamename;
	//invalid game so try and work it out from the file name
	if(typeof gameName != 'string' || gameName.length == 0){
		gameName = path.basename(req.files.game.name, '.hi');	
	}

	//need to check if the game exists in the mapping file, 
	//and if not then we add it to the database but flag it as missing
	var decodedScores = decoder.decode(gameMaps, filePath, gameName);


	var scoreData = { hasMapping: false, scores: [] };
	if(decodedScores != null){
		scoreData = {hasMapping: true, scores: decodedScores[gameName]};
	}

	var Game = mongoose.model('Game');

	//TODO: add new scores to the list instead of over writing all scores

	Game.findOneAndUpdate({name: gameName}, scoreData, { upsert: true }, function (err, saved) {
		if(err) { console.log(err); }

		if(req.accepts('json, html') == 'json'){
			res.json(saved);		
		} else {
			res.redirect('/games/' + gameName);
		}
	});
	

	
};



