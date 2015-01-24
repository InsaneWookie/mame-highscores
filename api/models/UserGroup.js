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
  },


  /**
   * Gets all the machine ids for all the groups that this user is in
   * @param userId
   * @param callbackFn
   */
  findMachineIdsForUser: function(userId, callbackFn){
    UserGroup.query(
      "SELECT DISTINCT machine_id FROM user_group ug, user_machine um WHERE ug.group_id = um.group_id AND ug.user_id = $1",
      [userId], function(err, result){

        var machineIds = _.pluck(result.rows, 'machine_id'); //TODO: handle if no machine ids found

        callbackFn(err, machineIds);
      });
  }

};

