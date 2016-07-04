var db = require('./db/api');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(function(username, password, done){
  db.findUserByUsername(username).then(function(user, err) {
    if(!user) {
      done("Something went wrong, please try again");
    } else if (user && bcrypt.compareSync(password, user.password)) {
      done(null, user);
    } else {
      done('That\'s not right either...');
    }
  });
}));

module.exports = {
  passport: passport,
  createUser: function(body){
    var hash = bcrypt.hashSync(body.password, 8);
    body.password = hash;
    return db.addUser(body).then(function(id){
      return id[0];
    });
  },
  isLoggedIn: function(req, res, next){
    if(req.session.userId) {
      res.redirect('/index');
    }else {
      next();
    }
  },
  isNotLoggedIn: function(req, res, next){
    if(!req.session.userId) {
      res.redirect('/index');
    } else {
      next();
    }
  }
};
