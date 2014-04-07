//var db = require('../db');
var fs = require('fs');
var mongoose = require('mongoose');

/* GET high scores listing. */
exports.list = function(req, res){

	//if there is a get param of game (eg ?game=[gamename])
	//we want to redirect to the nice url for that game
	if(req.query.game){
		res.redirect('/games/' + req.query.game); //this url building feel so wrong
	} else {
		var sort = {name: 1};

		//this is probably really bad, but just pass through the query params to mongo
		//query = req.query;
		console.log(req.query);
		var query = {};
		if(req.query.hasScores == 'true') { query.scores = { $exists: true }; }
		if(req.query.hasRawScores == 'true') { query.rawScores = { $exists: true }; }
		if(req.query.hasMapping == 'true') { query.hasMapping = { hasMapping: true }; }
		console.log(query);

		var Game = mongoose.model('Game');
		Game.find(query).sort(sort).lean().exec(function (err, docs) {
			if(req.accepts('json, html') == 'json'){
				res.json(docs);
			} else {
				console.log(docs);
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

	var path = require('path');
	require('../game_mappings/gameMaps');

    var decoder = require('../modules/score_decoder');


    //quick check for valid data
    if(!('game' in req.files) || !('path' in req.files.game)){
    	res.send("No or invalid file uploaded\n");
    	return;
    }

    var filePath = req.files.game.path;
    var gameName = req.body.gamename;
	//invalid game so try and work it out from the file name
	if(typeof gameName != 'string' || gameName.length === 0){
		gameName = path.basename(req.files.game.name, '.hi');	
	}

	//need to check if the game exists in the mapping file, 
	//and if not then we add it to the database but flag it as missing
	var decodedScores = decoder.decode(gameMaps, filePath, gameName);


	var scoreData = { hasMapping: false, scores: [] };
	if(decodedScores !== null){
		scoreData = {hasMapping: true, scores: decodedScores[gameName]};

		//go through the scores and see if any of the uses have aliases for them
		//this asumes that alaises are unique
		var User = mongoose.model('User');
		//probably could do this with a reduce function??
		var scores = scoreData.scores;

		var scoreLength = scores.length;
		scores.forEach(function(score, index){
			User.findOne({ aliases: { $in: [score.name] } }, function(err, user){
				//console.log(user);
				//console.log(score);
				if(err){ console.log(err); } 
				else if (user !== null) {
					scoreData.scores[index].userName = user.userName;
				}

				//not the most elegant wat to deal with the async nature of node
				scoreLength--;
				if(scoreLength === 0){
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
				}
			});
		});

		scoreData.scores = scores;

		console.log(scoreData.scores);

	} else {
		var fileBytes = fs.readFileSync(filePath);
		scoreData = {hasMapping: false, $push: {  rawScores: { bytes: fileBytes.toString('hex') } } };

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

	}


	
	

	
};



