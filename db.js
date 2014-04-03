//TODO: use an ORM like http://sequelizejs.com/
pg = require('pg').native; //good idea to use native connction ?

module.exports = {
 
	connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/mame-highscores",

	query: function(text, values, cb) {
		pg.connect(this.connectionString, function(err, client, done) {
			client.query(text, values, function(err, result) {
				done();
				cb(err, result);
			})
		});
	}
}