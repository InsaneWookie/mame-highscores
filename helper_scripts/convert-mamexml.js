var fs = require('fs');
var xml2js = require('xml2js');
var util = require('util');

//console.log(process.argv);
   
var hiToTextFile = process.argv[2];

var gameMaps = require('../game_mappings/gameMaps.json');

var validGames = {};
gameMaps.forEach(function(map){
	map.name.forEach(function(name){
		validGames[name] = true;
	});
});

var parser = new xml2js.Parser();
fs.readFile(hiToTextFile, function(err, data) {

    parser.parseString(data, function (err, result) {
        
        //l(result);

    	var gameInfos = [];

        result.mame.game.forEach(function(game){
			var gameInfo = {
				"name": "",
				"fullName": "",
				"year": "unknown",
				//"letter": "special",
				"order": ["score", "name"],
				"sort": {
				  "by": "score",
				  "order": "desc"
				}
			};

			gameInfo.name = game.$.name;
			gameInfo.fullName = game.description[0];

			if(game.year !== undefined && game.year.length > 0){
		  		gameInfo.year = game.year[0];
			}

			if(validGames[gameInfo.name]){ 
		  		gameInfos.push(gameInfo);
		  	}

        });

        console.log(JSON.stringify(gameInfos, null, 2));

    });

});

function l(data){
	console.log(util.inspect(data, false, null));
}