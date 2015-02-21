/**
 * ScoreController
 *
 * @description :: Server-side logic for managing Scores
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


  find: function(req, res){
    console.log(req.allParams());

    var findParams = req.allParams();
    var gameId = findParams.game;

    //Score.findByUser(1, findParams, function(err, scores){
    //  if(err) { return res.serverError(err); }
    //  res.json(scores);
    //});



    var query = "SELECT *, rank() \
    OVER (PARTITION BY s.game_id, mgroup.group_id \
    ORDER BY (0 || regexp_replace(s.score, E'[^0-9]+','','g'))::bigint DESC ) as rank \
    FROM score s, \
      (SELECT DISTINCT group_id, machine_id FROM user_machine um) mgroup \
    WHERE s.machine_id = mgroup.machine_id AND s.game_id = $1 \
    ORDER BY rank ASC";
    User.query(query, [gameId], function(err, scores){
      if(err) { return res.serverError(err); }

      res.json(scores.rows);
    })


  },


  /**
   * Claim a score that has no alias with it
   * TODO: add flag to say if game does not have name entering
   * route should be POST /score/:id/claim
   * @param req
   * @param res
   */
  claim: function(req, res){
    var scoreId = req.param('id');
    var scoreName = req.param('alias');

    Score.claim(scoreId, scoreName, function(err, score){
      if(err) { return res.badRequest(err); }

      res.json(score);
    });
  }
};

