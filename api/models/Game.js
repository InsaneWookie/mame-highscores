/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

/**
 * @class Game
 */
module.exports = {

  attributes: {
    name: 'STRING',
    full_name: 'STRING',
    has_mapping: 'boolean',
    play_count: 'integer',
    clone_of: 'integer',
    last_played: 'datetime',
    letter: 'string',
    order: 'string',
    sort: 'string',
    year: 'string',

    scores: {
      collection: 'Score',
      via: 'game'
    }
  },

  /**
   * Removes already existing scores and other invalid scores (like empty score)
   * @param newScores
   * @param currentScores
   */
  filterScores: function (newScores, currentScores) {
    //go through the scores and see if it exists in the ones being uploaded and if so remove it from the list
    return newScores.filter(function (newScore) {
      //if it doesn't exist then we want to add it to the filtered scores list
      var doesntExist = !currentScores.some(function (currentScore) {
        return (currentScore.name === newScore.name) && (currentScore.score === newScore.score);
      });

      //only save score if it does not exists and there is actually a score
      return doesntExist && newScore.score !== '';
    });
  },

  /**
   * Gets scores beaten for use in sending email
   * IMPORTANT: this assumes bother addedScores and afterAddedScores are sorted high to low
   * TODO: currently this only handles single alias, if a user sets a score on the same game with
   * a different alias it will think they have beaten them self
   * @param {array} addedScores
   * @param {array} afterAddedScores
   * @return {object}
   *  example
   *  [
   *   { beaten: { Score }, beatenBy: { Score },
   *   { beaten: { Score }, beatenBy: { Score },
   *   ...
   *  ]
   */
  getBeatenScores: function (addedScores, afterAddedScores) {

    var beatenList = []; //list of beaten/beatenBy objects to return;
    var topNewScore = addedScores[0];
    var foundCreatedScore = false;

    //has the aliasId been beaten by the beatenByAliasId
    var hasBeenBeatenBy = function(aliasId, beatenByAliasId){
      return beatenList.some(function(beatenObj){
        return beatenObj.beatenBy.alias === beatenByAliasId && beatenObj.beaten.alias === aliasId;
      });
    };

    //go through each score and find the added one
    afterAddedScores.forEach(function (score) {

      if (foundCreatedScore
        && score.alias //only care about scores that have a user
        && topNewScore.alias != score.alias
        && !hasBeenBeatenBy(score.alias, topNewScore.alias) ) { //TODO: add support for multiple aliases
;
        var beaten = { beaten: score, beatenBy: topNewScore };

        beatenList.push(beaten);
      }

      if(foundCreatedScore === false && topNewScore.id === score.id){
        topNewScore = score;
        foundCreatedScore = true;
      }

    });

    return beatenList;
  },

  /**
   * TODO: the playcount on the game table should be a db trigger off GamePlayed insert or delete
   * @param game
   * @param callback
   */
  updatePlayedCount: function (game, callback){
    //add a played record
    GamePlayed.create({game_id: game.id}).exec(function (err, newGamePLayed) { });

    //dont technically need to do this as it can be inferred from the gameplayed table
    Game.query('UPDATE game SET play_count = play_count + 1, last_played = NOW() WHERE id = $1', [game.id],
      function (err, result) {
        callback(err, result);
      });
  },


  /**
   * Handles the business logic for uploading a file (given as a Buffer)
   * @param {Buffer} rawBytes
   * @param {string} fileType
   * @param {Game} game (Game.js)
   * @param {Game~uploadScoresCallback} callback(err, addedScores)
   */
  uploadScores: function (rawBytes, fileType, game, callback) {

    if(typeof game != 'object'){
      callback("game must be an object", null);
      return;
    }
    var gameMaps = require('../game_mappings/gameMaps.json');

    Game.updatePlayedCount(game, function(err, playCount){
      //don't care about the response at the moment.
    });

    //need to check if the game exists in the mapping file,
    //and if not then we add it to the database but flag it as missing
    var decodedScores = ScoreDecoder.decode(gameMaps, rawBytes, game.name);

    //if we have some score data, process it
    if (decodedScores !== null) {

      var newScores = decodedScores[game.name];

      Game.addScores(game, newScores, function (err, createdScores) {

        if (createdScores.length > 0) {
          //we created some scores so notify users

          //notify socket subscribers
          Score.findOneById(createdScores[0].id).populate('game').exec(function (err, notifyScore) {
            if (err) {
              console.log(err);
              return;
            }
            //notify everyone that we created a score
            //TODO: only notify the people that were beaten
            Score.publishCreate(notifyScore);
          });

          //also want to send an email
          //workout if the top created score beat any other user's scores
          Score.find({game_id: game.id}).populate('alias').exec(function (err, allScores) {

            if(err) return callback(err);

            if(allScores.length) {
              allScores.sort(function (a, b) {
                return parseInt(b.score) - parseInt(a.score);
              });

              var beatenScores = Game.getBeatenScores(createdScores, allScores);

              beatenScores.forEach(function(beatenScore){
                beatenScore.game = game;

                async.parallel({
                    beatenUser: function(asyncCallback){
                      User.findOneById(beatenScore.beaten.alias.user).exec(asyncCallback);
                    },
                    beatenByUser: function(asyncCallback){
                      User.findOneById(beatenScore.beatenBy.alias.user).exec(asyncCallback);
                    }
                  },
                  function(err, results){
                    // the results array will equal ['one','two'] even though
                    // the second function had a shorter timeout.
                    beatenScore.beatenBy.user = results.beatenByUser;
                    beatenScore.beaten.user = results.beatenUser;
                    EmailService.sendBeatenEmail(beatenScore, { to: results.beatenUser.email }, function (err, emailResponse) {
                      if (err) console.error(err);
                    });
                  });
              });
            }
          });
        }

        //fire callback, this will fire before the notifications have gone out (but that's ok as email may take a while)
        callback(null, createdScores);
      });

    } else {

      //Its possible that the reason we couldn't decode the file is because its the wrong type. ie .nv instead of .hi
      //so in this case we don't want to add the raw scores
      if (ScoreDecoder.getGameMappingStructure(gameMaps, game.name, 'hi') || ScoreDecoder.getGameMappingStructure(gameMaps, game.name, 'nv')) {
        callback("I have a mapping for this game but not for this file type.");
        //TODO: better error handling
        return;
      }

      Game.addRawScores(game, rawBytes.toString('hex'), fileType, function (err, newRawScore) {
        callback(err, newRawScore);
      });
    }
  },

  addScores: function (game, newScores, callback) {

    var gameId = game.id;

    var filteredScores = [];
    //work out what scores do not exist in the scores that we have been given compared to whats in the database
    //should be able to use Score.findOrCreateEach
    Score.find({game_id: gameId}).exec(function (err, existingScores) {

      //remove any exiting or invalid scores
      filteredScores = Game.filterScores(newScores, existingScores);

      //stick the game id on the scores we want to save
      filteredScores.forEach(function (score) {
        score.game_id = gameId;
      });

      //now insert the new scores
      Score.createEach(filteredScores).exec(function (err, createdScores) {
        if (err) {
          console.log(err);
          callback(err);
        } else {
          //due to the way we are doing the ids, need to update the alias ids against the scores (easier to just do for all scores for this game)
          if(createdScores.length) {
            Game.updateScoreAliases(game, function (err) {
              //we need to refetch the created scores so we have the updated alias data
              var scoreIds = [];
              createdScores.forEach(function(score){
                scoreIds.push(score.id);
              });

              Score.find().where({id: scoreIds}).exec(function(err, updateCreatedScores){
                updateCreatedScores.sort(function (a, b) {
                  return parseInt(b.score) - parseInt(a.score);
                });

                callback(err, updateCreatedScores);
              });
            });
          } else {
            callback(err, createdScores);
          }
        }
      });
    });
  },

  addRawScores: function (game, rawScoreBytesSting, fileType, callback) {

    RawScore.create({game_id: game.id, file_type: fileType, bytes: rawScoreBytesSting}).exec(function (err, newRawScore) {
      callback(err, newRawScore);
    });
  },

  /**
   * This updates all the aliases against the scores (just does a blanket update off all scores for a game)
   * @param {Game} game
   * @param callback(err)
   */
  updateScoreAliases: function (game, callback) {

    var query = "UPDATE score SET alias_id = a.id FROM alias a " +
      "WHERE lower(score.name) = lower(a.name) AND score.game_id = $1";

    Score.query(query, [game.id], function (err, result) {
      callback(err);
    });
  }

};
