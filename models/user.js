
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    userName: String,
    aliases: [],
    email: String,
});

//register schema model
mongoose.model('User', userSchema);