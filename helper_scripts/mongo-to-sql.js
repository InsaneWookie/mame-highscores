

function encode_utf8(s) {
  var j = JSON.stringify(s);
  return j.substring(1, j.length - 1);
}

var fs = require('fs');
var mongoose = require('mongoose');
var async = require('async');
var pg = require('pg');

var uristring = process.argv[2]; //process.env.MONGOHQ_URL || 'mongodb://localhost/mame-highscores';
var pgConnection = process.argv[3]; //"postgres://username:password@localhost/database";

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring);
var db = mongoose.connection;

var client = new pg.Client(pgConnection);

var insertCount = 0;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
  console.log("Connected to mongo db (" + uristring + ")"); 
  
  
  client.connect(function(err) {

    console.log("connected to pg");

    db.collection('users').find().toArray(function (eer, users){

      users.forEach(function(u){

        client.query('INSERT INTO "user" ("username", "email") VALUES ($1, $2) RETURNING id',
          [u.userName, u.email],
        function(uErr, uResult){

          if(uErr) { console.log(uErr); return; }

          console.log(uResult);

          u.aliases.forEach(function(a){
            client.query('INSERT INTO alias ("name", "user_id") VALUES ($1, $2) RETURNING id',
              [a, uResult.rows[0].id],
              function(e, r){

            });
          });
        });
      });
    });


    //non clones first
    db.collection('games').find().sort({cloneOf: 1, name: 1,}).toArray(function (eer, games){

      async.eachSeries(games, function(g, callback) {

        
        console.log("got game: " + g.name);
        //console.log(g);

        var lastPlayed = null;
        if(g.lastPlayed){
          var d = new Date(g.lastPlayed);
          lastPlayed = d.toISOString();
          //console.log(lastPlayed);
        }

        if(g.playCount == null) {
          g.playCount = 0;
        }

        insertCount++;
        console.log('*** count ***: ' + insertCount);


        client.query('INSERT INTO game (name, full_name, has_mapping, letter, play_count, last_played, clone_of, clone_of_name, "order", sort, year, "createdAt", "updatedAt") VALUES \
          ($1, $2, $3, $4, $5, $6::timestamp with time zone, (SELECT id FROM game WHERE name = $7), $7, $8, $9, $10, $6::timestamp with time zone, $6::timestamp with time zone) RETURNING id',
         [g.name, g.fullName, g.hasMapping, g.letter, g.playCount, lastPlayed, g.cloneOf, g.order, g.sort, g.year],
         function(err, result) {
          console.log("inserted game");

          if(err) {
             console.error('error running query', err);
             callback(err);
             return;
          }
          
          var gameId = result.rows[0].id; 
          console.log(gameId);
          
          //console.log(g.scores);

          if(g.scores && g.scores.length > 0){
            g.scores.forEach(function(s){
              //created the game so now create the scores

              var createDate = new Date(s.createDate);
              createDate = createDate.toISOString();
              console.log(createDate);

              client.query('INSERT INTO score ("game_id", "name", "score", "createdAt", "updatedAt") VALUES ($1::integer, $2::text, $3::text, $4::timestamp with time zone, $4::timestamp with time zone) RETURNING id',
                [gameId, encode_utf8(s.name), encode_utf8(s.score), createDate],
                function(scoreErr, scoreResult){
                  //scoreDone();
                  console.log('inserted score');

                  if(scoreErr) {
                    console.log(g);
                    console.log(s);
                    console.error('error running query', scoreErr);
                    callback(scoreErr);
                  }

                  //console.log(scoreResult);
                  callback();

              });
            });
          } else if (g.rawScores && g.rawScores.length > 0){
              g.rawScores.forEach(function(rawScore){
              //created the game so now create the scores

              var createDate = new Date(rawScore.createDate);
              
              createDate = createDate.toISOString();

              client.query('INSERT INTO rawscore ("game_id", "bytes", "createdAt", "updatedAt") VALUES ($1::integer, $2::text, $3::timestamp with time zone, $3::timestamp with time zone) RETURNING id',
                [gameId, rawScore.bytes, createDate],
                function(rawScoreErr, rawScoreResult){
                  //scoreDone();
                  console.log('inserted raw score');

                  if(rawScoreErr) {
                    console.error('error running query', rawScoreErr);
                    callback(rawScoreErr);
                  }

                  //console.log(scoreResult);
                  callback();

              });
            });

          } else {
            callback();
          }
        });

      }, function(err){
        // if any of the file processing produced an error, err would equal that error
        if( err ) {
          // One of the iterations produced an error.
          // All processing will now stop.
          console.log('A file failed to process', err);
        } else {
          console.log('All files have been processed successfully');
        }

        //once thats done lest insert the users then link everything up
        //UPDATE score as s SET alias_id = a.id FROM alias as a WHERE a.name = s.name

        //client.end();
        //db.close();
      });
    });
  });



    
});






