//this is used to load all the game info into the database
//use convert-mamexml.js to create the game info file 
//format of a game info record should be
/*
{
    "name": "005",
    "fullName": "005",
    "year": "1981",
    "order": [
      "score",
      "name"
    ],
    "sort": {
      "by": "score",
      "order": "desc"
    }
  },

*/

var fs = require('fs');
var mongoose = require('mongoose');

var gameInfos = JSON.parse(fs.readFileSync(process.argv[2], {encoding: 'utf-8'})); //require('./game_mappings/gameInfos.json'); 
var uristring = process.argv[3]; //process.env.MONGOHQ_URL || 'mongodb://localhost/mame-highscores';
var gameMappings = require('../game_mappings/gameMaps.json'); 


//create a hash map of all the games name we have mappings for
var gameNames = {};
gameMappings.forEach(function(map){
    map.name.forEach(function(name){
        gameNames[name] = true;
    });
});

//console.log(gameNames);
//we want to insert/update any we have mappings for, but only update ones we don't have mappings for


// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Connected to mongo db (" + uristring + ")"); 
    console.log("Updating game infos (count: " + gameInfos.length + ")"); 

    //create any missing game records
    var progress = 0;
    var count = 0;
    gameInfos.forEach(function(game){

        game.hasMapping = (gameNames[game.name] !== undefined);
        //need to look up in the mappings to see if it has one 


        if(game.hasMapping){
          console.log(game);
        }

        db.collection('games').update(
          { name: game.name }, 
          { $set: game }, 
          { upsert: game.hasMapping }, //replace this line with the following to insert everthing
          //{ upsert: true }, //add this line to insert if no match is found
          function(err){

            if(err) {
              console.log(err);
            } else {

              count++;
              progress = Math.round(((count/gameInfos.length)*100));
              if(count % 1000 == 0){
                console.log(progress + "%"); 
              }

              if(count === gameInfos.length){
                console.log("Finished updating game infos");
                db.close();
              }

            }

          });
    });
});



