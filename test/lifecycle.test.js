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

    models: { migrate: 'safe' },

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

  }, async function(err, sails) {
    if (err) { return done(err); }
    // here you can load fixtures, etc.

    await Sails.sendNativeQuery("TRUNCATE score RESTART IDENTITY CASCADE");
    await Sails.sendNativeQuery("TRUNCATE rawscore RESTART IDENTITY CASCADE");
    await Sails.sendNativeQuery("TRUNCATE gameplayed RESTART IDENTITY CASCADE");
    await Sails.sendNativeQuery("TRUNCATE mapping RESTART IDENTITY CASCADE");
    await Sails.sendNativeQuery("TRUNCATE machine RESTART IDENTITY CASCADE");
    await Sails.sendNativeQuery("TRUNCATE \"alias\" RESTART IDENTITY CASCADE");
    await Sails.sendNativeQuery("TRUNCATE game RESTART IDENTITY CASCADE");
    await Sails.sendNativeQuery("TRUNCATE \"user\" RESTART IDENTITY CASCADE");
    await Sails.sendNativeQuery("TRUNCATE user_group RESTART IDENTITY CASCADE");
    await Sails.sendNativeQuery("TRUNCATE \"group\" RESTART IDENTITY CASCADE");

    return done();
  });
});

after(async function() {
  // here you can clear fixtures, etc.



  await Sails.lower();
});