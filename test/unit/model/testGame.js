

var assert = require('assert');

describe('Game', function () {

  //this.timeout(5000);

  describe('#filterScores()', function () {

    it('no existing scores should not filter any scores', function () {

      var newScores = [
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
      ];

      var existingScores = [];

      var filteredScores = Game.filterScores(newScores, existingScores);

      assert.deepEqual(filteredScores, newScores, 'should not have filtered any scores')

    });

    it('should filter if there are the same existing scores ', function () {

      var newScores = [
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
      ];

      var existingScores = [{name: 'ABC', score: '123'},];

      var expectedScores = [
        {name: 'TEST', score: '1234'},
      ];

      var filteredScores = Game.filterScores(newScores, existingScores);

      assert.deepEqual(filteredScores, expectedScores, 'should have filtered existing scores')

    });

    it('should filter duplicate new scores', function () {

      var newScores = [
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
        {name: 'BOB', score: '222'},
        {name: 'TEST', score: '1234'},
      ];

      var existingScores = [];

      var expectedScores = [
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
        {name: 'BOB', score: '222'},
      ];

      var filteredScores = Game.filterScores(newScores, existingScores);

      assert.deepEqual(filteredScores, expectedScores, 'should have filtered duplicate scores')

    });

    it('should filter both existing scores and duplicate new scores', function () {

      var newScores = [
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
        {name: 'BOB', score: '222'},
        {name: 'TEST', score: '1234'},
      ];

      var existingScores = [{name: 'ABC', score: '123'}];

      var expectedScores = [
        {name: 'TEST', score: '1234'},
        {name: 'BOB', score: '222'},
      ];

      var filteredScores = Game.filterScores(newScores, existingScores);

      assert.deepEqual(filteredScores, expectedScores, 'should have filtered duplicate scores')

    });

    it('should filter scores with empty scores', function () {

      var newScores = [
        {name: 'TEST', score: ''},
        {name: 'ABC', score: '0'},
        {name: 'TEST', score: '0'},
        {name: 'ABC', score: ''},
        {name: 'BOB', score: '222'},
        {name: 'TEST', score: '1234'},
      ];

      var existingScores = [{name: 'ABC', score: '123'}];

      var expectedScores = [
        {name: 'ABC', score: '0'},
        {name: 'TEST', score: '0'},
        {name: 'BOB', score: '222'},
        {name: 'TEST', score: '1234'},
      ];

      var filteredScores = Game.filterScores(newScores, existingScores);

      assert.deepEqual(filteredScores, expectedScores, 'should have filtered duplicate scores')

    });

  });


  //I think for this the easies is to just get the unique user's scores
  //that have been beaten by the top score
  //TODO: clean up the test data
  describe('#getBeatenScores()', function () {

    //most basic test to see if the structure is correct
    it('should return the correct structure', function(){

      var newScores = [{ id: 2, score: '200', name: 'BAR', alias: 2 }];

      var afterAddedScores = [
        { id: 2, score: '200', name: 'BAR', alias: 2 },
        { id: 1, score: '100', name: 'FOO', alias: 1 }
      ];

      var expectedBeatenScores = {
        //game: { id: 1, name: 'test', full_name: 'Test'},
        beatenBy: { id: 2, score: '200', name: 'BAR', alias: 2 },
        beaten: [{ id: 1, score: '100', name: 'FOO', alias: 1 }]
      };

      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");
    });

    it('should always show the top score with that has a user', function(){

      var newScores = [
        { id: 4, score: '300', name: 'BOB', alias: null },
        { id: 3, score: '200', name: 'BAR', alias: 2 },
        { id: 2, score: '50', name: 'BIL', alias: null }
      ];

      var afterAddedScores = [
        { id: 4, score: '300', name: 'BOB', alias: null },
        { id: 3, score: '200', name: 'BAR', alias: 2 },
        { id: 1, score: '100', name: 'FOO', alias: 1 },
        { id: 2, score: '50', name: 'BIL', alias: null }
      ];

      var expectedBeatenScores = {
        beatenBy: { id: 3, score: '200', name: 'BAR', alias: 2 },
        beaten: [{ id: 1, score: '100', name: 'FOO', alias: 1 }]
      };

      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");
    });

    it('should not beat the same user more than once', function(){
      var newScores = [
        { id: 9, score: '9000', name: 'BOB', alias: 5 },
      ];

      var afterAddedScores = [
        { id: 9, score: '9000', name: 'BOB', alias: 5 }, //new score
        { id: 8, score: '800', name: 'FOO', alias: 1 },
        { id: 7, score: '700', name: 'FOO', alias: 1 },
        { id: 6, score: '600', name: 'BAR', alias: 2 },
        { id: 5, score: '500', name: 'ROW', alias: 4 }, //only beat the top 5
        { id: 4, score: '400', name: 'BAR', alias: 2 },
        { id: 3, score: '300', name: 'JIM', alias: 3 },
        { id: 2, score: '200', name: 'BAR', alias: 2 },
        { id: 1, score: '100', name: 'FOO', alias: 1 }
      ];

      var expectedBeatenScores = {
        beatenBy: { id: 9, score: '9000', name: 'BOB', alias: 5 },
        beaten: [
          { id: 8, score: '800', name: 'FOO', alias: 1 },
          { id: 6, score: '600', name: 'BAR', alias: 2 },
          { id: 5, score: '500', name: 'ROW', alias: 4 },
          /*{ id: 3, score: '300', name: 'JIM', alias: 3 }*/]
      };

      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");
    });

    it('should not beat yourself', function(){
      var newScores = [
        { id: 3, score: '300', name: 'BOB', alias: 2 },
        { id: 2, score: '200', name: 'BOB', alias: 2 }];

      var afterAddedScores = [
        { id: 3, score: '300', name: 'BOB', alias: 2 },
        { id: 2, score: '200', name: 'BOB', alias: 2 },
        { id: 1, score: '100', name: 'BAR', alias: 1 },
        { id: 4, score: '50', name: 'BOB', alias: 2 }];

      var expectedBeatenScores = {
        beatenBy: { id: 3, score: '300', name: 'BOB', alias: 2 },
        beaten: [
          { id: 1, score: '100', name: 'BAR', alias: 1 }]
      };

      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");
    });

    //TODO: redo this test as we have changes it to the top 5 instead of top 10
    it('should only beat user if top score', function(){
      var newScores = [
        { id: 6, score: '600', name: 'BAR', alias: 2 },
      ];

      var afterAddedScores = [
        { id: 9, score: '9000', name: 'BOB', alias: 5 },
        { id: 8, score: '800', name: 'FOO', alias: 1 },
        { id: 7, score: '700', name: 'FOO', alias: 1 },
        { id: 6, score: '600', name: 'BAR', alias: 2 }, //new score
        { id: 5, score: '500', name: 'BOB', alias: 5 },
        { id: 4, score: '400', name: 'BAR', alias: 2 },
        { id: 3, score: '300', name: 'JIM', alias: 3 },
        { id: 2, score: '200', name: 'BAR', alias: 2 },
        { id: 1, score: '100', name: 'FOO', alias: 1 }
      ];

      var expectedBeatenScores = {
        beatenBy: { id: 6, score: '600', name: 'BAR', alias: 2 },
        beaten: [
          /*{ id: 3, score: '300', name: 'JIM', alias: 3 }*/]
      };

      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");
    });

    it('should not beat higher scores', function(){
      var newScores = [
        { id: 3, score: '200', name: 'BAR', alias: 3 },
        { id: 2, score: '50', name: 'BAR', alias: 3 }
      ];

      var afterAddedScores = [
        { id: 4, score: '300', name: 'BOB', alias: 2 },
        { id: 3, score: '200', name: 'BAR', alias: 3 },
        { id: 1, score: '100', name: 'FOO', alias: 1 },
        { id: 2, score: '50', name: 'ROW', alias: 4 },
        { id: 4, score: '20', name: 'BOB', alias: 2 } //this should not get beaten as the user has a higher score than what was newly set
      ];

      var expectedBeatenScores = {
        beatenBy: { id: 3, score: '200', name: 'BAR', alias: 3 },
        beaten: [
          { id: 1, score: '100', name: 'FOO', alias: 1 },
          { id: 2, score: '50', name: 'ROW', alias: 4 }]
      };

      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");
    });

    it('should not beat scores without a user', function(){
      var newScores = [
        { id: 3, score: '200', name: 'BAR', alias: 2 },
        { id: 2, score: '50', name: 'BIL', alias: null }
      ];

      var afterAddedScores = [
        { id: 3, score: '200', name: 'BAR', alias: 2 },
        { id: 1, score: '100', name: 'FOO', alias: 1 },
        { id: 2, score: '50', name: 'BIL', alias: null }
      ];

      var expectedBeatenScores = {
        beatenBy: { id: 3, score: '200', name: 'BAR', alias: 2 },
        beaten: [{ id: 1, score: '100', name: 'FOO', alias: 1 }]
      };

      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");
    });

    it('should only beat top 5 scores', function(){
      var newScores = [
        { id: 12, score: '9000', name: 'BOB', alias: 5 },
      ];

      var afterAddedScores = [
        { id: 12, score: '9000', name: 'BOB', alias: 5 }, //new score
        { id: 11, score: '800', name: 'FOO', alias: 1 },
        { id: 10, score: '700', name: 'FOO', alias: 1 },
        { id: 9, score: '600', name: 'BAR', alias: 2 },
        { id: 8, score: '500', name: 'ROW', alias: 4 },
        { id: 7, score: '400', name: 'BAR', alias: 2 }, //only top 5 beaten now
        { id: 6, score: '300', name: 'JIM', alias: 3 },
        { id: 5, score: '200', name: 'BAR', alias: 2 },
        { id: 4, score: '100', name: 'FOO', alias: 1 },
        { id: 3, score: '90', name: 'CAT', alias: 7 },
        { id: 2, score: '80', name: 'DOG', alias: 8 },
        { id: 1, score: '70', name: 'ABC', alias: 6 }
      ];

      var expectedBeatenScores = {
        beatenBy: { id: 12, score: '9000', name: 'BOB', alias: 5 },
        beaten: [
          { id: 11, score: '800', name: 'FOO', alias: 1 },
          { id: 9, score: '600', name: 'BAR', alias: 2 },
          { id: 8, score: '500', name: 'ROW', alias: 4 },
          /*{ id: 6, score: '300', name: 'JIM', alias: 3 },
          { id: 3, score: '90', name: 'CAT', alias: 7 }*/]
      };


      var actualBeatenScores = Game.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, "Invalid beaten scores");
    });

  });

  describe('#uploadScores()', function () {


    beforeEach(async () => {

      var result1 = await
        sails.sendNativeQuery('TRUNCATE TABLE score RESTART IDENTITY CASCADE', []);
      var result = await
        sails.sendNativeQuery('TRUNCATE TABLE game RESTART IDENTITY CASCADE', []);
      var result2 = await
        sails.sendNativeQuery('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE', []);


      var gameData = {
        name: 'zerowing',
        has_mapping: true
      };

      let game = await Game.create(gameData).fetch();

      let user = await User.create({username: 'test1', email: 'mamehighscores+test1@gmail.com'}).fetch();
      let alias = await Alias.create({user_id: user.id, name: 'ABC'}).fetch();

      user = await User.create({username: 'test2', email: 'mamehighscores+test2@gmail.com'}).fetch();
      alias = await Alias.create({user_id: user.id, name: 'DEF'}).fetch();
    });


    it('should upload scores without error',  (done) => {

      var bytes = '0000500000005000000048000000460000004400000042000026002600260000000000000026002600260000000' +
        '000000026002600260000000000000026002600260000000000000026002600260000000000000006000500040003000200140013' +
        '00120011001050';

      var newBytes = '000050000000550000005400000046000000440000004200000A000B000C000000000000000D000E000F0000000' +
        '000000026002600260000000000000026002600260000000000000026002600260000000000000006000500040003000200140013' +
        '00120011001050';

      var bytesBuffer = Buffer.from(bytes, 'hex');

      var fileType = 'hi';
      var gameName = 'zerowing';

      Game.findOne({ name: gameName }).exec(function(err, game){
        //console.log(game);

        assert.ok(game, "game not set");

        Game.uploadScores(bytesBuffer, fileType, game, function(err, savedScores){
          //console.log("Uploaded Scores");
          //console.log(savedScores);

          assert.ok(savedScores.length > 0, "should have saved some scores");

          assert.equal(savedScores[0].name, '...');
          assert.equal(savedScores[0].score, '50000');

          Game.uploadScores(Buffer.from(newBytes, 'hex'), fileType, game, function(err, savedScores){
            //console.log("Uploaded Scores 2");
            //console.log(savedScores);
            assert.ok(savedScores.length === 2, "should have saved 2 scores");

            assert.equal(savedScores[0].name, 'ABC');
            assert.equal(savedScores[0].score, '55000');

            assert.equal(savedScores[1].name, 'DEF');
            assert.equal(savedScores[1].score, '54000');

            done(err);
          });
        });
      });

    });

    it.skip('should upload scores concurrently without error', function (done) {

      var bytes = '0000500000005000000048000000460000004400000042000026002600260000000000000026002600260000000' +
        '000000026002600260000000000000026002600260000000000000026002600260000000000000006000500040003000200140013' +
        '00120011001050';

      var newBytes = '000050000000550000005400000046000000440000004200000A000B000C000000000000000D000E000F0000000' +
        '000000026002600260000000000000026002600260000000000000026002600260000000000000006000500040003000200140013' +
        '00120011001050';

      var bytesBuffer = Buffer.from(bytes, 'hex');

      var fileType = 'hi';
      var gameName = 'zerowing';

      Game.findOne({name: gameName}).exec(function(err, game){
        if(err){
          done(err);
        } else {

          assert.ok(game, "game not set");

          async.parallel([
            function(done){
              Game.uploadScores(bytesBuffer, fileType, game, function(err, savedScores){
                assert.equal(null, err, "should not have got an error");
                //assert.ok(savedScores.length > 0, "should have saved some scores");
                done(err, savedScores); //this is the async function done
              });
            },
            function(done) {
              Game.uploadScores(bytesBuffer, fileType, game, function (err, savedScores) {
                assert.equal(null, err, "should not have got an error");
                //assert.ok(savedScores.length > 0, "should have saved some scores");
                done(err, savedScores); //this is the async function done
              })
            },
            function(done) {
              Game.uploadScores(bytesBuffer, fileType, game, function (err, savedScores) {
                assert.equal(null, err, "should not have got an error");
                //assert.ok(savedScores.length > 0, "should have saved some scores");
                done(err, savedScores); //this is the async function done
              })
            }
          ], function(err, results){
            var scoreCount = 0;
            assert.equal(null, err, "should not have got an error");
            console.log(results);
            results.forEach(function(item){
              scoreCount = scoreCount + item.length;
            });


            assert.equal(scoreCount, 5, "should have only retuned 5 scores");
            done(); //this is the test done
          });
        }
      });
    });
  });


  describe('#updateHasMapping()', function () {

    beforeEach(async function(){

      var result1 = await
      sails.sendNativeQuery('TRUNCATE TABLE score RESTART IDENTITY CASCADE', []);
      var result = await
      sails.sendNativeQuery('TRUNCATE TABLE game RESTART IDENTITY CASCADE', []);
      var result2 = await
      sails.sendNativeQuery('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE', []);

      let a = await Game.create({name: 'zerowing', has_mapping: false }).fetch();
      let b = await Game.create({ name: 'bob', has_mapping: false }).fetch();

    });


    it('should update has_mapping from gameMaps', function (done) {

      Game.findOne({name: 'zerowing'}).exec(function(err, game){
        assert.ok(!err);
        assert.ok(game, 'game not found');
        assert.ok(!game.has_mapping);

        Game.updateHasMapping(function(err){
          assert.ok(!err);

          Game.findOne({name: 'zerowing'}).exec(function(err, game) {
            assert.ok(!err);
            assert.ok(game.has_mapping);

            done(err);
          });
        });
      });
    });
  });


  describe('#addRawScores()', function () {

    beforeEach(async function(){

      var result1 = await
        sails.sendNativeQuery('TRUNCATE TABLE score RESTART IDENTITY CASCADE', []);
      var result = await
        sails.sendNativeQuery('TRUNCATE TABLE game RESTART IDENTITY CASCADE', []);
      var result2 = await
        sails.sendNativeQuery('TRUNCATE TABLE rawscore RESTART IDENTITY CASCADE', []);

      let a = await Game.create({name: 'jackel', has_mapping: false }).fetch();

    });

    it('should add raw scores to game', (done) => {
      try {
        Game.findOne({name: 'jackel'}).exec(function(err, game) {
          console.log(game);
          Game.addRawScores(game, 'DEADBEEF', 'hi', (err, createdRawScores) => {

            assert.ok(!err);
            assert.ok(createdRawScores.length > 0);
            done(err);
          });
        });
      } catch(e){
        done(e);
      }

    });
  });
});
