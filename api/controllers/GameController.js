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

    User.points(null, null, function(err, topPlayers){
      if (err) return res.serverError(err);

      res.json(topPlayers);
    });
  },

  play_count: function(req, res){
    var userId = 1;

    var query = "SELECT g.id, g.name, g.full_name, play_count.play_count, play_count.last_played FROM game g, ( \
    SELECT game_id, count(1) play_count, max(date_time) last_played FROM gameplayed gp \
    WHERE machine_id IN \
    (SELECT DISTINCT machine_id FROM user_group ug, user_machine um WHERE ug.group_id = um.group_id AND ug.user_id = $1) \
    GROUP BY game_id) play_count \
    WHERE g.id = play_count.game_id \
    AND g.has_mapping = true \
    ORDER BY play_count.last_played DESC \
    LIMIT 10";

    Game.query(query, [userId], function(err, result){
      if(err) { return res.serverError(err); }
      res.json(result.rows);
    });
  },


  upload: function (req, res) {

    req.file('game').upload(function (err, files) {

      if (err) return res.serverError(err);

      var file = files[0]; //hopefully only one file

      //TODO: we need to remove the file (can we just read it from memory?)
      var filePath = file.fd;
      var fileName = file.filename;
      var fileType = path.extname(fileName).substring(1);
      var gameName = req.body.gamename;
      var apiKey = req.body.apikey;

      //invalid game so try and work it out from the file name
      if (typeof gameName != 'string' || gameName.length === 0) {
        gameName = fileName.substring(0, fileName.lastIndexOf('.'));
      }


      //TODO: need to find the machine by api key but for now just get it by id
      async.parallel({
        machine: function(next){
          Machine.findOneById(1).exec(function(err, machine){
            next(err, machine);
          });
        },
        game: function(next){
          Game.findOneByName(gameName).exec(function(err, game){
            next(err, game);
          });
        }
      },
      function(error, results){
        if(error){
          res.notFound("Game or machine does not exist");
        } else {
          var game = results.game;
          var machine = results.machine;

          fs.readFile(filePath, {}, function(err, rawBuffer){

            if(err) return res.serverError("Problem reading file");

            Game.uploadScores(rawBuffer, fileType, game, machine, function(err, savedScores){
              if(err) { res.json(err); } else { res.ok(savedScores, '/#/games/' + game.id); }
            });
          });
        }
      });

    });
  },

  /**
   *
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   */
  mapping: function (req, res) {
    var gameId = req.param('id');
    var fileType = req.param('file_type');

    //yeah, yeah this shouldn't be a post for this route
    if (req.method === 'POST') {

      var decodedScores = {};

      Game.findOneById(gameId).exec(function (err, game) {

        if(err) { return res.serverError(err); }

        try {
          //need to wrap it up in an array as the decoder expects an array of mappings to search through
          var testMapping = [req.body.gameMapping];
          var rawScore = new Buffer(req.body.rawBytes, 'hex');

          decodedScores = ScoreDecoder.decode(testMapping, rawScore, game.name);
        } catch (ex) {
          console.log(ex.message);
          decodedScores = { error: ex.message };
        }

        res.json(decodedScores);
      });

    } else {
      Game.findOneById(gameId).exec(function (err, game) {

        if(err) { return res.serverError(err); }

        if(!game.has_mapping){
          //if the game doesn't have a mapping then just return and example mapping
          var exampleDecodeStructure = {
            "name": [
              game.name
            ],
            "structure": {
              "blocks": 5,
              "fields": [
                {"name": "score", "bytes": 4, "format": "reverseDecimal", "settings": {"append": "0"}},
                {"name": "name", "bytes": 3, "format": "ascii"}
              ]
            }
          };

          res.json(exampleDecodeStructure);

        } else {
          //this game should have a mapping so try and find it based on the file type provided

          var mappings = require('../game_mappings/gameMaps.json');
          var decodeStructure = ScoreDecoder.getGameMapping(mappings, game.name, fileType);

          //if we couldn't find a mapping then its probably because of the wrong filetype so just return null

          res.json(decodeStructure);
        }

      });
    }


  },

  /**
   * TODO: convert this into a Grunt task
   * @param req
   * @param res
   */
  update_has_mapping: function(req, res) {

    Game.updateHasMapping(function(err, updatedGames){
      if(err) { return res.serverError(err); }

      res.json(updatedGames);
    });
  }
};

