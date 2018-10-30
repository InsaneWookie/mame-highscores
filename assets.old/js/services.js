'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  factory('mamedecoder', function () {
    return {
      decodeBytes: function(bytes, format){
//        bytes = this.preProcessBytes(bytes, settings);

        var hexString = bytes;//bytes.toString('hex').replace(' ', '');

        //var specialSettings = (settings.special !== undefined) ? settings.special : {};

        var value = "";

        switch (format) {
//          case 'ascii':
//            value = this.decodeAscii(bytes, settings);
//            break;
//          case 'fromCharMap':
//            value = this.decodeFromCharMap(bytes, settings.charMap, settings);
//            break;
          case 'bcd':
            value = this.decodeBcd(hexString);
            break;
          case 'bcdReversed':
            value = this.decodeBcdReversed(hexString);
            break;
          case 'asIs': //asIs is actually packed bcd (keep it until the mapping is fixed)
          case 'packedBcd':
            value = this.decodePackedBcd(hexString);
            break;
          case 'packedBcdReversed':
          case 'reverseDecimal':
            value = this.decodeReverseDecimal(hexString);
            break;
          case 'hexToDecimal':
            value = this.decodeHexToDecimal(hexString);
            break;
          case 'reversedHexToDecimal':
          case 'reverseHexToDecimal':
            value = this.decodeReverseHexToDecimal(hexString);
            break;
          default:
            console.log('unknown format type ' + format + ' \n');
            break;
        }

        return value;
        //return this.postProcessValue(value, settings).trim();
      },

      decodeBcd: function (hexString) {
        var decimalValue = '';
        for (var byteCount = 1; byteCount < hexString.length; byteCount = byteCount + 2) {
          decimalValue += hexString[byteCount];
        }

        return parseInt(decimalValue, 10).toString().replace(/^0+/, '');
      },

      decodeBcdReversed: function (hexString) {
        hexString = hexString.match(/.{1,2}/g).reverse().join("");
        var decimalValue = '';
        for (var byteCount = 1; byteCount < hexString.length; byteCount = byteCount + 2) {
          decimalValue += hexString[byteCount];
        }

        return parseInt(decimalValue, 10).toString().replace(/^0+/, '');
      },

      decodePackedBcd: function (hexString) {
        return parseInt(hexString, 10).toString().replace(/^0+/, '');
      },

//      decodeFromCharMap: function (byteArray, charMapType, specialOptions) {
//        //TODO: this should be read in form file
//        var charMaps = {
//          "upper": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
//          "numericUpper": "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
//          "numericCharUpper": "0123456789,’.!?- ABCDEFGHIJKLMNOPQRSTUVWXYZ",
//          "upperNumeric": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"};
//
//        var charMap = charMaps[charMapType];
//
//        if (charMap === undefined) {
//          console.log("charMap not found: " + charMapType);
//          return "<error:" + charMapType + ">";
//        }
//
//        var specialChars = ('special' in specialOptions) ? specialOptions.special : {};
//
//        //TODO: error handling if values do not exist
//        var name = "";
//        for (var mapIndex = 0; mapIndex < byteArray.length; mapIndex++) {
//
//          var specialCharValue = new Buffer(1);
//          specialCharValue[0] = byteArray[mapIndex];
//
//          var value = specialCharValue.toString('hex').toUpperCase();
//
//
//          if (value in specialChars) { //if its in the special char map always use that first
//            name += this.getSpecialChar(specialChars, value);
//          } else {
//
//            if (charMap[specialCharValue[0]] === undefined) {
//              name += "[" + value + "]"; //just print the orginal byte from the file (this may have been offset tho)
//            } else {
//              name += charMap[specialCharValue[0]];
//            }
//          }
//
//        }
//
//        return name;
//      },


      decodeHexToDecimal: function (hexString) {
        return parseInt(hexString, 16).toString().replace(/^0+/, '');
      },

      decodeReverseHexToDecimal: function (hexString) {

        var reversedString = "";
        for (var i = hexString.length; i > 0; i = i - 2) { //TODO: convert this into a function
          reversedString += hexString.substr(i - 2, 2);
        }

        return this.decodeHexToDecimal(reversedString)
        //parseInt(hexString, 16).toString().replace(/^0+/,'');
      },

      decodeReverseDecimal: function (hexString) {
        //work backwards and build a new reversed string
        var reversedString = "";
        for (var i = hexString.length; i > 0; i = i - 2) {
          reversedString += hexString.substr(i - 2, 2);
        }

        return reversedString.replace(/^0+/, '');
      }
    }
  });
