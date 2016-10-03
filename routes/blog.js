var express = require('express');
var router = express.Router();
var knex = require('../db/knex');


router.get('/', function(req, res, next) {
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
    console.log(data);
    res.render('blog', {posts: data[0], user: req.session.userId, comment: data[1]});
  }).catch(function (error) {
    console.error(error);
    next(error);
  });
});

router.get('/:id', function (req, res) {
  return Promise.all([
    knex('post').select(
      'post.id as postId',
      'users.id as userId',
      'post.title',
      'post.description',
      'post.image',
      'users.name',
      'post.posting_id'
    ).join('users', 'users.id', 'posting_id')
    .where('post.id', req.params.id).first(),
    knex('post').select(
      'comment.description'
    ).join('comment', 'comment_post_id', 'post.id')
    .where('post.id', req.params.id),
    knex('post').select('post.id as postId', 'users.id as userId', 'post.title', 'post.description', 'post.image', 'users.name')
    .join('users', function(){
      this.on('users.id', "=", "posting_id");
    }).where('post.id', '=', req.params.id).first(),

    knex('post').select('comment.description')
    .join('comment', function(){
      this.on('post.id', '=', 'comment_post_id');
    }).where('post.id', '=', req.params.id)
    ]).then(function(data){
      console.log(data);
      res.render('detail', {posts: data[0], comment:data[1]});
    });
});

router.get('/edit/:id', function(req, res) {
  Promise.all([
    knex('post').where({id:req.params.id}).select().first(),
    knex('users').select()
  ])
  .then(function(result){
    res.render('editBlog', {post: result[0], users: result[1]});
  });
});

router.post('/edit/:id', function (req, res, next) {
  knex('post').where({id: req.params.id}).update(req.body).then(function () {
    res.redirect("/blog/" + req.params.id);
  });
});

router.post('/comment/:id', function(req, res){
  knex('comment').insert({
    description: req.body.description,
    comment_post_id: req.params.id
  }).then(function(data){
    res.redirect(req.get('referer'));
  });
});

router.get('/delete/:id', function(req, res, next){
  knex('post').where({id: req.params.id}).del().then(function(data){
    res.redirect('/blog');
  }).catch(function(error){
    next(error);
  });
});



module.exports = router;
