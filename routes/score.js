/* GET high scores listing. */
exports.list = function(req, res){
  res.send([{name: "ABC", score: 1}, {name: "ROW", score:2}]);
};

exports.game = function(req, res){
	res.send("looking for game: " + req.params.game);
};

exports.upload = function(req, res){
  	require('../modules/gameMaps');
  	decoder = require('../modules/score_decoder');

	//console.log(JSON.stringify(req.files));
  	//console.log(req.body);

	result = decoder.decode(gameMaps, req.files.game.path, req.body.gamename);

	res.send(JSON.stringify(result));
	
};
