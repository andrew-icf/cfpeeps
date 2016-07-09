var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var db = require('../db/api');
var auth = require('../auth');

router.get('/', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

module.exports = router;
