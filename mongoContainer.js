export default class Contenedor {
  constructor(collection) {
    this.collection = collection;
  }

  async findAll() {
    try {
      return await this.collection.find({});
    } catch (error) {
      throw new Error(`Error al listar todo: ${error}`)
    }
  }

  async find(id) {
    try {
      return await this.collection.findById(id);
    } catch (error) {
      throw new Error(`Error al listar por id: ${error}`) 
    }
  }

  async create(item) {
    try {
      const newItem = new this.collection(item)
      const data = await newItem.save();
      return {status: "success", data};
    } catch (error) {
      console.log(error);
      throw new Error(`Error al guardar: ${error}`)
    }
  }

  async update(id, obj) {
    try {
      const updatedItem = await this.collection.replaceOne({_id: id}, obj);
      return { status: "success", updatedItem}
    } catch (error) {
      throw new Error(`Error al actualizar: ${error}`)
    }
  }

  async delete(id) {
    try {
      await this.collection.findOneAndDelete(id);
      return { status: 200, message: "deleted success" }
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`)
    }
  }
}
