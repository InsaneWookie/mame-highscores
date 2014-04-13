
var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({
    name: String,
    fullName: {type: String, default: ''},
    hasMapping: {type: Boolean, default: true},
    letter: String,
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
    	createDate: { type: Date, default: Date.now }
    }]
});

//register schema model
mongoose.model('Game', gameSchema);