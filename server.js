import dotenv from "dotenv";
import express from 'express';
import handlebars from "express-handlebars";
import axios from 'axios';

import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';

dotenv.config()

import router from "./routes/index.js";
import testRouter from "./routes/testRoute.js";
import { Contenedor } from "./contenedor.js";
import sqliteOpt from './options/sqlite.js';

import mongoConnect from './db/mongodb.js';
import mongoContainer from './mongoContainer.js';

const port = process.env.PORT || 3000;

// knex sqlite connection
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer)

const sqlite = new Contenedor(sqliteOpt, 'chat')
const mongo = new mongoContainer();

// Set template engine
app.engine('hbs', handlebars({
  extname: '.hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: "./views/layouts",
}))
app.set("view engine", "hbs")
app.set("views", "./views")

// static
app.use(express.static("./public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// routes
app.use("/api/productos", router);
app.use("/api/productos-test", testRouter)

app.get("/", async (req, res) => {
  const products = await axios.get("http://localhost:3000/api/productos");
  res.render("main", { products: products.data });
})


// sockets
io.on('connection', async socket => {
  // io.sockets.emit('render_messages', await mongo.findAll());
  io.sockets.emit('render_messages', await norm());
  socket.on('submit_product', data => {
    axios.post('http://localhost:3000/api/productos', data)
    .then(resp => console.log(resp.data))
    .catch(err => console.error(err))
  });
  
  socket.on('send_message', async data => {
    // console.log(data);
    await mongo.create(data);
    io.sockets.emit('render_messages', await mongo.findAll());
  });
});

mongoConnect()

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

import {normalizeChat, print} from './helpers/normalize.js';

const norm = async () => {
  const mongoData = await mongo.findAll();
  const formattedData = {id: "mensajes", mensajes: mongoData}
  console.log(mongoData);
  // const chat = normalizeChat({ id: "mensajes", mensajes: mongoData });
  const chat = normalizeChat(formattedData);
  // console.log(chat); 
  // print(chat)
  return chat;
}
  
