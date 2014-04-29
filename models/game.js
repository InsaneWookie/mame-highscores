
var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({
    name: String,
    fullName: {type: String, default: ''},
    hasMapping: {type: Boolean, default: true},
    letter: String,

    playCount: { type: Number, default: 0 },
    lastPlayed: { type: Date, default: Date.now },

    order: [{score: String, name: String}],
    sort: { by: String, order: String },

    scores: {
    	type: [{
                user_id: mongoose.Schema.Types.ObjectId,
    			name: String, 
    			score: String, 
    			createDate: { type: Date, default: Date.now }
    		}], 
    	default: []
    },
    //if we dont have a mapping then just save the raw bytes from the file
    //so we can process them later
    rawScores: [{  
    	bytes: String,
        //datVersion: { type: String, default: '0.108'}, //version of the hiscore.dat file these raw scores were created with
    	createDate: { type: Date, default: Date.now }
    }]
});

/**
*   decodedScores: array or scores returned from scoreDecoder
*   callBack: function(err, savedRecord)
*       call back with error or the record that was saved
*/
gameSchema.methods.addScores = function(decodedScores, callBack){
    //go through the scores and see if any of the uses have aliases for them
    //this asumes that alaises are unique (just finds the first user)
    var User = mongoose.model('User');
    var Game = mongoose.model('Game');
    //probably could do this with a reduce function??
    //var scores = scoreData.scores;
    
    var newScores = decodedScores;
    //console.log(newScores);

    //go through each score and see if we can find a user with and alias that matches
    //Game.findOne({name: gameName}, function(err, game){

    game = this;
    gameName = game.name;
    
    var filteredScores;

    filteredScores = newScores.filter(function(newScore){
        //if it doesnt exist then we want to add it to ther filtered scores list
        return !game.scores.some(function(currentScore){
            return (currentScore.name === newScore.name) && (currentScore.score === newScore.score);    
        });
    }); 

    //console.log("filtered scores");
    //console.log(filteredScores);
    //scoreData = { $push: { scores: { $each: filteredScores } } };
    var scoreLength = filteredScores.length;

    if(scoreLength === 0){
        //res.redirect('/games/' + gameName);
        //callBack({message: 'no scores to add'}); //whats the error format?
        //maybe just return the game object (ie no changes)
        //still want to update the playedCount and lastPLayed
        Game.findOneAndUpdate(
                    {name: gameName}, 
                    {   
                        hasMapping: true, 
                        lastPlayed: new Date(),                        
                        $inc: { playCount : 1 }
                    }, 
                    { upsert: true }, function (err, saved) {
                        
                        if(err) { console.log(err); }

                        callBack(err, saved);
                });

        return;
    }
    //scores.forEach(function(score, index){

    //see if it does not exist. 
    //FIXME: There will be a much better way of doing this. At least need to add 
    //indexing on scores name/score fields

    //does this score exist already

    //console.log(scoreData);
        
    filteredScores.forEach(function(score, index){

        User.findOne({ aliases: { $in: [score.name] } }, function(err, user){

            scoreLength--;

            if(err){ 
                console.log(err);
            } else if (user !== null) { //we found a user
                filteredScores[index].user_id = user._id;
            }
        

            //once we have processed all the scores, need to update them 
            //not the most elegant way to deal with the async nature of node                
            if(scoreLength === 0){
                //console.log(filteredScores);
                //TODO: add new scores to the list instead of over writing all scores
                Game.findOneAndUpdate({name: gameName}, 
                    {   
                        hasMapping: true, 
                        lastPlayed: new Date(),
                        $push : { scores: { $each: filteredScores } },
                        
                        $inc: { playCount : 1 }
                    }, 
                    { upsert: true }, function (err, saved) {
                        
                    if(err) { console.log(err); }

                    callBack(err, saved);
                });
            }
        });
    });
};

//register schema model
mongoose.model('Game', gameSchema);