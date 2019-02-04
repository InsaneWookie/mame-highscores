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
    sails.sendNativeQuery('SELECT id, name, full_name FROM game', function(err, results){
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

  /**
   * Gets the data for the game decode page
   * TODO: convert this to client side
   * @param req
   * @param res
   */
  decode_data: function(req, res) {

    var responseData = {};

    var gameId = req.param('id');

    Game.findOne({id: gameId}).populate('rawscores').exec(function(err, game){

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

      //invalid game so try and work it out from the file name
      if (typeof gameName != 'string' || gameName.length === 0) {
        gameName = fileName.substring(0, fileName.lastIndexOf('.'));
      }

      Game.findOne({name: gameName}).exec(function(err, game){
        if(err){
          res.notFound("Game does not exist");
        } else {

          fs.readFile(filePath, {}, function(err, rawBuffer){

            if(err) return res.serverError("Problem reading file");

            Game.uploadScores(rawBuffer, fileType, game, function(err, savedScores){
              if(err) {
                res.json(err);
              } else {
                res.json(savedScores);
              }
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

      Game.findOne({id: gameId}).exec(function (err, game) {

        if(err) { return res.serverError(err); }

        try {
          //need to wrap it up in an array as the decoder expects an array of mappings to search through
          var testMapping = [req.body.gameMapping];
          var rawScore = Buffer.from(req.body.rawBytes, 'hex');

          decodedScores = ScoreDecoder.decode(testMapping, rawScore, game.name);
        } catch (ex) {
          console.log(ex.message);
          decodedScores = { error: ex.message };
        }

        res.json(decodedScores);
      });

    } else {
      Game.findOne({id: gameId}).exec(function (err, game) {

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

