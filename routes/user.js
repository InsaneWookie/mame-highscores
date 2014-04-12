var mongoose = require('mongoose');

/* GET users listing. */
exports.list = function(req, res){
	var User = mongoose.model('User');

	User.find({}, function (err, users){
		res.render('users', {users: users});
	});
	
};

exports.user = function(req, res){
	var User = mongoose.model('User');
	var Game = mongoose.model('Game');

	User.findOne({ _id: req.params.id}, function (err, user){
		if(err) { console.log(err); return;}
		console.log(user);
		//TODO: under stand what type the _id fields are and how to use them prperly (instead of doing a to string)
		Game.find({ scores: { $elemMatch: { user_id: user._id }}}, function (err, games){
			res.render('user', { user: user, games: games });
		});
	});
};

exports.update = function(req, res){
	var User = mongoose.model('User');

	if(req.method === 'POST'){
		var data = req.body;

		//TODO: probably want to check if anyone has these aliases 
		data.aliases = data.aliases.split(',').map(function(element) { return element.trim(); });
		User.findOneAndUpdate({userName: req.body.userName}, req.body, { upsert: true }, function (err, saved){
			res.redirect('/users/' + saved.userName);
		});
	} else {
		res.render('save_user');
	}

};


exports.create = function(req, res){
	var User = mongoose.model('User');
	var Game = mongoose.model('Game');

	if(req.method === 'POST'){

		//TODO: this is bad just saving everything that gets passes in
		var data = req.body;

		//TODO: probably want to check if anyone has these aliases 
		data.aliases = data.aliases.split(',').map(function(element) { return element.trim(); });

		var user = new User(data);

		user.save(function(err, newUser){
			//created a new user so now we need to add their id into any scores they have initials for

			//TODO: the redirect will happen for the updates finish. Need to wait
			//Probably a nice way to do the update in one go use the $in query
			newUser.aliases.forEach(function(alias){

				Game.collection.update( //not sure if we need to use Game.collection.update (i think this by passes mongoose)
				{ scores : { $elemMatch: { name: alias }}},
   				{ $set: { "scores.$.user_id": newUser._id }},
   				{ multi: true }, 
   				function(err, numberAffected, rawResponse){
   					console.log(err, numberAffected);
   				});
			});

			res.redirect('/users/' + newUser._id);
		});

	} else {
		res.render('user_form');
	}

};