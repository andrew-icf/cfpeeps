var express = require('express');
var router = express.Router();
var knex = require('../db/knex');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/blog', function(req, res, next) {
  return Promise.all([
    knex('post').select('users.id as userId', 'users.name', 'post.title', 'post.description', 'post.image')
    .leftJoin("users", function () {
      this.on("posting_id", "=", "users.id");
    }),
    knex('comment').select('post.id as postId', 'users.id as userId', 'comment.description')
    .join("post", function() {
      this.on("comment_post_id", "=", "post.id");
    }).join('users', function(){
      this.on("comment_users_id", "=", "users.id")
    })
  ]).then(function(data){
    console.log(data)
    res.render('blog', {posts: data[0], comment: data[1]});
  }).catch(function (error) {
    console.error(error);
    next(error);
  });
});

router.get('/add', function(req, res){
  knex('users').select().then(function(data){
    res.render('add', {users: data});
  })
});

router.post('/add', function (req, res, next) {
  // grab info from post and insert into the db user first
  return new Promise(function(){
    knex.table("post").insert({title:req.body.title}).then(function(message){
      //redirecting to main page
      console.log(message);
      res.redirect('/blog');
    })
  }).catch(function(error){
    next(error);
  })
});

router.get('/create' , function(req, res, next) {
  res.render('create');
});

router.post('/create', function(req,res, next){
  knex('post').insert(req.body).then(function(){
    res.redirect('/');
  }).catch(function(err){
    console.log(err);
    next(err);
  })
});

router.get('/:id', function(req, res, next) {
  knex('post').where({id: req.params.id}).first().then(function(post){
  res.render('detail', {post: post});
  })
});

router.get('/:id/edit', function(req, res, next){
  knex('post').where({id: req.params.id}).first().then(function(post){
    res.render('edit', + {post: post});
  });
});

router.post('/:id/edit', function (req, res, next) {
  knex('post').where({id: req.params.id}).update(req.body).then(function () {
    res.redirect("/blog" + req.params.id)
  });
});

router.get('/:id/delete', function(req, res, next){
  knex('post').where({id: req.params.id}).del().then(function(){
    res.redirect('/blog');
  });
});



module.exports = router;
