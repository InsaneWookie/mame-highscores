/**
* UserGroup.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName: 'user_group',

  attributes: {

    group: {
      columnName: 'group_id',
      model: 'Group'

    },

    user: {
      columnName: 'user_id',
      model: 'User'

    }
  }
};

