
var fs = require('fs');

exports.decode = function(gameSaveMappings, filePath, gameName){
	var decoder = new ScoreDecoder(gameSaveMappings);
	return decoder.decode_internal(filePath, gameName);
}

function ScoreDecoder(gameSaveMappings){
	this.gameSaveMappings = gameSaveMappings;
}


ScoreDecoder.prototype.decode_internal = function(filePath, gameName){
	
	fileHandle = fs.openSync(filePath, 'r');

	//structure for storing the scores we read out
	// array('game_name' => array('name' => 'ABC', 'score' => 1234))
	scoreData = {};
	
	structure = this.getGameMappingStructure(gameName);

	if(structure === null){
		//no game mapping strucure found for this game
		fs.closeSync(fileHandle);
		return null; 
	}

	//see if we need to skip any bytes
	if(structure['skip'] != undefined){
		skipBuffer = new Buffer(structure['skip']);
		fs.readSync(fileHandle, skipBuffer, 0, structure['skip']);
	}

	scoreData[gameName] = new Array();

	for(scoreCount = 0; scoreCount < structure['blocks']; scoreCount++){
		
		data = {};

		for(fieldIndex in structure['fields']){
			field = structure['fields'][fieldIndex];

			byteCount = field['bytes'];
			bytes = new Buffer(byteCount);
			fs.readSync(fileHandle, bytes, 0, byteCount);

		
			//currently only store name and score, skip all other fields
			if(field['name'] === 'name' || field['name'] === 'score'){
				format = field['format'];
				settings = (field['settings'] != undefined) ? field['settings'] : new Array(); //array or null, can't decide

				decodedBytes = this.decodeBytes(bytes, byteCount, format, settings);
		
				data[field['name']] = decodedBytes;
			}
		}
		
		scoreData[gameName].push(data);
	}

	//TODO: need to catch any errors otherwise it will leave the file handle open (maybe its better if we dont open the file in this function?)
	fs.closeSync(fileHandle);

	return scoreData;
} 
	
//TODO: optimise this. scans through evey game 
//make a hash map of the games so we can look them up fast
ScoreDecoder.prototype.getGameMappingStructure = function(gameName){
	//console.log(this.gameSaveMappings);
	for(gameMapping in this.gameSaveMappings){
		
		gameMappingNames = this.gameSaveMappings[gameMapping]['name']; 
		
		for(gameMappingName in gameMappingNames){
			if(gameName === gameMappingNames[gameMappingName]){

				return this.gameSaveMappings[gameMapping]['structure'];
			}
		}
	}

	return null;
}


ScoreDecoder.prototype.decodeBytes = function(bytes, byteCount, format, settings){
	//byteArray = unpack("C$byteCount", bytes);
	hexString = bytes.toString('hex').replace(' ', '');

	

	specialSettings = (settings['special'] != undefined) ? settings['special'] : null;

	switch (format) {
		case 'ascii':
			return this.decodeAscii(bytes); 
		case 'fromCharMap':
			return this.decodeFromCharMap(bytes, settings['charMap'], specialSettings);
		case 'paddedAsIs':
		case 'bcd':
			return this.decodeFromPaddedAsIs(hexString);
		case 'asIs':
			return this.decodeAsIs(hexString);	
		case 'reverseDecimal':
			return this.decodeReverseDecimal(hexString, specialSettings);
		case 'hexToDecimal': 
			return this.decodeHexToDecimal(hexString, specialSettings);
		default:
			consol.log('unknown format type ' + format + ' \n');
			break;
	}
}

//not sure what this format is called but a score of 0x0000000200000000
//equals 20,000 decimal
//basicaly we just grab every second charater of the hex string,
// build up a new string and conver it to decimal
//probably just need to add skip bytes (or half bytes) to the mapping file??
ScoreDecoder.prototype.decodeFromPaddedAsIs = function(hexString){
	decimalValue = '';
	for(byteCount = 1; byteCount < hexString.length; byteCount = byteCount + 2){
		decimalValue += hexString[byteCount];
	}

	return parseInt(decimalValue, 10);
}

//TODO: handle "settings": {"append": "0"} 
ScoreDecoder.prototype.decodeAsIs = function(hexString){
	//just remove leading zeros
	return hexString.replace(/^0+/,'');
}

//TODO: handle "offset": 1,
ScoreDecoder.prototype.decodeFromCharMap = function(byteArray, charMapType, specialChars){
	//TODO: this should be read in form file
	charMaps = {
	  "upper" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	  "numericUpper" : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	  "numericCharUpper" : "0123456789,’.!?- ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	  "upperNumeric" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"};

	charMap = charMaps[charMapType];


	//TODO: error handling if values do not exist
	name = "";
	for(mapIndex = 0; mapIndex < byteArray.length; mapIndex++){
		b = byteArray[mapIndex];
		//console.log(b.toString(10, 'utf8'));

			specialCharValue = new Buffer(1);
			specialCharValue[0] = b;

		if(b > charMap.length){
			value = specialCharValue.toString('hex').toUpperCase();
			//console.log(value);
			name += specialChars[value];
		} else {
			//console.log(specialCharValue.toString('hex'));
			name += charMap[b];
		}

	}

	return name;
}

//TODO: handle "settings": { "ignoreBytes": [1, 3, 5, 7] }
ScoreDecoder.prototype.decodeAscii = function(byteArray){
	return byteArray.toString('ascii');
}

ScoreDecoder.prototype.decodeHexToDecimal = function(hexString, specialSettings){
	return parseInt(hexString, 16);
}

ScoreDecoder.prototype.decodeReverseDecimal = function(hexString, specialSettings){
	//work backwards and build a new reversed string
	reversedString = "";
	for(i = hexString.length; i > 0; i = i - 2){
		reversedString += hexString.substr(i - 2, 2);
	}

	return reversedString
}

ScoreDecoder.prototype.decodeBcd = function(){
	//TODO: this seems pretty rare
}

ScoreDecoder.prototype.decodeSpecialOnly = function(){
	//TODO: probably not worth worring about this one at the moment
}