
var db = require('../db');

/* GET home page. */
exports.index = function(req, res){

	db.query("SELECT DISTINCT game_id, game_name FROM games ORDER BY game_id", [], function(err, result){
		res.render('index', 
			{ 
				title: 'Select file to upload',
				games: result.rows
			});
	});

  
};
