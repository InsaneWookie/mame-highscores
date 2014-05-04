var fs = require('fs');
var xml2js = require('xml2js');
var util = require('util');

console.log(process.argv);
   
var hiToTextFile = process.argv[2];

//mapps HiToText format type to our types
var formatMapping = {
	//'CannedDisplay.AscendingFrom1' : '???', //this is used for the rank poition. prob not neaded
	'Reversed': 'reverseDecimal',
	'Name': 'ascii',
	'Standard': 'asIs',
	'Switch': 'switch', //not implmented //used to look up list of values (ie charater used)
	'BCD': 'bcd',
	'BCDReversed': 'reversedBcd', //not implemented
	'Hex': 'hexToDecimal',
	'HexReversed': 'reversedHexToDecimal', //not implemented yet
	'TwoToThreeEncoding(32)': '???', //no idea
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

			convertedStructure.fields = [];

			//l(scoreNameMapping);

			scoreNameMapping.Entry.forEach(function(entry){

				convertedField = { name: entry.$.Name.toLowerCase(), bytes: parseInt(entry.$.Length) }; //the format is fetched later from the header

				convertedStructure.fields.push(convertedField);
			});


			

			var extenstion = '.hi';
			//TODO: detect if the extenstion is not set
			extenstion = gameEntry.Header[0].Extensions[0].Name[0];


			//now go through the display structure and work out what format the fields are
			gameEntry.DisplayStructure[0].FieldName.forEach(function(field){

				var name = field.$.Name.toLowerCase();
				var format = field.$.ConversionType;

				var operator = field.$.Operator; //TODO: work out how to convert the operator

				//need to go through the already processed fields and add the format
				//for(var i = 0; i < convertedStructure.fields.length;

				convertedStructure.fields.forEach(function(f){
					if(f.name === name){
					
						f.format = (formatMapping[format] !== undefined) ? formatMapping[format] : 'unknown';
					}
				});


			});


			convertedEntry.name = gameNames;
			if(typeof(extenstion) === 'string'){
				
				convertedEntry.fileType = extenstion.substring(1); //remove the dot
			}
			convertedEntry.structure = convertedStructure;



			//l(convertedEntry);
			converted.push(convertedEntry);
		}




	});

	//l(converted);
	console.log(JSON.stringify(converted));

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