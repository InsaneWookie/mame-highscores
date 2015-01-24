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

    Score.findByUser(1, findParams, function(err, scores){
      if(err) { return res.serverError(err); }
      res.json(scores);
    });

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

