

mongoose = require("mongoose");
async = require("async");

var uristring = process.argv[2];
mongoose.connect(uristring);
var db = mongoose.connection;

require("../models/game");
var Game = mongoose.model('Game');

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
    console.log("Connected to mongo db (" + uristring + ")"); 


    Game.find({/*name: "ckong"*/}, function(err, games){
    	//console.log(games);

    	async.eachSeries(games, function(game, callBack){

    		var scores = game.scores;
    		var uniqueScores = [];
    		scores.forEach(function(score){
    			//build up a list of unique scores

    			var exists = uniqueScores.some(function(uniqueScore, index, array){
    				return ((uniqueScore.score == score.score) && (uniqueScore.name == score.name));
    			});

    			if(!exists){
    				//delete score._id;
    				console.log(score);
    				var newScore = {name: score.name, score: score.score, createDate: score.createDate };
    				if(score.user_id !== undefined){
    					newScore.user_id = score.user_id;
    				} 
    				
    				uniqueScores.push(newScore);
    			}

    		});

    		console.log(uniqueScores);

    		var gameName = game.name;

    		Game.findOneAndUpdate(
    			{ name: gameName }, 
    			{ scores: uniqueScores }, 
    			{ upsert: true }, 
    			function (err, saved) {
                    if(err) {
                    	callBack(err); 
                    	console.log(err); 
                    } else {
                    	callBack();
                    }
                });

    	}, 
    	function(err){
    		console.log("async finished");
    		db.close();
    	});

    });
});


