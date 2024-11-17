/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('games').del()
  await knex('games').insert([
    { id: 1, title: 'Bloodborne', release_year: 2015, image: 'https://media.rawg.io/media/games/214/214b29aeff13a0ae6a70fc4426e85991.jpg' },
  ]);
};
