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

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it.skip('should decode bjtwin correctly', function () {

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

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it('should decode zerowing correctly', function () {

    var hexString = '0000500000005000000048000000460000004400000042000026002600260000000000000026002600260000000' +
      '000000026002600260000000000000026002600260000000000000026002600260000000000000006000500040003000200140013' +
      '00120011001050';

    var buffer = new Buffer(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'zerowing', 'hi');

    var expected = { zerowing: [
      { score: '50000', name: '...' },
      { score: '48000', name: '...' },
      { score: '46000', name: '...' },
      { score: '44000', name: '...' },
      { score: '42000', name: '...' }
    ] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it('should decode arknoid2 correctly', function () {

    var hexString = '0100000553534200008000044B454900006000034F4752000040000247574B0000200001544B4E010000';

    var buffer = new Buffer(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'arknoid2', 'hi');

    var expected = { arknoid2: [
      { score: '100000', name: 'SSB' },
      { score: '80000', name: 'KEI' },
      { score: '60000', name: 'OGR' },
      { score: '40000', name: 'GWK' },
      { score: '20000', name: 'TKN' }
    ] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it('should decode crush correctly', function () {

    var hexString = '0000004B524C0000004B524C0000004B524C0000004B524C0000004B524C000000';

    var buffer = new Buffer(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'crush', 'hi');

    var expected = { crush: [
      { score: '0', name: 'KRL' },
      { score: '0', name: 'KRL' },
      { score: '0', name: 'KRL' },
      { score: '0', name: 'KRL' },
      { score: '0', name: 'KRL' }
    ] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it('should decode dorodon correctly', function () {

    var hexString = '0100000100000100000100000100000100000100000100000100000F0A150C1817FFFF0F0A150C1817FFFF0F0A15' +
      '0C1817FFFF0F0A150C1817FFFF0F0A150C1817FFFF0F0A150C1817FFFF0F0A150C1817FFFF0F0A150C1817FFFF0F0A150C1817';

    var buffer = new Buffer(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'dorodon', 'hi');

    var expected = { dorodon: [
      { score: '10000', name: 'FALCON' },
      { score: '10000', name: 'FALCON' },
      { score: '10000', name: 'FALCON' },
      { score: '10000', name: 'FALCON' },
      { score: '10000', name: 'FALCON' },
      { score: '10000', name: 'FALCON' },
      { score: '10000', name: 'FALCON' },
      { score: '10000', name: 'FALCON' },
      { score: '10000', name: 'FALCON' }
    ] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it('should decode boggy84 correctly', function () {

    var hexString = '000500000500000500000500000500000500000500000500000500000500000000111111111111111111111' +
      '111111111111111111111111111111111111111111111000005101010101010000000';

    var buffer = new Buffer(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'boggy84', 'hi');

    var expected = { boggy84: [
      { score: '5000', name: 'AAA' },
      { score: '5000', name: 'AAA' },
      { score: '5000', name: 'AAA' },
      { score: '5000', name: 'AAA' },
      { score: '5000', name: 'AAA' },
      { score: '5000', name: 'AAA' },
      { score: '5000', name: 'AAA' },
      { score: '5000', name: 'AAA' },
      { score: '5000', name: 'AAA' },
      { score: '5000', name: 'AAA' }
    ] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it('should decode aso correctly', function () {

    //when the name is entered if the user its end the remaining chars are filled with FF
    var hexString = '0050004E4F2E31FF20202020200028004E4F2E322020202020200027004E4F2E332020202020200026004E4F2E3420' +
      '20202020200025004E4F2E352020202020200024004E4F2E362020202020200023004E4F2E372020202020200022004E4F2E38202020' +
      '2020200021004E4F2E392020202020200020004E4F2E31302020202020005000';

    var buffer = new Buffer(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'aso', 'hi');

    var expected = { aso: [
      { score: '50000', name: 'NO.1' },
      { score: '28000', name: 'NO.2' },
      { score: '27000', name: 'NO.3' },
      { score: '26000', name: 'NO.4' },
      { score: '25000', name: 'NO.5' },
      { score: '24000', name: 'NO.6' },
      { score: '23000', name: 'NO.7' },
      { score: '22000', name: 'NO.8' },
      { score: '21000', name: 'NO.9' },
      { score: '20000', name: 'NO.10' },
    ] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });


});