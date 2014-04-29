var mongoose = require('mongoose');

exports.index = function(req, res){
	var Game = mongoose.model('Game');
	Game.find({hasMapping: true}).sort({ fullName: 1 }).exec(function(err, games){
		
		Game.collection.aggregate([{$unwind:'$scores'}, {$sort:{'scores.createDate':-1, 'scores.score': -1}}, { $limit: 10 }], function(err, result){

			res.render('index', 
			{ 
				title: 'Select file to upload',
				games: games,
				latestScores: result
			});
		});
	});
};

exports.notification = function(req, res){		
		res.render('notification_test');
};
