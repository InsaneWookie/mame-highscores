// api/services/EmailService.js

var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '../..', 'views/emails')
  , emailTemplates = require('email-templates')
  , nodemailer     = require('nodemailer');
var stubTransport = require('nodemailer-stub-transport');

/**
 * TODO: document templateData format (maybe make a template data class)
 * @param templateData
 * @param emailOptions
 * @param callback
 */
exports.sendBeatenEmail = function (templateData, emailOptions, callback) {


  var gameName = templateData.game.full_name;
  var beatenByUserName = templateData.beatenBy.user.username;

  emailOptions.subject = "Score on " + gameName + " has been beaten by " + beatenByUserName;
  this.sendEmail('beaten', templateData, emailOptions, callback);
};

/**
 *
 * @param template
 * @param templateData
 * @param options object email options (eg to, subject, etc)
 * @param callback (error, emailResponse)
 */
exports.sendEmail = function(templateDir, templateData, options, callback) {

  var transportConfig = (sails.config.email.transport === 'stub') ? stubTransport() : sails.config.email.transport;
  var fromAddress = sails.config.email.from;

  var sendMailConfig = options;
  //override from address with config
  sendMailConfig.from = fromAddress;

  //add the site url to all template data so we don't have to worry about it
  templateData.siteUrl = sails.config.siteUrl;

  //stick the port on if its not 80
  if(sails.config.port !== 80) {
    templateData.siteUrl += ':' + sails.config.port;
  }

  emailTemplates(templatesDir, function(err, template) {

    if (err) {
      console.log(err);
      return;
    }

    //console.log(transportConfig);
    var transport = nodemailer.createTransport(transportConfig);

    // Send a single email
    template(templateDir, templateData, function(err, html, text) {

      if(err) return callback(err, null);

      sendMailConfig.html = html;
      sendMailConfig.text = text;

      transport.sendMail(sendMailConfig, function(err, responseStatus) {
        if(err) console.log(err); //probably remove this log, but log for now in case we have any problems
        callback(err, responseStatus);
      });
    });
  });
};


