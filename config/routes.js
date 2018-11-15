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

  'get /api/v1/group/:id/machine': {
    controller: 'group',
    action: 'machine'
  },

  'get /api/v1/group/:id/user': {
    controller: 'group',
    action: 'user'
  },

  'post /api/v1/machine/:id/new_key': {
    controller: 'machine',
    action: 'new_key'
  }

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
