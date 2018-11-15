/**
* RawScore.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    bytes: 'string',
    file_type: { type: 'string', allowNull: true },

    game: { 
      model: 'Game',
      columnName: 'game_id'
    }
  }
};

