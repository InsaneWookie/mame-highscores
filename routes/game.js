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
		var query = { scores : { $exists: true } };

		if(req.query.hasScores == 'false') { query.scores = { $exists: false }; }
		if(req.query.hasRawScores == 'true') { query.rawScores = { $exists: true }; }
		if(req.query.hasMapping == 'true') { query.hasMapping = { hasMapping: true }; }

		limitQuery = (req.query.allScores == 'true') ? {} : { scores: { $slice : 5} };
		
		var Game = mongoose.model('Game');
		Game.find(query, limitQuery).sort(sort).lean().exec(function (err, docs) {
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

//TODO: this function is getting a bit big, time to refactor
exports.upload = function(req, res){


	if(req.method === 'GET'){
		res.render('upload');
		return;
	}



	var path = require('path');
	require('../game_mappings/gameMaps');

    var decoder = require('../modules/score_decoder');

    //probably should error out if no high score file version supplied
    //as it can mess up the decoding if we dont know what version the .hi file 
    //was created with
    var hiScoreVersion = ('version' in req.body) ? req.body.version.trim() : '';

    if(hiScoreVersion === ''){
    	res.json({ error: "no version provided"});
    	return;
    }

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
	var decodedScores = decoder.decode(gameMaps, filePath, gameName, hiScoreVersion);


	var scoreData = { hasMapping: false, scores: [] };
	var Game = mongoose.model('Game');

	if(decodedScores !== null){
		//if we have some score data, process it

		//scoreData = {hasMapping: true, scores: []};


		//go through the scores and see if any of the uses have aliases for them
		//this asumes that alaises are unique (just finds the first user)
		var User = mongoose.model('User');
		//probably could do this with a reduce function??
		//var scores = scoreData.scores;
		
		var newScores = decodedScores[gameName];
		//console.log(newScores);

		//go through each score and see if we can find a user with and alias that matches
		Game.findOne({name: gameName}, function(err, game){

			
			var filteredScores;

			filteredScores = newScores.filter(function(newScore){
				//if it doesnt exist then we want to add it to ther filtered scores list
				return !game.scores.some(function(currentScore){
					return (currentScore.name === newScore.name) && (currentScore.score === newScore.score);	
				});
			});	

			console.log(filteredScores);
			//scoreData = { $push: { scores: { $each: filteredScores } } };
			var scoreLength = filteredScores.length;

			if(scoreLength === 0){
				res.redirect('/games/' + gameName);
				return;
			}
			//scores.forEach(function(score, index){

			//see if it does not exist. 
			//FIXME: There will be a much better way of doing this. At least need to add 
			//indexing on scores name/score fields

			//does this score exist already

			//console.log(scoreData);
				
			filteredScores.forEach(function(score, index){

				//console.log(score);

				User.findOne({ aliases: { $in: [score.name] } }, function(err, user){
		
					scoreLength--;

					if(err){ 
						console.log(err);
					} else if (user !== null) { //we found a user
						filteredScores.scores[index].user_id = user._id;
					}

				

					//once we have processed all the scores, need to update them 
					//not the most elegant way to deal with the async nature of node				
					if(scoreLength === 0){
						console.log(filteredScores);
						//TODO: add new scores to the list instead of over writing all scores
						Game.findOneAndUpdate({name: gameName}, 
							{hasMapping: true, $push : { scores: { $each: filteredScores } } }, 
							{ upsert: true }, function (err, saved) {
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
			//});
		});

		//scoreData.scores = scores;

	} else {

		//no decode mapping was found so just add the raw bytes to the game mapping so we can decode them later

		var fileBytes = fs.readFileSync(filePath);
		scoreData = {hasMapping: false, $push: {  rawScores: { version: hiScoreVersion, bytes: fileBytes.toString('hex') } } };

		//var Game = mongoose.model('Game');

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



