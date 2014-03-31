/* GET high scores listing. */
exports.list = function(req, res){
  res.send([{name: "ABC", score: 1}, {name: "ROW", score:2}]);
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


	result = decoder.decode(gameMaps, filePath, gameName);

	pg.connect(connectionString, function(err, client, done) {

	  client.query('INSERT INTO scores (name, score) VALUES ($1, $2)', ['test', '123'], function(err, result) {
	    done();
	    if(err) return console.error(err);
	    //console.log(result.rows);
	  });
	});

	//res.send(JSON.stringify(result));
	res.render('score', {'gameName' : gameName, 'scores' : result});
	
};
