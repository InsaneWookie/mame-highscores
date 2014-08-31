/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs');
var path = require('path');

module.exports = {

  scores: function (req, res) {
    // Game.find()
    //  .populate('scores')
    //  .exec(function(err, games) {
    //     if(err) {console.log(err);}
    //     else { res.send(games); }
    //    });
  },

  search_list: function(req, res){
    Game.query('SELECT id, name, full_name FROM game', function(err, results){
      res.json(results.rows);
    });
  },

  game_list: function(req, res){
    //TODO: use this it replace the game list as its quite slow
    //var queryString = 'SELECT g.id, g.name, g.full_name, a.alias, s.score'
    //Game.query
  },

  top_players: function (req, res) {

    var query =
      "WITH scores AS ( \
      SELECT g.name, g.full_name, u.id, u.username, s.name, s.score, rank() \
      OVER (PARTITION BY g.name  ORDER BY (0 || regexp_replace(s.score, E'\\\\D','','g'))::bigint DESC ) as r \
      FROM \
      game g \
      INNER JOIN score s ON s.game_id = g.id \
      LEFT OUTER JOIN alias a ON s.alias_id = a.id \
      LEFT OUTER JOIN \"user\" u ON a.user_id = u.id) \
      SELECT id, username, sum(points) total_score FROM ( \
      SELECT *, \
      CASE  \
      WHEN r = 1 THEN 8 \
      WHEN r = 2 THEN 5 \
      WHEN r = 3 THEN 3 \
      WHEN r = 4 THEN 2 \
      WHEN r = 5 THEN 1 \
      ELSE 0 \
      END as points \
      FROM scores WHERE id IS NOT NULL AND r <= 5) sub \
      GROUP BY id, username \
      ORDER BY sum(points) DESC \
      LIMIT 5";

    Game.query(query, function (err, results) {
      if (err) {
        return console.log(err);
      }

      res.json(results.rows);
    })
  },


  upload: function (req, res) {

    console.log("*** decoding ***");
    console.log(req.param);
    console.log(req.body);


    //var decoder = require('../modules/score_decoder');

    req.file('game').upload(function (err, files) {

      if (err) return res.serverError(err);

      console.log(files);

      var file = files[0]; //hopefully only one file

      //TODO: we need to remove the file (can we just read it from memory?)
      var filePath = file.fd;
      var fileName = file.filename;
      var fileType = path.extname(fileName).substring(1);
      var gameName = req.body.gamename;

      //invalid game so try and work it out from the file name
      if (typeof gameName != 'string' || gameName.length === 0) {
        gameName = fileName.substring(0, fileName.lastIndexOf('.'));
      }

      Game.findOneByName(gameName).exec(function(err, game){
        if(err){
          res.notFound("Game does not exist");
        } else {

          fs.readFile(filePath, {}, function(err, rawBuffer){

            if(err) return res.serverError("Problem reading file");

            Game.uploadScores(rawBuffer, fileType, gameName, function(err, savedScores){
              if(err) { res.json(err); } else { res.ok(savedScores, '/#/games/' + game.id); }
            });
          });
        }
      });
    });
  }



};

