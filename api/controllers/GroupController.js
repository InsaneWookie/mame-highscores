/**
 * GroupController
 *
 * @description :: Server-side logic for managing Groups
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


  create: function(req, res){
    console.log('this is a controller test');

    console.log(req.allParams());

    var params = req.allParams();

    Group.create({name: params.name, description: params.description})
        .exec(function(err, group){
          if(err) return console.log(err);
          var userGroup = params.usergroups[0];
          userGroup.group = group.id;
          UserGroup.create(userGroup).exec(function(err, userGroup){
            if(err) return console.log(err);
          });
        });
  },


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

