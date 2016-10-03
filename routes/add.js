var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res){
  knex('users').select().then(function(data){
    res.render('add', {users: data, id: req.session.userId});
  });
});

router.post('/', function (req, res, next) {
  if (!req.body.title) {
    knex('users').select().then(function(data){
      res.render('add', {users: data, error: "Don't forget the title", post: req.body});
    });
  } else if (!req.body.image) {
    knex('users').select().then(function(data){
      res.render('add', {users: data, error: "Please insert a picture", post: req.body});
    });
  }else if (!req.body.description) {
    knex('users').select().then(function(data){
      res.render('add', {users: data, error: "Tell me a little bit about your athlete", post: req.body});
    });
  }else  {
    knex.table('post').insert(req.body).then(function(message){
      res.redirect('/blog');
    }).catch(function(error){
      next(error);
    });
  }
});


module.exports = router;
