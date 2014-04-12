

var fs = require('fs');

console.log(process.argv);

if(process.argv[3] === undefined){ //need 2 files provided
	console.log("must provided old and new hiscore.dat files");
	return;
}

var oldFilePath = process.argv[2];
var newFilePath = process.argv[3];


var oldFile = new fs.readFileSync(oldFilePath,{flag: 'r'});
fileOldLines = oldFile.toString().split(/\r?\n/);
var oldGames = buildGameMemoryStructure(fileOldLines);

var newFile = new fs.readFileSync(newFilePath, {flag: 'r'});
fileNewLines = newFile.toString().split(/\r?\n/);
var newGames = buildGameMemoryStructure(fileNewLines);

for(var game in oldGames){

	if(newGames[game] != oldGames[game]){
		console.log(game);
		console.log('old file:');
		console.log(oldGames[game]);
		console.log('new file:');
		console.log((game in newGames) ? newGames[game] : "[no mapping]\n");
		console.log('====================');
	}
	
}


function cleanLine(line) {
	if(line.indexOf(';') === 0 ){
		return '';
	}

	if(line.indexOf(';') > 0){
		return line.substring(0, line.indexOf(';')).trim();
	}

	return line.trim();
}

function buildGameMemoryStructure(fileLines){

	var gameList = [];
	var addressList = "";

	var gameMemoryStructure = {};

	var addToStructureFunc = function(game){
		gameMemoryStructure[game] = addressList;
	};

	for(var index = 0; index < fileLines.length; index++){

		var line = cleanLine(fileLines[index]);
		if(line === ''){
			//do nothing
		} else if (line.indexOf(':') === line.length-1  ){ //last char is a colon means its a game name
			
			gameList.push(line);
			
		} else {

			addressList += line + '\n';
		}

		//console.log(index, fileLines.length-1);
		//console.log(line);
		//console.log(gameList);
		if((line === '' || index == fileLines.length-1) && gameList.length > 0){

			//console.log(gameList, addressList);

			gameList.forEach(addToStructureFunc);

			gameList = [];
			addressList = "";

		}
	}

	return gameMemoryStructure;
}
