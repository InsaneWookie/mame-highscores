var db = require('../db');


/* GET high scores listing. */
exports.list = function(req, res){
	console.log(req.query);
	if(req.query.game){
		res.redirect('/scores/' + req.query.game); //this url building feel so wrong
	} else {
		db.query('SELECT * FROM scores', [], function(err, result){
			res.send(result.rows);		
		});
	}
};

exports.game = function(req, res){
	db.query("SELECT * FROM scores WHERE game_name = $1", [req.params.game], function(err, result){
		if(err) { 
			console.log(err); 
		} else {
			console.log(result.rows); 
			res.render('score', {'gameName' : req.params.game, 'scores' : result.rows});
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

	var scores = decoder.decode(gameMaps, filePath, gameName);

	for(i in scores[gameName]){
		
		//probably not the best way to so this as it will open a connection every query??
		//Or does the connection pooling take care of this??
		db.query('INSERT INTO scores (game_name, name, score) VALUES ($1, $2, $3)', [gameName, scores[gameName][i].name, scores[gameName][i].score], function(err, result){
			if(err) { console.log(err); }
		});
	}

	//This probably isn't right due to the async nature its possible that it hasn't finished 


	res.render('score', {'gameName' : gameName, 'scores' : scores});
	
};
