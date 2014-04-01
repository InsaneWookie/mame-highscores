
var db = require('../db');

/* GET home page. */
exports.index = function(req, res){

	db.query("SELECT DISTINCT game_name FROM scores ORDER BY game_name", [], function(err, result){
		res.render('index', 
			{ 
				title: 'Select file to upload',
				games: result.rows
			});
	});

  
};
