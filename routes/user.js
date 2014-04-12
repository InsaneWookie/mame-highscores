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

	User.findOne({userName: req.params.id}, function (err, user){
		Game.find({ scores: { $elemMatch: { userName: user.userName }}}, function (err, games){
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

	if(req.method === 'POST'){
		var data = req.body;

		//TODO: probably want to check if anyone has these aliases 
		data.aliases = data.aliases.split(',').map(function(element) { return element.trim(); });
		User.findOneAndUpdate({userName: req.body.userName}, req.body, { upsert: true }, function (err, saved){
			res.redirect('/users/' + saved.userName);
		});
	} else {
		res.render('user_form');
	}

};