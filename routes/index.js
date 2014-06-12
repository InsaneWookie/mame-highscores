var mongoose = require('mongoose');
var async = require('async');


exports.index = function(req, res){
	var Game = mongoose.model('Game');
	var User = mongoose.model('User');

	async.parallel({
		games: function(callback){
			Game.find({hasMapping: true}).sort({ fullName: 1 }).exec(
				function(err, games){
					callback(err, games);
			});
		},
		latestScores: function(callback){
			Game.collection.aggregate([{$unwind:'$scores'}, {$sort:{'scores.createDate':-1, 'scores.score': -1}}, { $limit: 10 }], 
				function(err, latestScores){
					callback(err, latestScores)
			});
		},
		latestPlayed: function(callback){
			Game.find({hasMapping: true, lastPlayed : { $exists : true }}).limit(5).sort({ lastPlayed: -1 }).exec(
				function(err, latestPlayed){	
					callback(err, latestPlayed);
			});
		},
		topPlayers: function(callback){
			Game.aggregate([
				{ $unwind:'$scores'},
				{ $match: {'scores.user_id': { $ne: null } } },
				{ $group : { _id : "$scores.user_id", size: {$sum:1} } },
				{ $sort: {'size':-1 }},
				{ $limit: 5 }]).exec(
				function(err, topPlayers){
					console.log(topPlayers);
					async.eachSeries(topPlayers, function(player, topPlayersCallback){
						User.findById(player._id, function(err, user){
							if(!err){
								if(user !== null){
									player.userName = user.userName;
								}
							}
							topPlayersCallback();
						});
					},
					function(){
						//finished the fetch of the users so we can finaly return the top level async
						callback(err, topPlayers);						
					});
			});
		}
	},
	function(err, results){
		res.render('index', 
		{ 
			games: results.games,
			latestScores: results.latestScores,
			latestPlayed: results.latestPlayed,
			topPlayers: results.topPlayers
		});
	});



	
};

exports.settings = function(req, res){	
	//console.log("notification request");	
	//io.emit('notification', { game: 'test' });
	res.render('settings');

};
