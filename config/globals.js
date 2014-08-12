/**
 * Global Variable Configuration
 * (sails.config.globals)
 *
 * Configure which global variables which will be exposed
 * automatically by Sails.
 *
 * For more information on configuration, check out:
 * http://links.sailsjs.org/docs/config/globals
 */

var pkgJson = require('../package.json');
module.exports.globals = {
	_: true,
	async: true,
	sails: true,
	services: true,
	models: true,
  version: pkgJson.version
};
