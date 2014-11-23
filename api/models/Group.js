/**
* Group.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: 'string',
    description: 'string',

    usergroups: {
      collection: 'UserGroup',
      via: 'group'
    }

    //users: {
    //  collection: 'User',
    //  references: 'a',
    //  on: 'b',
    //  via: 'groups',
    //  dominant: true // could be on either model, doesn't matter
    //}
  }
};

