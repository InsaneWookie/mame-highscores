fs = require('fs')
path = require('path')

var gameSaveMappings = require('./modules/gameMaps');
var decoder = require('./modules/score_decoder');



fileData = fs.readFileSync('./hi/1943.hi');


buff = new Buffer(fileData, 'hex');


//console.log(fileData);

var files = fs.readdirSync('./hi');

for(f in files){



	file = files[f];

	if(file == '.' || file == '..'){
		continue;
	}

	//console.log(file);
	gameName = path.basename(file, '.hi');

	result = decoder.decode(gameMaps, './hi/' + file, gameName);

	if(result != null){
		console.log(result);	
	}
	
}