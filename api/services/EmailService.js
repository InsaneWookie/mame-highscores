// api/services/EmailService.js

var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '../..', 'views/emails')
  , emailTemplates = require('email-templates')
  , nodemailer     = require('nodemailer');
var stubTransport = require('nodemailer-stub-transport');

var crypto = require('crypto');

/**
 *
 * @param {Game} game
 * @param {Score} beatenBy (score with user)
 * @param {Score} beaten
 * @param emailOptions
 * @param callback
 */
exports.sendBeatenEmail = function (game, beatenBy, beaten, emailOptions, callback) {

  var templateData = {
    game: game,
    beatenBy: beatenBy,
    beaten: beaten
  };

  var beatenByUserName = beatenBy.user.username;

  emailOptions.subject = "Here comes a new challenger: " + beatenByUserName + " beat your score on " +  game.full_name;
  this.sendEmail('beaten', templateData, emailOptions, callback);
};


exports.resetPassword = function (user, callbackFn){

  crypto.randomBytes(10, function(err, bytes){
    if(err) { return callbackFn(err); }

    var password = bytes.toString('base64');

    //TODO: probably shouldnt be doing the password hashing here, should just pass the hashed password in
    User.hashPassword(password, function(err, hash){
      if(err) { return callbackFn(err); }

      User.update(user.id, { password: hash }).exec(function(err, users){
        if(err) { return callbackFn(err); }

        var emailOptions = {
          to: user.email,
          subject: "Mame Highscores Password Reset"
        };

        var templateData = {
          password: password
        };

        EmailService.sendEmail('reset-password', templateData, emailOptions, callbackFn);

      });
    });

  });
};

/**
 *
 * @param templateDir
 * @param templateData
 * @param options object email options (eg to, subject, etc)
 * @param callback (error, emailResponse)
 */
exports.sendEmail = function(templateDir, templateData, options, callback) {

  if(!options.to || options.to.trim() === ''){
    //no email so do nothing
    console.log("no to email set");
    callback("no to address set", null);
    return;
  }

  var transportConfig = (sails.config.email.transport === 'stub') ? stubTransport() : sails.config.email.transport;
  var fromAddress = sails.config.email.from;

  var sendMailConfig = options;
  //override from address with config
  sendMailConfig.from = fromAddress;

  //add the site url to all template data so we don't have to worry about it
  templateData.siteUrl = sails.config.siteUrl;

  //stick the port on if its not 80
  //for now only stick the port of not production (cant use the port as openshift binds to port 8080 and routes
  //external port 80 to it
  if(sails.config.environment !== 'production' && sails.config.port !== 80) {
    templateData.siteUrl += ':' + sails.config.port;
  }

  emailTemplates(templatesDir, function(err, template) {

    if (err) {
      console.error(err);
      return;
    }

    //console.log(transportConfig);
    var transport = nodemailer.createTransport(transportConfig);

    // Send a single email
    template(templateDir, templateData, function(err, html, text) {

      if(err) {
        console.error(err);
        return callback(err, null);
      }

      sendMailConfig.html = html;
      sendMailConfig.text = text;

      transport.sendMail(sendMailConfig, function(err, responseStatus) {
        if(err) console.error(err); //probably remove this log, but log for now in case we have any problems
        callback(err, responseStatus);
      });
    });
  });
};


