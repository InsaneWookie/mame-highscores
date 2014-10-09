/**
 * Score.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    rank: 'integer',
    name: 'string',
    score: 'string',

    game: {
      model: 'Game',
      columnName: 'game_id'
    },

    alias: {
      model: 'Alias',
      columnName: 'alias_id'
    },

    toJSON: function () {
      var obj = this.toObject();
      //if(!Array.isArray(obj.game)){
      //	delete obj.game;
      //}
      //delete obj.user;
      return obj;
    }


  },

  /**
   * Update the rank posiiton for all scores for a given game
   * TODO: put this in a trigger/function in the database
   * this currently only supports scores that are numbers
   * @param gameId
   * @param cb
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

    //Game.query('SELECT pg_advisory_unlock(1234)', [], function(){
      Score.query(query, [gameId], function (err, result) {
     //   Game.query('SELECT pg_advisory_unlock(1234)', [], function() {
          cb(err, result);
      //  });
      });
   // });

  }

  //don't think this is working but do the update anyway
//  afterCreate: function(newScore, cb){
//
//    var gameId = newScore.game;
//
//    Score.updateRanks(gameId, function(err, result){
//      if(err) return cb(err);
//      cb();
//    });
//  }

};

