
exports.up = function(knex, Promise) {
  return knex.schema.createTable("post", function(table){
    table.increments();
    table.string('title');
    table.text('description');
    table.text('image');
    table.integer('posting_id').references('users.id')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("post");
};
