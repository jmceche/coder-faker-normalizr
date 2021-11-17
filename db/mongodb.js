import mongoose from "mongoose"

export default function mongoConnet() { 
  mongoose.connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }).then(() => console.log("MongoDB connected"));
}