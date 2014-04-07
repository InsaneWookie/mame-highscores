var mongoose = require('mongoose');

exports.index = function(req, res){
	var Game = mongoose.model('Game');
	Game.find({hasMapping: true}).sort({ fullName: 1 }).exec(function(err, games){
		console.log(games);
		res.render('index', 
		{ 
			title: 'Select file to upload',
			games: games
		});
	});

  
};
