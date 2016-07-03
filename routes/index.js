var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/blog', function(req, res, next) {
  return Promise.all([
    knex('post').select('users.id as userId', 'users.name', 'post.title', 'post.description', 'post.image', 'post.id as post_id')
    .leftJoin("users", function () {
      this.on("posting_id", "=", "users.id");
    }),
    knex('comment').select('post.id as postId', 'users.id as userId', 'comment.description')
    .join("post", function() {
      this.on("comment_post_id", "=", "post.id");
    }).join('users', function(){
      this.on("comment_users_id", "=", "users.id");
    })
  ]).then(function(data){
    res.render('blog', {posts: data[0], comment: data[1]});
  }).catch(function (error) {
    console.error(error);
    next(error);
  });
});

router.get('/add', function(req, res){
  knex('users').select().then(function(data){
    res.render('add', {users: data});
  });
});

router.get('/blog/:id', function (req, res) {
  return Promise.all([
    knex('post').select('post.id as postId', 'users.id as userId', 'post.title', 'post.description', 'post.image', 'users.name')
    .join('users', function(){
      this.on('users.id', "=", "posting_id");
    }).where('post.id', '=', req.params.id).first(),

    knex('post').select('comment.description')
    .join('comment', function(){
      this.on('post.id', '=', 'comment_post_id');
    }).where('post.id', '=', req.params.id)

    ]).then(function(data){
      res.render('detail', {posts: data[0], comment:data[1]});
    });

});

router.post('/add', function (req, res, next) {
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

router.get('/blog/:id/edit', function(req, res) {
  Promise.all([
    knex('post').where({id:req.params.id}).select().first(),
    knex('users').select()
  ])
  .then(function(result){
    res.render('editBlog', {post: result[0], users: result[1]});
  });
});

router.post('/blog/:id/edit', function (req, res, next) {
  knex('post').where({id: req.params.id}).update(req.body).then(function () {
    res.redirect("/blog/" + req.params.id);
  });
});

router.post('/blog/:id/comment', function(req, res){
  knex('comment').insert({
    description: req.body.description,
    comment_post_id: req.params.id
  }).then(function(data){
    res.redirect(req.get('referer'));
  });
});

router.get('/blog/:id/delete', function(req, res, next){
  knex('post').where({id: req.params.id}).del().then(function(){
    res.redirect('/blog');
  });
});



module.exports = router;
