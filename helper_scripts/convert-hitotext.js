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


var existingMappings = require('../api/game_mappings/gameMaps.json');

var parser = new xml2js.Parser();

fs.readFile(hiToTextFile, function (err, data) {

  //parse out the hiToText xml file
  parser.parseString(data, function (err, result) {

    console.log('Done');
    convertHiToTextFile(result.HiToText.Entry);

  });

});

var conversionTypes = [];

function convertHiToTextFile(entries) {

  //this is a list of all our converted games
  var convertedMappings = [];

  //an entry is each <Entry> from the HiToText.xml

  entries.forEach(function (gameEntry) {

    //this is really just to get a list of conversion types that HiToText has
    gameEntry.DisplayStructure[0].FieldName.forEach(function (field) {
      //build up a list of converion type (how the convert the bytes)
      if (conversionTypes.indexOf(field.$.ConversionType) === -1) {
        conversionTypes.push(field.$.ConversionType);
      }
    });


    var convertedEntry = {
      name: gameEntry.Header[0].Games[0].Name,
      structure: {}
    };

    //get the file extension
    var extension = gameEntry.Header[0].Extensions[0].Name[0];
    if (typeof(extension) === 'string') {
      var fileType = extension.substring(1);
      if(fileType !== 'hi') //no need to add the filetype as we assume its hi if non is provided
      convertedEntry.fileType = fileType; //remove the dot
    }

    //only want to add ones we dont alreay have
    var alreadyExisting = existingMappings.some(function(existingMapping){
      return existingMapping.name.some(function(existingName){
        return convertedEntry.name.some(function(currentEntryName){
          return currentEntryName == existingName;
        })
      });
    });

    if(alreadyExisting){
      return;
    }

    var entryStructure = gameEntry.FileStructure;

    function createMappingStrcture(mapping) {

      //this is our game mapping json structure
      var convertedStructure = {
        blocks: null,
        fields: null
      };

      //blocks is basically the number of times we need to iterate over the fields
      convertedStructure.blocks = parseInt(mapping.$.NumberOfBlocks);

      convertedStructure.fields = [];

      mapping.Entry.forEach(function (entry) {

        var convertedField = {
          name: entry.$.Name.toLowerCase(),
          bytes: parseInt(entry.$.Length)
        };

        var formatParts = getSettings(gameEntry, entry.$.Name);

        convertedField.format = formatParts.format;
        convertedField.settings = formatParts.settings;

        convertedStructure.fields.push(convertedField);
      });

      //convertedEntry.structure = convertedStructure;
      return convertedStructure;
    }


    /** problem is this just gets us the single mapping, really we need to get all of them, but discard the
     * non score or name ones */
    var scoreNameMappings = getFileStructureMapping(entryStructure[0].Mapping);

    if (scoreNameMappings.length === 0) {
      //console.log("no mapping found");
      return; //go to next entry
    } else {

      if (scoreNameMappings.length === 1) {
        //if there is only one we dont need to do anything special
        //just add it you the list
        convertedEntry.structure = createMappingStrcture(scoreNameMappings[0])
        convertedMappings.push(convertedEntry);

      } else {

        var parentStructure = {
          "blocks": 1,
          "fields": [ ]
        };

        scoreNameMappings.forEach(function (scoreNameMapping) {

          parentStructure.fields.push({ structure: createMappingStrcture(scoreNameMapping) });
        });

        convertedEntry.structure = parentStructure;

        convertedMappings.push(convertedEntry);
      }

    }

  });

  //l(converted);


  console.log(JSON.stringify(convertedMappings, null, 2));

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
/**
 *
 * @param gameEntry - <Entry> node
 * @param name - the <FileStructure> <Mapping> <Entry> Name field we are getting settings for (eg "Score" or "Name")
 * @return {*}
 */
function getSettings(gameEntry, name) {
  //need to work out the format
  var format = "<unknown>";
  var settings = {};

  gameEntry.DisplayStructure[0].FieldName.forEach(function (field) {

    if (field.$.Name == name) {

      if (field.$.Name == 'Name' && field.$.ConversionType == 'Name') {
        //need to look up the formats for the name
        //need to work out the special mappings

        //if(gameEntry.Header[0].TextParameters !== undefined){

        var formats = gameEntry.Header[0].TextParameters[0].Formats[0].Name;

        var specialFormats = "";

        var builtFormat = "";

        formats.forEach(function (f) {

          if (f == 'NeedsSpecialMapping') {
            //look up the special mapping
            var specialMapping = gameEntry.Header[0].TextParameters[0].SpecialMapping[0].Map;

            format = 'fromCharMap';
            settings = { charMap: "" };

            //see of there is any offset we need to apply
            if (gameEntry.Header[0].TextParameters[0].Offsets) {
              //just apply the first offset
              //going to have to hand fix the one that aren't right
              //l(gameEntry.Header[0].TextParameters[0].Offsets);
              var offset = undefined;
              if(typeof gameEntry.Header[0].TextParameters[0].Offsets[0].Offset[0] === 'string'){
                offset = gameEntry.Header[0].TextParameters[0].Offsets[0].Offset[0].substring(2).toUpperCase();
              } else {
                offset = gameEntry.Header[0].TextParameters[0].Offsets[0].Offset[0];
              }

              settings.offset = offset.$.StartByte.substr(-2,2).toUpperCase();
            }

            settings.special = {};

            specialMapping.forEach(function (map) {
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

        if (builtFormat == 'ASCIIStandard') {
          format = 'ascii';
          delete settings.charMap;
        } else {

          settings.charMap = (formatMapping[builtFormat.toUpperCase()] !== undefined) ? formatMapping[builtFormat.toUpperCase()] : '<unknown:' + builtFormat + '>';
        }

      } else if (field.$.Name !== 'Rank') {

        //var name = field.$.Name.toLowerCase();
        var conversionType = field.$.ConversionType;

        //var operator = field.$.Operator; //TODO: work out how to convert the operator

        format = (formatMapping[conversionType.toUpperCase()] !== undefined) ? formatMapping[conversionType.toUpperCase()] : '<unknown:' + conversionType + '>';

      }
    }
  });

  if (Object.keys(settings).length === 0) {
    if (format == "<unknown>") {
      return {};
    } else {
      return {format: format};
    }
  } else {
    return {format: format, settings: settings};
  }
}

/**
 * This returns an array of  <FileStructure> <Mappings> that have either a score or name
 * @param mappings - all the <Mappings> from <FileStructure>
 * @return Array
 */
function getFileStructureMapping(mappings) {

  var foundMappings = [];

  mappings.forEach(function (mapping) {
    //its possible that the Entry is not an array
    //and currently we dont support this kind of format in our decoder
    if (!(mapping.Entry instanceof Array)) {
      return false;
    } else {

      var foundNameOrScore = mapping.Entry.some(function (entry) {
        return (entry.$.Name === "Score" || entry.$.Name === "Name");
      });

      if (foundNameOrScore) {
        foundMappings.push(mapping);
      }
    }

  });

  //l('return mapping');
  //l(foundMapping);
  return foundMappings;

}


function l(data) {
  console.log(util.inspect(data, false, null));
}