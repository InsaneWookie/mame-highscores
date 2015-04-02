/**
 * ScoreController
 *
 * @description :: Server-side logic for managing Scores
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


  find: function(req, res){

    var loggedInUser = req.user;

    var findParams = req.allParams();
    var gameId = findParams.game;
    var userId = loggedInUser.id;

    var query = "SELECT s.*, um.user_id user_id, rank() \
    OVER (PARTITION BY s.game_id \
    ORDER BY (0 || regexp_replace(s.score, E'[^0-9]+','','g'))::bigint DESC ) as rank \
    FROM \
    ( SELECT DISTINCT  um.machine_id, ug.user_id \
    FROM user_machine um, user_group ug \
    WHERE um.user_id = ug.user_id \
    order by um.machine_id, ug.user_id) machines_for_user, score s \
     left outer join user_machine um ON um.machine_id = s.machine_id AND um.alias = s.alias \
    WHERE machines_for_user.machine_id = s.machine_id \
    AND machines_for_user.user_id = $1 " +
      ((gameId) ? " AND s.game_id = $2 " : "") +
    "ORDER BY rank";

    var params = [userId];

    if(gameId){
      params.push(gameId);
    }

    User.query(query, params, function(err, rankScores){
      if(err) { return res.serverError(err); }

      findParams.id = _.pluck(rankScores.rows, 'id');

      Score.find(findParams).populate('game').exec(function(err, scores){
        if(err) { return res.serverError(err); }

        scores.forEach(function(score){
          rankScores.rows.some(function(s){
            if(s.id === score.id){
              score.rank = parseInt(s.rank);
              score.user = parseInt(s.user_id);
              return true;
            }

            return false;
          });

        });



        res.json(_.sortBy(scores, 'rank'));
      });

      //res.json(scores.rows);
    });
  },


  recent: function(req, res){
    var loggedInUser = req.user;

    var findParams = req.allParams();
    var gameId = findParams.game;
    var userId = loggedInUser.id;

    var query = "SELECT *, rank() \
    OVER (PARTITION BY s.game_id \
    ORDER BY (0 || regexp_replace(s.score, E'[^0-9]+','','g'))::bigint DESC ) as rank \
    FROM \
    ( SELECT DISTINCT  um.machine_id, ug.user_id \
    FROM user_machine um, user_group ug \
    WHERE um.user_id = ug.user_id \
    order by um.machine_id, ug.user_id) machines_for_user, score s \
    WHERE machines_for_user.machine_id = s.machine_id \
    AND machines_for_user.user_id = $1 " +
      ((gameId) ? " AND s.game_id = $2 " : "") +
      "ORDER BY s.\"updatedAt\" DESC, rank " +
      "LIMIT 10";

    var params = [userId];

    if(gameId){
      params.push(gameId);
    }

    User.query(query, params, function(err, rankScores){
      if(err) { return res.serverError(err); }

      findParams.id = _.pluck(rankScores.rows, 'id');

      Score.find(findParams).populate('game').exec(function(err, scores){
        if(err) { return res.serverError(err); }

        scores.forEach(function(score){
          rankScores.rows.some(function(s){
            if(s.id === score.id){
              score.rank = parseInt(s.rank);
              return true;
            }

            return false;
          });

        });



        res.json(scores);
      });

      //res.json(scores.rows);
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

