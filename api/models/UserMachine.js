/**
* UserMachine.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName: 'user_machine',

  attributes: {
    alias: 'string',

    group: {
      model: 'Group' ,
      columnName: 'group_id'
    },

    user: {
      model: 'User' ,
      columnName: 'user_id'
    },

    machine: {
      model: 'Machine',
      columnName: 'machine_id'
    }

  },

  beforeCreate: function (values, cb) {
    values.alias = values.alias.toUpperCase();

    //for now everyone gets assigned againts the default group
    //values.group = 1;
    cb();
  }
};
