

var assert = require('assert');

describe('Alias', function () {

  describe('add new alias', function () {

    let user1;
    beforeEach(async function(){

      var gameData = {
        name: 'zerowing',
        has_mapping: true
      };

      await sails.sendNativeQuery('TRUNCATE TABLE score RESTART IDENTITY CASCADE', []);
      await sails.sendNativeQuery('TRUNCATE TABLE alias RESTART IDENTITY CASCADE', []);
      await sails.sendNativeQuery('TRUNCATE TABLE game RESTART IDENTITY CASCADE', []);
      await sails.sendNativeQuery('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE', []);

      let game = await Game.create(gameData).fetch();
      user1 = await User.create({username: 'test1', email: 'mamehighscores+test1@gmail.com'}).fetch();
      let alias = await Alias.create({user: user1.id, name: 'ABC'}).fetch();

      let newScores = [
        {name: 'ABC', score: '111'},
        {name: 'FOO', score: '222'},
      ];

      let createdScores = await Game.addScores(game, newScores);
    });


    it('should add new alias to user', async function () {
      //create a score without a name
      let alias = await Alias.create({name: 'BAR', user: user1.id}).fetch();

      assert.notEqual(alias.id, null);
      assert.equal(alias.name, 'BAR');
      assert.equal(alias.user, user1.id);

    });


    it('should update existing scores when adding alias', async function () {
      //create a score without a name
      let alias = await Alias.create({name: 'FOO', user: user1.id}).fetch();

      assert.notEqual(alias.id, null);
      assert.equal(alias.name, 'FOO');
      assert.equal(alias.user, user1.id);

      let scores = await Score.find({alias: alias.id});

      assert.equal(scores.length, 1);
      assert.equal(scores[0].name, 'FOO');


    });

    it('should update existing scores when removing alias', async function () {
      //create a score without a name
      let alias = await Alias.create({name: 'FOO', user: user1.id}).fetch();


      assert.notEqual(alias.id, null);
      assert.equal(alias.name, 'FOO');
      assert.equal(alias.user, user1.id);

      let scores = await Score.find({alias: alias.id});

      assert.equal(scores.length, 1);
      assert.equal(scores[0].name, 'FOO');


      let removedAlias = await Alias.destroyOne({id: 1});

      assert.notEqual(removedAlias, null);

      scores = await Score.find({name: 'ABC'});

      assert.equal(scores[0].alias, null);


    });

  });
});
