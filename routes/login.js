var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var db = require('../db/api');
var auth = require('../auth');

router.get('/', function(req, res, next) {
    if (req.session.userId) {
        res.redirect('/blog');
    } else {
        next();
    }
}, function(req, res, next) {
    res.render('./auth/login');
});

router.post('/', function(req, res, next) {
auth.passport.authenticate('local', function(err, user, info) {
  console.log(err);
    if (err) {
        res.render('./auth/login', {
            error: "Do it again"
        });
    } else if (user) {
        req.session.userId = user.id;
        res.redirect('/blog');
    } else {
      next();
    }

  })(req, res, next);
});

module.exports = router;
