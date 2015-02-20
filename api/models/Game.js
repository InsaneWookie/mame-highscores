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
    clone_of_name: 'string',
    last_played: 'datetime',
    letter: 'string',
    order: 'string',
    sort: 'string',
    year: 'string',
    decoded_on: 'datetime',

    scores: {
      collection: 'Score',
      via: 'game'
    },

    rawscores: {
      collection: 'RawScore',
      via: 'game'
    },

    clean_name_func: function(){
      var indexLastBracket = (this.full_name) ? this.full_name.lastIndexOf('(') : -1;
      return (indexLastBracket === -1) ? this.full_name : this.full_name.substring(0, indexLastBracket).trim() ;
    },

    toJSON: function(){
      var obj = this.toObject();
      obj.clean_name = this.clean_name_func();
      return obj;
    }

  },

  /**
   * Removes already existing scores, duplicate new scores and other invalid scores (like empty score)
   * @param newScores
   * @param currentScores
   */
  filterScores: function (newScores, currentScores) {

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
  },

  /**
   * Gets scores beaten for use in sending email
   * IMPORTANT: this assumes both addedScores and afterAddedScores are sorted high to low
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
   *      { Score }, // array of score objects
   *      ...
   *    ]
   *  }
   *
   *  TODO: need to redo this for new data model
   *  Beaten scores need to take into account the group
   *  Only send beaten emails to users that are in the same group
   */
  getBeatenScores: function (addedScores, afterAddedScores) {
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
   * TODO: this will be broken because getBeatenScores is broken
   * @param game
   * @param createdScores
   * @param callback
   */
  sendBeatenScoreEmails: function(game, createdScores, callback){

    Score.find({game_id: game.id}).populate('alias').exec(function (err, allScores) {

      if(err) return callback(err);

      if(allScores.length) {
        allScores.sort(function (a, b) {
          return parseInt(b.score) - parseInt(a.score);
        });

        //set the score TODO: check if they are already set?
        game.scores = allScores;

        var beatenScores = Game.getBeatenScores(createdScores, allScores);

        if(beatenScores.beatenBy != {} && beatenScores.beaten.length != 0){
          User.findOneById(beatenScores.beatenBy.alias.user).exec(function(err, beatenByUser){

            if(err) return callback(err);

            var beatenBy = beatenScores.beatenBy;
            beatenBy.user = beatenByUser;

            //go though all the beaten scores and send them emails
            beatenScores.beaten.forEach(function(beatenScore){
              User.findOneById(beatenScore.alias.user).exec(function(err, beatenUser){

                var beaten = beatenScore;
                beaten.user = beatenUser;
                EmailService.sendBeatenEmail(game, beatenBy, beaten, { to: beaten.user.email }, function (err, emailResponse) {
                  if (err) console.error(err);
                });
              });
            });
          });
        }
      }
    });
  },


  /**
   * Handles the business logic for uploading a file (given as a Buffer)
   * @param {Buffer} rawBytes
   * @param {string} fileType
   * @param {Game} game (Game.js)
   * @param {Machine} machine
 * @param {Game~uploadScoresCallback} callback(err, addedScores)
   */
  uploadScores: function (rawBytes, fileType, game, machine, callback) {


    if (typeof game !== 'object') {
      callback("game must be an object", null);
      return;
    }

    if (typeof machine !== 'object') {
      callback("machine must be an object", null);
      return;
    }

    //TODO: check that the user has access to this machine??

    var gameMaps = require('../game_mappings/gameMaps.json');

    Game.updatePlayedCount(game, function (err, playCount) {
      //don't care about the response at the moment.
    });

    //need to check if the game exists in the mapping file,
    //and if not then we add it to the database but flag it as missing
    var decodedScores = ScoreDecoder.decode(gameMaps, rawBytes, game.name, fileType);

    //if we have some score data, process it
    if (decodedScores !== null) {


      //if we have decoded the score we still want to save the latest raw mapping in case the decoding is wrong
      RawScore.destroy({game_id: game.id}).exec(function(){ //just remove them all and add a new one
        Game.addRawScores(game, rawBytes.toString('hex'), fileType, function (err, newRawScore) {
          //callback(err, newRawScore);
        });
      });




      var newScores = decodedScores[game.name];


      Game.addScores(game, machine, newScores, function (err, createdScores) {

        if (err) {
          console.log(err);
          return callback(err, null);
        }

        if (createdScores.length > 0) {
          //we created some scores so notify users

          //notify socket subscribers
          Score.findOneById(createdScores[0].id).populate('game').populate('machine').exec(function (err, notifyScore) {
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
          //TODO: fix this (broken by new data model)
          //Game.sendBeatenScoreEmails(game, createdScores, function (err) {
          //  console.log(err);
          //});
        }

        //fire callback, this will fire before the notifications have gone out (but that's ok as email may take a while)
        callback(err, createdScores);
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

  /**
   *
   * @param game
   * @param machine
   * @param newScores - decoded scores
   * @param callback (error, [Score])
   */
  addScores: function (game, machine, newScores, callback) {

    var gameId = game.id;

    var filteredScores = [];
    //work out what scores do not exist in the scores that we have been given compared to whats in the database
    //should be able to use Score.findOrCreateEach
    Score.find({game_id: gameId, machine_id: machine.id}).exec(function (err, existingScores) {

      //remove any exiting or invalid scores
      filteredScores = Game.filterScores(newScores, existingScores);

      //console.log(machine);
      //stick the game id on the scores we want to save
      filteredScores.forEach(function (score) {
        score.game_id = gameId;
       // console.log(machine);
        score.machine_id = machine.id;
        score.alias = (score.name) ? score.name.toUpperCase() : null; //TODO: probably should make this a trigger or atleast a before create action
      });

      //console.log(filteredScores);
      //now insert the new scores
      Score.createEach(filteredScores).exec(function (err, createdScores) {
        if (err) {
          console.log(err);
          callback(err);
        } else {
          //due to the way we are doing the ids, need to update the alias ids against the scores (easier to just do for all scores for this game)
          if(createdScores.length) {

              //TODO: shouldnt need to update the aliases anymore
              //TODO: need to sort out how to update the rank with groups
              //Game.updateScoreAliases(game, function (err) {
              //  if(err) { return callback(err, null); }
              //
              //  //we need to refetch the created scores so we have the updated alias data
              //  var scoreIds = [];
              //  createdScores.forEach(function(score){
              //    scoreIds.push(score.id);
              //  });
              //
              //  //created some scores so update the score rank
              //  Score.updateRanks(gameId, function(err){
              //    if(err) { return callback(err, null); }
              //
              //    Score.find().where({id: scoreIds}).sort('rank ASC').exec(function(err, updateCreatedScores){
              //      callback(err, updateCreatedScores);
              //    });
              //  });
              //});
            callback(err, createdScores);
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

    //var query = "UPDATE score SET alias_id = a.id FROM alias a " +
    //  "WHERE lower(score.name) = lower(a.name) AND score.game_id = $1";
    //
    //Score.query(query, [game.id], function (err, result) {
    //  callback(err);
    //});
  },

  /**
   * This function goes through the game mappings and sets game.has_mapping to true
   * if it exists
   */
  updateHasMapping: function (callbackFn){

    var gameMaps = require('../game_mappings/gameMaps.json');
    var gameNamesToUpdate = [];

    gameMaps.forEach(function(gameMapping){
      gameNamesToUpdate = gameNamesToUpdate.concat(gameMapping.name);
    });

    Game.update(
      {
        has_mapping: false,
        or: [
          { name: gameNamesToUpdate },
          { clone_of_name: gameNamesToUpdate }
        ]

      },
      { has_mapping: true, decoded_on: new Date() }
    )
    .exec(function updateResult(err, updatedGames){
        callbackFn(err, updatedGames);
    });
  }


};
