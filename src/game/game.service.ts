import { Injectable } from '@nestjs/common';
import { Game } from '../entity/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { GamePlayed } from '../entity/gameplayed.entity';
import { Score } from '../entity/score.entity';
import { User } from '../entity/user.entity';
import _ = require('underscore');
import path = require("path");

import { ScoredecoderService } from '../scoredecoder/scoredecoder.service';

import gameMaps = require('../scoredecoder/game_mappings/gameMaps.json');
import { Machine } from "../entity/machine.entity";

@Injectable()
export class GameService {

  constructor(@InjectRepository(Game)
              private readonly game: Repository<Game>,
              @InjectRepository(GamePlayed)
              private readonly gamePlayed: Repository<GamePlayed>,
              @InjectRepository(Score)
              private readonly score: Repository<Score>,
              @InjectRepository(User)
              private readonly user: Repository<User>,
              @InjectRepository(Machine)
              private readonly machine: Repository<Machine>,
              private readonly scoreDecoder: ScoredecoderService) {

  }

  async findAll(groupId: number, orderBy = 'name ASC'): Promise<Game[]> {

    const sort: string[] = orderBy.split(' ');
    const direction: any = sort[1];

    let q = this.gamePlayed.createQueryBuilder('gp')
      .leftJoinAndSelect('gp.machine', 'm')
      .where('m.group_id = :groupId')
      .getQuery();

    return await this.game.createQueryBuilder('game')
      .leftJoinAndSelect(`(${q})`, 'played', 'game.id = played.gp_game_id')
      .leftJoinAndMapOne('game.gameplayed', 'game.gameplayed', 'gameplayed', 'played.gp_id = gameplayed.id')
      .setParameter('groupId', groupId)
      //.where('gameplayed.id IS NOT NULL')
      .where('game.has_mapping = true')
      .andWhere('game.clone_of IS NULL')
      .orderBy('game.' + sort[0], sort[1] as any) //Not sure if dynamically doing this order by is a good idea
      //.orderBy()
      .limit(1000)
      .getMany();
  }

  async find(id: number, groupId: number): Promise<Game> {
    let q = this.gamePlayed.createQueryBuilder('gp')
      .leftJoinAndSelect('gp.machine', 'm')
      .where('m.group_id = :groupId')
      .getQuery();

    return await this.game.createQueryBuilder('game')
      .leftJoinAndSelect(`(${q})`, 'played', 'game.id = played.gp_game_id')
      //  .leftJoinAndSelect(GamePlayed, 'gameplayed', 'played.gp_id = gameplayed.id')
      .leftJoinAndMapOne('game.gameplayed', 'game.gameplayed', 'gameplayed', 'played.gp_id = gameplayed.game_id')
      .setParameter('groupId', groupId)
      .where({id: id})
      .getOne();
  }

  async findTopPlayers(groupId: number): Promise<object> {

    // var userId = (user && typeof user === "object") ? user.id : user;

    // var extraWhere = (!!userId) ? " AND u.id = $1 " : "";
    // var queryParams = (!!userId) ? [ userId ] : [];

    const pointsQuery =
      ' SELECT u.id, u.username, player_total_points.total_points \
        FROM \
        (SELECT user_id, sum(points) total_points \
         FROM \
           (SELECT s.game_id, ug.user_id, min (s.rank) top_rank, \
           CASE \
           WHEN min (s.rank) = 1 THEN 8 \
           WHEN min (s.rank) = 2 THEN 5 \
           WHEN min (s.rank) = 3 THEN 3 \
           WHEN min (s.rank) = 4 THEN 2 \
           WHEN min (s.rank) = 5 THEN 1 \
           ELSE 0 \
           END as points \
           FROM user_group ug \
           JOIN alias a ON ug.id = a.user_group_id \
              JOIN score s ON a.id = s.alias_id \
           WHERE \
            ug.group_id = $1 \
            AND s.rank <= 5 \
           GROUP BY s.game_id, ug.user_id ) player_points \
         GROUP BY user_id \
        ) \
        player_total_points, \
                "user" u \
      WHERE player_total_points.user_id = u.id ' +
      // extraWhere +
      'ORDER BY total_points DESC';

    return await getConnection().query(pointsQuery, [groupId]);

  }


  /**
   * Removes already existing scores, duplicate new scores and other invalid scores (like empty score)
   * @param newScores
   * @param currentScores
   */
  filterScores(newScores, currentScores): any {

    return newScores.filter(function (newScore, filterIndex) {

      //compares a score to the newScore to see if they match (compares name and score)
      var areScoresEqual = function(scoreToCompare){
        //some games don't have names, only scores so we need to take this into account
        //if the name isn't set then just compare the scores
        //TODO: really need to have a flag against the game to say that it has scores only
        //var newScoreName = (newScore.name === undefined) ? null : newScore.name;
        if(newScore.name === undefined){
          return (newScore.score === scoreToCompare.score);
        } else {
          return (newScore.name === scoreToCompare.name) && (newScore.score === scoreToCompare.score);
        }
      };

      //if it doesn't exist then we want to add it to the filtered scores list
      var doesntExist = !currentScores.some(areScoresEqual);

      //also want to remove duplicate new scores
      var foundDuplicateIndex = 0;
      var foundDuplicate = newScores.some(function(dupeScore, dupeSomeIndex){
        //if a score has a duplicate we want to keep the first instance of it
        foundDuplicateIndex = dupeSomeIndex;
        return areScoresEqual(dupeScore)
      });

      //we do not want to remove the first instance of the duplicate
      //so if we find a duplicate score for the one being filtered we also need to check that the
      //one we found isn't in the same position, if its not in the same posistion then its a dupe
      var isNotDuplicate = foundDuplicate && filterIndex === foundDuplicateIndex;

      return doesntExist && isNotDuplicate && newScore.score !== '';
    });
  }

  /**
   * Gets scores beaten for use in sending email
   * IMPORTANT: this assumes bother addedScores and afterAddedScores are sorted high to low
   * TODO: currently this only handles single alias, if a user sets a score on the same game with
   * a different alias it will think they have beaten them self
   * @param {Array} addedScores
   * @param {Array} afterAddedScores
   * @return {object}
   *  example
   *  {
   *    //game: {Game}
   *    beatenBy: { Score }
   *    beaten: [
   *      { Score ,
   *      ...
   *    ]
   *  }
   */
  getBeatenScores(addedScores, afterAddedScores) {
    var foundCreatedScore = false;

    //scores above the new ones
    var topScoreAliasIds = [];

    var topNewScore = null;
    //find the first score with a user
    for(var i = 0; i < addedScores.length; i++){
      if(addedScores[i].alias){
        topNewScore = addedScores[i];
        break;
      }
    }

    var beatenObject = {
      beatenBy: {},
      beaten: []
    };

    //could not find a top score so return the empty object
    if(topNewScore === null){
      return beatenObject;
    }

    //simple array for holding the alias ids that we have beaten (so only add a score for a user once)
    var beatenAliasIds = [];

    //count for holding how far though the score list we are
    //only want to beat top 10
    var beatenCount = 0;

    var topScoreAliasId = null;

    //go through each score and find the added one
    afterAddedScores.forEach(function (score) {

      beatenCount++;

      if(beatenCount > 5){
        //probably a better way of doing this
        //it will keep returning until we run out of scores
        return;
      }

      var scoreAliasId = null;
      if(score.alias) {
        scoreAliasId = (typeof score.alias == 'object') ? score.alias.id : score.alias;
      }

      if (foundCreatedScore
        && scoreAliasId //only care about scores that have a user
        && topScoreAliasId != scoreAliasId //don't beat yourself
        && beatenAliasIds.indexOf(scoreAliasId) === -1  //TODO: add support for multiple aliases
        && topScoreAliasIds.indexOf(scoreAliasId) === -1) { //don't flag a score as beaten if they have a higher score

        beatenObject.beaten.push(score);
        beatenAliasIds.push(scoreAliasId);
      }

      if(foundCreatedScore === false ){
        if(topNewScore.id === score.id){
          topNewScore = score;
          topScoreAliasId = (typeof score.alias == 'object') ? topNewScore.alias.id : topNewScore.alias;
          foundCreatedScore = true;
        } else {
          var beatenAliasId = (score.alias && typeof score.alias == 'object') ? score.alias.id : score.alias;
          topScoreAliasIds.push(beatenAliasId);
        }
      }

    });

    beatenObject.beatenBy = topNewScore;

    return beatenObject;
  }

  /**
   * TODO: the playcount on the game table should be a db trigger off GamePlayed insert or delete
   * @param game
   * @param machine
   * @param callback
   */
  updatePlayedCount(game, machine, callback){
    //add a played record
    // GamePlayed.create({game: game.id, machine: machine.id}).exec(function (err, newGamePLayed) { });
    //
    // //dont technically need to do this as it can be inferred from the gameplayed table
    // sails.sendNativeQuery('UPDATE game SET play_count = play_count + 1, last_played = NOW() WHERE id = $1', [game.id],
    //   function (err, result) {
    //     callback(err, result);
    //   });
  }

  // sendBeatenScoreEmails(game, createdScores, callback){
  //
  //   this.score.find({game: game.id}).populate('alias').exec(function (err, allScores) {
  //
  //     if(err) return callback(err);
  //
  //     if(allScores.length) {
  //       allScores.sort(function (a, b) {
  //         return parseInt(b.score) - parseInt(a.score);
  //       });
  //
  //       //set the score TODO: check if they are already set?
  //       game.scores = allScores;
  //
  //       var beatenScores = Game.getBeatenScores(createdScores, allScores);
  //
  //       if(beatenScores.beatenBy != {} && beatenScores.beaten.length != 0){
  //         this.user.findOne(beatenScores.beatenBy.alias.user).exec(function(err, beatenByUser){
  //
  //           if(err) return callback(err);
  //
  //           var beatenBy = beatenScores.beatenBy;
  //           beatenBy.user = beatenByUser;
  //
  //           //go though all the beaten scores and send them emails
  //           beatenScores.beaten.forEach(function(beatenScore){
  //             User.findOneById(beatenScore.alias.user).exec(function(err, beatenUser){
  //
  //               var beaten = beatenScore;
  //               beaten.user = beatenUser;
  //               // EmailService.sendBeatenEmail(game, beatenBy, beaten, { to: beaten.user.email }, function (err, emailResponse) {
  //               //   if (err) console.error(err);
  //               // });
  //             });
  //           });
  //         });
  //       }
  //     }
  //   });
  // }


  /**
   * Handles the business logic for uploading a file (given as a Buffer)
   * @param {Buffer} rawBytes
   * @param {string} fileType
   * @param {Game} game (Game.js)
   * @param {Machine} machine
   * @param {Game~uploadScoresCallback} callback(err, addedScores)
   */
  async uploadScores(rawBytes, fileType, game, machine) {

    let callback = (s, e) => {};
    if (typeof game !== 'object') {
      callback('game must be an object', null);
      return;
    }

    if (typeof machine !== 'object') {
      callback('machine must be an object', null);
      return;
    }

    //TODO: check that the user has access to this machine??



    // Game.updatePlayedCount(game, machine, function (err, playCount) {
    //   //don't care about the response at the moment.
    // });

    //need to check if the game exists in the mapping file,
    //and if not then we add it to the database but flag it as missing
    let decodedScores = this.scoreDecoder.decode(gameMaps, rawBytes, game.name, fileType);

    //if we have some score data, process it
    if (decodedScores !== null) {

      //TODO
      //if we have decoded the score we still want to save the latest raw mapping in case the decoding is wrong
      // RawScore.destroy({game_id: game.id}).exec(function(){ //just remove them all and add a new one
      //   Game.addRawScores(game, rawBytes.toString('hex'), fileType, function (err, newRawScore) {
      //     //callback(err, newRawScore);
      //   });
      // });

      let newScores = decodedScores[game.name];

      let createdScores = await this.addScores(game, machine, newScores, null);

      if (createdScores.length > 0) {
        //we created some scores so notify users

        //TODO: also want to send an email
        //workout if the top created score beat any other user's scores
        // Game.sendBeatenScoreEmails(game, createdScores, function(err){
        //   console.log(err);
        // });
      }


      return createdScores;

    } else {

      //Its possible that the reason we couldn't decode the file is because its the wrong type. ie .nv instead of .hi
      //so in this case we don't want to add the raw scores
      if (this.scoreDecoder.getGameMappingStructure(gameMaps, game.name, 'hi')
        || this.scoreDecoder.getGameMappingStructure(gameMaps, game.name, 'nv')) {
        callback('I have a mapping for this game but not for this file type.', null);
        //TODO: better error handling
        return;
      }

      // TODO
      // this.addRawScores(game, rawBytes.toString('hex'), fileType, function (err, newRawScore) {
      //   callback(err, newRawScore);
      // });
    }
  }

  /**
   *
   * @param game
   * @param machine
   * @param newScores - decoded scores
   * @param callback (error, [Score])
   */
  async addScores (game: Game, machine: Machine, newScores, callback) {

    machine = await this.machine.findOne(machine.id, {relations: ['group']});
    let groupId = machine.group.id ;
    let gameId = game.id;
    let machineIds = [machine.id]; //todo better finding of all scores for the group

    if(!_.isFunction(callback)){
      callback = (a, b) => {};
    }


    //work out what scores do not exist in the scores that we have been given compared to whats in the database

    //should be able to use Score.findOrCreateEach
    let existingScores = await this.score.createQueryBuilder('score')
      .where({game: gameId})
      .andWhere('score.machine_id IN (:...machines)', {machines: machineIds})
      .getMany();

    //remove any exiting or invalid scores
    let filteredScores = this.filterScores(newScores, existingScores);

    //stick the game id on the scores we want to save
    filteredScores.forEach(function (score) {
      score.game = {id: gameId};
      score.machine = {id: machine.id};
    });

    //now insert the new scores
    let createdScores = await this.score.save(filteredScores);

    //due to the way we are doing the ids, need to update the alias ids against the scores (easier to just do for all scores for this game)
    if(createdScores.length) {

      //TODO: pull this out so it can be reused
      await this.updateScoreAliases(groupId, game, () => {});

      //we need to re-fetch the created scores so we have the updated alias data
      let scoreIds = [];
      createdScores.forEach(function(score){
        scoreIds.push(score.id);
      });

      //created some scores so update the score rank
      //await this.score.updateRanks(gameId); //TODO

      let updateCreatedScores = await this.score.findByIds(scoreIds /*{order: { rank: 'ASC'}}*/);

      callback(null, updateCreatedScores);
      return updateCreatedScores;
    } else {
      //callback(err, createdScores);
      callback(null, createdScores);
      return createdScores;
    }
  }

//   async addRawScores(game, machine, rawScoreBytesSting, fileType, callback): any {
//
//     if(!_.isFunction(callback)) {
//     callback = () => {};
//   }
//
//   let newRawScore = await RawScore.create({game: game.id, machine: machine.id, file_type: fileType, bytes: rawScoreBytesSting}).fetch();
//   callback(null, newRawScore);
//   return newRawScore;
//   }
//
/**
 * This updates all the aliases against the scores (just does a blanket update off all scores for a game)
 * @param groupId
 * @param {Game} game
 * @param callback(err)
 */
  async updateScoreAliases(groupId, game, callback) {

    let query = "UPDATE score SET alias_id = a.id " +
      "FROM user_group ug, alias a " +
      "WHERE ug.user_id = a.user_group_id " +
      "AND lower(score.name) = lower(a.name) " +
      "AND ug.group_id = $1 " +
      "AND score.game_id = $2 " +
      "AND score.machine_id IN (SELECT machine_id FROM machine WHERE group_id = $1)";

    let result = await getConnection().query(query, [groupId, game.id]);

    callback(result);
    return result;

}
//
// /**
//  * This function goes through the game mappings and sets game.has_mapping to true
//  * if it exists
//  */
//   updateHasMapping(callbackFn) {
//
//   var gameMaps = require('../game_mappings/gameMaps.json');
//   var gameNamesToUpdate = [];
//
//   gameMaps.forEach(function(gameMapping){
//     gameNamesToUpdate = gameNamesToUpdate.concat(gameMapping.name);
//   });
//
//   Game.update(
//     {
//       has_mapping: false,
//       or: [
//         { name: gameNamesToUpdate },
//         { clone_of_name: gameNamesToUpdate }
//       ]
//
//     },
//     { has_mapping: true, decoded_on: new Date() }
//   ).fetch().exec(function updateResult(err, updatedGames){
//     callbackFn(err, updatedGames);
//   });
// }


  async upload(gameName, machineId, file): Promise<any> {

    //const filePath = file.fd;
    const fileName = file.originalname;
    const fileType = path.extname(fileName).substring(1);
    //var gameName = req.body.gamename;

    //invalid game so try and work it out from the file name
    if (typeof gameName != 'string' || gameName.length === 0) {
      gameName = fileName.substring(0, fileName.lastIndexOf('.'));
    }

    const game = await this.game.findOne({name: gameName});
    const machine = await this.machine.findOne(machineId);
    const rawBuffer = file.buffer;

    const createdScores = await this.uploadScores(rawBuffer, fileType, game, machine);

    const scores = await this.score.findByIds(createdScores.map(s => s.id));

    return scores;

  }

}
