fs = require('fs')
path = require('path')
//process = require('process');

var gameSaveMappings = require('./game_mappings/gameMaps');
var decoder = require('./modules/score_decoder');



//fileData = fs.readFileSync('./hi/1943.hi');


//buff = new Buffer(fileData, 'hex');


//console.log(fileData);

console.log(process.argv);

if(process.argv[2] != undefined){
	var files = [ process.argv[2] ];
} else {
	var files = fs.readdirSync('./hi');
}




var foundGames = Array();
var missingGames = Array();

for(f in files){

	file = files[f];

	if(file == '.' || file == '..'){
		continue;
	}

	//console.log(file);
	gameName = path.basename(file, '.hi');

	result = decoder.decode(gameMaps, './hi/' + file, gameName);

	//console.log(gameName);

	if(result != null){
		console.log(result);
		foundGames.push(gameName);
	} else {
		missingGames.push(gameName);
	}

	
}

//console.log("===Found Games===");
//console.log(foundGames);


//console.log("===Missing Games===");
//console.log(missingGames);