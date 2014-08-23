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

    var gameMaps = require('../game_mappings/gameMaps.json');
    //var decoder = require('../modules/score_decoder');

    req.file('game').upload(function (err, files) {

      if (err) return res.serverError(err);

      console.log(files);

      var file = files[0]; //hopefully only one file

      //TODO: we need to remove the file (can we just read it from memory?)
      var filePath = file.fd;
      var fileName = file.filename;
      var gameName = req.body.gamename;

      //invalid game so try and work it out from the file name
      if (typeof gameName != 'string' || gameName.length === 0) {
        gameName = fileName.substring(0, fileName.lastIndexOf('.'));
      }

      //need to check if the game exists in the mapping file, 
      //and if not then we add it to the database but flag it as missing
      var decodedScores = ScoreDecoder.decodeFromFile(gameMaps, filePath, gameName);

      //if we have some score data, process it
      if (decodedScores !== null) {

        var newScores = decodedScores[gameName];

        Game.findOneByName(gameName).exec(function (err, game) {
          if (err) {
            console.log(err);
            return res.serverError(err);
          }

          if (!game) {
            return res.notFound("Game not found");
          } else {

            //add a played record
            GamePlayed.create({game_id: game.id}).exec(function(err, newGamePLayed){});
            //dont technically need to do this as it can be inferred from the gameplayed table
            Game.query('UPDATE game SET play_count = play_count + 1, last_played = NOW() WHERE id = $1', [game.id], function (err, result) {});

            game.addScores(newScores, function (createdScores) {

              //not sure if this should be here or in the model
              if (createdScores.length > 0) {
                console.log("**** created scores***");
                Score.findOneById(createdScores[0].id).populate('game').exec(function (err, notifyScore) {
                  Score.publishCreate(notifyScore);
                });
              }

              res.ok(createdScores, '/#/games/' + game.id);
            });
          }
        });
      } else {
        //Its possible that the reson we couldn't decode the file is because its the wrong type. ie .nv instead of .hi
        //so in this case we don't want to add the raw scores
        if (ScoreDecoder.getGameMappingStructure(gameMaps, gameName, 'hi') || ScoreDecoder.getGameMappingStructure(gameMaps, gameName, 'nv')) {
          res.notFound("I have a mapping for this game but not for this file type.");
          //TODO: better error handling
          return;
        }

        //no decode mapping was found so just add the raw bytes to the game mapping so we can decode them later
        var fileBytes = fs.readFileSync(filePath);
        var fileType = path.extname(fileName).substring(1);

        Game.findOneByName(gameName).exec(function (err, game) {
          if (!game) {
            //no game we want to create a empty game and store the raw score against it
            Game.create({name: gameName}).exec(function (err, newGame) {
              GamePlayed.create({game_id: newGame.id}).exec(function(err, newGamePLayed){});
              //dont technically need to do this as it can be inferred from the gameplayed table
              Game.query('UPDATE game SET play_count = play_count + 1, last_played = NOW() WHERE id = $1', [newGame.id], function (err, result) {});

              game.addRawScores(fileBytes.toString('hex'), fileType, function(err, newRawScore){
                res.ok('/#/games/' + newGame.id);
              });
            });
          } else {
            GamePlayed.create({game_id: game.id}).exec(function(err, newGamePLayed){});
            //dont technically need to do this as it can be inferred from the gameplayed table
            Game.query('UPDATE game SET play_count = play_count + 1, last_played = NOW() WHERE id = $1', [game.id], function (err, result) {});

            game.addRawScores(fileBytes.toString('hex'), fileType, function(err, newRawScore){
              res.ok('/#/games/' + game.id);
            });
          }
        });
      }
    });
  }



};

