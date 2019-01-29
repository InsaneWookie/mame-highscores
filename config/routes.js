/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': {
  //   view: 'pages/homepage'
  // },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  // Custom routes here...

  // Custom routes here...
  //'get /login': 'AuthController.login',
  // 'get /logout': 'AuthController.logout',
  //'get /register': 'AuthController.register',

  // 'post /auth/local': 'AuthController.callback',
  // 'post /auth/local/:action': 'AuthController.callback',

  //TODO:
  //'get /auth/:provider': 'AuthController.provider',
  //'get /auth/:provider/callback': 'AuthController.callback',
  //'get /auth/:provider/:action': 'AuthController.callback',

  // 'post /auth/:id/change_password': {
  //   controller: 'auth',
  //   action: 'change_password'
  // },

  //'GET /login': { view: 'login' },
  'POST /api/v1/auth/login': 'AuthController.login',
  '/api/v1/auth/logout': 'AuthController.logout',
  //'GET /register': { view: 'register' },


  'GET /api/v1/game/top_players': 'GameController.top_players',
  'GET /api/v1/game/update_has_mapping': 'GameController.update_has_mapping',

  //gets all the games with scores that the user has scores for
  'get /api/v1/user/:id/games': {
    controller: 'user',
    action: 'games'
  },

  'get /api/v1/user/:id/points': {
    controller: 'user',
    action: 'points'
  },

  'post /api/v1/game/upload' : {
    controller: 'game',
    action: 'upload'
  },

  'get /api/v1/game/:id/mapping': {
    controller: 'game',
    action: 'mapping'
  },

  'post /api/v1/game/:id/mapping': {
    controller: 'game',
    action: 'mapping'
  },

  'post /api/v1/score/:id/claim': {
    controller: 'score',
    action: 'claim'
  },

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
