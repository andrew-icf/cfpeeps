exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE comment, post, users  RESTART IDENTITY CASCADE;');
};
