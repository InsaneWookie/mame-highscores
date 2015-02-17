
var uuid = require('node-uuid');
/**
* Machine.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: 'string',
    description: 'string',
    api_key: 'string',
    secret_key: 'string',

    scores: {
      collection: 'Score',
      via: 'machine'
    },

    usermachine: {
      collection: "UserMachine",
      via: 'machine'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.secret_key;
      return obj;
    }
  },

  generateApiKey: function(){
    return uuid.v4();
  }
};

