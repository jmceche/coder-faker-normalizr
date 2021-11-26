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

const sqlite = new Contenedor(sqliteOpt, 'chat')
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

app.get("/login", (req, res) => {
    res.render("login")
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  req.session.user = username;
  res.redirect("/")
})

app.get("/logout",  (req, res) => {
  res.render("logout", { user: req.session.user })
  setTimeout( () => {
     req.session.destroy((err) => {
      if (err) {
        return res.json({status: "logout error", body: err})
      } else {
        res.redirect("/")
      }
    });
  }, 5000)
});

app.get("/", authMiddleware, async (req, res) => {
  const products = await axios.get("http://localhost:3000/api/productos");
  res.render("main", { products: products.data, user: req.session.user });
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

const norm = async () => {
  const mongoData = await mongo.findAll();
  const formattedData = {id: "mensajes", mensajes: mongoData}
  const chat = normalizeChat(JSON.stringify(formattedData));
  return chat;
}
