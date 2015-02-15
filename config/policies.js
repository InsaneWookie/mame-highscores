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

var isAuthed = ['passport', 'sessionAuth'];
module.exports.policies = {

  // Default policy for all controllers and actions
  // (`true` allows public access)
  '*': false,

  'auth': {
    '*': ['passport']
  },

  //AuthController: {
  //  '*': true
  //}

  AliasController: {
    find: isAuthed,
    findOne: isAuthed
  },

  GameController: {
    find: isAuthed,
    findOne: isAuthed,
    search_list: isAuthed,
    top_players: isAuthed,
    upload: isAuthed,
    mapping: isAuthed,
    update_has_mapping: isAuthed,
    play_count: isAuthed
  },

  GamePlayedController: {
    find: isAuthed,
    findOne: isAuthed
  },

  MappingController: {
    find: isAuthed,
    findOne: isAuthed
  },

  RawScoreController: {
    find: isAuthed,
    findOne: isAuthed
  },

  ScoreController: {
    find: isAuthed,
    findOne: isAuthed,
    claim: isAuthed
  },

  UserController: {
    find: isAuthed,
    findOne: isAuthed,
    create: ['passport'],
    //update: true, //TODO: only allow update of a users own details
    profile: isAuthed,
    games: isAuthed,
    player_scores: isAuthed,
    points: isAuthed,
    register_setup: isAuthed
  },

  MachineController: {
    find: isAuthed,
    findOne: isAuthed,
    create: isAuthed
  },

  GroupController: {
    find: isAuthed,
    findOne: isAuthed,
    create: isAuthed,
    machine: isAuthed
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
