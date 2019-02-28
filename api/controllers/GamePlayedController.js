/**
 * GamePlayedController
 *
 * @description :: Server-side logic for managing Gameplayeds
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  find: async (req, res) => {
    console.log(req.user);
    console.log(req.session);
    const groupId = req.session.selectedGroup;

    var parseBlueprintOptions = req.options.parseBlueprintOptions || req._sails.config.blueprints.parseBlueprintOptions;

    // Set the blueprint action for parseBlueprintOptions.
    req.options.blueprintAction = 'find';

    var queryOptions = parseBlueprintOptions(req);
    var Model = req._sails.models[queryOptions.using];

    queryOptions.criteria.where.group = groupId;
    console.log(queryOptions.criteria);

    Model
      .find(queryOptions.criteria, queryOptions.populates).meta(queryOptions.meta)
      .exec(function found(err, matchingRecords) {
        if (err) {
          // If this is a usage error coming back from Waterline,
          // (e.g. a bad criteria), then respond w/ a 400 status code.
          // Otherwise, it's something unexpected, so use 500.
          switch (err.name) {
            case 'UsageError':
              return res.badRequest(formatUsageError(err, req));
            default:
              return res.serverError(err);
          }
        }//-•

        if (req._sails.hooks.pubsub && req.isSocket) {
          Model.subscribe(req, _.pluck(matchingRecords, Model.primaryKey));
          // Only `._watch()` for new instances of the model if
          // `autoWatch` is enabled.
          if (req.options.autoWatch) {
            Model._watch(req);
          }
          // Also subscribe to instances of all associated models
          _.each(matchingRecords, function (record) {
            actionUtil.subscribeDeep(req, record);
          });
        }//>-

        return res.ok(matchingRecords);
      });

    // let gamesPlayed = await Machine.find({group: groupId}).populate('gamesplayed');
    //
    // let requests = [];
    // gamesPlayed.forEach((gp) => {
    //   requests.push(Game.findOne({id: gp.gamesplayed[0].game}));
    //   // console.log(g);
    //   // gp.gamesplayed[0].game = g;
    // });
    //
    // Promise.all(requests).then((games) =>{
    //   console.log(games);
    //   gamesPlayed.forEach((gp, index) => {
    //     gp.gamesplayed[0].game = games[index];
    //   });
    //
    //   console.log(gamesPlayed);
    //   res.json(gamesPlayed);
    // });


  }
};

