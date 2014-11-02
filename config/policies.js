/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!documentation/
 */


module.exports.policies = {

  // Default policy for all controllers and actions
  // (`true` allows public access)
  '*': false,

  AliasController: {
    find: true,
    findOne: true
  },

  GameController: {
    find: true,
    findOne: true,
    search_list: true,
    top_players: true,
    upload: true,
    mapping: true,
    update_has_mapping: true
  },

  GamePlayedController: {
    find: true,
    findOne: true
  },

  MappingController: {
    find: true,
    findOne: true
  },

  RawScoreController: {
    find: true,
    findOne: true
  },

  ScoreController: {
    find: true,
    findOne: true,
    claim: true
  },

  UserController: {
    find: true,
    findOne: true,
    create: true,
    //update: true, //TODO: only allow update of a users own details
    games: true,
    player_scores: true,
    points: true
  }





	// Here's an example of mapping some policies to run before
  // a controller and its actions
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
};
