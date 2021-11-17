import knex from 'knex';

export class Contenedor {
  constructor(config, table) {
    this.table = table;
    this.db = knex(config);
  }

  async save(obj) {
    try {
      await this.db(this.table).insert(obj);
    } catch (error) {
      throw "Error al guardar objeto: " + error;
    }
  }

  async getById(id) {
    try {
      return await this.db(this.table).select('*').where({id})
    } catch (error) {
      throw "Error al leer datos: " + error; 
    }
  }

  async getAll() {
    try {
      return await this.db(this.table).select('*');
    } catch (error) {
      throw "Error al leer datos: " + error;
    }
  }

  async deleteById(id) {
    try {
      await this.db(this.table).where({id}).del();
    } catch (error) {
      throw "Error al borrar objeto: " + error;
    }
  }
}
