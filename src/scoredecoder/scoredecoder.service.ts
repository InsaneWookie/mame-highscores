import { Injectable } from '@nestjs/common';
import scoreDecoder = require('./ScoreDecoder.js');

@Injectable()
export class ScoredecoderService {

  decode(gameSaveMappings, buffer, gameName, fileType): any {
    return scoreDecoder.decode(gameSaveMappings, buffer, gameName, fileType);
  }

  decodeFromFile(gameSaveMappings, filePath, gameName) {
    return scoreDecoder.decodeFromFile(gameSaveMappings, filePath, gameName);
  }

  getGameMappingStructure(gameSaveMappings, gameName, fileType) {
    return scoreDecoder.getGameMappingStructure(gameSaveMappings, gameName, fileType);
  }

  getGameMapping(gameSaveMappings, gameName, fileType) {
    return scoreDecoder.getGameMapping(gameSaveMappings, gameName, fileType);
  }
}
