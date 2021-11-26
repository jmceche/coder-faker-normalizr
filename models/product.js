import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Product", productSchema);