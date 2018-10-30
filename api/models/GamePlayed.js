/**
* GamePlayed.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    date_time: {
      type: 'ref',
      required: true,
      columnType: 'timestamp'
    },

    game: { 
      model: 'Game',
      columnName: 'game_id'
     }
  }
};

