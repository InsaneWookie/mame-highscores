import {ScoredecoderService} from "./scoredecoder.service";

import assert = require('assert');

import gameMaps = require('./game_mappings/gameMaps.json');

// Here goes a module test
describe('GameMappingDecodings', function () {

  let ScoreDecoder: ScoredecoderService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [ScoredecoderService],
    // }).compile();

    ScoreDecoder = new ScoredecoderService();

  });

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

    var dkongBuffer = Buffer.from(dkongBytes, 'hex');
    var decoding = ScoreDecoder.decode(gameMaps, dkongBuffer, 'dkong', 'hi');

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it.skip('should decode bjtwin correctly', function () {

    var hexString = '9477012324101000000706050010101010101010101010101010103f00507600f4769677021e14101000000601' +
      '000010101010101010101010101010103f00006100f6769877032214101000000509050010101010101010101010101010103f005' +
      '05900f8769a77042418101000000500050010101010101010101010101010103f00505000fa769c77052418101000000403000010' +
      '101010101010101010101010103f00004300fc76507600000007060500';

    var buffer = Buffer.from(hexString, 'hex');

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

    var buffer = Buffer.from(hexString, 'hex');

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

    var buffer = Buffer.from(hexString, 'hex');

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

    var buffer = Buffer.from(hexString, 'hex');

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
      '0C1817FFFF0F0A150C1817FFFF0F0A150C1817FFFF0F0A150C1817FFFF0F0A150C1817FFFF0F0A150C1817FFFFFFFFFF1B1820';

    var buffer = Buffer.from(hexString, 'hex');

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
      { score: '10000', name: 'ROW' }
    ] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it('should decode boggy84 correctly', function () {

    var hexString = '000500000500000500000500000500000500000500000500000500000500000000111111111111111111111' +
      '111111111111111111111111111111111111111111111000005101010101010000000';

    var buffer = Buffer.from(hexString, 'hex');

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

    var buffer = Buffer.from(hexString, 'hex');

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


  it('should decode actionhw correctly', function () {

    //when the name is entered if the user its end the remaining chars are filled with FF
    var hexString = '4A4F450001F401014B414D000190010146415300012C010145474F0000C801014A414E0000640101';

    var buffer = Buffer.from(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'actionhw', 'hi');

    var expected = { actionhw: [
      { score: '50000', name: 'JOE' },
      { score: '40000', name: 'KAM' },
      { score: '30000', name: 'FAS' },
      { score: '20000', name: 'EGO' },
      { score: '10000', name: 'JAN' }
    ] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });


  it('should decode blktiger correctly', function () {

    //when the name is entered if the user its end the remaining chars are filled with FF
    var hexString = '000000000200000020202020494D4F200000000001080000202020204D4B50200000000001060000202020204D2E4' +
      '820000000000104000020202020592E4B20000000000102000020202020592E46200000000002000000';

    var buffer = Buffer.from(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'blktiger', 'hi');

    var expected = { blktiger: [
      { score: '20000', name: 'IMO' },
      { score: '18000', name: 'MKP' },
      { score: '16000', name: 'M.H' },
      { score: '14000', name: 'Y.K' },
      { score: '12000', name: 'Y.F' }
    ] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it('should decode valtric correctly', function () {

    //when the name is entered if the user its end the remaining chars are filled with FF
    var hexString = '00001500014A4C4300000500004E4D4B0000040000542E4E0000030000415247000002000047555300001500';

    var buffer = Buffer.from(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'valtric', 'hi');

    var expected = { valtric: [
      { score: '15000', name: 'JLC' },
      { score: '5000', name: 'NMK' },
      { score: '4000', name: 'T.N' },
      { score: '3000', name: 'ARG' },
      { score: '2000', name: 'GUS' }
    ] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });
  
  it('should decode galaga correctly', function () {

    var hexString = '0002020505010008030602010002030809240008090109240002070808240D0E0A130A220D16120D0E0A13180E000202050501';

    var buffer = Buffer.from(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'galaga', 'hi');

    var expected = { galaga: 
      [ { score: '155220', name: 'DEA' },
        { score: '126380', name: 'JAY' },
        { score: '98320', name: 'DMI' },
        { score: '91980', name: 'DEA' },
        { score: '88720', name: 'JOE' } ] };
    
    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });


  it('should decode frogger correctly', function () {

    var hexString = '630405029701580127016304';

    var buffer = Buffer.from(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'frogger', 'hi');

    //frogger only has scores, no name entry
    var expected = { "frogger": [
        {"score": "4630"},
        {"score": "2050"},
        {"score": "1970"},
        {"score": "1580"},
        {"score": "1270"}]
    };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it('should decode explorer correctly', function () {

    var hexString = '49F00030011D3A0025014CBA002001102300150132B0001001041A100801003001';

    var buffer = Buffer.from(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'explorer', 'hi');

    var expected = { explorer:
      [ { score: '13000', name: 'ROP' },
        { score: '12500', name: 'GIZ' },
        { score: '12000', name: 'SEZ' },
        { score: '11500', name: 'DAC' },
        { score: '11000', name: 'LUP' },
        { score: '10810', name: 'A Z' }] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });


  it('should decode zookeep correctly', function () {

    var hexString = "00000600F00000000000000000000680103F603865C5008DFF02F4DD0000000001C500000D83000003E510000001F" +
      "C014880000000000000007FC20060C49080000000000000000000000000000000000000000000000000000000000000000000000000" +
      "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
      "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
      "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
      "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
      "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
      "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
      "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
      "000000000000000000000000000000000000000FE00B022E7FDA8803CA0B022AFCE09D3B20000E55DE7FC00FCFF000004E7FDFF0875" +
      "B00004AEE120D30000FC000004E7FD1EC500580004659000E71CD4C4E5D70000000000000000000000000000000091000000F669005" +
      "5AA00000000000000000000000000000000000000000000000000000617564A4F4E98000531574D4F52980004223747414E98000331" +
      "5745565998000225284B4A4598000148684D41429800012599524A489800008723444C509800007578504A529800006383434453980" +
      "00058335252500000004729524A50000000429444414E00000039554C555000000034285245580000002755474A4C00000022285241" +
      "450000001845544746000000174842464D0000001305574C4D008C00000000000000000000000000000000000000000000000000000" +
      "000000000000000000000000000000000000000000000000000000000000000000000000054484953204C4F434154494F4E20202020" +
      "20202000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
      "00000000000000000000000000000000000000000000001040101000001040102040001040102000006000101000001160602000001" +
      "00040100000100020100000100020200000004010400000100060200000101040101000012100301010039300000000000000000000" +
      "00000000000000000000000000000";

    var buffer = Buffer.from(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'zookeep', 'nv');

    var expected = { zookeep:
      [ { score: '61756', name: 'JON' },
        { score: '53157', name: 'MOR' },
        { score: '42237', name: 'GAN' },
        { score: '33157', name: 'EVY' },
        { score: '22528', name: 'KJE' },
        { score: '14868', name: 'MAB' },
        { score: '12599', name: 'RJH' },
        { score: '8723', name: 'DLP' },
        { score: '7578', name: 'PJR' },
        { score: '6383', name: 'CDS' } ]
    };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it('should decode jackal correctly', function () {

    var hexString = "000200001d0d1f0000015000180d1f000001450011111111000136001111111100010000180d2400091109";

    var buffer = Buffer.from(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, 'jackal', 'hi');

    var expected = { jackal:
        [ { score: '20000', name: 'M.O' },
          { score: '15000', name: 'H.O' },
          { score: '14500', name: 'AAA' },
          { score: '13600', name: 'AAA' },
          { score: '10000', name: 'H.T' } ] };

    // console.log(decoding);

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it('should decode 1944 correctly', function () {

    var hexString =
      "0100000001000000009000000080000000700000006000000050000000496372004785800041150100400000000000020000000200000" +
      "0020000000100000001000000010100000200000001000000010000000000000900000008050000080000000705000007000000060500" +
      "00070100000607000007020000060000040000001E8004801C801800040000001E8004801C801800040000001E8004801C80180000004" +
      "4004480008044804400000044004400040000001E";

    var buffer = Buffer.from(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, '1944', 'hi');

    var expected = { '1944':
        [ { score: '1000000', name: 'CAP' },
          { score: '900000', name: 'COM' },
          { score: '800000', name: 'CAP' },
          { score: '700000', name: 'COM' },
          { score: '600000', name: 'CAP' },
          { score: '500000', name: 'COM' },
          { score: '496372', name: 'A' },
          { score: '478580', name: 'A' },
          { score: '411501', name: 'A' },
          { score: '400000', name: 'CAP' } ]
    };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

  it('should decode 1945kiii correctly', function () {

    var hexString =
      "03171419000007A1200301110E161600" +
      "0785640302110E16160006ECA8030204" +
      "00111600061A800302110E16160005B1" +
      "080302130E1812000493E00301060E12" +
      "160003A4080001110E160000039C3800" +
      "010C000D0000030D400001110E160000" +
      "02F9B8";

    var buffer = Buffer.from(hexString, 'hex');

    var decoding = ScoreDecoder.decode(gameMaps, buffer, '1945kiii', 'hi');

    var expected = { '1945kiii':
        [ { name: 'XUZ', score: '500000' },
          { name: 'ROW', score: '492900' },
          { name: 'ROW', score: '453800' },
          { name: 'EAR', score: '400000' },
          { name: 'ROW', score: '373000' },
          { name: 'TOY', score: '300000' },
          { name: 'GOS', score: '238600' },
          { name: 'ROW', score: '236600' },
          { name: 'MAN', score: '200000' },
          { name: 'ROW', score: '195000' } ] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });
  it('should decode jailbrek correctly', function () {

    let hexString =
      "0028900100141a12" +
      "0026600100141d19" +
      "0025300200290c23" +
      "0023700101141a12" +
      "0021800101141a12" +
      "0021500101141a12" +
      "0021400101111b19" +
      "0020700102101010" +
      "0020400102141a12" +
      "0019100102141a12" +
      "002890";

    let buffer = Buffer.from(hexString, 'hex');

    let decoding = ScoreDecoder.decode(gameMaps, buffer, 'jailbrek', 'hi');

    let expected = { jailbrek:
        [ { score: '28900', name: 'DJB' },
          { score: '26600', name: 'DMI' },
          { score: '25300', name: 'Y.S' },
          { score: '23700', name: 'DJB' },
          { score: '21800', name: 'DJB' },
          { score: '21500', name: 'DJB' },
          { score: '21400', name: 'AKI' },
          { score: '20700', name: '' },
          { score: '20400', name: 'DJB' },
          { score: '19100', name: 'DJB' } ] };

    assert.deepEqual(decoding, expected, "should have decoded the bytes");

  });

});
