/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name: 'STRING',
  	full_name: 'STRING',
  	has_mapping: 'boolean',
    play_count: 'integer',
  	clone_of: 'integer',
  	last_played: 'datetime',
    letter: 'string',
    order: 'string',
    sort: 'string',
    year: 'string',

  	scores: { 
      collection: 'Score',
      via: 'game'
    },


    addScores: function(newScores, callback){

      var thisGameId = this.id;
      //before we save work out if the top score has been set
      var sortedNewScores = newScores;

      sortedNewScores.sort(function(a, b){
        return parseInt(b.score) - parseInt(a.score);
      });

      // foundTopScore = game.scores.some(function(score){
      //   return (sortedNewScores[0].score === score.score 
      //     && sortedNewScores[0].name === score.name
      //     && score.user_id);
      // });


      // if(!foundTopScore){
      //     io.emit('notification', { game: saved, topScore: sortedNewScores[0]});
      // }

      var filteredScores = [];
      //work out was scores do not exist in the scores that we have been given compared to whats in the database
      //should be able to use Score.findOrCreateEach
      Score.find({game_id: thisGameId}).exec(function (err, scores){
        //go through the scores and see if it exists in the ones being uploaded and if so remove it from the list
        filteredScores = newScores.filter(function (newScore){
          //if it doesnt exist then we want to add it to ther filtered scores list
          return !scores.some(function (currentScore){
              return (currentScore.name === newScore.name) && (currentScore.score === newScore.score);    
          });
        });

        filteredScores.forEach(function(score){
          score.game_id = thisGameId;
        });

        //now insert the new scores

        Score.createEach(filteredScores).exec(function (err, result){
          if(err) { console.log(err); } else {
            
            //due to the way we are doing the ids, need to update the alias ids against the scores (easier to just do for all scores for this game)
            Score.query("UPDATE score SET alias_id = a.id FROM alias a WHERE lower(score.name) = lower(a.name) AND score.game_id = $1",
              [thisGameId],
              function(err, result){
                callback(result); //callback with the newlly created scores
              });
          }
        });
      });
    }

  },


  
};

//name, full_name, has_mapping, letter, play_count, last_played, clone_of, order, sort