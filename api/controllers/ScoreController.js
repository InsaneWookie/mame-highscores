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

    var query = "SELECT *, rank() \
    OVER (PARTITION BY s.game_id \
    ORDER BY (0 || regexp_replace(s.score, E'[^0-9]+','','g'))::bigint DESC ) as rank \
    FROM \
    ( SELECT DISTINCT  um.machine_id, ug.user_id \
    FROM user_machine um, user_group ug \
    WHERE um.user_id = ug.user_id \
    order by um.machine_id, ug.user_id) machines_for_user, score s \
    WHERE machines_for_user.machine_id = s.machine_id \
    AND machines_for_user.user_id = $1 \
    AND s.game_id = $2 \
    ORDER BY rank";
    User.query(query, [1, gameId], function(err, scores){
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

