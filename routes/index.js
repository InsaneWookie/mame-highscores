
//var db = require('../db');

var mongoose = require('mongoose');
/* GET home page. */
exports.index = function(req, res){
/*
	db.query("SELECT DISTINCT game_id, game_name FROM games ORDER BY game_id", [], function(err, result){
		res.render('index', 
			{ 
				title: 'Select file to upload',
				games: result.rows
			});
	});
*/
	var Game = mongoose.model('Game');
	Game.find().sort({ fullName: 1 }).exec(function(err, games){
		console.log(games);
		res.render('index', 
		{ 
			title: 'Select file to upload',
			games: games
		});
	});

  
};
