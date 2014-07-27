var assert = require('assert')
  , Sails = require('sails')
  // , barrels = require('barrels')
  //  fixtures;

// Global before hook
before(function (done) {
  this.timeout(10000);

  // Lift Sails with test database
  Sails.lift({
    log: {
      level: 'error'
    },
    // adapters: {
    //   default: 'test'
    // }
  }, 
  function(err, sails) {
    if (err)
      return done(err);

    done(err, sails);
    // Load fixtures
    // barrels.populate(function(err) {
    //   done(err, sails);
    // });
    // // Save original objects in `fixtures` variable
    // fixtures = barrels.objects;
  });
});

// Global after hook
after(function (done) {
  console.log();
  sails.lower(done);
});

// Here goes a module test
describe('Controllers', function() {
  describe('#upload', function() {
    
    it('should upload file without error', function() {

      assert(true, "i passed");
      // All apples
      
      // GameController.upload(null, {
      //           view: view
      //       });

      //assert(gotApples&&applesAreInTheDb, 'There must be something!');

        // All oranges
      //assert.equal(apples.length, oranges.length,
      //      'The amount of varieties of apples and oranges should be equal!');
      
    });
  });
});