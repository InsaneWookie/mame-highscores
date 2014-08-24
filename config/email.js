/**
 * Custom configuration params for email service
 * This ia basically the nodemailer transport configuration settings (passed straight through)
 *
 * When developing, you can either create the environment variables or create the config data in your
 * config/local.js file
 *
 * On production it is intended to look up from the environment vars
 */


module.exports.email = {

  from: process.env.MAME_EMAIL_FROM,

  //node mailer transport options
  transport: {
    service: "gmail",
    auth: {
      user: process.env.MAME_GMAIL_USER,
      pass: process.env.MAME_GMAIL_PASS
    }
  }

};
