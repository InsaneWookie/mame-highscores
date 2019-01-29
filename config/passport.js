const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt-nodejs');


passport.serializeUser(function (user, cb) {
  console.log("serializeUser");
  console.log(user);
  cb(null, user.id);
});


passport.deserializeUser(async function (id, cb) {
  console.log("deserializeUser");
  console.log(id);
  let user = await User.findOne({id: id});
  cb(null, user);
});


passport.use(new LocalStrategy({
  usernameField: 'username',
  passportField: 'password'
}, async function (username, password, cb) {
  let user = await User.findOne({username: username});
  //if (err) return cb(err);
  if (!user) return cb(null, false, {message: 'Username not found'});
  bcrypt.compare(password, user.password, function (err, res) {
    if (!res) return cb(null, false, {message: 'Invalid Password'});
      let userDetails = {
        email: user.email,
        username: user.username,
        id: user.id
      };
    return cb(null, userDetails, {message: 'Login Succesful'});
  });
}));