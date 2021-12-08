import dotenv from "dotenv";
import express from 'express';
import handlebars from "express-handlebars";
import axios from 'axios';

import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';

dotenv.config()



import router from "./routes/index.js";
import testRouter from "./routes/testRoute.js";
import authRoute from "./routes/authRoute.js";

import message from "./models/message.js"

import mongoConnect from './db/mongodb.js';
import mongoContainer from './mongoContainer.js';

import { useMiddlewares } from './middlewares/useMiddlewares.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
const port = process.env.PORT || 3000;

// knex sqlite connection
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer)

const mongo = new mongoContainer(message);

// connect to mongodb atlas
mongoConnect()

// Set template engine
app.engine('hbs', handlebars({
  extname: '.hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: "./views/layouts",
}))
app.set("view engine", "hbs")
app.set("views", "./views")


useMiddlewares(app)
// routes
app.use("/api/productos", router);
app.use("/api/productos-test", testRouter)
app.use("/", authRoute)

app.get("/", async (req, res) => {
  const products = await axios.get("http://localhost:3000/api/productos");
  console.log(req.user)
  res.render("main", { products: products.data, user: req.user.username });
})


// sockets
io.on('connection', async socket => {
  io.sockets.emit('render_messages', await norm());
  socket.on('submit_product', data => {
    axios.post('http://localhost:3000/api/productos', data)
    .then(resp => console.log(resp.data))
    .catch(err => console.error(err.response.data))
  });
  
  socket.on('send_message', async data => {
    await mongo.create(data);
    io.sockets.emit('render_messages', await mongo.findAll());
  });
});


httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

import { normalizeChat, print } from './helpers/normalize.js';
import { log } from 'console';

const norm = async () => {
  const mongoData = await mongo.findAll();
  const formattedData = {id: "mensajes", mensajes: mongoData}
  const chat = normalizeChat(JSON.stringify(formattedData));
  return chat;
}
