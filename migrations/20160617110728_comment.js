
exports.up = function(knex, Promise) {
  return knex.schema.createTable("comment", function(table){
    table.increments();
    table.text("description");
    table.integer('comment_post_id').references("post.id");
    table.integer('comment_users_id').references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("comment");
};
