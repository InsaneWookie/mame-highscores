
//TODO: clean this up to follow node js module way
var fs = require('fs');

exports.decode = function(gameSaveMappings, buffer, gameName){
	var decoder = new ScoreDecoder(gameSaveMappings);
	return decoder.decode_internal(buffer, gameName);
};

exports.decodeFromFile = function(gameSaveMappings, filePath, gameName){
	var decoder = new ScoreDecoder(gameSaveMappings);
	var buffer = fs.readFileSync(filePath);
	return decoder.decode_internal(buffer, gameName);
};

function ScoreDecoder(gameSaveMappings) {
	this.gameSaveMappings = gameSaveMappings;
	//this.mappingsVersion = mappingsVersion;
}


ScoreDecoder.prototype.decode_internal = function(buffer, gameName){
	
	//var fileHandle = fs.openSync(filePath, 'r');

	//structure for storing the scores we read out
	// array('game_name' => array('name' => 'ABC', 'score' => 1234))
	var scoreData = {};
	
	var structure = this.getGameMappingStructure(gameName);

	if(structure === null){
		//no game mapping strucure found for this game
		//fs.closeSync(fileHandle);
		return null; 
	}

	//see if we need to skip any bytes
	if(structure.skip !== undefined){
		//var skipBuffer = new Buffer(structure['skip']);
		//fs.readSync(fileHandle, skipBuffer, 0, structure['skip']);
		buffer = buffer.slice(structure.skip, buffer.length);
	}

	//use a custom functions for decoding this file
	if('custom' in structure){
		//var buff = fs.readFileSync(filePath, {flag: 'r'});
		//console.log(buff.toString('hex'));
		return this.decodeCustom(buffer, gameName);
	}

	scoreData[gameName] = [];

	//the structure.blocks defines bassically how many scores the game has
	for(var scoreCount = 0; scoreCount < structure.blocks; scoreCount++){
		
		var data = {};

		for(var fieldIndex in structure.fields){
			var field = structure.fields[fieldIndex];

			var byteCount = field.bytes;
			//var bytes = new Buffer(byteCount);
			var bytes = buffer.slice(0, byteCount);
			//remove the bytes we just slice from the full buffer so we dont read them nect time round
			buffer = buffer.slice(byteCount, buffer.length);
			//fs.readSync(fileHandle, bytes, 0, byteCount);

		
			//currently only store name and score, skip all other fields
			if(field.name === 'name' || field.name === 'score'){
				var format = field.format;
				var settings = (field.settings !== undefined) ? field.settings : []; //array or null, can't decide

				var decodedBytes = this.decodeBytes(bytes, format, settings);
		
				data[field.name] = decodedBytes + ''; //make sure is a string
			}
		}
		
		scoreData[gameName].push(data);
	}

	//TODO: need to catch any errors otherwise it will leave the file handle open (maybe its better if we dont open the file in this function?)
	//fs.closeSync(fileHandle);

	return scoreData;
} ;
	
//TODO: optimise this. scans through evey game 
//make a hash map of the games so we can look them up fast
ScoreDecoder.prototype.getGameMappingStructure = function(gameName){
	//console.log(this.gameSaveMappings);
	for(var gameMapping in this.gameSaveMappings){
		
		var gameMappingNames = this.gameSaveMappings[gameMapping]['name']; 
		
		for(var gameMappingName in gameMappingNames){
			if(gameName === gameMappingNames[gameMappingName]){

				return this.gameSaveMappings[gameMapping]['structure'];
			}
		}
	}

	return null;
};


ScoreDecoder.prototype.decodeBytes = function(bytes, format, settings){
	

	bytes = this.preProcessBytes(bytes, settings);

	var hexString = bytes.toString('hex').replace(' ', '');

	var specialSettings = (settings.special !== undefined) ? settings.special : {};

	var value = "";

	switch (format) {
		case 'ascii':
			value = this.decodeAscii(bytes, settings); 
			break;
		case 'fromCharMap':
			value = this.decodeFromCharMap(bytes, settings.charMap, settings);
			break;		
		case 'bcd':
			value = this.decodeBcd(hexString, settings);
			break;
		case 'paddedAsIs':
			value = this.decodePaddedAsIs(hexString);
			break;
		case 'asIs':
			value = this.decodeAsIs(hexString, settings);	
			break;
		case 'reverseDecimal':
			value = this.decodeReverseDecimal(hexString, specialSettings);
			break;
		case 'hexToDecimal': 
			value = this.decodeHexToDecimal(hexString, specialSettings);
			break;
		default:
			console.log('unknown format type ' + format + ' \n');
			break;
	}

	return this.postProcessValue(value, settings);
};


ScoreDecoder.prototype.preProcessBytes = function(bytes, settings){
	
	//console.log('pre processing');
	bytes = this.removeIgnoreBytes(bytes, settings);
	bytes = this.addOffset(bytes, settings);
	return bytes;
};

ScoreDecoder.prototype.removeIgnoreBytes = function(bytes, settings){
	
	var clean = bytes.toJSON();
	var removedCount = 0;
	if(settings.ignoreBytes !== undefined){
		for(var i = 0; i < settings.ignoreBytes.length; i++){
			//because we are editing in place we need to adjust for the elemtents removed
			clean.splice(settings.ignoreBytes[i] - removedCount, 1); //remove the bytes we dont want
			removedCount++;
		}		
	}
	return new Buffer(clean);
};


ScoreDecoder.prototype.addOffset = function(bytes, settings){
	//console.log(bytes.length);
	if(settings.offset !== undefined){
		for(var i = 0; i < bytes.length; i++){
			var b = new Buffer(1);
			b[0] = bytes[i];

			if(!this.inSpecialChars(b.toString('hex'), settings)){
				//console.log('converting');
				bytes[i] -= parseInt(settings.offset, 16);
			}
		}
	}

	return bytes;
};


ScoreDecoder.prototype.postProcessValue = function(value, settings){
	value = this.appendChars(value, settings);
	return value;
};

ScoreDecoder.prototype.appendChars = function(value, settings){
	if(settings.append !== undefined){
		value += settings.append;
	}
	return value;
};

ScoreDecoder.prototype.getSpecialChar = function(specialChars, specialCharKey){
	specialCharKey = specialCharKey.toUpperCase();
	return (specialChars[specialCharKey] === undefined) ? '[' + specialCharKey + ']' : specialChars[specialCharKey];
};

ScoreDecoder.prototype.inSpecialChars = function(specialCharKey, settings){
	if("special" in settings && specialCharKey.toUpperCase() in settings.special){
		return true;
	}
	return false;
};




//TODO: handle "settings": { "ignoreBytes": [1, 3, 5, 7] }
ScoreDecoder.prototype.decodeAscii = function(byteArray, settings){

	var specialChars = (settings.special === undefined) ? {} : settings.special ;
	//Get special chars
	var processedString = "";
	for(var i = 0; i < byteArray.length; i++){

		var specialCharValue = new Buffer(1);
		specialCharValue[0] = byteArray[i];

		//see if the ascii representation is actually displayable
		if(this.inSpecialChars(specialCharValue.toString('hex'), settings)){
			processedString += this.getSpecialChar(specialChars, specialCharValue.toString('hex'));
		} else {
			processedString += specialCharValue.toString('ascii');
		}

	}
	return processedString;
	//return byteArray.toString('ascii');
};
//not sure what this format is called but a score of 0x0000000200000000
//equals 20,000 decimal
//basicaly we just grab every second charater of the hex string,
// build up a new string and conver it to decimal
//probably just need to add skip bytes (or half bytes) to the mapping file??
ScoreDecoder.prototype.decodePaddedAsIs = function(hexString){
	var decimalValue = '';
	for(var byteCount = 1; byteCount < hexString.length; byteCount = byteCount + 2){
		decimalValue += hexString[byteCount];
	}

	return parseInt(decimalValue, 10).toString().replace(/^0+/,'');
};

ScoreDecoder.prototype.decodeBcd = function(hexString, settings){
	return parseInt(hexString, 10).toString().replace(/^0+/,'');
};

//TODO: handle "settings": {"append": "0"} 
ScoreDecoder.prototype.decodeAsIs = function(hexString, settings){
	//just remove leading zeros
	return hexString.replace(/^0+/,'');
};

//TODO: handle "offset": 1,
ScoreDecoder.prototype.decodeFromCharMap = function(byteArray, charMapType, specialOptions){
	//TODO: this should be read in form file
	var charMaps = {
        "upper" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "numericUpper" : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "numericCharUpper" : "0123456789,’.!?- ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "upperNumeric" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"};

	var charMap = charMaps[charMapType];
	var specialChars = ('special' in specialOptions) ? specialOptions.special : {};

	//TODO: error handling if values do not exist
	var name = "";
	for(var mapIndex = 0; mapIndex < byteArray.length; mapIndex++){
		//skip over any bytes that have been flaged to ignore
		if(specialOptions.ignoreBytes !== undefined	&&
			specialOptions.ignoreBytes.indexOf(mapIndex) != -1){

			continue;
		}

		var specialCharValue = new Buffer(1);
		specialCharValue[0] = byteArray[mapIndex];

		var value = specialCharValue.toString('hex').toUpperCase();

		if(value in specialChars){ //if its in the special char map always use that first
			name += this.getSpecialChar(specialChars, value);
		} else {
			//TODO: better error handling if its out of range
			name += charMap[specialCharValue[0]];
		}

	}

	return name;
};




ScoreDecoder.prototype.decodeHexToDecimal = function(hexString, specialSettings){
	return parseInt(hexString, 16).toString().replace(/^0+/,'');
};

ScoreDecoder.prototype.decodeReverseDecimal = function(hexString, specialSettings){
	//work backwards and build a new reversed string
	var reversedString = "";
	for(var i = hexString.length; i > 0; i = i - 2){
		reversedString += hexString.substr(i - 2, 2);
	}

	return reversedString.replace(/^0+/,'');
};



ScoreDecoder.prototype.decodeSpecialOnly = function(){
	//TODO: probably not worth worring about this one at the moment
};



ScoreDecoder.prototype.decodeCustom = function(bytes, gameName){
	switch(gameName){
		case "zerowing":
		//case "zerowing2":
			return this.decodeZerowing(bytes);
		case "ddonpach":
			return this.decodeDdonpach(bytes);
	}
};


//TODO: files like this can probably be turned into a 1st scores = these bytes, 
//2nd score = some other bytes, etc type mapping
ScoreDecoder.prototype.decodeZerowing = function(bytes){

	var scoreData = [];

	var scoreStart = 5;
	var nameStart = 25;

/*
	if(this.mappingsVersion <= '0.100') {
		scoreStart = 1;
		nameStart = 21;
	}
*/

	//get scores and names
	for(var i = 0; i < 5; i++){
		var currentScoreByte = scoreStart + (i * 4);
		var currentNameByte = nameStart + (i * 12);
		var scoreBytes = bytes.slice(currentScoreByte, currentScoreByte + 4);
		//console.log(scoreBytes);
		//scoreBytes = this.preProcessBytes(scoreBytes, { ignoreBytes: [3]});

		var nameBytes = new Buffer(bytes.slice(currentNameByte, currentNameByte + 12));

		var nameData = new Buffer([nameBytes[0], nameBytes[2], nameBytes[4]]);
		
		nameData = this.preProcessBytes(nameData, { offset: '0A', special: {'24': "!", '25': ',', '26': '.', '27': '+'} });
		
		var scoreString = this.decodeAsIs(scoreBytes.toString('hex')).slice(0,-1);
		
		scoreData.push({
			name: this.decodeFromCharMap(nameData, "upper", 
				{ special: {'24': "!", '25': ',', '26': '.', '27': '+'}}),
			score : scoreString 
		});
	} 
	var data = {};
	data.zerowing = scoreData;
	return data;

};

ScoreDecoder.prototype.decodeDdonpach = function(bytes){

	var specialChars = { special: {'38': "."} } ;

	var scoreDecoder = this;

	var getDdonName = function (bytes, start, end){

		//the dodonpachi format is a bit weird
		//the letters got up in multpules of 4 ed A = 0x84, B = 0x88, etc
		//so we devide by 4 and minus 33 to get A = 0x00, B = 0x01, etc
		//but we need to make sue we dont adjust special chars
		nameData = scoreDecoder.preProcessBytes(bytes.slice(start, end), { ignoreBytes: [1,3]});

		if(nameData[0] >= 0x84) { nameData[0] = (nameData[0] / 4) - 33; }
		if(nameData[1] >= 0x84) { nameData[1] = (nameData[1] / 4) - 33; }
		if(nameData[2] >= 0x84) { nameData[2] = (nameData[2] / 4) - 33; }

		return scoreDecoder.decodeFromCharMap(nameData, "upper", specialChars);
	};

	var getDdonScore = function(bytes, start, end, last){
		return scoreDecoder.decodeAsIs(bytes.slice(start, end).toString('hex') + 
			bytes.slice(last, last+1).toString('hex')[1]);
	};


	var data = [
		{ score: getDdonScore(bytes, 0, 4, 91), name: getDdonName(bytes, 21, 26) },
		{ score: getDdonScore(bytes, 5, 8, 93), name: getDdonName(bytes, 27, 32) },
		{ score: getDdonScore(bytes, 9, 12, 95), name: getDdonName(bytes, 33, 38) },
		{ score: getDdonScore(bytes, 13, 16, 97), name: getDdonName(bytes, 39, 44) },
		{ score: getDdonScore(bytes, 17, 20, 99), name: getDdonName(bytes, 45, 50) }
	];

	return { ddonpach: data };

};



