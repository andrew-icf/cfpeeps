var knex = require('./knex');

module.exports = {
  findUserByUsername: function(name){
    return knex('users').select().where({name: name}).first();
  },
  addUser: function(body){
    return knex('users').insert(body, 'id');
  },
  findUserbyId: function(id){
    return knex('users').where({id: id}).first();
  }
};
