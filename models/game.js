


var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

var gameSchema = mongoose.Schema({
    name: String,
    fullName: {type: String, default: ''},
    hasMapping: {type: Boolean, default: true},
    letter: String,
    order: [{score: String, name: String}],
    sort: { by: String, order: String },

    scores: {type: [{name: String, score: String}], default: []}
});

//register schema model
mongoose.model('Game', gameSchema);