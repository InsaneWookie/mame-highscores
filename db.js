//TODO: use an ORM like http://sequelizejs.com/
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/mame-highscores";

module.exports = {
   query: function(text, values, cb) {
      pg.connect(connectionString, function(err, client, done) {
        client.query(text, values, function(err, result) {
          done();
          cb(err, result);
        })
      });
   }
}