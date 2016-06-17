var express = require('express');
var router = express.Router();
var knex = require('../db/knex');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/blog', function(req, res, next) {
  return Promise.all([
    knex('users').select(),
    knex('post').select()
  ]).then(function(data){
    console.log(data[1]);
    res.render('blog', {data: data[0], post: data[1]});
  })
});

module.exports = router;
