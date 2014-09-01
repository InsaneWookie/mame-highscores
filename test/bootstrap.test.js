/**
 * Created by rowan on 8/23/14.
 */
var Sails = require('sails');
var stubTransport = require('nodemailer-stub-transport');

before(function(done) {
  Sails.lift({
    // configuration for testing purposes
    //TODO: move this config data into a file
    log: {
      level: 'silent'
    },

    connections: {
      postgresqlServer: {
        adapter: 'sails-postgresql',
        url: 'postgres://postgres:postgres@localhost:5432/mame-highscores-test',
        database: 'mame-highscores-test'
      }
    },

    email: {
      from: "mamehighscores@invalid",

      //node mailer transport options
      transport: 'stub'
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