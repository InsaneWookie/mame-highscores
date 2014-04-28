var mongoose = require('mongoose');

exports.index = function(req, res){
	var Game = mongoose.model('Game');
	Game.find({hasMapping: true}).sort({ fullName: 1 }).exec(function(err, games){
		
		var latestScores = [];

		games.forEach(function(g){
			//console.log(g.scores);
			var scores = g.scores;
			scores.forEach(function(s){
				s.gameName = g.fullName;
			});

			latestScores = latestScores.concat(scores);
		});

		console.log(latestScores);

		latestScores.sort(function(a, b){
			return (b.createDate) - (a.createDate);
		});

		
		latestScores = latestScores.slice(0, 10);
		


		res.render('index', 
		{ 
			title: 'Select file to upload',
			games: games,
			latestScores: latestScores
		});
	});

  
};

exports.notification = function(req, res){		
		res.render('notification_test');
};
