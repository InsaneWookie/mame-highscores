var fs = require('fs');
var xml2js = require('xml2js');
var util = require('util');

console.log(process.argv);
   
var hiToTextFile = process.argv[2];

//mapps HiToText format type to our types
var formatMapping = {
	//'CannedDisplay.AscendingFrom1' : '???', //this is used for the rank poition. prob not neaded
	'REVERSED': 'reverseDecimal',
	//'Name': 'ascii',
	'STANDARD': 'asIs',
	//'Switch': 'switch', //not implmented //used to look up list of values (ie charater used)
	'BCD': 'bcd',
	'BCDREVERSED': 'reversedBcd', //not implemented
	'HEX': 'hexToDecimal',
	'HEXREVERSED': 'reversedHexToDecimal', //not implemented yet
	//'TwoToThreeEncoding(32)': '???', //no idea

	'ASCIISTANDARD': 'ascii', //not sure what this should be
	'ASCIIUPPER': 'upper', 
	'ASCIINUMBERS': 'upperNumeric',

	//kind of hacking way to convert multiple formats
	'ASCIIUPPERASCIINUMBERS': 'upperNumeric',
	'ASCIINUMBERSASCIIUPPER': 'numericUpper'

	//'_1944',
	//'_8ballact',
	//'actionhw',
	//'airwolf',
	//'arkarea',
	//'athena',
	//'bankp',
	//'barrier',
	//'bloodbroArea',
	//'cabal',
	//'cleopatr',
	//'dariusg',
	//'ddribble_date',
	//'ddribble_percent',
	//'digdug2',
	//'dkong3',
	//'extrmatn',
	//'galaga',
};


var parser = new xml2js.Parser();
fs.readFile(hiToTextFile, function(err, data) {

    parser.parseString(data, function (err, result) {
        //console.log(result.HiToText.Entry);
        console.log('Done');

        convertHiToTextFile(result.HiToText.Entry);

    });

});

var conversionTypes = [];

function convertHiToTextFile(entries){

	//console.log(hi2Text);

	//this is our converted format 
	var converted = [];

	entries.forEach(function(gameEntry){
		

		//console.log(gameEntry);
		gameEntry.DisplayStructure[0].FieldName.forEach(function(field){
			if(conversionTypes.indexOf(field.$.ConversionType) === -1){
							
				conversionTypes.push(field.$.ConversionType);
			}
		});


		var convertedEntry = {};
		//first work out the game name for this entry

		//l(gameEntry);
		var gameNames = gameEntry.Header[0].Games[0].Name;

		//next work out the structure
		//need the block count

		
		var convertedStructure = {};
		
		entryStructure = gameEntry.FileStructure;

		//there can be multiple mapping strctures but we just care about the one that has the name and score in it
		
		var scoreNameMapping = getFileStructureMapping(entryStructure[0].Mapping);

		if(scoreNameMapping === null){
			//console.log("no mapping found");
			return; //go to next entry
		} else {

			//
			convertedStructure.blocks = parseInt(scoreNameMapping.$.NumberOfBlocks);

			convertedEntry.name = gameNames;

			var extenstion = '.hi';
			extenstion = gameEntry.Header[0].Extensions[0].Name[0];
			if(typeof(extenstion) === 'string'){
				convertedEntry.fileType = extenstion.substring(1); //remove the dot
			}

			convertedEntry.structure = convertedStructure;

			convertedStructure.fields = [];

			scoreNameMapping.Entry.forEach(function(entry){

				convertedField = { 
					name: entry.$.Name.toLowerCase(), 
					bytes: parseInt(entry.$.Length) 
				}; 
				
				formatParts = getSettings(gameEntry, entry.$.Name);
				//if()
				convertedField.format = formatParts.format;
				convertedField.settings = formatParts.settings;

				convertedStructure.fields.push(convertedField);
			});

			converted.push(convertedEntry);
		}




	});

	//l(converted);
	console.log(JSON.stringify(converted, null, 2));

}



//this returns the format and settings part of the mapping 
//eg for the following returns and object with the format and settings part
/*
{"name": "name", "bytes": 3, "format": "fromCharMap", "settings": {
            "charMap": "upper",
            "offset": "01", //in hex
            "special": {
              "1B": "."
            }
          }
        }
*/
function getSettings(gameEntry, name){
	//need to work out the format 
	var format = "<unknown>";
	var settings = {};

	gameEntry.DisplayStructure[0].FieldName.forEach(function(field){

		if(field.$.Name == name){

			if(field.$.Name == 'Name' && field.$.ConversionType == 'Name'){
			//need to look up the formats for the name
			//need to work out the special mappings

			//if(gameEntry.Header[0].TextParameters !== undefined){

				var formats = gameEntry.Header[0].TextParameters[0].Formats[0].Name;

				var specialFormats = "";

				var builtFormat = "";

				formats.forEach(function(f){

					if(f == 'NeedsSpecialMapping'){
						//look up the special mapping
						var specialMapping = gameEntry.Header[0].TextParameters[0].SpecialMapping[0].Map;

						format = 'fromCharMap';
						settings = { charMap: "" };

						//see of there is any offset we need to apply
						if(gameEntry.Header[0].TextParameters[0].Offsets){
							//just apply the first offset
							//going to have to hand fix the one that aren't right
							var offset = gameEntry.Header[0].TextParameters[0].Offsets[0].Offset[0].substring(2).toUpperCase();
							settings.offset = parseInt(offset.$.StartByte, 16);
						}

						settings.special = {};

						specialMapping.forEach(function(map){
							//need to remove the first 2 chars as its in the format 0xFF and we want FF
							settings.special[map.$.Byte.substring(2).toUpperCase()] = map.$.Char;
						});



					} else {
						//as there can be more than one type in the hi to text format just add them 
						//together so we can hand fix it later
						builtFormat = builtFormat + f;
						//settings.charMap = settings.charMap + formatMapping[f]; 
					}

					
				});

				if(builtFormat == 'ASCIIStandard'){
					format = 'ascii';
					delete settings.charMap;
				} else {

					settings.charMap = (formatMapping[builtFormat.toUpperCase()] !== undefined) ? formatMapping[builtFormat.toUpperCase()] : '<unknown:' + builtFormat + '>';
				}

			} else if(field.$.Name !== 'Rank'){
			
				//var name = field.$.Name.toLowerCase();
				var conversionType = field.$.ConversionType;

				//var operator = field.$.Operator; //TODO: work out how to convert the operator

				format = (formatMapping[conversionType.toUpperCase()] !== undefined) ? formatMapping[conversionType.toUpperCase()] : '<unknown:' + conversionType + '>';
				
			}
		}
	});

	if(Object.keys(settings).length === 0){
		if(format == "<unknown>"){
			return {};
		} else {
			return {format: format};
		}
	} else {
		return {format: format, settings: settings};
	}
}


function getFileStructureMapping(mappings){

	var foundMapping = {};

	var found = mappings.some(function(mapping){

		var foundName = false;
		var foundScore = false;
		foundMapping = mapping;

		//l(mapping);

		//its posible that the Entry is not an array 
		//and currently we dont support this kind of format in out decoder
		if(!(mapping.Entry instanceof Array)){
			return false;
		} else {

			return mapping.Entry.some(function(entry){

				if(entry.$.Name === "Score"){
					foundName = true;
				}

				if(entry.$.Name === "Name"){
					foundScore = true;
				}

				return foundScore && foundName;

			});
		}	
	});

	//l('return mapping');
	//l(foundMapping);
	return (found) ? foundMapping : null;

}


function l(data){
	console.log(util.inspect(data, false, null));
}