/**
* Alias.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: 'string',

    user: { 
      model: 'User' ,
      columnName: 'user_id'
    },

    scores: { 
     collection: 'Score',
     via: 'alias'
    }

  }
};

