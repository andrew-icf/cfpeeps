
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('post').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('post').insert({title: 'Rich Froning', description: 'The fittest man in the world', image: "https://image.boxrox.com/2015/07/Rich-Froning.png", posting_id: 1}),
        knex('post').insert({title: 'Camille Leblanc-Bazinet', description: 'The 2014 winner', image: "http://www.girlswithmuscle.com/images/full/615385377.jpg", posting_id: 1})
      ]);
    });
};
