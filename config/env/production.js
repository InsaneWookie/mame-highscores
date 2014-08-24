module.exports = {

  environment: process.env.NODE_ENV || 'production',

  host: process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
  port: process.env.OPENSHIFT_NODEJS_PORT || 8080,

  siteUrl: process.env.OPENSHIFT_APP_DNS || '<no site url defined>'
};