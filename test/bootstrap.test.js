/**
 * Created by rowan on 8/23/14.
 */
var Sails = require('sails');

before(function(done) {
  Sails.lift({
    // configuration for testing purposes
    log: {
      level: 'silent'
    },

    connections: {
      postgresqlServer: {
        adapter: 'sails-postgresql',
        url: 'postgres://postgres:postgres@localhost:5432/mame-highscores-test',
        database: 'mame-highscores-test'
      }
    }
  }, function(err, sails) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});