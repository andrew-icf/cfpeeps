var express = require('express');
var router = express.Router();
var knex = require('../db/knex');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/blog', function(req, res, next) {
  return Promise.all([
    knex('users').select().join("comment", function () {
      this.on("users.id", "=", "comment_users_id")
    }).join("post", function() {
      this.on("post.id", "=", "comment.comment_post_id")
    })
    // knex('post').select()
  ]).then(function(data){
    console.log(data);
    res.render('blog', {data: data[0], post: data[1]});
  }).catch(function (error) {
    console.error(error);
    next(error);
  });
});

module.exports = router;
