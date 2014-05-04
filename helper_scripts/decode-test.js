fs = require('fs');
path = require('path');


var gameSaveMappings = require('../game_mappings/gameMaps');
//var gameMaps = require('./out.json');
//console.log(gameMaps);

var decoder = require('../modules/score_decoder');


console.log(process.argv);

var files = [];
var pathStat = null;


if(process.argv[2] !== undefined){
	pathArg = process.argv[2];

	pathStat = fs.lstatSync(pathArg);

	if(pathStat.isDirectory()){
		files = fs.readdirSync(pathArg);
	} else if(pathStat.isFile()) {
		files = [ pathArg ];
	} else {
		console.error('No file or file path provided');
		return; //error code??
	}
} else {
	console.error('No file or file path provided');
	return; //error code??
}





//if a single file is passed we want to process that slightly differently

if(pathStat.isFile()){

	var file = files[0];

	gameName = path.basename(file, '.hi');
	if(process.argv[3] !== undefined){
		gameName = process.argv[3];
	}

	result = decoder.decodeFromFile(gameMaps, file, gameName);

	if(result !== null){
		console.log(result);
	} else {
		console.log('Unable to decode file (game name: ' + gameName + ')');
	}

} else {

	var foundGames = Array();
	var missingGames = Array();

	for(var f in files){

		file = files[f];

		if(file == '.' || file == '..'){
			continue;
		}

		gameName = path.basename(file, '.hi');

		
		file = process.argv[2] + "/" + file;

		result = decoder.decodeFromFile(gameMaps, file, gameName);

		//console.log(gameName);

		if(result !== null){
			console.log(result);
			foundGames.push(gameName);
		} else {
			missingGames.push(gameName);
		}

		
	}

	if(file.length > 1) {
		console.log("===Found Games===");
		console.log(foundGames);


		console.log("===Missing Games===");
		console.log(missingGames);
	}
}

