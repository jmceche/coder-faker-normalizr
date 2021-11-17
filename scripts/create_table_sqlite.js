import options from "../options/sqlite.js";
import knex from 'knex';

const db = knex(options);

db.schema.createTable('chat', table => {
  table.increments('id');
  table.string('user_id');
  table.string('user');
  table.string('msg');
  table.timestamp('timestamp').defaultTo(db.fn.now());
})
  .then(() => console.log('table created'))
  .catch((err) => { console.log(err); throw err})
  .finally(() => {
    db.destroy();
  })