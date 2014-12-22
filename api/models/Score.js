/**
 * Score.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    rank: 'integer',
    name: 'string', //TODO: make name default to empty sting in the database
    score: 'string',
    alias: 'string', //this is upercased name used to foreign key on user machine

    game: {
      model: 'Game',
      columnName: 'game_id'
    },

    machine: {
      model: 'Machine',
      columnName: 'machine_id'
    }

    //alias: {
    //  model: 'Alias',
    //  columnName: 'alias_id'
    //}

//    toJSON: function () {
//      var obj = this.toObject();
//      //if(!Array.isArray(obj.game)){
//      //	delete obj.game;
//      //}
//      //delete obj.user;
//      return obj;
//    }


  },

  /**
   * Update the rank position for all scores for a given game
   * TODO: put this in a trigger/function in the database
   * this currently only supports scores that are numbers
   * @param gameId
   * @param cb
   * //TODO: this needs to take into account the groups the user is in
   */
  updateRanks: function(gameId, cb){
    var query =
      "UPDATE score s SET rank = r.rank \
      FROM (SELECT id, rank() \
        OVER (PARTITION BY game_id \
        ORDER BY (0 || regexp_replace(score, E'[^0-9]+','','g'))::bigint DESC ) as rank \
        FROM \
        score \
        WHERE game_id = $1) r \
      WHERE s.id = r.id";

      Score.query(query, [gameId], function (err, result) {
          cb(err, result);
      });

  },


//  afterCreate: function(newScore, cb){
//
//    var gameId = newScore.game;
//
//    Score.updateRanks(gameId, function(err, result){
//      if(err) return cb(err);
//      cb();
//    });
//  }

  /**
   * Allows a user to claim a score
   * All we are really doing is setting the alias on a score
   * Returns error if the alias is not empty
   * @param scoreId
   * @param aliasName
   * @param callBackFn (err, Score)
   */
  claim: function(scoreId, aliasName, callBackFn){

    callBackFn("TODO");
    //if(aliasName === null || aliasName === undefined){
    //  return callBackFn("Alias can not be null", null);
    //}
    //
    ////TODO: should really do a case insensitive look up of the users alias
    //aliasName = aliasName.trim().toUpperCase();
    //
    //if(aliasName === ''){
    //  return callBackFn("Alias can not be empty", null);
    //}
    //
    //Score.findOneById(scoreId).exec(findScoreFn);
    //
    //function findScoreFn(err, score){
    //  if(err) { return callBackFn(err, null); }
    //
    //  if(score.name !== null && score.name !== ''){
    //    return callBackFn("Score name is not empty", null);
    //  } else {
    //    //empty name so we can update it
    //    score.name = aliasName;
    //    score.save(saveScoreFn);
    //  }
    //}
    //
    //function saveScoreFn(err, updatedScore){
    //  if(err) { return callBackFn(err, null); }
    //
    //  Game.updateScoreAliases(updatedScore.game, updateAliasesResultFn);
    //}
    //
    //function updateAliasesResultFn(err) {
    //  if(err) { return callBackFn(err, null); }
    //
    //  //need to get the updated data
    //  //populate the alias object as its need for the score table
    //  Score.findOneById(scoreId).populate('alias').exec(callBackFn);
    //}

  }

};

