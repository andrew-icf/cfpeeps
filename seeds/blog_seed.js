
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
  return knex('comment').del().then(function(){
    return knex('post').del()
  }).then(function(){
    return knex('users').del()
  }).then(function(){
    // Inserts seed entries
    return Promise.join(
      knex('users').insert({name: "Andrew VanderMeer"}).returning("id"),
      knex('users').insert({name: "Amanda Pearce"}).returning("id")
    );
  })
  .then(function(idsData){
    var andrew = idsData[0][0];
    var amanda = idsData[1][0];
    return Promise.join(
      knex('post').insert({
        title: "Rich Froning",
        description: "Strongest man in the world",
        image: "http://cdn2.omidoo.com/sites/default/files/imagecache/full_width/images/bydate/201505/3afa7dcffc40db0631009.jpg",
        posting_id: andrew
        }).returning('id'),
      knex('post').insert({
        title: "Annie Thorisdottir",
        description: "Iceland Annie!",
        image: "https://pbs.twimg.com/profile_images/595267205299871744/94c4T_hx.jpg",
        posting_id: amanda
        }).returning('id')
    ).then(function(postIds){
      return {
        post:{
          zero: postIds[0][0],
          one: postIds[1][0]
        },
        users: {
          andrew: andrew,
          amanda: amanda
        }
      };
    });
  }).then(function(data){
    return Promise.join(
      knex('comment').insert({
        description: "I need to do steroids!",
        comment_users_id: data.users.andrew,
        comment_post_id: data.post.zero
      }),
      knex('comment').insert({
        description: "She's my fav...OMG",
        comment_users_id: data.users.amanda,
        comment_post_id: data.post.one
      })
    );
  });
};
