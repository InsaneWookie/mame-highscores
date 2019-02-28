const passport = require('passport');

module.exports = {

  login: function(req, res, next) {

    // let user = {username: 'test'};
    // req.logIn(user, function(err) {
    //   if(err) { return res.send(err); }
    //
    //   return res.send({
    //     message: info.message,
    //     user
    //   });
    // });

    passport.authenticate('local', function(err, user, info){
      if((err) || (!user)) {

        return res.json({
          message: info.message,
          user
        });
      }

      console.log(user);
      req.logIn(user, function(err) {
        console.log(err);
        if(err) { return res.json(err); }

        req.session.selectedGroup = 1;
        return res.json({
          message: info.message,
          user
        });
      });
    })(req, res, next);
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  }
};