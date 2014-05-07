
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

		//if(req.query.hasScores == 'false') { query.scores = { $exists: false }; }
		if(req.query.hasRawScores == 'true') { 
			query.rawScores = { $exists: true }; 
			query.scores = { $exists: false };
		}
		//if(req.query.hasMapping == 'true') { query.hasMapping = { hasMapping: true }; }

		//can't limit as we need to sort them first, and mongo sorting is crap
		//limitQuery = (req.query.allScores == 'true') ? {} : { scores: { $slice : 5} };
		
		var Game = mongoose.model('Game');
		Game.find(query).sort(sort).exec(function (err, docs) {

			//need to sort at the application level as I cant't work out how to sort it in mongo
			docs.forEach(function(g){
				g.scores.sort(function(a, b){
					return parseInt(b.score) - parseInt(a.score);
				});

				if(req.query.allScores !== 'true'){
					g.scores = g.scores.slice(0, 5);
				}
			});

			if(req.accepts('json, html') == 'json'){
				res.json(docs);
			} else {
				res.render('games', {games: docs});
			}
		});
	}
};

exports.game = function(req, res, next){
	var Game = mongoose.model('Game');
	Game.findOne({name: req.params.game_id}, function (err, game){

		if(err){
			console.log(err);
			next(err); //not sure if this will work
		} else if(game === null){
			res.status(404); //probably a better way of doing this
			next(new Error('Game does not exist'));
		} else {

			game.scores.sort(function(a, b){
				return parseInt(b.score) - parseInt(a.score);
			});

			if(req.accepts('json, html') == 'json'){
				res.json(game);
			} else {
				res.render('game', {game: game});
			}
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
	var gameMaps = require('../game_mappings/gameMaps.json');

    var decoder = require('../modules/score_decoder');

    //probably should error out if no high score file version supplied
    //as it can mess up the decoding if we dont know what version the .hi file 
    //was created with
    //var hiScoreVersion = ('version' in req.body) ? req.body.version.trim() : '';

    //if(hiScoreVersion === ''){
    //	res.json({ error: "no version provided"});
    //	return;
    //}

    //quick check for valid data
    if(!('game' in req.files) || !('path' in req.files.game)){
    	res.send("No or invalid file uploaded\n");
    	return;
    }



    var filePath = req.files.game.path;
    var gameName = req.body.gamename;
	//invalid game so try and work it out from the file name
	if(typeof gameName != 'string' || gameName.length === 0){
		//gameName = path.basename(req.files.game.name, '.hi');	
		var fileName = req.files.game.name;
    	gameName = fileName.substring(0, fileName.lastIndexOf('.'));
	}

	//need to check if the game exists in the mapping file, 
	//and if not then we add it to the database but flag it as missing
	var decodedScores = decoder.decodeFromFile(gameMaps, filePath, gameName);


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

			if(err) { console.log(err); }

			if(game === null){
				//no game found so we want to send a 404
				res.send("Error: Game not found");
			} else {

				game.addScores(newScores, function(err, saved){
					
					if(err) { console.log(err); }

					if(req.accepts('json, html') == 'json'){
						res.json(saved);		
					} else {
						res.redirect('/games/' + gameName);
					}
				});
			}	
		});
			
	} else {

		//Its possible that the reson we couldn't decode the file is because its the wrong type. ie .nv instead of .hi
		//so in this case we don't want to add the raw scores
		if(decoder.getGameMappingStructure(gameMaps, gameName, 'hi') || decoder.getGameMappingStructure(gameMaps, gameName, 'nv')){
			res.send("I have a mapping for this game but not for this file type.");
			//TODO: better error handling
			return;
		} 

		//no decode mapping was found so just add the raw bytes to the game mapping so we can decode them later

		//may aswell record the play count and the last played even if there isnt a mapping
		var fileBytes = fs.readFileSync(filePath);
		scoreData = {
			hasMapping: false,
			$inc: { playCount : 1 },
			lastPlayed: new Date(), 
			$push: {  rawScores: { bytes: fileBytes.toString('hex') } } 
		};
		
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



