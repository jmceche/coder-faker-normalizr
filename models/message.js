import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  author: {
    email: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
    },
    apellido: {
      type: String,
    },
    edad: {
      type: Number,
    },
    alias: {
      type: String,
    },
    avatar: {
      type: String,
    }
  },
  text: {
    type: String,
  }, 
}, {
  timestamps: true,
});

export default mongoose.model("Message", messageSchema);