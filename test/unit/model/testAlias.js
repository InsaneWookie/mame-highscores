

var assert = require('assert');

describe('Alias', function () {

  describe('add new alias', function () {

    let user1;
    let userGroup;
    beforeEach(async function(){

      var gameData = {
        name: 'zerowing',
        has_mapping: true
      };

      // console.log("truncating tables");

      await sails.sendNativeQuery('TRUNCATE TABLE score RESTART IDENTITY CASCADE', []);
      await sails.sendNativeQuery('TRUNCATE TABLE alias RESTART IDENTITY CASCADE', []);
      await sails.sendNativeQuery('TRUNCATE TABLE game RESTART IDENTITY CASCADE', []);
      await sails.sendNativeQuery('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE', []);
      await sails.sendNativeQuery('TRUNCATE TABLE machine RESTART IDENTITY CASCADE', []);
      await sails.sendNativeQuery('TRUNCATE TABLE "group" RESTART IDENTITY CASCADE', []);


      // console.log("creating group");
      let group = await Group.create({name: "TestGroup"}).fetch();

      // console.log("creating Machine");
      let machine = await Machine.create({name: 'Test machine', group: group.id}).fetch();
      // console.log("creating Game");
      let game = await Game.create(gameData).fetch();
      // console.log("creating User");
      user1 = await User.create({username: 'test1', email: 'mamehighscores+test1@gmail.com'}).fetch();
      // console.log("creating UserGroup");
      userGroup = await UserGroup.create({group: group.id, user: user1.id}).fetch();
      // console.log("creating Alias");
      let alias = await Alias.create({user_group: userGroup.id , name: 'ABC'}).fetch();
      // let alias = await Alias.create({user_group: userGroup.id, name: 'ABC'}).fetch();

      let newScores = [
        {name: 'ABC', score: '111'},
        {name: 'FOO', score: '222'},
      ];

      // console.log("creating scores");
      let createdScores = await Game.addScores(game, machine, newScores);
    });


    it('should add new alias to user', async function () {
      //create a score without a name
      let alias = await Alias.create({name: 'BAR', user_group: userGroup.id}).fetch();

      assert.notEqual(alias.id, null);
      assert.equal(alias.name, 'BAR');
      assert.equal(alias.user_group, userGroup.id);
    });


    it('should update existing scores when adding alias', async function () {
      //create a score without a name
      let alias = await Alias.create({name: 'FOO', user_group: userGroup.id}).fetch();

      assert.notEqual(alias.id, null);
      assert.equal(alias.name, 'FOO');
      assert.equal(alias.user_group, userGroup.id);

      let scores = await Score.find({alias: alias.id});

      assert.equal(scores.length, 1);
      assert.equal(scores[0].name, 'FOO');
    });

    it('should update existing scores when removing alias', async function () {
      //create a score without a name
      let alias = await Alias.create({name: 'FOO', user_group: userGroup.id}).fetch();

      assert.notEqual(alias.id, null);
      assert.equal(alias.name, 'FOO');
      assert.equal(alias.user_group, userGroup.id);

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
