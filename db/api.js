var knex = require('./knex');

module.exports = {
  findUserByUsername: function(username){
    return knex('users').select().where({username: username}).first();
  },
  addCamper: function(body){
    return knex('users').insert(body, 'id');
  },
  findUserbyId: function(id){
    return knex('users').where({id: id}).first();
  }
};
