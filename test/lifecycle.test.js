/**
 * Created by rowan on 8/23/14.
 */
var Sails = require('sails');
//vvar stubTransport = require('nodemailer-stub-transport');

before(function(done) {

  this.timeout(50000);

  Sails.lift({
    // configuration for testing purposes
    //TODO: move this config data into a file
    hooks: { grunt: false },
    log: { level: 'warn' },

    models: { migrate: 'drop' },

    datastores: {
      default: {
        adapter: 'sails-postgresql',
        url: 'postgres://postgres:example@db:5432/mame-highscores-test',
        database: 'mame-highscores-test'
      }
    },

    email: {
      from: "mamehighscores@invalid",

      //node mailer transport options
      transport: 'stub'
    }

  }, function(err, sails) {
    if (err) { return done(err); }
    // here you can load fixtures, etc.
    return done();
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});