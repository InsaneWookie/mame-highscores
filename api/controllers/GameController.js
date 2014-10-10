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

  /**
   * Gets the data for the game decode page
   * TODO: convert this to client side
   * @param req
   * @param res
   */
  decode_data: function(req, res) {

    var responseData = {};

    var gameId = req.param('id');

    Game.findById(gameId).populate('rawscores').exec(function(err, game){

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

      Game.findOneByName(gameName).exec(function(err, game){
        if(err){
          res.notFound("Game does not exist");
        } else {

          fs.readFile(filePath, {}, function(err, rawBuffer){

            if(err) return res.serverError("Problem reading file");

            Game.uploadScores(rawBuffer, fileType, game, function(err, savedScores){
              if(err) { res.json(err); } else { res.ok(savedScores, '/#/games/' + game.id); }
            });
          });
        }
      });
    });
  }




};

