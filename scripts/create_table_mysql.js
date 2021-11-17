import options from "./options/mysql.js";
import knex from 'knex';

const db = knex(options);

db.schema.createTable('products', table => {
  table.increments('id');
  table.string('name');
  table.integer('price');
  table.string('thumbnail')
})
  .then(() => console.log('table created'))
  .catch((err) => { console.log(err); throw err})
  .finally(() => {
    db.destroy();
  })