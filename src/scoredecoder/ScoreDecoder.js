
//TODO: clean this up to follow node js module way
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/**
 * @global
 * @class ScoreDecoder
 * @type {{decode: Function, decodeFromFile: Function, getGameMappingStructure: Function, getGameMapping: Function}}
 */

module.exports = {

	decode: function(gameSaveMappings, buffer, gameName, fileType){ //TODO: need to pass the file type in, ie .hi or .nv
		var decoder = new ScoreDecoder(gameSaveMappings, buffer);

		if(!fileType){
			fileType = 'hi';
		}
		var gameMappingStructure = decoder.getGameMappingStructure(gameName, fileType);


		return decoder.decode_internal(gameName, gameMappingStructure);
	},

	decodeFromFile: function(gameSaveMappings, filePath, gameName){
    var buffer = fs.readFileSync(filePath);
    var decoder = new ScoreDecoder(gameSaveMappings, buffer);

		var fileType = path.extname(filePath).substring(1); //extname returns the extention with the dot so we need to remove it

		//this is basically just structure part of the document from the gameMaps for this game
		var gameMappingStructure = decoder.getGameMappingStructure(gameName, fileType);

		return decoder.decode_internal(gameName, gameMappingStructure);
	},
	
	//TODO: really need to clean this up
	getGameMappingStructure: function(gameSaveMappings, gameName, fileType){
		var mapping = this.getGameMapping();

		return (mapping) ? mapping.structure : null;
	},

	getGameMapping: function(gameSaveMappings, gameName, fileType){

		for(var gameMapping in gameSaveMappings){

			var gameMappingNames = gameSaveMappings[gameMapping].name;

			for(var gameMappingName in gameMappingNames){
				if(gameName === gameMappingNames[gameMappingName]){

					//found a game but is it the right format
					//if doesnt have a file type and the file we are decoding is a .hi then use this mapping
					if(gameSaveMappings[gameMapping].fileType === undefined && fileType === 'hi'){
						return gameSaveMappings[gameMapping];

						//else if the file types match use this mapping (probably could turn this into a single if statement)
					} else if (gameSaveMappings[gameMapping].fileType === fileType){
						return gameSaveMappings[gameMapping];
					} else if(fileType === undefined){
						//if no file type provided just return any
						return gameSaveMappings[gameMapping];
					}
					//else keep looking
				}
			}
		}

		return null;
	}

};


function ScoreDecoder(gameSaveMappings, buffer) {
	this.gameSaveMappings = gameSaveMappings;
  this.fileBufferData = buffer;
	//this.mappingsVersion = mappingsVersion;
}

//TODO: optimise this. scans through evey game 
//make a hash map of the games so we can look them up fast
//fileType is the type of file uploaded ie .hi or .nv
//if the game mapping does not have a file type defined then it is assumed to be using .hi
ScoreDecoder.prototype.getGameMappingStructure = function(gameName, fileType){
	//console.log(this.gameSaveMappings);
	for(var gameMapping in this.gameSaveMappings){
		
		var gameMappingNames = this.gameSaveMappings[gameMapping].name; 
		
		for(var gameMappingName in gameMappingNames){
			if(gameName === gameMappingNames[gameMappingName]){

				//found a game but is it the right format
				//if doesnt have a file type and the file we are decoding is a .hi then use this mapping
				if(this.gameSaveMappings[gameMapping].fileType === undefined && fileType === 'hi'){
					return this.gameSaveMappings[gameMapping].structure;

				//else if the file types match use this mapping (probably could turn this into a single if statement)
				} else if (this.gameSaveMappings[gameMapping].fileType === fileType){
					return this.gameSaveMappings[gameMapping].structure;
				}
				//else keep looking
			}
		}
	}

	return null;
};

ScoreDecoder.prototype.decode_internal = function(gameName, gameMappingStructure){
	
	//var fileHandle = fs.openSync(filePath, 'r');

	//structure for storing the scores we read out
	// array('game_name' => array('name' => 'ABC', 'score' => 1234))
	var scoreData = {};
	
	var structure = gameMappingStructure;

	if(structure === null){
		//no game mapping strucure found for this game
		//fs.closeSync(fileHandle);
		return null; 
	}

	//see if we need to skip any bytes
	if(structure.skip !== undefined){
		//var skipBuffer = new Buffer(structure['skip']);
		//fs.readSync(fileHandle, skipBuffer, 0, structure['skip']);
    this.fileBufferData = this.fileBufferData.slice(structure.skip, this.fileBufferData.length);
	}

	//use a custom functions for decoding this file
	if(structure.custom){
		//var buff = fs.readFileSync(filePath, {flag: 'r'});
		//console.log(buff.toString('hex'));
		return this.decodeCustom(this.fileBufferData, gameName);
	}

	scoreData[gameName] = [];

	//the structure.blocks defines basically how many scores the game has
	for(var scoreCount = 0; scoreCount < structure.blocks; scoreCount++){
		
		var data = {};

		for(var fieldIndex in structure.fields){
			var field = structure.fields[fieldIndex];

      //if we get another structure then we want to recurs down
      if(field.structure){
        var subDecode = this.decode_internal(gameName, field.structure);

        //now need to merge sub decodes together
        if(scoreData[gameName].length === 0){
          scoreData[gameName] = subDecode[gameName];
        } else {
          subDecode[gameName].forEach(function(entry, index){
            //only want to extend the object if the key does not exist at this index
            //TODO: might have to rethink this, it makes alot of assumptions about the data
            if(!(Object.keys(entry)[0] in scoreData[gameName][index])){
              scoreData[gameName][index] = _.extend(scoreData[gameName][index], entry);
            } else {
              //if the key does exist then we want to append the record to the end of the scoreData that we have so far
              scoreData[gameName].push(entry);
            }

          });
        }
      } else {

        var byteCount = field.bytes;
        //var bytes = new Buffer(byteCount);
        var bytes = this.fileBufferData.slice(0, byteCount);
        //remove the bytes we just slice from the full buffer so we don't read them next time round
        this.fileBufferData = this.fileBufferData.slice(byteCount, this.fileBufferData.length);
        //fs.readSync(fileHandle, bytes, 0, byteCount);


        //currently only store name and score, skip all other fields
        if (field.name === 'name' || field.name === 'score') {
          var format = field.format;
          var settings = (field.settings !== undefined) ? field.settings : []; //array or null, can't decide

          var decodedBytes = this.decodeBytes(bytes, format, settings);

          data[field.name] = decodedBytes + ''; //make sure is a string
        }
      }
		}

    //little bit of a hack, if the decoding field data (ie using sub structures) we end up with an empty object
    if(!_.isEmpty(data)){
      scoreData[gameName].push(data);
    }

	}

	//TODO: need to catch any errors otherwise it will leave the file handle open (maybe its better if we dont open the file in this function?)
	//fs.closeSync(fileHandle);

	return scoreData;
} ;
	



ScoreDecoder.prototype.decodeBytes = function(bytes, format, settings){
	

	bytes = this.preProcessBytes(bytes, settings);

	var hexString = bytes.toString('hex').replace(' ', '');

	var specialSettings = (settings.special !== undefined) ? settings.special : {};

	var value = "";

	switch (format) {
		case 'ascii':
			value = this.decodeAscii(bytes, settings); 
			break;
		case 'specialOnly':
			value = this.decodeSpecialOnly(bytes, settings);
			break;
		case 'fromCharMap':
			value = this.decodeFromCharMap(bytes, settings.charMap, settings);
			break;
		case 'bcd':
			value = this.decodeBcd(hexString, settings);
			break;
    case 'bcdReversed':
      value = this.decodeBcdReversed(hexString, settings);
      break;
		case 'asIs': //asIs is actually packed bcd (keep it until the mapping is fixed)
		case 'packedBcd':
			value = this.decodePackedBcd(hexString);
			break;
		case 'reverseDecimal':
    case 'packedBcdReversed':
			value = this.decodeReverseDecimal(hexString, specialSettings);
			break;
		case 'hexToDecimal': 
			value = this.decodeHexToDecimal(hexString, specialSettings);
			break;
		case 'reversedHexToDecimal': 
		case 'reverseHexToDecimal':
			value = this.decodeReverseHexToDecimal(hexString, specialSettings);
			break;

		default:
			console.log('unknown format type ' + format + ' \n');
			break;
	}

	return this.postProcessValue(value, settings).trim();
};


ScoreDecoder.prototype.preProcessBytes = function(bytes, settings){
	
	//console.log('pre processing');
	bytes = this.removeIgnoreBytes(bytes, settings);
  bytes = this.convertTwoToThree(bytes, settings);
	bytes = this.reverseBytes(bytes, settings);
	bytes = this.addOffset(bytes, settings);
	bytes = this.addDivider(bytes, settings);
	return bytes;
};

ScoreDecoder.prototype.removeIgnoreBytes = function(bytes, settings){
	
	var clean = bytes.toJSON();
	var removedCount = 0;
	if(settings.ignoreBytes !== undefined){
		for(var i = 0; i < settings.ignoreBytes.length; i++){
			//because we are editing in place we need to adjust for the elemtents removed
			clean.data.splice(settings.ignoreBytes[i] - removedCount, 1); //remove the bytes we dont want
			removedCount++;
		}		
	}
	return Buffer.from(clean.data);
};

ScoreDecoder.prototype.reverseBytes = function(bytes, settings){

  if(settings.reverse !== undefined && settings.reverse == true){
     return Buffer.from(bytes.toJSON().data.reverse());
  }

  return bytes;
};

/**
 * This is used to decode 3 letter values that have been encoded in 2 bytes
 * Basically every 5 bits starting from the LSB is a char
 * so do the shifting then run it though the decode from char map
 * @param bytes
 * @param settings
 */
ScoreDecoder.prototype.convertTwoToThree = function(bytes, settings){

  if(!settings.convert2To3 || bytes.length !== 2){ //must be 2 bytes
    return bytes;
  }

  //convert to integer
  var hexString = bytes.toString('hex').replace(' ', '');
  var intValue = parseInt(hexString, 16);

  var buff = Buffer.alloc(3);

  buff[0] = intValue & 0x1F; //mask of the top 11 bits (ie keep the bottom 5)
  buff[1] = (intValue >> 5) & 0x1F;
  buff[2] = (intValue >> 10) & 0x1F;

  return buff;
};

ScoreDecoder.prototype.addOffset = function(bytes, settings){
	//console.log(bytes.length);
	if(settings.offset !== undefined){
		for(var i = 0; i < bytes.length; i++){
			var b = Buffer.alloc(1);
			b[0] = bytes[i];

			if(!this.inSpecialChars(b.toString('hex'), settings)){
				bytes[i] -= parseInt(settings.offset, 16);
			}
		}
	}

	return bytes;
};

// Some score names are encoded as a char map with every letter every 4 numbers 
// eg A = 1, B = 4, C = 8, D = 12, ... Z = 104
// So we support a divider to bring it down to A = 1, B = 2, C = 3, etc 
ScoreDecoder.prototype.addDivider = function(bytes, settings){

	if(settings.divideBy !== undefined){
		for(var i = 0; i < bytes.length; i++){

			var b = Buffer.alloc(1);
			b[0] = bytes[i];

			//skip of any bytes that are in the special chars array as we decode them later
			if(!this.inSpecialChars(b.toString('hex'), settings)){
				bytes[i] = bytes[i] / settings.divideBy;
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


ScoreDecoder.prototype.decodeAscii = function(byteArray, settings){

	var specialChars = (settings.special === undefined) ? {} : settings.special ;
	//Get special chars
	var processedString = "";
	for(var i = 0; i < byteArray.length; i++){

		var specialCharValue = Buffer.alloc(1);
		specialCharValue[0] = byteArray[i];

		//see if the ascii representation is actually displayable
		if(this.inSpecialChars(specialCharValue.toString('hex'), settings)){
			processedString += this.getSpecialChar(specialChars, specialCharValue.toString('hex'));
		} else {
			processedString += specialCharValue.toString('ascii');
		}

	}
	return processedString;
	
};


ScoreDecoder.prototype.decodeBcd = function(hexString){
	var decimalValue = '';
	for(var byteCount = 1; byteCount < hexString.length; byteCount = byteCount + 2){
		decimalValue += hexString[byteCount];
	}

	return parseInt(decimalValue, 10).toString().replace(/^0+/,'');
};

ScoreDecoder.prototype.decodeBcdReversed = function(hexString){
  hexString = hexString.match(/.{1,2}/g).reverse().join("");
  var decimalValue = '';
  for(var byteCount = 1; byteCount < hexString.length; byteCount = byteCount + 2){
    decimalValue += hexString[byteCount];
  }

  return parseInt(decimalValue, 10).toString().replace(/^0+/,'');
};

ScoreDecoder.prototype.decodePackedBcd = function(hexString, settings){
	return parseInt(hexString, 10).toString().replace(/^0+/,'');
};

ScoreDecoder.prototype.decodeFromCharMap = function(byteArray, charMapType, specialOptions){
	//TODO: this should be read in form file
	var charMaps = {
        "upper" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "numericUpper" : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "numericCharUpper" : "0123456789,’.!?- ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "upperNumeric" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"};

	var charMap = charMaps[charMapType];

	if(charMap === undefined){
		console.log("charMap not found: " + charMapType);
		return "<error:" + charMapType + ">";
	}

	var specialChars = ('special' in specialOptions) ? specialOptions.special : {};

	//TODO: error handling if values do not exist
	var name = "";
	for(var mapIndex = 0; mapIndex < byteArray.length; mapIndex++){

		var specialCharValue = Buffer.alloc(1);
		specialCharValue[0] = byteArray[mapIndex];

		var value = specialCharValue.toString('hex').toUpperCase();


		if(value in specialChars){ //if its in the special char map always use that first
			name += this.getSpecialChar(specialChars, value);
		} else {
			
			if(charMap[specialCharValue[0]] === undefined){
				name += "[" + value + "]"; //just print the orginal byte from the file (this may have been offset tho)
			} else {
				name += charMap[specialCharValue[0]];
			}
		}

	}

	return name;
};

//TODO: this function is very similar to decodeFromCharMap
ScoreDecoder.prototype.decodeSpecialOnly = function(byteArray, specialOptions){

	var specialChars = ('special' in specialOptions) ? specialOptions.special : null;

	if(!specialChars){
		console.log('no special chars');
		return "";
	}

	var name = "";

	for(var mapIndex = 0; mapIndex < byteArray.length; mapIndex++){

		var specialCharValue = new Buffer(1);
		specialCharValue[0] = byteArray[mapIndex];

		var value = specialCharValue.toString('hex').toUpperCase();

		if(value in specialChars){
			name += this.getSpecialChar(specialChars, value);
		} else {
				console.log("invalid char");
				name += "[" + value + "]"; //just print the orginal byte from the file (this may have been offset tho)
		}
	}

	return name;
};


ScoreDecoder.prototype.decodeHexToDecimal = function(hexString, specialSettings){
	return parseInt(hexString, 16).toString().replace(/^0+/,'');
};

ScoreDecoder.prototype.decodeReverseHexToDecimal = function(hexString, specialSettings){

	var reversedString = "";
	for(var i = hexString.length; i > 0; i = i - 2){ //TODO: convert this into a function
		reversedString += hexString.substr(i - 2, 2);
	}

	return this.decodeHexToDecimal(reversedString, specialSettings)
	//parseInt(hexString, 16).toString().replace(/^0+/,'');
};

//TODO: this should check if all numbers
ScoreDecoder.prototype.decodeReverseDecimal = function(hexString, specialSettings){
	//work backwards and build a new reversed string
	var reversedString = "";
	for(var i = hexString.length; i > 0; i = i - 2){
		reversedString += hexString.substr(i - 2, 2);
	}

	return reversedString.replace(/^0+/,'');
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

		var nameBytes = Buffer.from(bytes.slice(currentNameByte, currentNameByte + 12));

		var nameData = Buffer.from([nameBytes[0], nameBytes[2], nameBytes[4]]);
		
		nameData = this.preProcessBytes(nameData, { offset: '0A', special: {'24': "!", '25': ',', '26': '.', '27': '+'} });
		
		var scoreString = this.decodePackedBcd(scoreBytes.toString('hex')).slice(0,-1);
		
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
		return scoreDecoder.decodePackedBcd(bytes.slice(start, end).toString('hex') + 
			bytes.slice(last, last+1).toString('hex')[1]);
	};


	var data = [
		{ score: getDdonScore(bytes, 0, 4, 91), name: getDdonName(bytes, 21, 26) },
		{ score: getDdonScore(bytes, 4, 8, 93), name: getDdonName(bytes, 27, 32) },
		{ score: getDdonScore(bytes, 8, 12, 95), name: getDdonName(bytes, 33, 38) },
		{ score: getDdonScore(bytes, 12, 16, 97), name: getDdonName(bytes, 39, 44) },
		{ score: getDdonScore(bytes, 16, 20, 99), name: getDdonName(bytes, 45, 50) }
	];

	return { ddonpach: data };

};



