var mongoose = require('mongoose');

exports.index = function(req, res){
	var Game = mongoose.model('Game');
	Game.find({hasMapping: true}).sort({ fullName: 1 }).exec(function(err, games){
		
		res.render('index', 
		{ 
			title: 'Select file to upload',
			games: games
		});
	});

  
};

exports.notification = function(req, res){		
		res.render('notification_test');
};
