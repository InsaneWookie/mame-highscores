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
  }
};

