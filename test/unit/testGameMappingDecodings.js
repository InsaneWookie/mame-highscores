var assert = require('assert');

var gameMaps = require('../../api/game_mappings/gameMaps.json');

// Here goes a module test
describe('GameMappingDecodings', function () {
  it('should decode dkong correctly', function () {

    var dkongBytes = '9477012324101000000706050010101010101010101010101010103f00507600f4769677021e14101000000601' +
      '000010101010101010101010101010103f00006100f6769877032214101000000509050010101010101010101010101010103f005' +
      '05900f8769a77042418101000000500050010101010101010101010101010103f00505000fa769c77052418101000000403000010' +
      '101010101010101010101010103f00004300fc76507600000007060500';

    var expected = { dkong: [
      { score: '7650', name: '' },
      { score: '6100', name: '' },
      { score: '5950', name: '' },
      { score: '5050', name: '' },
      { score: '4300', name: '' }
    ] };

    var dkongBuffer = new Buffer(dkongBytes, 'hex');
    var decoding = ScoreDecoder.decode(gameMaps, dkongBuffer, 'dkong', 'hi');

    assert.ok(decoding, expected, "should have decoded the bytes");

  });

  it('should decode bjtwin correctly', function () {

    var hexString = '9477012324101000000706050010101010101010101010101010103f00507600f4769677021e14101000000601' +
      '000010101010101010101010101010103f00006100f6769877032214101000000509050010101010101010101010101010103f005' +
      '05900f8769a77042418101000000500050010101010101010101010101010103f00505000fa769c77052418101000000403000010' +
      '101010101010101010101010103f00004300fc76507600000007060500';

    var buffer = new Buffer(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'bjtwin', 'hi');

    var expected = { bjtwin: [
      { score: '3110', name: 'PPP' },
      { score: '2570', name: 'AAA' },
      { score: '1980', name: 'CMT' },
      { score: '1630', name: 'X' },
      { score: '1110', name: 'BUS' },
      { score: '690', name: 'MOR' },
      { score: '520', name: '...' },
      { score: '150', name: 'EKL' },
      { score: '40', name: 'COF' },
      { score: '10', name: 'BIT' }
    ] };

    assert.ok(decoding, expected, "should have decoded the bytes");

  });
});