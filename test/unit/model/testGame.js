

var assert = require('assert');

describe('Game', function () {

  //this.timeout(5000);

  describe('#filterScores()', function () {

    it('should filter scores', function (done) {
      done();
    });
  });

  describe('#getBeatenScores()', function () {

    it('should get one beaten score', function () {

      var newScores = [
        { id: 3, score: '345', name: 'XYZ', alias: 2 },
        { id: 2, score: '234', name: 'XYZ', alias: 2 }];

      var afterAddedScores = [
        { id: 3, score: '345', name: 'XYZ', alias: 2 },
        { id: 2, score: '234', name: 'XYZ', alias: 2 },
        { id: 1, score: '123', name: 'ABC', alias: 1 }];

      var expectedBeatenScores = [
        { beaten: { id: 1, score: '123', name: 'ABC', alias: 1 }, beatenBy: { id: 3, score: '345', name: 'XYZ', alias: 2 } }
      ];

      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");

    });

    it('should not show user as beaten by a user they have beaten', function () {

      var newScores = [
        { id: 4, score: '456', name: 'ABC', alias: 1 },
        { id: 3, score: '345', name: 'XYZ', alias: 2 },
        { id: 2, score: '234', name: 'XYZ', alias: 2 }];

      var afterAddedScores = [
        { id: 4, score: '456', name: 'ABC', alias: 1 }, //new score - beatenBy
        { id: 3, score: '345', name: 'XYZ', alias: 2 }, //new score - beaten
        { id: 2, score: '234', name: 'XYZ', alias: 2 }, //new score
        { id: 1, score: '123', name: 'ABC', alias: 1 }  //original score
      ];

      var expectedBeatenScores = [
        { beaten: { id: 3, score: '345', name: 'XYZ', alias: 2 }, beatenBy: { id: 4, score: '456', name: 'ABC', alias: 1 } }
      ];

      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);

//      console.log(actualBeatenScores);
//      console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");

    });


    it('should show multiple beaten if different users', function () {

      var newScores = [
        { id: 4, score: '456', name: 'ABC', alias: 1 },
        { id: 3, score: '345', name: 'XYZ', alias: 2 },
        { id: 2, score: '234', name: 'FOO', alias: 3 }];

      var afterAddedScores = [
        { id: 4, score: '456', name: 'ABC', alias: 1 }, //new score
        { id: 3, score: '345', name: 'XYZ', alias: 2 }, //new score
        { id: 2, score: '234', name: 'FOO', alias: 3 }, //new score
        { id: 1, score: '123', name: 'ABC', alias: 1 }  //original score
      ];

      var expectedBeatenScores = [
        { beaten: { id: 3, score: '345', name: 'XYZ', alias: 2 }, beatenBy: { id: 4, score: '456', name: 'ABC', alias: 1 } },
        { beaten: { id: 2, score: '234', name: 'FOO', alias: 3 }, beatenBy: { id: 4, score: '456', name: 'ABC', alias: 1 } }
      ];

      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);

//      console.log(actualBeatenScores);
//      console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");

    });

    it('should show multiple beaten if different users even of higher scores', function () {

      var newScores = [
        { id: 4, score: '456', name: 'ABC', alias: 1 },
        { id: 3, score: '345', name: 'XYZ', alias: 2 },
        { id: 2, score: '234', name: 'FOO', alias: 3 }];

      var afterAddedScores = [
        { id: 5, score: '9001', name: 'BOB', alias: 99}, //existing higher score
        { id: 4, score: '456', name: 'ABC', alias: 1 }, //new score
        { id: 3, score: '345', name: 'XYZ', alias: 2 }, //new score
        { id: 2, score: '234', name: 'FOO', alias: 3 }, //new score
        { id: 1, score: '123', name: 'ABC', alias: 1 }  //original score
      ];

      var expectedBeatenScores = [
        { beaten: { id: 3, score: '345', name: 'XYZ', alias: 2 }, beatenBy: { id: 4, score: '456', name: 'ABC', alias: 1 } },
        { beaten: { id: 2, score: '234', name: 'FOO', alias: 3 }, beatenBy: { id: 4, score: '456', name: 'ABC', alias: 1 } }
      ];

      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);

//      console.log(actualBeatenScores);
//      console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");

    });

    it('should should not show non user scores as beaten', function () {

      var newScores = [
        { id: 3, score: '345', name: 'XYZ', alias: 2 },
        { id: 2, score: '234', name: 'FOO', alias: 3 }];

      var afterAddedScores = [
        { id: 3, score: '345', name: 'XYZ', alias: 2 }, //new score
        { id: 2, score: '234', name: 'FOO', alias: 3 }, //new score
        { id: 1, score: '123', name: 'ABC', alias: null }  //original score
      ];

      var expectedBeatenScores = [
        { beaten: { id: 2, score: '234', name: 'FOO', alias: 3 }, beatenBy: { id: 3, score: '345', name: 'XYZ', alias: 2 } }
      ];

      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);

//      console.log(actualBeatenScores);
//      console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");

    });
  });

  describe('#uploadScores()', function () {


    beforeEach(function(done){

      Game.query('TRUNCATE TABLE game RESTART IDENTITY CASCADE', [], function(err){
        User.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE', [], function(err){


          var gameData = {
            name: 'zerowing',
            has_mapping: true
          };
          Game.create(gameData).exec(function(err, game){

            User.create({username: 'test1', email: 'mamehighscores+test1@gmail.com'}).exec(function(err, user){
              Alias.create({user_id: user.id, name: 'ABC'}).exec(function(err, alias){
                User.create({username: 'test2', email: 'mamehighscores+test2@gmail.com'}).exec(function(err, user){
                  Alias.create({user_id: user.id, name: 'DEF'}).exec(function(err, alias){
                    done(err);
                  });
                });
              });
            });
          });


        });
      });


    });

    afterEach(function(done){
      done();

    });




    it('should upload scores without error', function (done) {

      var bytes = '0000500000005000000048000000460000004400000042000026002600260000000000000026002600260000000' +
        '000000026002600260000000000000026002600260000000000000026002600260000000000000006000500040003000200140013' +
        '00120011001050';

      var newBytes = '000050000000550000005400000046000000440000004200000A000B000C000000000000000D000E000F0000000' +
        '000000026002600260000000000000026002600260000000000000026002600260000000000000006000500040003000200140013' +
        '00120011001050';

      var bytesBuffer = new Buffer(bytes, 'hex');

      var fileType = 'hi';
      var gameName = 'zerowing';

      Game.findOneByName(gameName).exec(function(err, game){
        if(err){
          done(err);
        } else {

          assert.ok(game, "game not set");

          Game.uploadScores(bytesBuffer, fileType, game, function(err, savedScores){
            assert.ok(savedScores.length > 0, "should have saved some scores");

            assert.equal(savedScores[0].name, '...');
            assert.equal(savedScores[0].score, '50000');

            Game.uploadScores(new Buffer(newBytes, 'hex'), fileType, game, function(err, savedScores){
              assert.ok(savedScores.length === 2, "should have saved 2 scores");

              assert.equal(savedScores[0].name, 'ABC');
              assert.equal(savedScores[0].score, '55000');

              assert.equal(savedScores[1].name, 'DEF');
              assert.equal(savedScores[1].score, '54000');

              done(err);
            });
          });
        }
      });
    });
  });
});
