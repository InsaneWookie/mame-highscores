

var assert = require('assert');

describe('Score', function () {

  describe('#claim()', function () {

    beforeEach(function(done){

      var gameData = {
        name: 'zerowing',
        has_mapping: true
      };

      //TODO: really need a proper fixture system
      async.waterfall([
        function(cb){
          Game.query('TRUNCATE TABLE game RESTART IDENTITY CASCADE', [], function(err) { cb(err); });
        },
        function(cb){
          User.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE', [], function(err){ cb(err); });
        },
        function(cb){
          Game.create(gameData).exec(function(err, game){
            cb(err);
          });
        },
        function(cb){
          User.create({username: 'test1', email: 'mamehighscores+test1@gmail.com'}).exec(function(err, user){
            cb(err, user);
          });
        },
        //function(user, cb){
        //  Alias.create({user_id: user.id, name: 'ABC'}).exec(function(err, alias){
        //    cb(err);
        //  });
        //}
      ], function(err, result){
        done(err);
      });

    });


    it('should update score.name on claim', function (done) {
      //create a score without a name
      Score.create({game_id: 1, name: '', score: '1234'}).exec(function(err, score){
        assert.ok(!err);

        assert.equal(score.name, '');
        assert.equal(score.alias, null);

        Score.claim(score.id, 'ABC', function(err, score){
          assert.equal(null, err);

          assert.equal(score.name, 'ABC');
          assert.equal(score.alias.id, 1);

          done();
        });

      });
    });

  });
});
