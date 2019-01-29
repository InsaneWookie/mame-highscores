/**
 * GroupController
 *
 * @description :: Server-side logic for managing Groups
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


  machine: function(req, res){

    var params = req.allParams();
    var groupId = params.id;

    Group.findAllMachines(groupId, function(err, machines){
      if(err) { return res.serverError(err); }

      res.json(machines);
    });

  },

  user: function(req, res){
    var params = req.allParams();
    var groupId = params.id;

    //TODO: check if user has access to this group

    UserGroup.find({ group_id: groupId }).populate('user').exec(function(err, userGroups){
      if(err) { return res.serverError(err); }
      //just want the users
      var users = [];
      userGroups.forEach(function(userGroup){
        users.push(userGroup.user);
      });

      users = _.sortBy(users, 'username');
      res.json(users);

    });

  }
};

