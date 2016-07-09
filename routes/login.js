var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var db = require('../db/api');
var auth = require('../auth');

router.get('/', function(req, res, next) {
    if (req.session.userId) {
        res.redirect('/index');
    } else {
        next();
    }
}, function(req, res, next) {
    res.render('./auth/login');
});

router.post('/', function(req, res, next) {
auth.passport.authenticate('local', function(err, user, info) {
    if (err) {
        res.render('./auth/login', {
            error: err
        });
    } else if (user) {
        req.session.userId = users.id;
        res.redirect('/blog');
    }
  })(req, res, next);
});

module.exports = router;
