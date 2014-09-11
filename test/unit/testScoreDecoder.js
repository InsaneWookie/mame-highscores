/**
 * Created by rowan on 8/23/14.
 */

var assert = require('assert');


//before(function(done) {
//
//});
//
//after(function(done) {
//
//});

// Here goes a module test
describe('ScoreDecoder', function () {
  describe('#decode', function () {

    it('should decode correctly', function () {

      var gameMaps = require('../../api/game_mappings/gameMaps.json');

      var dkongBytes = '9477012324101000000706050010101010101010101010101010103f00507600f4769677021e14101000000601' +
        '000010101010101010101010101010103f00006100f6769877032214101000000509050010101010101010101010101010103f005' +
        '05900f8769a77042418101000000500050010101010101010101010101010103f00505000fa769c77052418101000000403000010' +
        '101010101010101010101010103f00004300fc76507600000007060500';

      var dkongBuffer = new Buffer(dkongBytes, 'hex');

      var decoding = ScoreDecoder.decode(gameMaps, dkongBuffer, 'dkong', 'hi');

      var expected = { dkong: [
        { score: '7650', name: '' },
        { score: '6100', name: '' },
        { score: '5950', name: '' },
        { score: '5050', name: '' },
        { score: '4300', name: '' }
      ] };

      assert.deepEqual(decoding, expected, "should have decoded the bytes");

    });


    it('should not decode nv file when only hi mapping', function () {

      var gameMaps = require('../../api/game_mappings/gameMaps.json');

      var bytes = '9477012324101000000706050010101010101010101010101010103f00507600f4769677021e14101000000601' +
        '000010101010101010101010101010103f00006100f6769877032214101000000509050010101010101010101010101010103f005' +
        '05900f8769a77042418101000000500050010101010101010101010101010103f00505000fa769c77052418101000000403000010' +
        '101010101010101010101010103f00004300fc76507600000007060500';


      var buffer = new Buffer(bytes, 'hex');

      var decoding = ScoreDecoder.decode(gameMaps, buffer, 'ddonpach', 'nv');

      var expected = null;

      assert.equal(decoding, expected, "should not have decoded the file");

    });
  });
});