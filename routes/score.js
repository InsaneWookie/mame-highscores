var db = require('../db');


/* GET high scores listing. */
exports.list = function(req, res){
	db.query('SELECT * FROM scores', [], function(err, result){
		res.send(result.rows);		
	});

  //res.send([{name: "ABC", score: 1}, {name: "ROW", score:2}]);
};

exports.game = function(req, res){
	res.send("looking for game: " + req.params.game);
};

exports.upload = function(req, res){

	path = require('path');
  	require('../game_mappings/gameMaps');
  	decoder = require('../modules/score_decoder');
  	

	console.log(JSON.stringify(req.files));
  	//console.log(req.body);

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

	res.render('score', {'gameName' : gameName, 'scores' : scores});
	
};
