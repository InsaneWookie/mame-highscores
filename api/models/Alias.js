/**
* Alias.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: 'string',

    usergroup: {
      model: 'UserGroup' ,
      columnName: 'user_group_id'
    },

    scores: { 
     collection: 'Score',
     via: 'alias'
    }

  },

  afterCreate: async (newRecord, proceed) => {
    await Alias.updateScoreAliasesForUser(newRecord);
    return proceed();
  },

  beforeDestroy: async (destroyRecordCriteria, proceed) => {
    // console.log(destroyRecordCriteria);
    let alias = await Alias.findOne(destroyRecordCriteria.where);
    await Alias.removeScoreAliasesForUser(alias);
    return proceed();
  },


  updateScoreAliasesForUser: async (newRecord) => {
    let query = "UPDATE score " +
      "SET alias_id = a.id FROM alias a " +
      "WHERE lower(score.name) = lower(a.name) " +
      "AND score.name = $1 " +
      "AND score.id IN (SELECT s.id FROM score s JOIN machine m ON s.machine_id = m.id AND m.group_id = $2) ";

    let userGroup = await UserGroup.findOne({id: newRecord.user_group});
    return await sails.sendNativeQuery(query, [newRecord.name, userGroup.group]);
  },

  removeScoreAliasesForUser: async (removedRecord) => {
    // let query = "UPDATE score SET alias_id = null FROM alias a " +
    //   "WHERE lower(score.name) = lower(a.name) AND score.name = $1";

    let query = "UPDATE score SET alias_id = null WHERE score.alias_id = $1";

    return await sails.sendNativeQuery(query, [removedRecord.id]);
  }
};

