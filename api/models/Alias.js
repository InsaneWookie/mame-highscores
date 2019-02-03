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

  },

  afterCreate: async (newRecord, proceed) => {
    await Alias.updateScoreAliasesForUser(newRecord);
    return proceed();
  },

  beforeDestroy: async (destroyRecordCriteria, proceed) => {
    console.log(destroyRecordCriteria);
    let alias = await Alias.findOne(destroyRecordCriteria.where);
    await Alias.removeScoreAliasesForUser(alias);
    return proceed();
  },


  updateScoreAliasesForUser: async (newRecord) => {
    let query = "UPDATE score SET alias_id = a.id FROM alias a " +
      "WHERE lower(score.name) = lower(a.name) AND score.name = $1";

    return await sails.sendNativeQuery(query, [newRecord.name]);
  },

  removeScoreAliasesForUser: async (removedRecord) => {
    // let query = "UPDATE score SET alias_id = null FROM alias a " +
    //   "WHERE lower(score.name) = lower(a.name) AND score.name = $1";

    let query = "UPDATE score SET alias_id = null WHERE score.name = $1";

    return await sails.sendNativeQuery(query, [removedRecord.name]);
  }
};

