/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  scores: function(req, res) {
    // Game.find()
    //  .populate('scores')
    //  .exec(function(err, games) {
   //     if(err) {console.log(err);}
   //     else { res.send(games); }
  //    });
  },

  top_players: function(req, res){
    
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

    Game.query(query, function(err, results){
      if(err) { return console.log(err); }

      res.json(results.rows);
    })
  },

  upload: function(req, res) {

    console.log("*** decoding ***");
    console.log(req.param);
    console.log(req.body);

    var gameMaps = require('../game_mappings/gameMaps.json');
    //var decoder = require('../modules/score_decoder');

    req.file('game').upload(function (err, files) {

      if (err) return res.serverError(err);

      var file = files[0]; //hopefully only one file


      var filePath = './.tmp/uploads/' + file.filename;
      var gameName = req.body.gamename;

      //invalid game so try and work it out from the file name
      if(typeof gameName != 'string' || gameName.length === 0){
        var fileName = file.filename;
        gameName = fileName.substring(0, fileName.lastIndexOf('.'));
      }

      //need to check if the game exists in the mapping file, 
      //and if not then we add it to the database but flag it as missing
      var decodedScores = ScoreDecoder.decodeFromFile(gameMaps, filePath, gameName);


      //var scoreData = { hasMapping: false, scores: [] };

      //if we have some score data, process it
      if(decodedScores !== null){

        var newScores = decodedScores[gameName];
        
        Game.findOneByName(gameName).exec(function(err, game){

          if(err) {
            console.log(err);
            return res.serverError(err);
          }

          if(!game){
            return res.notFound("Game not found");
          } else {
            game.addScores(newScores, function(createdScores){

              if(createdScores.length > 0){
                console.log("**** created scores***");
                Score.findOneById(createdScores[0].id).populate('game').exec(function(err, notifyScore){
                  Score.publishCreate(notifyScore);
                });
              }

              res.ok(createdScores, '/#/games/' + game.id);
            });
          } 
        });
      } else {

        //   //Its possible that the reson we couldn't decode the file is because its the wrong type. ie .nv instead of .hi
        //   //so in this case we don't want to add the raw scores
        //   if(decoder.getGameMappingStructure(gameMaps, gameName, 'hi') || decoder.getGameMappingStructure(gameMaps, gameName, 'nv')){
        //     res.send("I have a mapping for this game but not for this file type.");
        //     //TODO: better error handling
        //     return;
        //   } 

        //   //no decode mapping was found so just add the raw bytes to the game mapping so we can decode them later

        //   //may aswell record the play count and the last played even if there isnt a mapping
        //   var fileBytes = fs.readFileSync(filePath);
        //   var fileType = path.extname(filePath).substring(1);
        //   scoreData = {
        //     hasMapping: false,
        //     $inc: { playCount : 1 },
        //     lastPlayed: new Date(), 
        //     $push: {  rawScores: { 
        //             fileType: fileType,
        //             bytes: fileBytes.toString('hex') } } 
        //   };
          
        //   Game.findOneAndUpdate({name: gameName}, scoreData, { upsert: true }, function (err, saved) {
        //     if(err) { console.log(err); }

        //     if(req.accepts('json, html') == 'json'){
        //       res.json(saved);    
        //     } else {
        //       res.redirect('/games/' + gameName);
        //     }
        //   });
        // }

      }
    });
  }


    
};

