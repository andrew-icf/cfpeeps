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

router.get('/blog/:id', function (req, res) {
  knex('post').where({id: req.params.id}).select().first().then(function (post) {
    res.render('detail', {post: post})
  })
})

router.get('/blog/:id/edit', function (req, res) {
  Promise.all([
    knex('post').where({id: req.params.id}).select().first(),
    knex('users').select()
  ])
  .then(function (result) {
    res.render('editBlog', {post: result[0], users: result[1]})
  })
})

router.post('/update/:id', function (req, res) {
  knex('post').where({id: req.params.id}).update(req.body).then(function () {
    res.redirect('/blog/' + req.params.id);
  })
})

router.post('/add', function (req, res, next) {
  // grab info from post and insert into the db user first
  if (!req.body.title) {
    knex('users').select().then(function(data){
      res.render('add', {users: data, error: "DUDE, don't forget the title", post: req.body});
    })
  } else {
    knex.table("post").insert(req.body, 'id').first().then(function(id){
      res.redirect('/');
    }).catch(function(error){
      next(error);
    })
  }
  // knex('users').select().where({name: req.body.name}).first().then(function (result) {
  //   if (result) {
  //     req.body.user_id = result.id
  //     knex('blog').insert(req.body).then(function () {
  //       res.redirect('/')
  //     })
  //   } else {
  //     knex('users').insert(req.body, 'id').first().then(function (id) {
  //       req.body.user_id = id;
  //       knex('blog').insert(req.body, 'id').first().then(function (post_id) {
  //         res.r
  //       })
  //   }
  // })
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
