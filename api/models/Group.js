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

    user_groups: {
      collection: 'UserGroup',
      via: 'group'
    },

    users: {
      collection: 'user',
      via: 'group',
      through: 'usergroup'
    },

    //users: {
    //  collection: 'User',
    //  references: 'a',
    //  on: 'b',
    //  via: 'groups',
    //  dominant: true // could be on either model, doesn't matter
    //}
  },

  findAllMachines: function(group, callbackFn){

    var groupId = (typeof group === 'object') ? group.id : group;

    // same query ???
    //SELECT m.* FROM machine m
    //WHERE exists (SELECT 1 FROM user_group ug, user_machine um WHERE ug.group_id = um.group_id AND ug.group_id = 1)

    UserGroup.query(
      "SELECT DISTINCT m.* FROM user_group ug, user_machine um, machine m" +
      " WHERE ug.group_id = um.group_id AND um.machine_id = m.id AND ug.group_id = $1",
      [groupId], function(err, result){

        //var machineIds = _.pluck(result.rows, 'machine_id'); //TODO: handle if no machine ids found

        //var machines = [];

        //result.rows.forEach(function(machine){
        //  machines.push(new Machine)
        //});


        callbackFn(err, result.rows);
      });
  }
};

