import { Test, TestingModule } from '@nestjs/testing';
import { ScoredecoderService } from './scoredecoder.service';
import gameMaps = require('./game_mappings/gameMaps.json');

describe('ScoredecoderService', () => {
  let ScoreDecoder: ScoredecoderService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [ScoredecoderService],
    // }).compile();

    ScoreDecoder = new ScoredecoderService();

  });

  it('should be defined', () => {
    expect(ScoreDecoder).toBeDefined();
  });

  describe('#decode', function () {

    it('should decode correctly', function () {

      //var gameMaps = require('../../api/game_mappings/gameMaps.json');

      var dkongBytes = '9477012324101000000706050010101010101010101010101010103f00507600f4769677021e14101000000601' +
        '000010101010101010101010101010103f00006100f6769877032214101000000509050010101010101010101010101010103f005' +
        '05900f8769a77042418101000000500050010101010101010101010101010103f00505000fa769c77052418101000000403000010' +
        '101010101010101010101010103f00004300fc76507600000007060500';

      var dkongBuffer = Buffer.from(dkongBytes, 'hex');

      var decoding = ScoreDecoder.decode(gameMaps, dkongBuffer, 'dkong', 'hi');

      var expected = { dkong: [
          { score: '7650', name: '' },
          { score: '6100', name: '' },
          { score: '5950', name: '' },
          { score: '5050', name: '' },
          { score: '4300', name: '' }
        ] };

      expect(decoding).toEqual(expected);

    });


    it('should not decode nv file when only hi mapping', function () {

      //var gameMaps = require('../../api/game_mappings/gameMaps.json');

      var bytes = '9477012324101000000706050010101010101010101010101010103f00507600f4769677021e14101000000601' +
        '000010101010101010101010101010103f00006100f6769877032214101000000509050010101010101010101010101010103f005' +
        '05900f8769a77042418101000000500050010101010101010101010101010103f00505000fa769c77052418101000000403000010' +
        '101010101010101010101010103f00004300fc76507600000007060500';


      var buffer = Buffer.from(bytes, 'hex');

      var decoding = ScoreDecoder.decode(gameMaps, buffer, 'ddonpach', 'nv');

      var expected = null;

      expect(decoding).toEqual(expected);

    });
  });
});
