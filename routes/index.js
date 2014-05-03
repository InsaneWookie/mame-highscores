var mongoose = require('mongoose');

exports.index = function(req, res){
	var Game = mongoose.model('Game');
	Game.find({hasMapping: true}).sort({ fullName: 1 }).exec(function(err, games){
		
		Game.collection.aggregate([{$unwind:'$scores'}, {$sort:{'scores.createDate':-1, 'scores.score': -1}}, { $limit: 10 }], function(err, result){

			//need to start using the asyc module, call backs are getting out of hand. and these could all be done in parall
			Game.find({hasMapping: true, lastPlayed : { $exists : true }}).limit(5).sort({ lastPlayed: -1 }).exec(function(err, latestPlayed){	

				res.render('index', 
				{ 
					//moment: require('moment-timezone'),
					title: 'Select file to upload',
					games: games,
					latestScores: result,
					latestPlayed: latestPlayed
				});

			});
		});
	});
};

exports.notification = function(req, res){		
		res.render('notification_test');
};
