

var assert = require('assert');

describe('Score', function () {

  describe('#claim()', function () {

    beforeEach(async function(){

      var gameData = {
        name: 'zerowing',
        has_mapping: true
      };

      await sails.sendNativeQuery('TRUNCATE TABLE alias RESTART IDENTITY CASCADE', []);
      await sails.sendNativeQuery('TRUNCATE TABLE game RESTART IDENTITY CASCADE', []);
      await sails.sendNativeQuery('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE', []);

      let game = await Game.create(gameData).fetch();
      let user = await User.create({username: 'test1', email: 'mamehighscores+test1@gmail.com'}).fetch();
      let alias = await Alias.create({user: user.id, name: 'ABC'}).fetch();
      //TODO: really need a proper fixture system

    });


    it('should update score.name on claim', async function () {
      //create a score without a name
      let score = await Score.create({game: 1, name: '', score: '1234'}).fetch();

      assert.equal(score.name, '');
      assert.equal(score.alias, null);

      score = await Score.claim(score.id, 'ABC');
      // assert.equal(null, err);

      assert.equal(score.name, 'ABC');
      assert.equal(score.alias.id, 1);

    });

  });
});
